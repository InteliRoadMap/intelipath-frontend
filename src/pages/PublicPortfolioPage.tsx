import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { portfolioApi, PortfolioData } from '@/api/portfolioApi';
import { EPortfolioEditor } from '@/features/portfolio/components/EPortfolioEditor';
import { SharedAppBackground } from '@/components/ui';
import { Loader2 } from 'lucide-react';

export const PublicPortfolioPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    portfolioApi.getPublicPortfolio(slug).then((res) => {
      if (!res) {
        setError("Portfolio not found.");
      } else {
        setData(res);
      }
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setError("Failed to load portfolio.");
      setLoading(false);
    });
  }, [slug]);

  if (loading || !data) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center relative overflow-hidden">
        <SharedAppBackground />
        
        <div className="relative flex flex-col items-center justify-center mb-8 z-10 bg-white/80 p-8 rounded-2xl shadow-sm backdrop-blur-sm border border-slate-200">
          <Loader2 className="w-10 h-10 text-[#00838f] animate-spin mb-4" />
          <h2 className="text-xl font-semibold tracking-tight text-slate-800">
            {error ? error : "Loading Portfolio..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <EPortfolioEditor initialData={data} isPublicView={true} />
    </div>
  );
};
