import React, { useRef } from 'react';
import { Gauge, Users, Layers } from 'lucide-react';
import { Layout, ChatTeardropText, Users as UsersIcon } from '@phosphor-icons/react';
import { DashboardUserActions, Logo } from '@/components/ui';
import { useAuth } from '@/context';
import { useNavigate, NavLink } from 'react-router-dom';
import mentorApi from '@/api/mentorApi';
import { ROUTES } from '@/shared';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  WelcomeBanner, 
  MetricWidget, 
  PendingReviewsWidget, 
  CareerDistributionWidget, 
  QuickActionsWidget, 
  MentorInsightWidget 
} from './MentorDashboardWidgets';

const mentorSections = [
  { id: "overview", label: "Overview" },
  { id: "pending-reviews", label: "Pending Reviews" },
  { id: "career-distribution", label: "Career Distribution" },
  { id: "mentor-insight", label: "Mentor Insight" }
];

export function MentorDashboardView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".gsap-fade-section", {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f8fafc] font-sans text-slate-950 pb-20">
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-[1680px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Logo hideIcon className="origin-left scale-90" />
            <nav className="hidden items-center gap-8 lg:flex">
              <NavLink
                end
                to={ROUTES.DASHBOARD_MENTOR}
                className={({ isActive }) =>
                  `relative flex h-[72px] items-center gap-2 border-b-[3px] px-0 text-sm font-semibold transition-colors ${
                    isActive ? "border-cyan-700 text-cyan-800" : "border-transparent text-slate-500 hover:text-slate-950"
                  }`
                }
              >
                <Layout size={17} weight="duotone" />
                Dashboard
              </NavLink>
              <NavLink
                to={ROUTES.DASHBOARD_MENTOR_STUDENTS}
                className={({ isActive }) =>
                  `relative flex h-[72px] items-center gap-2 border-b-[3px] px-0 text-sm font-semibold transition-colors ${
                    isActive ? "border-cyan-700 text-cyan-800" : "border-transparent text-slate-500 hover:text-slate-950"
                  }`
                }
              >
                <UsersIcon size={17} weight="duotone" />
                Students
              </NavLink>
              <NavLink
                to={ROUTES.DASHBOARD_MENTOR_FEEDBACK}
                className={({ isActive }) =>
                  `relative flex h-[72px] items-center gap-2 border-b-[3px] px-0 text-sm font-semibold transition-colors ${
                    isActive ? "border-cyan-700 text-cyan-800" : "border-transparent text-slate-500 hover:text-slate-950"
                  }`
                }
              >
                <ChatTeardropText size={17} weight="duotone" />
                Feedback
              </NavLink>
            </nav>
          </div>
          <DashboardUserActions user={user} onLogout={handleLogout} />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-8 px-4 py-8 md:px-8 xl:grid-cols-[220px_minmax(0,1fr)] 2xl:grid-cols-[220px_minmax(0,860px)_260px]">
        {/* LEFT SIDEBAR (SECTIONS) */}
        <aside className="hidden xl:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-hidden">
            <p className="mb-4 text-[13px] font-medium text-slate-400">Sections</p>
            <nav className="space-y-1.5">
              {mentorSections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block rounded-md px-3 py-2 text-[14px] font-semibold transition-colors ${
                    index === 0
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 border-t border-slate-100 pt-5">
              <p className="mb-3 text-[13px] font-medium text-slate-300">Actions</p>
              <button
                type="button"
                onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_FEEDBACK)}
                className="block rounded-md px-3 py-2 text-left text-[14px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                Provide Feedback
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <div className="min-w-0">
          <section id="overview" className="scroll-mt-28 mb-6 gsap-fade-section">
            <WelcomeBanner user={user} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricWidget title="TOTAL STUDENTS" icon={Users} apiFunction={mentorApi.getTotalStudentsMetric} />
              <MetricWidget title="PENDING REVIEWS" icon={Layers} apiFunction={mentorApi.getPendingReviewsCountMetric} />
              <MetricWidget title="FEEDBACK SUBMITTED" icon={ChatTeardropText} apiFunction={mentorApi.getFeedbackSubmittedMetric} />
              <MetricWidget title="AVG. RESPONSE TIME" icon={Gauge} apiFunction={mentorApi.getResponseTimeMetric} />
            </div>
          </section>

          <div className="flex min-w-0 flex-col gap-5 xl:gap-6">
            <section id="pending-reviews" className="scroll-mt-28 gsap-fade-section">
              <PendingReviewsWidget />
            </section>
            
            <section id="career-distribution" className="scroll-mt-28 gsap-fade-section">
              <CareerDistributionWidget />
            </section>

            <section id="mentor-insight" className="scroll-mt-28 gsap-fade-section">
              <MentorInsightWidget />
            </section>
          </div>
        </div>

        {/* RIGHT SIDEBAR (ON THIS PAGE & QUICK ACTIONS) */}
        <aside className="hidden 2xl:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-8">
            <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
              <QuickActionsWidget />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
