import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared';
import StudentHeader from './StudentHeader';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components';
import { ChatTeardropText, PaperPlaneRight, CheckCircle } from '@phosphor-icons/react';
import studentApi from '@/api/studentApi';

export function StudentFeedbackPageView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replySuccess, setReplySuccess] = useState<string | null>(null);

  useEffect(() => {
    studentApi.getFeedback()
      .then(res => setFeedbackList(res))
      .catch(() => setFeedbackList([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const handleSendReply = async (feedbackId: string) => {
    if (!replyContent.trim()) return;
    setIsReplying(true);
    try {
      await studentApi.replyFeedback(feedbackId, replyContent);
      setReplySuccess(feedbackId);
      setReplyContent('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <StudentHeader 
        user={user} 
        onLogout={handleLogout} 
        onOpenAiMentor={() => {}} 
      />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 pt-[120px] md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mentor Feedback</h1>
          <p className="mt-2 text-slate-500">Read and reply to professional reviews of your portfolio.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <div className="col-span-full py-20 text-center text-slate-500 animate-pulse">
              Loading feedback...
            </div>
          )}
          
          {!isLoading && feedbackList.length === 0 && (
            <div className="col-span-full grid min-h-[400px] place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-5 text-center">
              <div>
                <ChatTeardropText className="mx-auto text-slate-300" size={48} weight="duotone" />
                <p className="mt-4 text-lg font-bold text-slate-700">No feedback yet</p>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                  When a mentor reviews your portfolio, their feedback will appear here.
                </p>
              </div>
            </div>
          )}

          {!isLoading && feedbackList.map(item => (
            <Card key={item.id} className="overflow-hidden shadow-sm border-slate-200 rounded-2xl flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.mentorName}</h3>
                    <p className="text-xs font-medium text-slate-500">{item.mentorRole}</p>
                  </div>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    {item.type}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  Received on {new Date(item.submittedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="p-5 bg-slate-50 flex-1">
                <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                  {item.content}
                </div>
              </div>
              <div className="p-4 bg-white border-t border-slate-100 mt-auto">
                {replySuccess === item.id ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold py-2">
                    <CheckCircle size={20} weight="fill" />
                    Reply sent!
                  </div>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                        <ChatTeardropText size={18} />
                        Reply to Mentor
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl">
                      <DialogHeader className="mb-4">
                        <DialogTitle>Reply to {item.mentorName}</DialogTitle>
                        <DialogDescription>
                          Send a follow-up question or a thank you note regarding their feedback.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <textarea 
                          rows={5}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="E.g., Thank you so much for the review! I will definitely look into Zustand."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none text-slate-900"
                        />
                        <button 
                          onClick={() => handleSendReply(item.id)}
                          disabled={!replyContent.trim() || isReplying}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isReplying ? (
                            <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                          ) : (
                            <><PaperPlaneRight size={18} weight="fill" /> Send Reply</>
                          )}
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
