import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  className = '',
  hideCloseButton = false,
}: BaseModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(13,80,96,0.15)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Subtle glow effect behind the modal */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-cyan/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-blue/5 blur-[80px] rounded-full pointer-events-none"></div>

        {!hideCloseButton && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors z-20 border border-slate-200"
          >
            <X size={18} />
          </button>
        )}
        
        <div className="relative z-10 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
