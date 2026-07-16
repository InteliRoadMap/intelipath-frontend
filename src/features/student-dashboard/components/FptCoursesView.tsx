import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  CheckCircle,
  DownloadSimple,
  FileArrowDown,
  MagnifyingGlass,
  Target,
} from "@phosphor-icons/react"
import { Badge, Card, CardContent } from "@/components"
import fptCoursesApi, {
  type FptCourseDetail,
  type FptCourseListItem,
} from "@/features/student-dashboard/api/fptCoursesApi"
import { toast } from "@/utils/toast"

/** "13.0 MB" — students decide whether to download by size, not by byte count. */
function formatSize(bytes: number | null): string {
  if (!bytes) return ""
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

/**
 * Course lookup: search the subjects on your curriculum, read what each one teaches
 * (its CLOs) and download the material we hold for it.
 *
 * The download button only appears for sessions we actually have a file for. Most
 * sessions have none — FLM publishes files for a minority of them — so the page treats
 * "no file" as ordinary rather than as an error.
 */
export function FptCoursesView() {
  const [courses, setCourses] = useState<FptCourseListItem[]>([])
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState<FptCourseDetail | null>(null)
  const [loadingList, setLoadingList] = useState(true)
  /** The subject whose detail failed, so a failed load doesn't read as a stuck spinner. */
  const [failed, setFailed] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  // Derived rather than its own state: "the detail on screen isn't the one selected yet"
  // is exactly what loading means here, and tracking it separately only invites the two
  // to disagree.
  const loadingDetail = !!selected && detail?.code !== selected && failed !== selected

  useEffect(() => {
    let alive = true
    fptCoursesApi
      .list()
      .then((rows) => {
        if (!alive) return
        setCourses(rows)
        setSelected((current) => current ?? rows[0]?.code ?? null)
      })
      .catch(() => alive && toast.error("Could not load your subjects."))
      .finally(() => alive && setLoadingList(false))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!selected) return
    let alive = true
    fptCoursesApi
      .detail(selected)
      .then((d) => {
        if (!alive) return
        setDetail(d)
      })
      .catch(() => {
        if (!alive) return
        setFailed(selected)
        toast.error(`Could not load ${selected}.`)
      })
    return () => {
      alive = false
    }
  }, [selected])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return courses
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
    )
  }, [courses, query])

  const files = detail?.sessions.filter((s) => s.downloadable) ?? []

  const download = async (materialId: string) => {
    setDownloading(materialId)
    try {
      // The link expires in ~2 minutes, so fetch it at click time and use it at once.
      const url = await fptCoursesApi.downloadLink(materialId)
      window.open(url, "_blank", "noopener")
    } catch {
      toast.error("That file isn't available right now.")
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-16 pt-28 md:px-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-slate-900">Course materials</h1>
        <p className="mt-1 text-[13.5px] text-slate-500">
          The subjects on your curriculum, what each one teaches, and the files we hold for them.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* ── Subject list ─────────────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="relative mb-3">
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code, name or skill…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[13px] text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>

          <div className="max-h-[70vh] space-y-1.5 overflow-y-auto pr-1">
            {loadingList ? (
              <p className="py-10 text-center text-[13px] text-slate-400">Loading subjects…</p>
            ) : filtered.length === 0 ? (
              <p className="py-10 text-center text-[13px] text-slate-400">
                {courses.length === 0
                  ? "No subjects yet for your curriculum."
                  : `Nothing matches “${query}”.`}
              </p>
            ) : (
              filtered.map((c) => {
                const active = c.code === selected
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelected(c.code)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                      active
                        ? "border-indigo-200 bg-indigo-50/70"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12.5px] font-semibold text-slate-900">{c.code}</span>
                      {c.semester !== null && (
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                          Term {c.semester}
                        </span>
                      )}
                      {c.status === "PASSED" && (
                        <CheckCircle size={14} weight="fill" className="ml-auto text-emerald-500" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[12.5px] text-slate-600">{c.name}</p>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── Detail ───────────────────────────────────────── */}
        <div className="lg:col-span-8">
          {loadingDetail ? (
            <Card>
              <CardContent className="py-16 text-center text-[13px] text-slate-400">Loading…</CardContent>
            </Card>
          ) : !detail || detail.code !== selected ? (
            <Card>
              <CardContent className="py-16 text-center text-[13px] text-slate-400">
                {failed === selected ? `Couldn't load ${selected}.` : "Pick a subject to see what it teaches."}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[13px] font-bold text-indigo-700">{detail.code}</span>
                    {detail.credits !== null && <Badge variant="info">{detail.credits} credits</Badge>}
                    {detail.prerequisite && (
                      <span className="text-[11.5px] text-slate-400">Requires {detail.prerequisite}</span>
                    )}
                  </div>
                  <h2 className="mt-1 font-display text-lg font-semibold text-slate-900">{detail.name}</h2>

                  {detail.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Target size={14} weight="duotone" className="text-slate-400" />
                      {detail.skills.map((s) => (
                        <Badge key={s} variant="default">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {detail.description && (
                    <p className="mt-3 line-clamp-4 text-[12.5px] leading-relaxed text-slate-500">
                      {detail.description}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* What you'll be able to do — the syllabus's own words. */}
              {detail.clos.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-slate-800">
                      <BookOpen size={16} weight="duotone" className="text-indigo-600" />
                      What you'll learn
                    </h3>
                    <ul className="space-y-2">
                      {detail.clos.map((c) => (
                        <li key={c.code} className="flex gap-2.5 text-[12.5px] leading-relaxed text-slate-600">
                          <span className="mt-px shrink-0 font-mono text-[11px] font-bold text-indigo-600">
                            {c.code}
                          </span>
                          <span>{c.outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-slate-800">
                    <FileArrowDown size={16} weight="duotone" className="text-emerald-600" />
                    Files
                    <span className="font-normal text-slate-400">({files.length})</span>
                  </h3>
                  {files.length === 0 ? (
                    <p className="py-6 text-center text-[12.5px] text-slate-400">
                      No files for this subject.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {files.map((f) => (
                        <li
                          key={f.id}
                          className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-[12.5px] font-medium text-slate-700">{f.title}</p>
                            {f.sizeBytes && (
                              <p className="text-[11px] text-slate-400">{formatSize(f.sizeBytes)}</p>
                            )}
                          </div>
                          <button
                            onClick={() => download(f.id)}
                            disabled={downloading === f.id}
                            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                          >
                            <DownloadSimple size={14} weight="bold" />
                            {downloading === f.id ? "Preparing…" : "Download"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Books and articles the syllabus points at; we don't host these. */}
              {detail.materials.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-3 text-[13px] font-bold text-slate-800">Recommended reading</h3>
                    <ul className="space-y-1.5">
                      {detail.materials.map((m) => (
                        <li key={m.id} className="text-[12.5px] leading-relaxed text-slate-600">
                          {m.url ? (
                            <a
                              href={m.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 underline-offset-2 hover:underline"
                            >
                              {m.title}
                            </a>
                          ) : (
                            m.title
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
