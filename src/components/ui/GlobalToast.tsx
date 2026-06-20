import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalToast = () => {
  const [toasts, setToasts] = useState<{ id: number, message: string, type: 'success' | 'error' | 'info' }[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...customEvent.detail }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    window.addEventListener('global-toast', handleToast);
    return () => window.removeEventListener('global-toast', handleToast);
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-black/5 pointer-events-auto bg-white/95 backdrop-blur-xl w-full mx-auto`}
          >
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
              toast.type === 'error' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 
              toast.type === 'success' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 
              'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
            }`} />
            <span className="text-[14.5px] font-semibold text-slate-800 leading-snug">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
