import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mentorApi from '@/features/mentor-dashboard/api/mentorApi';
import { PortfolioData } from '@/features/portfolio/api/portfolioApi';
import { EPortfolioEditor } from '@/features/portfolio/components/EPortfolioEditor';
import { ROUTES } from '@/shared';

export default function MentorPortfolioPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    mentorApi.getStudentPortfolio(studentId).then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [studentId]);

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
        <button onClick={() => navigate(ROUTES.DASHBOARD_MENTOR)} className="px-4 py-2 bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors">
          Go back to Dashboard
        </button>
      </div>
    );
  }

  // Ensure the portfolio knows which student it belongs to so the feedback modal works correctly
  if (!data.studentId) {
    data.studentId = studentId;
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      {/* 
        EPortfolioEditor automatically detects isMentor based on useAuth().
        Passing isPublicView={true} disables editing and shows the Feedback button for Mentors.
      */}
      <EPortfolioEditor initialData={data} isPublicView={true} />
    </div>
  );
}
