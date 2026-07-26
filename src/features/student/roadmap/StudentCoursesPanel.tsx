import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { BookOpen, Users, GraduationCap, CaretRight, CaretDown, CaretUp, LinkSimple, ArrowUpRight, X } from "@phosphor-icons/react"
import courseApi, { type Course } from "@/features/mentor-dashboard/api/courseApi"
import { emitToast } from "@/utils/toast"

interface Props {
  careerId?: string | null
  careerName?: string | null
}

/** Friendly source name for a resource URL, falling back to the hostname. */
function sourceLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "")
    return host
  } catch {
    return "Link"
  }
}

/**
 * Mentor-authored courses for the student's current career. Shown as a single
 * sidebar trigger that opens a roomy modal for browsing lessons and resources.
 */
export function StudentCoursesPanel({ careerId, careerName }: Props) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    if (!careerId) return
    let alive = true
    setLoading(true)
    courseApi.browse(careerId)
      .then(res => { if (alive) setCourses(res.data || []) })
      .catch(() => { if (alive) setCourses([]) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [careerId])

  // Lock body scroll + close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const patch = (updated: Course) =>
    setCourses(cs => cs.map(c => c.courseId === updated.courseId ? updated : c))

  const toggleEnroll = async (c: Course) => {
    setBusy(c.courseId)
    try {
      if (c.enrolled) {
        await courseApi.unenroll(c.courseId)
        patch({ ...c, enrolled: false, progress: null, enrolledCount: Math.max(0, c.enrolledCount - 1) })
        emitToast("Left the course.", "info")
      } else {
        const res = await courseApi.enroll(c.courseId)
        patch({ ...res.data, lessons: c.lessons })
        emitToast("Enrolled! The course is now in your learning list.", "success")
      }
    } catch {
      emitToast("Something went wrong. Please try again.", "error")
    } finally {
      setBusy(null)
    }
  }

  const openDetail = async (c: Course) => {
    if (openId === c.courseId) { setOpenId(null); return }
    setOpenId(c.courseId)
    if (!c.lessons) {
      try { const res = await courseApi.detail(c.courseId); patch(res.data) } catch { /* ignore */ }
    }
  }

  if (!careerId || (!loading && courses.length === 0)) return null

  return (
    <>
      {/* Floating glass pill on the canvas, sitting above the stage legend. */}
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 rounded-xl bg-white/70 px-3.5 py-2.5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-md transition-colors hover:bg-white/90"
      >
        <BookOpen size={15} weight="bold" className="text-slate-700" />
        <span className="text-[12px] font-bold tracking-tight text-slate-800">Mentor Courses</span>
        <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-slate-900 px-1.5 text-[10px] font-bold text-white">{courses.length}</span>
        <CaretRight size={12} weight="bold" className="text-slate-400 transition-transform group-hover:translate-x-0.5" />
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <BookOpen size={13} weight="bold" /> Mentor Courses
                </p>
                <h2 className="mt-0.5 text-[19px] font-bold tracking-tight text-slate-900">
                  Courses for {careerName || "this path"}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Body */}
            <div className="grid gap-3 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />)
              ) : (
                courses.map(c => (
                  <div key={c.courseId} className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
                    <div className="flex items-start justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="text-[15px] font-bold text-slate-900">{c.title}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{c.description || "No description."}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-medium text-slate-400">
                          <span className="flex items-center gap-1"><GraduationCap size={13} weight="duotone" /> {c.mentorName || "Mentor"}</span>
                          <span>{c.level}</span>
                          <span>{c.lessonCount} lessons</span>
                          <span className="flex items-center gap-1"><Users size={13} weight="duotone" /> {c.enrolledCount}</span>
                        </div>
                        {c.enrolled && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="h-1.5 w-36 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-slate-900" style={{ width: `${c.progress ?? 0}%` }} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500">{c.progress ?? 0}%</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleEnroll(c)}
                        disabled={busy === c.courseId}
                        className={`shrink-0 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-50 ${c.enrolled ? "ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                      >
                        {c.enrolled ? "Leave" : "Enroll"}
                      </button>
                    </div>

                    <button
                      onClick={() => openDetail(c)}
                      className="flex w-full items-center justify-center gap-1 border-t border-slate-100 py-2 text-[12px] font-semibold text-slate-400 transition-colors hover:text-slate-900"
                    >
                      {openId === c.courseId ? <>Hide lessons <CaretUp size={12} /></> : <>View lessons &amp; resources <CaretDown size={12} /></>}
                    </button>

                    {openId === c.courseId && (
                      <div className="border-t border-slate-100 bg-slate-50/60 p-3">
                        {c.lessons && c.lessons.length > 0 ? (
                          <ol className="grid gap-1.5">
                            {c.lessons.map((l, i) => (
                              <li key={l.lessonId || i} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/70">
                                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-900 text-[11px] font-bold text-white">{i + 1}</span>
                                <span className="flex-1 text-[13px] font-medium text-slate-800">{l.title}</span>
                                {l.resourceUrl && (
                                  <a
                                    href={l.resourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-900 hover:text-white"
                                  >
                                    <LinkSimple size={12} weight="bold" />
                                    <span className="max-w-[110px] truncate">{sourceLabel(l.resourceUrl)}</span>
                                    <ArrowUpRight size={12} weight="bold" />
                                  </a>
                                )}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="py-2 text-center text-[12px] text-slate-400">No lessons published yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default StudentCoursesPanel
