import { useEffect, useState } from "react"
import { BookOpen, Users, GraduationCap, CaretDown, CaretUp, LinkSimple } from "@phosphor-icons/react"
import courseApi, { type Course } from "@/features/mentor-dashboard/api/courseApi"
import { emitToast } from "@/utils/toast"

interface Props {
  careerId?: string | null
  careerName?: string | null
}

/** Mentor-authored courses for the student's current career, shown on the roadmap. */
export function StudentCoursesPanel({ careerId, careerName }: Props) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <BookOpen size={18} weight="duotone" className="text-indigo-600" />
        <h3 className="text-[15px] font-bold text-slate-900">Courses from industry mentors</h3>
      </div>
      <p className="mb-4 text-[12.5px] text-slate-500">
        Curated by mentors for the {careerName || "this"} path. Enroll if you'd like to follow them alongside your roadmap.
      </p>

      {loading ? (
        <div className="grid gap-2">{[1, 2].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>
      ) : (
        <div className="grid gap-2.5">
          {courses.map(c => (
            <div key={c.courseId} className="rounded-xl border border-slate-200">
              <div className="flex items-start justify-between gap-3 p-3.5">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900">{c.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[12.5px] text-slate-500">{c.description || "No description."}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-500">
                    <span className="flex items-center gap-1"><GraduationCap size={12} weight="duotone" /> {c.mentorName || "Mentor"}</span>
                    <span>{c.level}</span>
                    <span>{c.lessonCount} lessons</span>
                    <span className="flex items-center gap-1"><Users size={12} weight="duotone" /> {c.enrolledCount}</span>
                  </div>
                  {c.enrolled && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${c.progress ?? 0}%` }} />
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">{c.progress ?? 0}%</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleEnroll(c)}
                  disabled={busy === c.courseId}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-[12.5px] font-medium disabled:opacity-50 ${c.enrolled ? "border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                >
                  {c.enrolled ? "Leave" : "Enroll"}
                </button>
              </div>

              <button onClick={() => openDetail(c)} className="flex w-full items-center justify-center gap-1 border-t border-slate-100 py-1.5 text-[12px] font-medium text-slate-400 hover:text-indigo-600">
                {openId === c.courseId ? <>Hide lessons <CaretUp size={12} /></> : <>View lessons <CaretDown size={12} /></>}
              </button>
              {openId === c.courseId && c.lessons && (
                <ol className="grid gap-1 px-3.5 pb-3.5 pt-1">
                  {c.lessons.map((l, i) => (
                    <li key={l.lessonId || i} className="flex items-center gap-2 text-[13px] text-slate-700">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">{i + 1}</span>
                      <span className="flex-1">{l.title}</span>
                      {l.resourceUrl && <a href={l.resourceUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-600"><LinkSimple size={14} /></a>}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentCoursesPanel
