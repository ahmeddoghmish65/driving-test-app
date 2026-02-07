import { useState } from 'react';
import { useStore } from '../store/useStore';

interface AuthPageProps {
  onBack?: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('يرجى ملء جميع الحقول'); return; }
    const ok = login(email, password);
    if (!ok) setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('يرجى ملء جميع الحقول'); return; }
    if (password.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    const ok = register(name, email, password);
    if (!ok) setError('هذا البريد مسجل بالفعل');
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
    setTimeout(() => { setSuccess(''); setMode('login'); }, 3000);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Back button */}
      {onBack && (
        <div className="px-5 pt-5">
          <button onClick={onBack} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-lg shadow-card border border-border-light active:scale-95 transition-all">
            →
          </button>
        </div>
      )}
      
      {/* Top Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Logo */}
        <div className="animate-fade-in mb-10">
          <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-primary-glow relative">
            <span className="text-white text-4xl font-extrabold">P</span>
            <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-card border border-border-light">
              <span className="text-sm">🇮🇹</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-text text-center">Patente B</h1>
          <p className="text-text-secondary text-sm text-center mt-2 font-medium">رخصة القيادة الإيطالية للعرب</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-1.5 rounded-full bg-italian"></div>
            <div className="w-8 h-1.5 rounded-full bg-italian-white border border-border"></div>
            <div className="w-8 h-1.5 rounded-full bg-italian-red"></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-sm animate-fade-in stagger-2">
          <div className="bg-white rounded-3xl shadow-card p-6 border border-border-light">
            {mode === 'login' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-text">تسجيل الدخول</h2>
                  <p className="text-sm text-text-secondary mt-1 font-medium">أهلاً بعودتك! 👋</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text block mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-border bg-surface focus:border-primary focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                        placeholder="example@email.com" dir="ltr" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">📧</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text block mb-2">كلمة المرور</label>
                    <div className="relative">
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-border bg-surface focus:border-primary focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                        placeholder="••••••" dir="ltr" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔒</span>
                    </div>
                  </div>
                  {error && (
                    <div className="bg-danger-light rounded-2xl px-4 py-3 flex items-center gap-2.5 animate-scale-in">
                      <span className="text-base">⚠️</span>
                      <p className="text-danger text-xs font-bold">{error}</p>
                    </div>
                  )}
                  <button type="submit" className="w-full gradient-primary text-white py-4 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform shadow-primary-glow">
                    تسجيل الدخول
                  </button>
                </form>
                <div className="flex items-center justify-between mt-5">
                  <button onClick={() => { setMode('forgot'); setError(''); }} className="text-xs text-text-secondary hover:text-primary transition-colors font-bold">
                    نسيت كلمة المرور؟
                  </button>
                  <button onClick={() => { setMode('register'); setError(''); }} className="text-xs text-primary font-bold hover:text-primary-dark transition-colors">
                    حساب جديد ←
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-text">حساب جديد</h2>
                  <p className="text-sm text-text-secondary mt-1 font-medium">ابدأ رحلتك نحو الباتينتي 🎯</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text block mb-2">الاسم</label>
                    <div className="relative">
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-border bg-surface focus:border-primary focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                        placeholder="اسمك الكامل" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">👤</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text block mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-border bg-surface focus:border-primary focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                        placeholder="example@email.com" dir="ltr" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">📧</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text block mb-2">كلمة المرور</label>
                    <div className="relative">
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-border bg-surface focus:border-primary focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                        placeholder="6 أحرف على الأقل" dir="ltr" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔒</span>
                    </div>
                  </div>
                  {error && (
                    <div className="bg-danger-light rounded-2xl px-4 py-3 flex items-center gap-2.5 animate-scale-in">
                      <span className="text-base">⚠️</span>
                      <p className="text-danger text-xs font-bold">{error}</p>
                    </div>
                  )}
                  <button type="submit" className="w-full gradient-primary text-white py-4 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform shadow-primary-glow">
                    إنشاء الحساب
                  </button>
                </form>
                <button onClick={() => { setMode('login'); setError(''); }} className="w-full text-xs text-text-secondary font-bold hover:text-primary text-center mt-5 transition-colors">
                  لدي حساب بالفعل ←
                </button>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-text">استعادة كلمة المرور</h2>
                  <p className="text-sm text-text-secondary mt-1 font-medium">أدخل بريدك وسنرسل لك رابط الاستعادة</p>
                </div>
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-text block mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 pr-11 rounded-2xl border border-border bg-surface focus:border-primary focus:bg-white focus:outline-none focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                        placeholder="example@email.com" dir="ltr" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">📧</span>
                    </div>
                  </div>
                  {success && (
                    <div className="bg-success-light rounded-2xl px-4 py-3 flex items-center gap-2.5 animate-scale-in">
                      <span className="text-base">✅</span>
                      <p className="text-success text-xs font-bold">{success}</p>
                    </div>
                  )}
                  <button type="submit" className="w-full gradient-primary text-white py-4 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform shadow-primary-glow">
                    إرسال رابط الاستعادة
                  </button>
                </form>
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="w-full text-xs text-text-secondary font-bold hover:text-primary text-center mt-5 transition-colors">
                  العودة لتسجيل الدخول ←
                </button>
              </>
            )}
          </div>

          {/* Quick Login - outside card */}
          {mode === 'login' && (
            <div className="mt-6 animate-fade-in stagger-3">
              <p className="text-[11px] text-text-muted text-center mb-3 font-medium">⚡ تسجيل دخول سريع</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setEmail('admin@patente.com'); setPassword('admin123'); }}
                  className="bg-white border border-border-light py-3.5 rounded-2xl hover:shadow-card transition-all text-xs font-bold text-text-secondary active:scale-[0.97] shadow-card">
                  🔑 حساب المدير
                </button>
                <button onClick={() => { 
                  register('مستخدم تجريبي', `user${Date.now()}@test.com`, 'test123');
                }}
                  className="bg-primary-50 border border-primary-100 py-3.5 rounded-2xl hover:shadow-card transition-all text-xs font-bold text-primary active:scale-[0.97]">
                  👤 حساب تجريبي
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pb-6 text-center">
        <p className="text-text-muted text-[10px] font-medium">© 2025 Patente B — جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}
