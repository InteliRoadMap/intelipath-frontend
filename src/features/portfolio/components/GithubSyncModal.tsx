import React, { useEffect, useState } from 'react';
import { Lock, Star, GitFork, Loader2, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Badge } from '@/components/ui';
import { portfolioApi, GithubRankedRepo, GithubLinkState } from '@/features/portfolio/api/portfolioApi';
import { GH_LINK_STATE_KEY, GH_LINK_RETURN_KEY } from './GithubLinkCallback';
import { toast } from '@/utils/toast';

// lucide-react dropped brand marks, so we ship our own GitHub glyph (same path as the
// login screen's) and reuse it across the portfolio Sync-GitHub UI.
export const GithubIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
    <path
      d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99a2.6 2.6 0 0 1 .76-1.6c-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3Z"
      fill="currentColor"
    />
  </svg>
);

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Repo URLs already in the portfolio — shown as "Added" and not re-importable. */
  existingRepoUrls?: string[];
  /** Receives the raw backend project entries (PortfolioProjectResponse[]) to append. */
  onImported: (projects: any[]) => void;
}

const TIER_VARIANT: Record<GithubRankedRepo['qualityTier'], 'success' | 'info' | 'default'> = {
  HIGH: 'success',
  MEDIUM: 'info',
  LOW: 'default',
};

const TIER_LABEL: Record<GithubRankedRepo['qualityTier'], string> = {
  HIGH: 'Top pick',
  MEDIUM: 'Good',
  LOW: 'Basic',
};

const normalizeUrl = (url: string) => url.replace(/\.git$/, '').replace(/\/$/, '').toLowerCase();

