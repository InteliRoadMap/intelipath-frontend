import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import mentorApi from '@/features/mentor-dashboard/api/mentorApi';
import { PortfolioData } from '@/features/portfolio/api/portfolioApi';
import { EPortfolioEditor } from '@/features/portfolio/components/EPortfolioEditor';
import { ROUTES } from '@/shared';

export default function MentorPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    mentorApi.getStudentPortfolio(slug).then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.hero) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h2 className="text-2xl font-bold mb-4">Portfolio not found or not created yet</h2>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD_MENTOR, { state: { activeTab: 'portfolios' } })}
          className="px-4 py-2 bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors"
        >
          Back to E-Portfolios
        </button>
      </div>
    );
  }

  // studentId arrives on the portfolio itself now (mapped from userInfo.userId), so
  // the feedback modal has the person to write to even though the URL carries a slug.

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      {/* The URL is the only way back out of here: the editor renders the student's
          own portfolio full-bleed, with no app chrome of its own. Fixed so it stays
          reachable however far down the page you have scrolled. */}
      <button
        onClick={() => navigate(ROUTES.DASHBOARD_MENTOR, { state: { activeTab: 'portfolios' } })}
        className="fixed left-4 top-4 z-50 flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-[13px] font-bold text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/80"
      >
        <ArrowLeft size={16} />
        Back to E-Portfolios
      </button>

      {/*
        EPortfolioEditor automatically detects isMentor based on useAuth().
        Passing isPublicView={true} disables editing and shows the Feedback button for Mentors.
      */}
      <EPortfolioEditor initialData={data} isPublicView={true} />
    </div>
  );
}
