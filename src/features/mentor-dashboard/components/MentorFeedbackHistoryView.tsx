import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Layout, 
  ChatTeardropText,
  Users
} from '@phosphor-icons/react';
import { NavLink, useNavigate } from 'react-router-dom';
import mentorApi from '@/api/mentorApi';
import { ROUTES } from '@/shared';
import { useAuth } from '@/context';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardUserActions,
  Logo,
  Skeleton
} from "@/components";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle as UIDialogTitle, 
  DialogDescription 
} from "@/components/ui";

export function MentorFeedbackHistoryView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    mentorApi.getFeedbackHistory()
      .then(res => setFeedbackList(Array.isArray(res) ? res : []))
      .catch(() => setFeedbackList([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".gsap-fade-section", {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 pb-14 font-sans text-slate-950 xl:h-screen xl:overflow-hidden xl:pb-0">
      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-40 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-[1680px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Logo hideIcon className="origin-left scale-90" />
            <nav className="hidden items-center gap-8 lg:flex">
              <NavLink
                end
                to={ROUTES.DASHBOARD_MENTOR}
                className={({ isActive }) =>
                  `relative flex h-[72px] items-center gap-2 border-b-[3px] px-0 text-sm font-semibold transition-colors ${
                    isActive ? "border-cyan-700 text-cyan-800" : "border-transparent text-slate-500 hover:text-slate-950"
                  }`
                }
              >
                <Layout size={17} weight="duotone" />
                Dashboard
              </NavLink>
              <NavLink
                to={ROUTES.DASHBOARD_MENTOR_STUDENTS}
                className={({ isActive }) =>
                  `relative flex h-[72px] items-center gap-2 border-b-[3px] px-0 text-sm font-semibold transition-colors ${
                    isActive ? "border-cyan-700 text-cyan-800" : "border-transparent text-slate-500 hover:text-slate-950"
                  }`
                }
              >
                <Users size={17} weight="duotone" />
                Students
              </NavLink>
              <NavLink
                to={ROUTES.DASHBOARD_MENTOR_FEEDBACK}
                className={({ isActive }) =>
                  `relative flex h-[72px] items-center gap-2 border-b-[3px] px-0 text-sm font-semibold transition-colors ${
                    isActive ? "border-cyan-700 text-cyan-800" : "border-transparent text-slate-500 hover:text-slate-950"
                  }`
                }
              >
                <ChatTeardropText size={17} weight="duotone" />
                Feedback
              </NavLink>
            </nav>
          </div>
          <DashboardUserActions user={user} onLogout={handleLogout} onSettings={() => navigate(ROUTES.DASHBOARD_MENTOR_SETTINGS)} />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto w-full max-w-[1440px] px-4 py-5 md:px-8 xl:flex xl:h-[calc(100vh-72px)] xl:min-h-0 xl:flex-col xl:overflow-hidden">
        
        <Card className="mt-4 overflow-hidden xl:flex xl:min-h-0 xl:flex-1 xl:flex-col shadow-xs border-slate-200 rounded-2xl gsap-fade-section">
          <CardHeader className="gap-4 border-b border-slate-200 bg-white p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Feedback History</CardTitle>
              <CardDescription>
                {activeTab === 'sent' 
                  ? 'A record of all the professional feedback you have provided to students.'
                  : 'Feedback and ratings you have received from students.'}
              </CardDescription>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl self-start xl:self-auto shrink-0">
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'sent' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sent to Students
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'received' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Received
              </button>
            </div>
          </CardHeader>

          <div className="relative xl:min-h-0 xl:flex-1 bg-white">
            <div className="max-h-[calc(100vh-230px)] min-h-[280px] overflow-auto xl:h-full xl:max-h-none xl:min-h-0">
              <table className="w-full min-w-[860px] table-fixed text-left">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-5 py-3">{activeTab === 'sent' ? 'Student' : 'From Student'}</th>
                    <th className="px-5 py-3">Career</th>
                    <th className="px-5 py-3">{activeTab === 'sent' ? 'Submitted At' : 'Received At'}</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading && Array.from({ length: 3 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-5 py-4"><Skeleton className="h-9 w-48" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-5 w-32" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-5 py-4"><Skeleton className="ml-auto h-8 w-24" /></td>
                    </tr>
                  ))}
                  
                  {activeTab === 'sent' && !isLoading && feedbackList.map((item) => (
                    <tr key={item.id} className="h-[72px] transition-colors hover:bg-slate-50/80">
                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">
                            {item.studentName.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-950">{item.studentName}</p>
                            <p className="text-xs text-slate-400">{item.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle">
                        <Badge variant="info">{item.career}</Badge>
                      </td>
                      <td className="px-5 py-4 align-middle text-sm text-slate-600 font-medium">
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 align-middle">
                        {item.status === 'read' ? (
                          <Badge variant="default" className="text-emerald-700 bg-emerald-50 border-emerald-200">Read</Badge>
                        ) : (
                          <Badge variant="default" className="text-amber-700 bg-amber-50 border-amber-200">Unread</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost"
                                className="h-8 text-xs font-semibold text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50"
                              >
                                <Eye size={14} weight="bold" className="mr-1.5" /> View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <UIDialogTitle>Feedback Details</UIDialogTitle>
                                <DialogDescription>
                                  Feedback for {item.studentName} ({item.career})
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-2 space-y-4 text-sm text-slate-700">
                                <div className="flex items-center">
                                  <span className="font-bold text-slate-900 w-20">Type:</span> 
                                  <Badge variant="outline">{item.type || 'General'}</Badge>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-bold text-slate-900 w-20">Date:</span> 
                                  <span>{new Date(item.submittedAt).toLocaleString()}</span>
                                </div>
                                <div className="pt-2">
                                  <span className="font-bold text-slate-900 block mb-2">Message Content:</span>
                                  <p className="p-4 bg-slate-50/80 rounded-xl whitespace-pre-wrap border border-slate-100 leading-relaxed text-slate-700">
                                    {item.content || "No content provided."}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {activeTab === 'sent' && !isLoading && feedbackList.length === 0 && (
                <div className="grid min-h-[300px] place-items-center px-5 text-center">
                  <div>
                    <ChatTeardropText className="mx-auto text-slate-300" size={36} weight="duotone" />
                    <p className="mt-3 text-[15px] font-bold text-slate-700">No feedback submitted yet</p>
                    <p className="mt-1 text-sm text-slate-500">Go to the Students directory to review portfolios.</p>
                  </div>
                </div>
              )}

              {activeTab === 'received' && !isLoading && (
                <div className="grid min-h-[300px] place-items-center px-5 text-center">
                  <div>
                    <ChatTeardropText className="mx-auto text-slate-300" size={36} weight="duotone" />
                    <p className="mt-3 text-[15px] font-bold text-slate-700">No feedback received yet</p>
                    <p className="mt-1 text-sm text-slate-500">You haven't received any feedback from students yet.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

      </main>
    </div>
  );
}
