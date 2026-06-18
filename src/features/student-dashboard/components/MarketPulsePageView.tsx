import React, { useState } from 'react';
import { SharedAppBackground } from '@/components/ui';
import { Search, MapPin, Briefcase, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { RecruitmentPost } from '../types/marketPulse';
import StudentHeader from './StudentHeader';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared';

// Mock Data based on SQL Schema
const mockData: RecruitmentPost[] = [
  {
    post_id: '1',
    company_id: 'c1',
    recruitment_id: 'r1',
    company: {
      company_id: 'c1',
      company_link: 'https://techcorp.com',
      logo: 'https://logo.clearbit.com/google.com',
      name: 'TechCorp Solutions',
      introduction: {},
      info: {},
      contact: {}
    },
    recruitment: {
      recruitment_id: 'r1',
      recruitment_link: '#',
      title: 'Senior Frontend Developer (React)',
      salary: '$120,000 - $150,000',
      location: 'Remote, US',
      experience: '5+ Years',
      application_deadline: '2026-08-15',
      tags: ['React', 'TypeScript', 'Tailwind'],
      descriptions: {},
      general_infos: {},
      related_tags: []
    }
  },
  {
    post_id: '2',
    company_id: 'c2',
    recruitment_id: 'r2',
    company: {
      company_id: 'c2',
      company_link: 'https://innovateai.io',
      logo: 'https://logo.clearbit.com/openai.com',
      name: 'Innovate AI',
      introduction: {},
      info: {},
      contact: {}
    },
    recruitment: {
      recruitment_id: 'r2',
      recruitment_link: '#',
      title: 'Machine Learning Engineer',
      salary: 'Competitive',
      location: 'San Francisco, CA',
      experience: '3-5 Years',
      application_deadline: '2026-07-30',
      tags: ['Python', 'PyTorch', 'AWS'],
      descriptions: {},
      general_infos: {},
      related_tags: []
    }
  },
  {
    post_id: '3',
    company_id: 'c3',
    recruitment_id: 'r3',
    company: {
      company_id: 'c3',
      company_link: 'https://fintech.com',
      logo: 'https://logo.clearbit.com/stripe.com',
      name: 'Stripe',
      introduction: {},
      info: {},
      contact: {}
    },
    recruitment: {
      recruitment_id: 'r3',
      recruitment_link: '#',
      title: 'Fullstack Engineer',
      salary: '$140k - $180k',
      location: 'New York, NY',
      experience: '4+ Years',
      application_deadline: '2026-09-01',
      tags: ['Node.js', 'React', 'PostgreSQL'],
      descriptions: {},
      general_infos: {},
      related_tags: []
    }
  }
];

export default function MarketPulsePageView() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const filteredData = mockData.filter(post => 
    post.recruitment?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen w-full relative overflow-hidden bg-transparent pt-24 pb-20">
      <SharedAppBackground />
      <StudentHeader
        user={user}
        onLogout={logout}
        onOpenAiMentor={() => navigate(ROUTES.AI_MENTOR)}
      />
      
      <div className="max-w-6xl mx-auto w-full px-6 relative z-10 flex flex-col h-full gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Market Pulse
          </h1>
          <p className="text-slate-600 max-w-2xl text-[16px]">
            Discover the latest recruitment opportunities from top tech companies tailored to your roadmap.
          </p>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-[14px] outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              Filter by Tags
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              Sort by Date
            </button>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Company & Role</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Details</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Deadline</th>
                  <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((post) => (
                  <tr key={post.post_id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm p-1.5 shrink-0 flex items-center justify-center">
                          <img 
                            src={post.company?.logo} 
                            alt={post.company?.name}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[#00838f] transition-colors">
                            {post.recruitment?.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[13px] font-medium text-slate-600">
                              {post.company?.name}
                            </span>
                            <div className="flex gap-1">
                              {post.recruitment?.tags?.slice(0,2).map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell align-top pt-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[13px] text-slate-600">
                          <MapPin size={14} className="text-slate-400" /> {post.recruitment?.location}
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-slate-600">
                          <DollarSign size={14} className="text-slate-400" /> {post.recruitment?.salary}
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-slate-600">
                          <Briefcase size={14} className="text-slate-400" /> {post.recruitment?.experience}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell align-top pt-6">
                      <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                        <Calendar size={14} className="text-slate-400" /> 
                        {new Date(post.recruitment?.application_deadline || '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-middle text-right">
                      <a 
                        href={post.recruitment?.recruitment_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-[13px] font-bold rounded-full hover:bg-black transition-all active:scale-95 shadow-sm"
                      >
                        View <ChevronRight size={14} strokeWidth={3} />
                      </a>
                    </td>
                  </tr>
                ))}
                
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No recruitment posts found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