export const GithubSyncModal: React.FC<Props> = ({ open, onOpenChange, existingRepoUrls = [], onImported }) => {
  const [repos, setRepos] = useState<GithubRankedRepo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  // needsReconnect => GitHub isn't linked / token expired; offer the OAuth reconnect button.
  const [error, setError] = useState<{ message: string; needsReconnect: boolean } | null>(null);
  // Which GitHub account is connected. Null until the status call lands.
  const [link, setLink] = useState<GithubLinkState | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);
  // Disconnecting logs the student out of GitHub here, so it asks first rather than
  // firing on a stray click next to "Import".
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false);

  const existing = new Set(existingRepoUrls.map(normalizeUrl));

  const loadStatus = async () => {
    try {
      setLink(await portfolioApi.getGithubLinkStatus());
    } catch {
      // Non-fatal: the repo list below already tells the student whether sync works.
      setLink(null);
    }
  };

  const loadRepos = async () => {
    setIsLoading(true);
    setError(null);
    setSelected(new Set());
    setConfirmingDisconnect(false);
    try {
      const data = await portfolioApi.listGithubRepos();
      setRepos(data);
    } catch (err: any) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message as string | undefined;
      if (status === 400) {
        setError({
          message: serverMsg || 'Connect your GitHub account to sync repositories.',
          needsReconnect: true,
        });
      } else if (status === 503) {
        setError({ message: serverMsg || 'GitHub sync is not available right now.', needsReconnect: false });
      } else {
        setError({ message: 'Could not load your repositories. Please try again.', needsReconnect: false });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadStatus();
      loadRepos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (repoUrl: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(repoUrl)) next.delete(repoUrl);
      else next.add(repoUrl);
      return next;
    });
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setIsImporting(true);
    try {
      const projects = await portfolioApi.importGithubBatch(Array.from(selected));
      if (!projects || projects.length === 0) {
        toast.error('None of the selected repositories could be analyzed. Please try again.');
        return;
      }
      onImported(projects);
      const skipped = selected.size - projects.length;
      toast.success(
        skipped > 0
          ? `Added ${projects.length} project${projects.length > 1 ? 's' : ''} (${skipped} skipped).`
          : `Added ${projects.length} project${projects.length > 1 ? 's' : ''} to your portfolio.`,
      );
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.status === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : 'Import failed. The AI service may be busy — please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  // Begin the dedicated link flow: get the authorize URL, stash a CSRF state + where to
  // return, then hand off to GitHub. On return, GithubLinkCallback finishes the exchange.
  const reconnect = async () => {
    try {
      const { authorizeUrl, state } = await portfolioApi.linkGithubStart();
      sessionStorage.setItem(GH_LINK_STATE_KEY, state);
      sessionStorage.setItem(GH_LINK_RETURN_KEY, window.location.pathname + window.location.search);
      window.location.href = authorizeUrl;
    } catch {
      toast.error('Could not start GitHub connection. Please try again.');
    }
  };

  const disconnect = async () => {
    setIsUnlinking(true);
    try {
      setLink(await portfolioApi.unlinkGithub());
      setRepos([]);
      setSelected(new Set());
      setConfirmingDisconnect(false);
      setError({ message: 'Connect your GitHub account to sync repositories.', needsReconnect: true });
      toast.success('GitHub account disconnected.');
    } catch {
      toast.error('Could not disconnect GitHub. Please try again.');
    } finally {
      setIsUnlinking(false);
    }
  };

  // Switching accounts is disconnect-then-connect. The unlink revokes the authorization
  // itself, not just our token, which is what makes GitHub show its account chooser again
  // instead of silently reconnecting the account the student is trying to leave.
  const changeAccount = async () => {
    setIsUnlinking(true);
    try {
      await portfolioApi.unlinkGithub();
      await reconnect();
    } catch {
      toast.error('Could not switch GitHub accounts. Please try again.');
      setIsUnlinking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GithubIcon size={20} /> Sync from GitHub
          </DialogTitle>
          <DialogDescription>
            We ranked your repositories by portfolio quality. Pick the ones you want and InteliPath AI
            will write up each project for you.
          </DialogDescription>
        </DialogHeader>

        {/* Connected account strip — also the only place to disconnect or switch accounts. */}
        {link?.linked && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            {confirmingDisconnect ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600">
                  Disconnect{link.githubLogin ? ` @${link.githubLogin}` : ''}? Projects you already
                  imported stay in your portfolio.
                </p>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isUnlinking}
                    onClick={() => setConfirmingDisconnect(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" size="sm" disabled={isUnlinking} onClick={disconnect} className="gap-1.5">
                    {isUnlinking && <Loader2 className="animate-spin" size={13} />}
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <GithubIcon size={16} className="flex-shrink-0 text-slate-700" />
                  <span className="truncate text-xs text-slate-600">
                    Connected as{' '}
                    <span className="font-semibold text-slate-800">
                      {link.githubLogin ? `@${link.githubLogin}` : 'your GitHub account'}
                    </span>
                  </span>
                  {link.repoAccess && (
                    <Badge variant="info">
                      <Lock size={10} className="mr-1" /> Private repos
                    </Badge>
                  )}
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isUnlinking}
                    onClick={changeAccount}
                    className="gap-1.5"
                  >
                    {isUnlinking ? <Loader2 className="animate-spin" size={13} /> : <RefreshCw size={13} />}
                    Change account
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUnlinking}
                    onClick={() => setConfirmingDisconnect(true)}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <Loader2 className="animate-spin" size={28} />
            <p className="text-sm">Reading your repositories…</p>
          </div>
        )}

        {/* Needs connect (friendly invite) / real error */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
            {error.needsReconnect ? (
              <GithubIcon size={32} className="text-slate-700" />
            ) : (
              <AlertCircle className="text-amber-500" size={32} />
            )}
            <p className="max-w-sm text-sm text-slate-600">
              {error.needsReconnect
                ? 'Connect your GitHub account to browse and import your repositories.'
                : error.message}
            </p>
            {error.needsReconnect ? (
              <Button onClick={reconnect} className="gap-2">
                <GithubIcon size={16} /> Connect GitHub
              </Button>
            ) : (
              <Button variant="outline" onClick={loadRepos} className="gap-2">
                <RefreshCw size={16} /> Try again
              </Button>
            )}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && repos.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center text-slate-500">
            <GithubIcon size={32} className="text-slate-300" />
            <p className="text-sm">No repositories found on your GitHub account.</p>
          </div>
        )}

        {/* Repo list */}
        {!isLoading && !error && repos.length > 0 && (
          <>
            <div className="-mx-1 max-h-[52vh] space-y-2 overflow-y-auto px-1 py-1">
              {repos.map(repo => {
                const isAdded = existing.has(normalizeUrl(repo.repoUrl));
                const isChecked = selected.has(repo.repoUrl);
                return (
                  <button
                    key={repo.fullName}
                    type="button"
                    disabled={isAdded}
                    onClick={() => !isAdded && toggle(repo.repoUrl)}
                    className={[
                      'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                      isAdded
                        ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-60'
                        : isChecked
                          ? 'border-indigo-400 bg-indigo-50/60'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    {/* Checkbox */}
                    <span
                      className={[
                        'mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded border',
                        isChecked ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white',
                      ].join(' ')}
                    >
                      {isChecked && <Check size={13} strokeWidth={3} />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-semibold text-slate-800">{repo.name}</span>
                        {repo.isPrivate && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            <Lock size={11} /> Private
                          </span>
                        )}
                        <Badge variant={TIER_VARIANT[repo.qualityTier]}>{TIER_LABEL[repo.qualityTier]}</Badge>
                        {isAdded && <Badge variant="default">Added</Badge>}
                      </div>

                      {repo.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{repo.description}</p>
                      )}

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                        {repo.language && <span className="font-medium text-slate-500">{repo.language}</span>}
                        <span className="inline-flex items-center gap-1"><Star size={11} /> {repo.stars}</span>
                        <span className="inline-flex items-center gap-1"><GitFork size={11} /> {repo.forks}</span>
                        <span className="text-slate-300">Score {repo.qualityScore}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm text-slate-500">
                {selected.size > 0 ? `${selected.size} selected` : 'Select repositories to import'}
              </span>
              <Button
                variant="brand"
                disabled={selected.size === 0 || isImporting}
                onClick={handleImport}
                className="gap-2"
              >
                {isImporting ? <Loader2 className="animate-spin" size={16} /> : <GithubIcon size={16} />}
                {isImporting ? 'Analyzing…' : `Import ${selected.size > 0 ? selected.size : ''}`.trim()}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
