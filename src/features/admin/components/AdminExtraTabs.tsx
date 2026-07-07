import { useEffect, useState } from "react"
import { Briefcase, GraduationCap, Buildings, MapPin, Money, ArrowSquareOut } from "@phosphor-icons/react"
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components"
import { mainClient } from "@/shared/api"

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>()
  useEffect(() => {
    let alive = true
    mainClient
      .get<T>(url)
      .then((res) => { if (alive) setData(res.data) })
      .catch(() => { if (alive) setData(null) })
    return () => { alive = false }
  }, [url])
  return data // undefined = loading, null = error, T = loaded
}

function SectionSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-1.5">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="p-8 text-center text-sm text-slate-400">{text}</p>
}

// ─── Content tab: Careers & Roadmaps + Universities ────────────────────────────
export function AdminContentTab() {
  const careers = useFetch<any[]>("/careers")
  const universities = useFetch<any[]>("/universities")

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center gap-3 border-b border-slate-100 p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-black/5">
            <GraduationCap size={19} weight="duotone" />
          </div>
          <div>
            <CardTitle className="text-base">Careers & Roadmaps</CardTitle>
            <CardDescription>{Array.isArray(careers) ? `${careers.length} career paths` : "Loading…"}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          {careers === undefined ? (
            <SectionSkeleton />
          ) : !careers || careers.length === 0 ? (
            <EmptyState text="No careers found." />
          ) : (
            <ul className="max-h-[440px] overflow-auto">
              {careers.map((c) => {
                const nodes = Array.isArray(c.skillNodes) ? c.skillNodes.length : undefined
                return (
                  <li key={c.careerId} className="flex items-start gap-3 rounded-lg px-2.5 py-2.5 hover:bg-slate-50">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                      <Briefcase size={16} weight="duotone" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-slate-800">{c.careerName}</p>
                      {c.description && <p className="line-clamp-2 text-[12px] leading-4 text-slate-400">{c.description}</p>}
                    </div>
                    {nodes !== undefined && (
                      <Badge variant={nodes > 0 ? "success" : "default"} className="shrink-0">
                        {nodes > 0 ? `${nodes} nodes` : "No roadmap"}
                      </Badge>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center gap-3 border-b border-slate-100 p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-black/5">
            <Buildings size={19} weight="duotone" />
          </div>
          <div>
            <CardTitle className="text-base">Universities</CardTitle>
            <CardDescription>{Array.isArray(universities) ? `${universities.length} registered` : "Loading…"}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          {universities === undefined ? (
            <SectionSkeleton />
          ) : !universities || universities.length === 0 ? (
            <EmptyState text="No universities found." />
          ) : (
            <ul className="max-h-[440px] overflow-auto">
              {universities.map((u) => (
                <li key={u.universityId || u.name} className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 hover:bg-slate-50">
                  <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500">
                    {u.logoUrl ? <img src={u.logoUrl} alt="" className="h-full w-full object-cover" /> : (u.code || u.name?.slice(0, 2) || "U").toUpperCase().slice(0, 3)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-slate-800">{u.name}</p>
                    {u.domainEmail && <p className="truncate text-[12px] text-slate-400">{u.domainEmail}</p>}
                  </div>
                  {u.code && <Badge className="shrink-0">{u.code}</Badge>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Market tab: scraped recruitment posts ─────────────────────────────────────
export function AdminMarketTab() {
  const posts = useFetch<any[]>("/recruitment-posts/")

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center gap-3 border-b border-slate-100 p-4">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-black/5">
          <Briefcase size={19} weight="duotone" />
        </div>
        <div>
          <CardTitle className="text-base">Recruitment posts</CardTitle>
          <CardDescription>{Array.isArray(posts) ? `${posts.length} jobs from the latest scrape` : "Loading…"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {posts === undefined ? (
          <SectionSkeleton />
        ) : !posts || posts.length === 0 ? (
          <EmptyState text="No recruitment posts yet. Run the Job Scraper from the Overview tab." />
        ) : (
          <div className="grid max-h-[560px] grid-cols-1 gap-2.5 overflow-auto md:grid-cols-2">
            {posts.map((p) => {
              const r = p.recruitment || {}
              const c = p.company || {}
              return (
                <div key={p.postId} className="rounded-xl border border-slate-200 p-3.5 transition-colors hover:border-slate-300 hover:bg-slate-50/50">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500">
                      {c.logo ? <img src={c.logo} alt="" className="h-full w-full object-cover" /> : (c.name || "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-slate-900">{r.title || "Untitled role"}</p>
                      <p className="truncate text-[12.5px] text-slate-500">{c.name || "Unknown company"}</p>
                    </div>
                    {c.companyLink && (
                      <a href={c.companyLink} target="_blank" rel="noreferrer" className="shrink-0 text-slate-300 hover:text-indigo-600">
                        <ArrowSquareOut size={16} weight="bold" />
                      </a>
                    )}
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
                    {r.salary && <span className="flex items-center gap-1"><Money size={13} weight="duotone" /> {r.salary}</span>}
                    {r.location && <span className="flex items-center gap-1"><MapPin size={13} weight="duotone" /> {r.location}</span>}
                    {r.experience && <span className="flex items-center gap-1"><Briefcase size={13} weight="duotone" /> {r.experience}</span>}
                  </div>
                  {Array.isArray(r.tags) && r.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.tags.slice(0, 5).map((t: string, i: number) => (
                        <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
