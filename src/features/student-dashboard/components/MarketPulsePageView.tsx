import React, { useState, useMemo } from 'react';
import { SharedAppBackground } from '@/components/ui';
import { Search, MapPin, Briefcase, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { RecruitmentPost } from '../types/marketPulse';
import StudentHeader from './StudentHeader';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared';
import marketPulseApi from '@/api/marketPulseApi';
import TopHiringCompaniesChart from './market-pulse/TopHiringCompaniesChart';
import TrendingSkillsChart from './market-pulse/TrendingSkillsChart';
import SalaryOverviewChart from './market-pulse/SalaryOverviewChart';
import { TopCompany, SkillTrend, SalaryBracket } from '../types/marketPulse';

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
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [trendingTimeRange, setTrendingTimeRange] = useState('30days');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [trendingSkills, setTrendingSkills] = useState<SkillTrend[]>([]);
  const [salaryOverview, setSalaryOverview] = useState<SalaryBracket[]>([]);
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [companiesRes, skillsRes, salaryRes, postsRes] = await Promise.all([
          marketPulseApi.getTopHiringCompanies(5),
          marketPulseApi.getTrendingSkills(),
          marketPulseApi.getSalaryOverview(),
          marketPulseApi.getRecruitmentPosts()
        ]);
        
        setTopCompanies(companiesRes.data || []);
        setTrendingSkills(skillsRes.data || []);
        setSalaryOverview(salaryRes.data || []);
        
        // Handle RecruitmentPostResponse (which might have a nested list of posts depending on backend)
        const postsData = postsRes.data?.data || postsRes.data || [];
        setRecruitmentPosts(Array.isArray(postsData) ? postsData : []);
      } catch (error) {
        console.error("Failed to fetch market pulse data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const tagGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {
      'Experience': new Set(),
      'Education': new Set(),
      'Perks & Benefits': new Set(),
      'Roles & Skills': new Set(),
    };
    
    recruitmentPosts.forEach(post => {
      post.recruitment?.tags?.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes('kinh nghiệm') || lowerTag.includes('năm') || lowerTag.includes('experience') || lowerTag.includes('tháng')) {
          groups['Experience'].add(tag);
        } else if (lowerTag.includes('đại học') || lowerTag.includes('cao đẳng') || lowerTag.includes('thạc sĩ') || lowerTag.includes('cao học') || lowerTag.includes('chuyên môn') || lowerTag.includes('bằng')) {
          groups['Education'].add(tag);
        } else if (lowerTag.includes('bảo hiểm') || lowerTag.includes('hỗ trợ') || lowerTag.includes('thưởng') || lowerTag.includes('chế độ') || lowerTag.includes('trợ cấp') || lowerTag.includes('lương')) {
          groups['Perks & Benefits'].add(tag);
        } else {
          groups['Roles & Skills'].add(tag);
        }
      });
    });
    
    return Object.entries(groups)
      .map(([category, tagsSet]) => ({
        category,
        tags: Array.from(tagsSet).sort()
      }))
      .filter(group => group.tags.length > 0);
  }, [recruitmentPosts]);

  const filteredData = useMemo(() => {
    let result = recruitmentPosts.filter(post => {
      const matchSearch = post.recruitment?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.recruitment?.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchTag = selectedTag ? post.recruitment?.tags?.includes(selectedTag) : true;
      return matchSearch && matchTag;
    });

    result = result.sort((a, b) => {
      const dateA = new Date(a.recruitment?.application_deadline || 0).getTime();
      const dateB = new Date(b.recruitment?.application_deadline || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [recruitmentPosts, searchTerm, sortOrder, selectedTag]);

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

        {/* Dashboard Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Hiring Companies */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-2xl p-6 lg:row-span-2 flex flex-col">
            <h3 className="text-[16px] font-bold text-slate-800 mb-6">Top Hiring Companies</h3>
            {loading ? (
              <div className="animate-pulse flex flex-col gap-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl w-full"></div>)}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <TopHiringCompaniesChart data={topCompanies} />
              </div>
            )}
          </div>

          {/* Trending Skills */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-bold text-slate-800">Trending Skills Demand</h3>
              <select 
                value={trendingTimeRange}
                onChange={(e) => setTrendingTimeRange(e.target.value)}
                className="text-[12px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              >
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
              </select>
            </div>
            {loading ? (
              <div className="h-[300px] bg-slate-50 animate-pulse rounded-xl w-full"></div>
            ) : (
              <TrendingSkillsChart data={trendingSkills} />
            )}
          </div>

          {/* Salary Overview */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-[16px] font-bold text-slate-800 mb-2">Salary Overview</h3>
            <p className="text-[13px] text-slate-500 mb-6">Distribution of open jobs across different salary ranges.</p>
            {loading ? (
              <div className="h-[300px] bg-slate-50 animate-pulse rounded-xl w-full"></div>
            ) : (
              <SalaryOverviewChart data={salaryOverview} />
            )}
          </div>
        </div>

        <div className="w-full h-px bg-slate-200 my-2"></div>

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
            <select 
              className="px-4 py-2 w-full md:w-[220px] bg-white border border-slate-200 rounded-full text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm outline-none cursor-pointer truncate"
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
            >
              <option value="">Filter by Tags</option>
              {tagGroups.map(group => (
                <optgroup key={group.category} label={group.category}>
                  {group.tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </optgroup>
              ))}
            </select>

            <button 
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1"
            >
              Sort by Date {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-2xl overflow-hidden min-h-[600px]">
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
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 shadow-sm p-1.5 shrink-0 flex items-center justify-center">
                          <img 
                            src={post.company?.logo} 
                            alt={post.company?.name}
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://placehold.co/40x40/f8fafc/94a3b8?text=Logo';
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[#00838f] transition-colors leading-tight mb-1.5">
                            {post.recruitment?.title}
                          </h3>
                          <div className="text-[13px] font-medium text-slate-600 truncate max-w-[300px] mb-2">
                            {post.company?.name}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {post.recruitment?.tags?.slice(0,3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded-md bg-[#00838f]/10 text-[#00838f] border border-[#00838f]/20 text-[10px] font-bold uppercase tracking-wider">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell align-top">
                      <div className="flex flex-col gap-2.5 min-w-[180px]">
                        <div className="flex items-start gap-2 text-[13px] text-slate-600">
                          <MapPin size={15} className="text-slate-400 mt-0.5 shrink-0" /> 
                          <span className="leading-tight">{post.recruitment?.location}</span>
                        </div>
                        <div className="flex items-start gap-2 text-[13px] text-slate-600">
                          <DollarSign size={15} className="text-slate-400 mt-0.5 shrink-0" /> 
                          <span className="leading-tight font-semibold text-slate-700">{post.recruitment?.salary}</span>
                        </div>
                        <div className="flex items-start gap-2 text-[13px] text-slate-600">
                          <Briefcase size={15} className="text-slate-400 mt-0.5 shrink-0" /> 
                          <span className="leading-tight">{post.recruitment?.experience}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell align-top">
                      <div className="flex items-start gap-2 text-[13px] font-medium text-slate-600">
                        <Calendar size={14} className="text-slate-400 mt-0.5 shrink-0" /> 
                        <span className="leading-tight">
                          {new Date(post.recruitment?.application_deadline || '').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-middle text-right">
                      <a 
                        href={post.recruitment?.recruitment_link || '#'}
                        target={post.recruitment?.recruitment_link ? "_blank" : "_self"}
                        rel="noreferrer"
                        onClick={(e) => {
                          if (!post.recruitment?.recruitment_link || post.recruitment.recruitment_link === '#') {
                            e.preventDefault();
                            // If no link is provided, fallback to opening the company website if available
                            if (post.company?.company_link) {
                              window.open(post.company.company_link, '_blank');
                            }
                          }
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-slate-900 !text-white text-[13px] font-bold rounded-full hover:bg-[#00838f] transition-all shadow-sm cursor-pointer"
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
