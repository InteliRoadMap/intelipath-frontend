/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V4 */
import { useState, useEffect } from 'react'
import { Select } from '@/components'
import { ArrowLeft, ArrowSquareOut, PaperPlaneTilt, Student, Sparkle } from '@phosphor-icons/react'
import {
  UserHeaderActions,
  Logo,
  SharedAppBackground,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui'
import { useAuth } from '@/context'
import { useNavigate, useParams } from 'react-router-dom'
import mentorApi from '@/features/mentor-dashboard/api/mentorApi'
import type { PortfolioData } from '@/features/portfolio/api/portfolioApi'
import { ROUTES } from '@/shared'

const PANEL =
  'rounded-2xl bg-white/70 backdrop-blur-md ring-1 ring-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.06)]'

type Load = 'loading' | 'ready' | 'missing'

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase() || '?'

export function MentorPortfolioView() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()

  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [load, setLoad] = useState<Load>('loading')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState('TECHNICAL')
  const [feedbackContent, setFeedbackContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // The URL carries the slug, but feedback is addressed to a person, so it needs
  // the id the portfolio response carries. Until it loads there is nobody to write to.
  const studentId = portfolio?.studentId

  useEffect(() => {
    if (!slug) return
    let alive = true
    setLoad('loading')
    mentorApi.getStudentPortfolio(slug).then((res) => {
      if (!alive) return
      setPortfolio(res)
      setLoad(res ? 'ready' : 'missing')
    })
    return () => {
      alive = false
    }
  }, [slug])

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim() || !studentId) return
    setIsSubmitting(true)
    try {
      await mentorApi.submitFeedback(studentId, { type: feedbackType, content: feedbackContent })
      localStorage.setItem(
        'student_notification',
        JSON.stringify({
          type: 'FEEDBACK_RECEIVED',
          message: 'A mentor just provided feedback on your E-Portfolio.',
          timestamp: Date.now(),
        })
      )
      setSubmitSuccess(true)
      setTimeout(() => {
        setIsDialogOpen(false)
        setSubmitSuccess(false)
        setFeedbackContent('')
      }, 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const hero = portfolio?.hero
  const name = hero?.name ?? ''

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-transparent pb-24 font-sans text-slate-900">
      <SharedAppBackground />

      <nav className="sticky top-0 z-40 flex items-center justify-between px-4 py-3.5 md:px-8">
        <Logo iconOnly className="scale-90 origin-left" />
        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 py-1 pl-3 pr-1 shadow-sm backdrop-blur-md">
          <UserHeaderActions
            user={user}
            onLogout={handleLogout}
            onSettings={() => navigate(ROUTES.DASHBOARD_MENTOR_SETTINGS)}
          />
        </div>
      </nav>

      <main className="mx-auto w-full max-w-[1000px] px-4 md:px-8 py-6">
        {/* The E-Portfolios list is a tab on /dashboard/mentor, not a route of its
            own, so returning means restoring the tab through location state. */}
        <button
          onClick={() => navigate(ROUTES.DASHBOARD_MENTOR, { state: { activeTab: 'portfolios' } })}
          className="mb-6 flex w-fit cursor-pointer items-center gap-2 text-[13px] font-bold text-slate-500 transition-colors hover:text-[#00838f]"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to E-Portfolios
        </button>

        {load === 'loading' ? (
          <div className="space-y-6">
            <div className={`${PANEL} flex flex-col gap-6 p-8 md:flex-row md:items-center`}>
              <div className="h-28 w-28 shrink-0 animate-pulse rounded-full bg-slate-200/70" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200/70" />
                <div className="h-8 w-64 animate-pulse rounded bg-slate-200/70" />
                <div className="h-4 w-full max-w-md animate-pulse rounded bg-slate-200/70" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className={`${PANEL} h-64 md:col-span-2 animate-pulse`} />
              <div className={`${PANEL} h-64 animate-pulse`} />
            </div>
          </div>
        ) : load === 'missing' ? (
          <div className={`${PANEL} flex flex-col items-center px-8 py-16 text-center`}>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Student size={28} className="text-slate-400" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">No portfolio at this address</h2>
            <p className="max-w-sm text-sm text-slate-500">
              Nothing is published at <span className="font-mono text-slate-600">{slug}</span>. The
              link may be out of date.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Identity */}
            <section className={`${PANEL} relative overflow-hidden p-8`}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-bl from-[#e0f2fe] to-transparent opacity-60" />

              <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
                {hero?.avatarUrl ? (
                  <img
                    src={hero.avatarUrl}
                    alt=""
                    className="h-28 w-28 shrink-0 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#00838f] to-[#00b4d8] text-[32px] font-bold text-white shadow-md">
                    {initialsOf(name)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {hero?.role && (
                    <div className="mb-3 inline-block rounded-md bg-[#e0f2fe] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#0284c7]">
                      {hero.role}
                    </div>
                  )}
                  <h1 className="mb-2 text-[32px] font-bold leading-tight text-slate-900 [overflow-wrap:anywhere]">
                    {name}
                  </h1>
                  {hero?.objective && (
                    <p className="mb-4 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                      {hero.objective}
                    </p>
                  )}

                  {/* Only what the student actually published. */}
                  {hero?.contact?.length ? (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium text-slate-500">
                      {hero.contact.map((c) => (
                        <span key={c.id} className="[overflow-wrap:anywhere]">
                          <span className="text-slate-400">{c.type}: </span>
                          {c.value}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:flex-col">
                  {portfolio?.slug && (
                    <a
                      href={ROUTES.PUBLIC_PORTFOLIO.replace(':slug', portfolio.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-[#00838f] bg-white px-6 py-3 text-[14px] font-bold text-[#00838f] shadow-sm transition-colors hover:bg-slate-50"
                    >
                      <ArrowSquareOut size={16} weight="bold" />
                      Live E-Portfolio
                    </a>
                  )}
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="group flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-[#00838f] bg-[#00838f] px-6 py-3 text-[14px] font-bold text-white shadow-sm transition-colors hover:border-[#006064] hover:bg-[#006064]">
                        <PaperPlaneTilt size={16} weight="bold" />
                        Provide Feedback
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Provide Feedback</DialogTitle>
                        <DialogDescription>
                          Share your professional review and suggestions with {name || 'this student'}.
                        </DialogDescription>
                      </DialogHeader>
                      {submitSuccess ? (
                        <div className="flex flex-col items-center gap-3 py-6 text-center font-semibold text-green-600">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <Sparkle size={24} weight="fill" className="text-green-600" />
                          </div>
                          Feedback sent successfully!
                        </div>
                      ) : (
                        <div className="grid gap-4 py-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Feedback Type</label>
                            <Select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
                              <option value="GENERAL">General Feedback</option>
                              <option value="TECHNICAL">Technical Skills Review</option>
                              <option value="SOFT_SKILL">Soft Skills &amp; Communication</option>
                              <option value="CAREER_ADVICE">Career Advice</option>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Review Comments</label>
                            <textarea
                              rows={5}
                              value={feedbackContent}
                              onChange={(e) => setFeedbackContent(e.target.value)}
                              placeholder="What did they do well? What can they improve?"
                              className="w-full resize-none rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-[#00838f] focus:ring-1 focus:ring-[#00838f]"
                            />
                          </div>
                        </div>
                      )}
                      {!submitSuccess && (
                        <DialogFooter>
                          <button
                            onClick={() => setIsDialogOpen(false)}
                            className="cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitFeedback}
                            disabled={!feedbackContent.trim() || isSubmitting || !studentId}
                            className="flex cursor-pointer items-center gap-2 rounded-md bg-[#00838f] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#006064] disabled:opacity-50"
                          >
                            {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                          </button>
                        </DialogFooter>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-6 md:col-span-2">
                <section className={`${PANEL} p-6`}>
                  <h2 className="mb-5 text-[18px] font-bold text-slate-900">Featured Projects</h2>
                  {portfolio?.projects?.length ? (
                    <div className="space-y-6">
                      {portfolio.projects.map((project, idx) => (
                        <div key={project.id} className="group">
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <h3 className="text-[15px] font-bold text-slate-800 transition-colors group-hover:text-[#00838f] [overflow-wrap:anywhere]">
                              {project.title}
                            </h3>
                            {project.codeLink && (
                              <a
                                href={project.codeLink}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open ${project.title} repository`}
                                className="shrink-0 p-1 text-slate-400 transition-colors hover:text-[#00838f]"
                              >
                                <ArrowSquareOut size={16} weight="bold" />
                              </a>
                            )}
                          </div>
                          {project.description && (
                            <p className="mb-3 text-[14px] leading-relaxed text-slate-600">
                              {project.description}
                            </p>
                          )}
                          {project.tech && (
                            <div className="flex flex-wrap gap-2">
                              {project.tech
                                .split(',')
                                .map((t) => t.trim())
                                .filter(Boolean)
                                .map((tech) => (
                                  <span
                                    key={tech}
                                    className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                                  >
                                    {tech}
                                  </span>
                                ))}
                            </div>
                          )}
                          {idx !== portfolio.projects.length - 1 && (
                            <hr className="mt-6 border-slate-100" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      This student has not published any projects yet.
                    </p>
                  )}
                </section>

                {portfolio?.education?.length ? (
                  <section className={`${PANEL} p-6`}>
                    <h2 className="mb-5 text-[18px] font-bold text-slate-900">Education</h2>
                    <div className="space-y-5">
                      {portfolio.education.map((item) => (
                        <div key={item.id}>
                          <h3 className="text-[15px] font-bold text-slate-800">{item.university}</h3>
                          <p className="text-[13px] font-medium text-slate-500">
                            {[item.degree, item.period].filter(Boolean).join(' · ')}
                          </p>
                          {item.description && (
                            <p className="mt-1 text-[14px] leading-relaxed text-slate-600">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <div className="space-y-6">
                <section className={`${PANEL} p-6`}>
                  <h2 className="mb-4 text-[16px] font-bold text-slate-900">Skills</h2>
                  {portfolio?.skills?.length ? (
                    <div className="space-y-4">
                      {portfolio.skills.map((skill) => (
                        <div key={skill.id}>
                          {skill.category && (
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {skill.category}
                            </p>
                          )}
                          <p className="text-[13px] font-bold text-[#0284c7] [overflow-wrap:anywhere]">
                            {skill.stack}
                          </p>
                          {skill.description && (
                            <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No skills published yet.</p>
                  )}
                </section>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
