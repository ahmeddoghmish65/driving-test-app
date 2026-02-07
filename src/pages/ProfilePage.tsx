import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { PageType } from '../App';
import { IconEdit, IconRefresh, IconChart, IconFileText, IconBook, IconLogout, IconUser, IconMail, IconCalendar, IconCamera, IconCheck, IconX, IconArrowLeft } from '../components/Icons';

interface ProfilePageProps {
  onNavigate: (page: PageType) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, logout, updateProfile, completedLessons, lessons, examResults, mistakes, getReadinessScore } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const readiness = getReadinessScore();
  const totalExams = examResults.length;
  const passedExams = examResults.filter(e => e.passed).length;
  const avgScore = totalExams > 0 ? Math.round(examResults.reduce((s, e) => s + (e.score / e.total) * 100, 0) / totalExams) : 0;

  const handleSave = () => {
    updateProfile({ name, bio, avatar: avatarUrl || undefined });
    setEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-5 space-y-5 animate-fade-in">
      {/* Profile Card - No cover, just avatar */}
      <div className="bg-white rounded-3xl border border-border-light overflow-hidden shadow-card">
        <div className="p-6 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <button onClick={editing ? () => fileRef.current?.click() : undefined} className="relative group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-24 h-24 rounded-3xl shadow-card object-cover border-4 border-surface" />
              ) : (
                <div className="w-24 h-24 gradient-primary rounded-3xl shadow-card flex items-center justify-center text-3xl font-extrabold text-white border-4 border-surface">
                  {user?.name?.charAt(0) || '؟'}
                </div>
              )}
              {editing && (
                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-4 border-surface cursor-pointer">
                  <IconCamera size={20} className="text-white" />
                </div>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>

          {editing ? (
            <div className="w-full space-y-4">
              <div>
                <label className="text-xs font-bold text-text-secondary mb-1.5 block">الاسم</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-border-light text-sm font-bold bg-surface focus:border-primary focus:outline-none text-center" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary mb-1.5 block">نبذة عنك</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="اكتب نبذة قصيرة عن نفسك..."
                  className="w-full px-4 py-3 rounded-2xl border border-border-light text-sm bg-surface focus:border-primary focus:outline-none resize-none h-20" />
              </div>
              <div className="flex gap-2.5">
                <button onClick={handleSave} className="flex-1 gradient-primary text-white py-3 rounded-2xl font-bold text-sm shadow-primary-glow/40 active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
                  <IconCheck size={16} /> حفظ التعديلات
                </button>
                <button onClick={() => { setEditing(false); setName(user?.name || ''); setBio(user?.bio || ''); setAvatarUrl(user?.avatar || ''); }}
                  className="px-5 py-3 rounded-2xl font-bold text-sm bg-surface text-text-secondary border border-border-light flex items-center justify-center gap-1">
                  <IconX size={14} /> إلغاء
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-extrabold text-text">{user?.name}</h2>
              <p className="text-xs text-text-muted font-medium mt-1" dir="ltr">{user?.email}</p>
              {user?.bio && <p className="text-sm text-text-secondary leading-7 mt-3">{user.bio}</p>}
              <button onClick={() => setEditing(true)}
                className="mt-4 bg-primary-50 text-primary py-3 px-6 rounded-2xl font-bold text-sm border border-primary-100 active:scale-[0.97] transition-transform flex items-center justify-center gap-2 mx-auto">
                <IconEdit size={14} /> تعديل الملف الشخصي
              </button>
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="bg-success-light rounded-2xl px-4 py-3 flex items-center gap-2.5 animate-scale-in border border-success/10">
          <IconCheck size={16} className="text-success" />
          <p className="text-success text-xs font-bold">تم حفظ التعديلات بنجاح!</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-pastel-purple rounded-2xl p-4 text-center shadow-card">
          <p className="text-2xl font-extrabold text-primary">{readiness}%</p>
          <p className="text-[10px] text-text-secondary font-bold mt-1">الاستعداد</p>
        </div>
        <div className="bg-pastel-blue rounded-2xl p-4 text-center shadow-card">
          <p className="text-2xl font-extrabold text-blue-600">{completedLessons.length}/{lessons.length}</p>
          <p className="text-[10px] text-text-secondary font-bold mt-1">الدروس</p>
        </div>
        <div className="bg-pastel-green rounded-2xl p-4 text-center shadow-card">
          <p className="text-2xl font-extrabold text-emerald-600">{passedExams}/{totalExams}</p>
          <p className="text-[10px] text-text-secondary font-bold mt-1">الامتحانات الناجحة</p>
        </div>
        <div className="bg-pastel-orange rounded-2xl p-4 text-center shadow-card">
          <p className="text-2xl font-extrabold text-amber-600">{avgScore}%</p>
          <p className="text-[10px] text-text-secondary font-bold mt-1">المعدل</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-border-light p-5 shadow-card space-y-1">
        <h3 className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
          <IconArrowLeft size={12} /> اختصارات
        </h3>
        {[
          { icon: <IconRefresh size={18} />, label: 'أخطائي', sub: `${mistakes.length} خطأ`, page: 'mistakes' as PageType },
          { icon: <IconChart size={18} />, label: 'تقدمي', sub: 'عرض التقدم', page: 'progress' as PageType },
          { icon: <IconFileText size={18} />, label: 'امتحان تجريبي', sub: 'ابدأ امتحان', page: 'exam' as PageType },
          { icon: <IconBook size={18} />, label: 'القاموس', sub: 'المصطلحات', page: 'glossary' as PageType },
        ].map(item => (
          <button key={item.page} onClick={() => onNavigate(item.page)}
            className="w-full flex items-center gap-3 py-3.5 px-2 rounded-xl hover:bg-surface transition-all text-right group">
            <span className="text-text-muted group-hover:text-primary transition-colors">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-text">{item.label}</p>
              <p className="text-[10px] text-text-muted font-medium">{item.sub}</p>
            </div>
            <span className="text-text-muted group-hover:text-primary transition-colors">←</span>
          </button>
        ))}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-border-light p-5 shadow-card">
        <h3 className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
          <IconUser size={12} /> معلومات الحساب
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-text-secondary font-medium flex items-center gap-2"><IconMail size={14} /> البريد</span>
            <span className="text-xs font-bold text-text" dir="ltr">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border-light">
            <span className="text-xs text-text-secondary font-medium flex items-center gap-2"><IconUser size={14} /> نوع الحساب</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${user?.role === 'admin' ? 'bg-pastel-orange text-amber-700' : 'bg-pastel-blue text-blue-700'}`}>
              {user?.role === 'admin' ? 'مدير' : 'مستخدم'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border-light">
            <span className="text-xs text-text-secondary font-medium flex items-center gap-2"><IconCalendar size={14} /> تاريخ التسجيل</span>
            <span className="text-xs font-bold text-text">{new Date(user?.createdAt || '').toLocaleDateString('ar-EG')}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button onClick={logout}
        className="w-full bg-danger-light text-danger py-4 rounded-2xl font-bold text-sm border-2 border-danger/10 active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
        <IconLogout size={16} /> تسجيل الخروج
      </button>

      <div className="text-center pb-4 pt-2">
        <p className="text-[10px] text-text-muted font-medium">© 2025 Patente B — v2.0</p>
      </div>
    </div>
  );
}
