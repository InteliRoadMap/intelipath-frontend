import React, { useEffect, useState } from 'react';
import { portfolioApi, PortfolioData } from '@/api/portfolioApi';
// We will create this component next
import { EPortfolioEditor } from '@/features/portfolio/components/EPortfolioEditor';

import { useAuth } from '@/context';
import { studentDashboardService } from '@/features/student-dashboard/services/studentDashboardService';

export const StudentPortfolioPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [portfolioRes, profileRes] = await Promise.all([
          portfolioApi.getPortfolio(),
          studentDashboardService.getStudentProfile()
        ]);
        
        // Merge real user data if this is the first time (mock data still has 'Student Name')
        if (portfolioRes.hero.name === 'Student Name' && user) {
          portfolioRes.hero.name = user.fullName || 'Student Name';
          portfolioRes.hero.greeting = `Hi, I'm ${user.fullName?.split(' ')[0] || 'there'}!`;
          portfolioRes.hero.contact[0].value = user.email || 'student@example.com';
          
          if (profileRes) {
            const profile = profileRes as any;
            portfolioRes.hero.role = profile.major || 'Software Engineering';
            
            if (profile.university) {
              portfolioRes.education = [{
                id: 'edu-mock-1',
                university: profile.university,
                degree: profile.major || 'Bachelor Degree',
                period: profile.yearOfAdmission ? `${profile.yearOfAdmission} - Present` : 'Present',
                description: 'Currently studying here.'
              }];
            }
          }
        }
        
        setData(portfolioRes);
      } catch (err) {
        console.error("Failed to load portfolio data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user]);

  if (loading || !data) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        
        {/* Animated Spinner */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="w-20 h-20 border-[3px] border-slate-800 rounded-full"></div>
          <div className="absolute w-20 h-20 border-[3px] border-indigo-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          <div className="absolute w-20 h-20 border-[3px] border-purple-500 rounded-full border-b-transparent border-l-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
          {/* Inner core */}
          <div className="absolute w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full animate-pulse opacity-80 blur-[2px]"></div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">Initializing Workspace</h2>
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <span className="animate-pulse">Loading E-Portfolio modules</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* We pass the initial data to the editor. The editor manages its own state and auto-saving */}
      <EPortfolioEditor initialData={data} />
    </div>
  );
};
