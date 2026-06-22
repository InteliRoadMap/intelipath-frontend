import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui';
import { Send, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import studentApi from '@/api/studentApi';

interface RequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestReviewModal: React.FC<RequestReviewModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await studentApi.requestPortfolioReview(email);
      setSubmitSuccess(true);
      setTimeout(() => {
        resetAndClose();
      }, 2500);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to send request. Please check the email and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitSuccess(false);
      setError('');
      setEmail('');
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 border border-slate-200 shadow-2xl rounded-[16px] bg-white overflow-hidden">
        <div className="p-8">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h3>
              <p className="text-slate-500">
                We've notified the mentor. You will receive an email once they provide feedback.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader className="mb-6 text-center">
                <div className="w-12 h-12 bg-[#00838f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-[#00838f]" />
                </div>
                <DialogTitle className="text-[24px] font-bold text-slate-900 tracking-tight text-center">
                  Request Feedback
                </DialogTitle>
                <DialogDescription className="text-center text-slate-500 text-[15px] pt-2">
                  Send your portfolio to a mentor for review by entering their email address below.
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 text-rose-700 items-start">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="text-[13px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Mail size={16} /> Mentor's Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mentor@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] text-slate-900 focus:outline-none focus:border-[#00838f] focus:ring-2 focus:ring-[#00838f]/20 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#0f172a] text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        Send Request <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
