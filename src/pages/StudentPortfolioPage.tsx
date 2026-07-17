import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { portfolioApi, PortfolioData } from '@/features/portfolio/api/portfolioApi';
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
                // The portfolio reads as a CV, so the admission date shows as its year alone.
                period: profile.admissionDate
                  ? `${new Date(profile.admissionDate).getFullYear()} - Present`
                  : 'Present',
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

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} strokeWidth={2.5} />
        <p className="text-sm font-medium text-slate-500">Loading your portfolio…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-500">
        Couldn't load your portfolio. Please try again.
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
