import { useState, useEffect } from 'react';
import { IconBook, IconShield, IconTarget, IconChat, IconCheck, IconStar, IconArrowLeft } from '../components/Icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: 'احصل على رخصة القيادة الإيطالية',
      subtitle: 'تعلّم بالعربي، انجح بالإيطالي',
      bg: 'from-[#6C5CE7] via-[#7C6CF7] to-[#A29BFE]'
    },
    {
      title: 'دروس مبسطة بالعربي',
      subtitle: 'شرح واضح لكل مصطلح إيطالي مع أمثلة عملية',
      bg: 'from-[#4A90D9] via-[#5A9FE5] to-[#67B8F0]'
    },
    {
      title: 'مدرب ذكاء اصطناعي',
      subtitle: 'يشرح لك كل سؤال ويحلل أخطاءك',
      bg: 'from-[#00B87C] via-[#00C48C] to-[#44D9A8]'
    },
    {
      title: 'امتحانات تجريبية حقيقية',
      subtitle: 'نفس نظام الامتحان الحقيقي في إيطاليا',
      bg: 'from-[#FF5252] via-[#FF6B6B] to-[#FF8A8A]'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Italian flag stripe */}
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-[#009246]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#CE2B37]" />
      </div>

      {/* Hero Section */}
      <div className={`flex-1 bg-gradient-to-br ${slides[currentSlide].bg} relative flex flex-col items-center justify-center px-6 transition-all duration-1000`}>
        {/* Decorative elements */}
        <div className="absolute top-12 right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-24 left-4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="absolute top-1/4 left-8 w-20 h-20 bg-white/5 rounded-full" />
        <div className="absolute bottom-1/3 right-6 w-24 h-24 bg-white/5 rounded-full" />
        
        {/* Floating road sign shapes */}
        <div className="absolute top-16 left-12 w-12 h-12 border-2 border-white/10 rounded-full" />
        <div className="absolute top-28 right-16 w-10 h-10 border-2 border-white/10 rotate-45" />
        <div className="absolute bottom-40 left-8 w-8 h-8 border-2 border-white/10 rounded-sm rotate-45" />

        {/* Logo */}
        <div className="relative z-10 mb-8 animate-scale-in">
          <div className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-lg">
            <span className="text-white text-5xl font-extrabold tracking-tight">P</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-sm">🇮🇹</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center animate-fade-in" key={currentSlide}>
          <h1 className="text-[26px] font-extrabold text-white leading-[1.6] mb-3">
            {slides[currentSlide].title}
          </h1>
          <p className="text-[15px] text-white/70 font-medium leading-relaxed max-w-xs mx-auto">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-10 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white px-6 py-8 space-y-6 relative z-20" style={{ borderTopLeftRadius: '32px', borderTopRightRadius: '32px', marginTop: '-32px' }}>
        {/* Features row */}
        <div className="flex items-center justify-center gap-5 mb-1">
          {[
            { icon: <IconBook size={20} />, label: 'دروس عربية', color: 'text-primary bg-primary-50' },
            { icon: <IconShield size={20} />, label: 'إشارات', color: 'text-blue-600 bg-pastel-blue' },
            { icon: <IconTarget size={20} />, label: 'تدريبات', color: 'text-emerald-600 bg-pastel-green' },
            { icon: <IconChat size={20} />, label: 'مجتمع', color: 'text-pink-600 bg-pastel-pink' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center ${item.color}`} style={{ width: '50px', height: '50px' }}>
                {item.icon}
              </div>
              <span className="text-[10px] text-text-secondary font-bold">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 py-3">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <IconCheck size={14} className="text-success" />
            <span className="font-bold">+1000 ناجح</span>
          </div>
          <div className="w-1 h-4 bg-border-light rounded-full" />
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <IconStar size={14} className="text-warning" />
            <span className="font-bold">4.9 تقييم</span>
          </div>
          <div className="w-1 h-4 bg-border-light rounded-full" />
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <IconShield size={14} className="text-primary" />
            <span className="font-bold">محدّث 2025</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="w-full gradient-primary text-white py-4.5 rounded-2xl font-bold text-[15px] shadow-primary-glow active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
          style={{ paddingTop: '18px', paddingBottom: '18px' }}
        >
          <span>ابدأ الآن مجاناً</span>
          <IconArrowLeft size={18} />
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-text-secondary">
          لديك حساب؟{' '}
          <button onClick={onGetStarted} className="text-primary font-bold hover:underline">
            تسجيل الدخول
          </button>
        </p>
      </div>
    </div>
  );
}
