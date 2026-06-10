import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, ArrowLeft, Mail, MapPin, GraduationCap, Briefcase, ExternalLink, Send, Users } from 'lucide-react';
import { DashboardUserActions, Logo, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui';
import { useAuth } from '@/context';
import { useNavigate, useParams } from 'react-router-dom';
import mentorApi from '@/api/mentorApi';
import { ROUTES } from '@/shared';

export function MentorPortfolioView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Feedback State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('TECHNICAL');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    setIsSubmitting(true);
    try {
      await mentorApi.submitFeedback(studentId!, { type: feedbackType, content: feedbackContent });
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsDialogOpen(false);
        setSubmitSuccess(false);
        setFeedbackContent('');
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      mentorApi.getStudentPortfolio(studentId).then(res => {
        setPortfolio(res);
        setIsLoading(false);
      });
    }
  }, [studentId]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      {/* TOP NAVIGATION */}
      <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6 md:gap-12">
          <Logo hideIcon={true} className="scale-90 origin-left" />
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500">
            <a onClick={() => navigate(ROUTES.DASHBOARD_MENTOR)} className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors cursor-pointer text-slate-500">
              <LayoutDashboard size={16} />
              Dashboard
            </a>
            <a onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_FEEDBACK)} className="flex items-center gap-2 hover:text-slate-800 py-4 -mb-3.5 transition-colors cursor-pointer text-[#00838f] border-b-[3px] border-[#00838f]">
              <MessageSquare size={16} />
              Feedback
            </a>
          </div>
        </div>

        <div className="relative">
          <DashboardUserActions user={user} onLogout={handleLogout} onSettings={() => navigate(ROUTES.DASHBOARD_MENTOR_SETTINGS)} />
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-[1000px] mx-auto px-4 md:px-8 py-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD_MENTOR_FEEDBACK)}
          className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-[#00838f] transition-colors mb-6 cursor-pointer w-fit"
        >
          <ArrowLeft size={16} />
          Back to Directory
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin w-10 h-10 border-4 border-[#00838f] border-t-transparent rounded-full mb-4"></div>
             <p className="text-slate-500 font-medium">Loading portfolio...</p>
          </div>
        ) : !portfolio ? (
          <div className="text-center py-20 text-slate-500">Student portfolio not found.</div>
        ) : (
          <div className="space-y-8">
            {/* Header Profile Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-[#e0f2fe] to-transparent rounded-bl-full -z-0 opacity-50" />
              
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-[#00838f] to-[#00b4d8] text-white font-bold text-[32px] sm:text-[48px] flex items-center justify-center shrink-0 shadow-md z-10 relative border-4 border-white">
                {portfolio.fullName.charAt(0)}
              </div>
              
              <div className="flex-1 z-10">
                <div className="inline-block px-3 py-1 bg-[#e0f2fe] text-[#0284c7] text-[11px] font-black uppercase tracking-wider rounded-md mb-3">
                  {portfolio.career}
                </div>
                <h1 className="text-[32px] font-bold text-slate-900 leading-tight mb-2">{portfolio.fullName}</h1>
                <p className="text-[15px] text-slate-600 mb-4 max-w-2xl leading-relaxed">{portfolio.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-[13px] font-medium text-slate-500">
                  <div className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400" /> {portfolio.email}</div>
                  <div className="flex items-center gap-1.5"><GraduationCap size={16} className="text-slate-400" /> {portfolio.university}{portfolio.major ? ` • ${portfolio.major}` : ''}</div>
                  <div className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> Vietnam</div>
                  {portfolio.github_profile && (
                    <div className="flex items-center gap-1.5">
                      <ExternalLink size={16} className="text-slate-400" /> 
                      <a href={portfolio.github_profile} target="_blank" rel="noreferrer" className="hover:text-[#00838f]">{portfolio.github_profile.replace('https://github.com/', '')}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="z-10 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => navigate(ROUTES.DASHBOARD_STUDENT_PORTFOLIO)} 
                  className="w-full md:w-auto px-6 py-3 bg-white text-[#00838f] border-2 border-[#00838f] font-bold text-[14px] rounded-xl shadow-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                  Live E-Portfolio
                </button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full md:w-auto px-6 py-3 bg-[#00838f] text-white font-bold text-[14px] border-2 border-[#00838f] rounded-xl shadow-md hover:bg-[#006064] hover:border-[#006064] transition-colors flex items-center justify-center gap-2 group cursor-pointer">
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Provide Feedback
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Provide Feedback</DialogTitle>
                      <DialogDescription>
                        Share your professional review and suggestions with {portfolio.fullName}.
                      </DialogDescription>
                    </DialogHeader>
                    {submitSuccess ? (
                      <div className="py-6 text-center text-green-600 font-semibold flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        Feedback sent successfully!
                      </div>
                    ) : (
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-slate-700">Feedback Type</label>
                          <select 
                            value={feedbackType}
                            onChange={(e) => setFeedbackType(e.target.value)}
                            className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:border-[#00838f] focus:ring-1 focus:ring-[#00838f] outline-none"
                          >
                            <option value="GENERAL">General Feedback</option>
                            <option value="TECHNICAL">Technical Skills Review</option>
                            <option value="SOFT_SKILL">Soft Skills & Communication</option>
                            <option value="CAREER_ADVICE">Career Advice</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-slate-700">Review Comments</label>
                          <textarea 
                            rows={5}
                            value={feedbackContent}
                            onChange={(e) => setFeedbackContent(e.target.value)}
                            placeholder="What did they do well? What can they improve?"
                            className="w-full rounded-md border border-slate-200 p-3 text-sm focus:border-[#00838f] focus:ring-1 focus:ring-[#00838f] outline-none resize-none"
                          />
                        </div>
                      </div>
                    )}
                    {!submitSuccess && (
                      <DialogFooter>
                        <button 
                          onClick={() => setIsDialogOpen(false)}
                          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSubmitFeedback}
                          disabled={!feedbackContent.trim() || isSubmitting}
                          className="px-4 py-2 text-sm font-bold text-white bg-[#00838f] hover:bg-[#006064] rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                          {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                        </button>
                      </DialogFooter>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column */}
              <div className="md:col-span-2 space-y-8">
                
                {/* Projects */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-[18px] font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Briefcase className="text-[#00838f]" /> Featured Projects
                  </h3>
                  <div className="space-y-6">
                    {portfolio.projects && portfolio.projects.map((project: any, idx: number) => (
                      <div key={idx} className="group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-[#00838f] transition-colors">{project.repo_url ? project.repo_url.split('/').pop() : 'Project'}</h4>
                          {project.repo_url && (
                            <a href={project.repo_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#00838f] p-1">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                        <p className="text-[14px] text-slate-600 leading-relaxed mb-3">{project.description}</p>
                        
                        {project.tech_stack && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {Array.isArray(project.tech_stack) ? project.tech_stack.map((tech: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                {tech}
                              </span>
                            )) : null}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-slate-400 text-[12px] font-bold">
                          <span>⭐ {project.stars || 0}</span>
                        </div>
                        {idx !== portfolio.projects.length - 1 && <hr className="mt-6 border-slate-100" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Skills */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-slate-900 mb-4">Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 bg-[#f0f9ff] text-[#0284c7] text-[12px] font-bold rounded-lg border border-[#bae6fd]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mentor Quick Notes */}
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-amber-900 mb-2">Mentor Notes</h3>
                  <p className="text-[13px] text-amber-700 leading-relaxed mb-4">
                    Private notes visible only to you. Use this to keep track of this student's progress over time.
                  </p>
                  <textarea 
                    className="w-full bg-white border border-amber-200 rounded-xl p-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[120px] resize-none"
                    placeholder="E.g. Needs to improve on state management in React..."
                  ></textarea>
                  <button className="mt-3 w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[13px] font-bold rounded-lg transition-colors">
                    Save Notes
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
