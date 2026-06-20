import React, { useState, useRef } from 'react';

import profileApi from '@/api/profileApi';
import { useAuth } from '@/context';
import { Edit3 } from 'lucide-react';
import gsap from 'gsap';

interface AvatarUploadProps {
  initial: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ initial }) => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user?.id) return;

      setUploading(true);
      setError('');

      // 1. Gửi thẳng File xuống API (Backend tự xử lý Supabase)
      const res = await profileApi.updateAvatar(file) as any;
      
      // Giả sử API trả về { avatarUrl: 'https://...' } hoặc { data: { avatarUrl: ... } }
      let newAvatarUrl = res.data?.avatarUrl || res.avatarUrl || URL.createObjectURL(file);

      // Thêm query param ?t=... để tránh lỗi cache của trình duyệt khi URL giống y hệt URL cũ
      if (newAvatarUrl.startsWith('http')) {
        const separator = newAvatarUrl.includes('?') ? '&' : '?';
        newAvatarUrl = `${newAvatarUrl}${separator}t=${Date.now()}`;
      }

      // 2. Báo thành công và cập nhật lại Context
      updateUser({ avatarUrl: newAvatarUrl });
      
    } catch (err: any) {
      console.error('Lỗi khi upload:', err);
      setError(err.message || 'Lỗi khi upload ảnh');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-emerald-500/30 overflow-hidden border border-slate-200">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          initial
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleUploadAvatar}
        disabled={uploading}
      />

      <button
        type="button"
        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.15, rotation: 15, duration: 0.4, ease: "back.out(2)" })}
        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, rotation: 0, duration: 0.4, ease: "power2.out" })}
        onClick={(e) => {
          gsap.fromTo(e.currentTarget, { scale: 0.8 }, { scale: 1.15, duration: 0.5, ease: "elastic.out(1, 0.3)" });
          fileInputRef.current?.click();
        }}
        disabled={uploading}
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-md border border-slate-100 disabled:opacity-50 cursor-pointer"
        aria-label="Edit avatar"
      >
        <Edit3 size={14} />
      </button>

      {error && (
        <div className="absolute top-24 left-0 text-xs text-red-500 font-medium whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm border border-red-100 z-10">
          {error}
        </div>
      )}
    </div>
  );
};
