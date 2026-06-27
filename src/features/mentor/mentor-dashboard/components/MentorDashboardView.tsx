import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { UserHeaderActions, Logo, SharedAppBackground } from '@/components';
import { useAuth } from '@/context';
import { ROUTES } from '@/shared';
import { MentorHeader } from './MentorHeader';

// Sections
import { 
  WelcomeBanner, 
  MetricWidget, 
  PendingReviewsWidget, 
  CareerDistributionWidget, 
  QuickActionsWidget, 
  MentorInsightWidget 
} from './MentorDashboardWidgets';
import mentorApi from '@/api/mentorApi';
import { Users, Layers, Gauge } from 'lucide-react';
import { ChatTeardropText } from '@phosphor-icons/react';
import { MentorEPortfoliosView } from './MentorEPortfoliosView';
import { MentorProgressReportsView } from './MentorProgressReportsView';
import { MentorFeedbackHistoryView } from './MentorFeedbackHistoryView';

export function MentorDashboardView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clean up the state so refreshing doesn't get stuck
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  useGSAP(() => {
    gsap.from(".gsap-fade-section", {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all"
    });
  }, { scope: containerRef, dependencies: [activeTab] });

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div ref={containerRef} className="relative min-h-[100dvh] overflow-x-hidden bg-transparent pb-32 pt-[120px] font-sans text-slate-900 selection:bg-black/10">
      <SharedAppBackground />
      
      <MentorHeader 
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <section className="gsap-fade-section">
              <WelcomeBanner user={user} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <MetricWidget title="TOTAL MENTEES" icon={Users} apiFunction={mentorApi.getTotalStudentsMetric} />
                <MetricWidget title="PENDING REVIEWS" icon={Layers} apiFunction={mentorApi.getPendingReviewsCountMetric} />
                <MetricWidget title="FEEDBACK SENT" icon={ChatTeardropText} apiFunction={mentorApi.getFeedbackSubmittedMetric} />
                <MetricWidget title="AVG. PROGRESS" icon={Gauge} apiFunction={mentorApi.getResponseTimeMetric} />
              </div>
            </section>
            
            <section className="gsap-fade-section">
              <PendingReviewsWidget />
            </section>
          </div>
        )}

        {activeTab === 'portfolios' && (
          <div className="gsap-fade-section">
            <MentorEPortfoliosView />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="gsap-fade-section">
            <MentorProgressReportsView />
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="gsap-fade-section">
            <MentorFeedbackHistoryView />
          </div>
        )}

        {activeTab === 'market' && (
          <div className="gsap-fade-section flex h-96 items-center justify-center text-slate-500 font-medium">
            Market trends coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
