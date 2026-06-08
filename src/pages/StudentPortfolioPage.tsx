import React, { useEffect, useState } from 'react';
import { portfolioApi, PortfolioData } from '@/api/portfolioApi';
// We will create this component next
import { EPortfolioEditor } from '@/features/portfolio/components/EPortfolioEditor';

export const StudentPortfolioPage = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from mock API when page loads
    portfolioApi.getPortfolio().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="text-xl font-semibold animate-pulse">Loading E-Portfolio...</div>
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
