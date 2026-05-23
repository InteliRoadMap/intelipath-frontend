import React from 'react';
import { DashboardLayout } from '../component/layout/DashboardLayout';
import { DetailedRoadmap } from '../component/dashboard/DetailedRoadmap';
import { MentorFeedback } from '../component/dashboard/MentorFeedback';
import { SkillComparison } from '../component/dashboard/SkillComparison';
import { SkillGapsList } from '../component/dashboard/SkillGapsList';
import { AIMentorHistory } from '../component/dashboard/AIMentorHistory';
import { PriorityLearning } from '../component/dashboard/PriorityLearning';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { data, loading, error } = useDashboardData();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1F36] mb-2">Good morning, {user?.name || 'Student'}</h1>
            <p className="text-gray-500 text-sm">
              You've completed {data?.overallProgress || 0}% of the {data?.currentPath || 'current path'} roadmap. Ready for the next step?
            </p>
          </div>
          
          {data && (
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#0E7490]"
                    strokeDasharray={`${data.overallProgress}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-[#0E7490]">{data.overallProgress}%</span>
              </div>
              <div>
                <div className="text-[10px] font-medium text-gray-500">Current Path</div>
                <div className="text-sm font-bold text-[#1A1F36]">{data.currentPath}</div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-10 h-10 border-4 border-[#0E7490] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Loading your dashboard data...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
            Error loading data: {error.message}
          </div>
        ) : data ? (
          <>
            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Left Column (Span 7) */}
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                <DetailedRoadmap />
                <MentorFeedback feedbacks={data.feedbacks} />
                <SkillComparison skills={data.skills} />
              </div>

              {/* Right Column (Span 5) */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                <SkillGapsList gaps={data.gaps} />
                <AIMentorHistory />
              </div>

            </div>

            {/* Bottom Section */}
            <PriorityLearning />
          </>
        ) : null}

      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
