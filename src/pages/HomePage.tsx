import { useStore } from '../store/useStore';
import type { PageType } from '../App';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { getReadinessScore, getDailyPlan, completedLessons, lessons, examResults, mistakes } = useStore();
  const readiness = getReadinessScore();
  const dailyPlan = getDailyPlan();

  const menuItems: { id: PageType; icon: string; label: string; sublabel: string; gradient: string }[] = [
    { id: 'lessons', icon: '📚', label: 'الدروس', sublabel: `${completedLessons.length}/${lessons.length} مكتمل`, gradient: 'from-[#4A90D9] to-[#67B8F0]' },
    { id: 'signs', icon: '🚦', label: 'الإشارات', sublabel: 'تعلم الإشارات', gradient: 'from-[#FF9F43] to-[#FFD093]' },
    { id: 'quiz', icon: '✍️', label: 'تدريب', sublabel: 'اختبر معلوماتك', gradient: 'from-[#6C5CE7] to-[#A29BFE]' },
    { id: 'exam', icon: '📝', label: 'امتحان تجريبي', sublabel: 'محاكي حقيقي', gradient: 'from-[#FF6B6B] to-[#FF8A8A]' },
    { id: 'progress', icon: '📊', label: 'تقدمي', sublabel: `${examResults.length} امتحان`, gradient: 'from-[#00C48C] to-[#44D9A8]' },
    { id: 'mistakes', icon: '🔄', label: 'أخطائي', sublabel: `${mistakes.length} للمراجعة`, gradient: 'from-[#E17055] to-[#FDCB6E]' },
  ];

  return (
    <div className="px-5 space-y-5">
      {/* Readiness Card - Gradient */}
      <div className="gradient-primary rounded-3xl p-6 text-white relative overflow-hidden animate-fade-in shadow-primary-glow/50">
        {/* Decorative */}
        <div className="absolute top-0 left-0 w-44 h-44 bg-white/5 rounded-full -translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 translate-y-12" />
        <div className="absolute top-6 left-1/3 w-8 h-8 bg-white/5 rounded-full" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/50 text-xs font-bold mb-1">نسبة استعدادك للامتحان</p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-extrabold">{readiness}</p>
                <p className="text-lg font-bold text-white/60">%</p>
              </div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                <circle cx="30" cy="30" r="25" fill="none" stroke="white" strokeWidth="5"
                  strokeDasharray={`${readiness * 1.57} 157`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-extrabold">{readiness < 30 ? '🌱' : readiness < 60 ? '📈' : readiness < 85 ? '🔥' : '🌟'}</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden">
            <div className="bg-white h-3 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${readiness}%` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 rounded-full" />
            </div>
          </div>
          <p className="text-[11px] text-white/40 mt-2.5 font-medium">
            {readiness < 30 ? '🌱 ابدأ التعلم لتحسين مستواك' : readiness < 60 ? '📈 أنت في الطريق الصحيح!' : readiness < 85 ? '🔥 أداء ممتاز، واصل!' : '🌟 جاهز للامتحان!'}
          </p>
        </div>
      </div>

      {/* Daily Plan */}
      <div className="animate-fade-in stagger-1">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-text">📅 خطة اليوم</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-card border border-border-light hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 bg-pastel-blue rounded-xl flex items-center justify-center mx-auto mb-2 text-lg">📚</div>
            <p className="text-2xl font-extrabold text-primary">{dailyPlan.lessonsToday}</p>
            <p className="text-[10px] text-text-secondary font-bold mt-0.5">دروس</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-card border border-border-light hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 bg-pastel-purple rounded-xl flex items-center justify-center mx-auto mb-2 text-lg">❓</div>
            <p className="text-2xl font-extrabold text-primary">{dailyPlan.questionsToday}</p>
            <p className="text-[10px] text-text-secondary font-bold mt-0.5">أسئلة</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-card border border-border-light hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 bg-pastel-orange rounded-xl flex items-center justify-center mx-auto mb-2 text-lg">🚦</div>
            <p className="text-sm font-bold text-text truncate mt-1">{dailyPlan.signToday}</p>
            <p className="text-[10px] text-text-secondary font-bold mt-0.5">إشارة اليوم</p>
          </div>
        </div>
      </div>

      {/* Quick Start CTA */}
      <button 
        onClick={() => onNavigate('quiz')}
        className="w-full gradient-green rounded-2xl p-5 text-white text-right shadow-success-glow/40 active:scale-[0.98] transition-transform animate-fade-in stagger-2"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">✍️ ابدأ التدريب الآن</h3>
            <p className="text-xs text-white/70 mt-1 font-medium">تدرب على أسئلة الامتحان</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
            →
          </div>
        </div>
      </button>

      {/* Menu Grid */}
      <div className="animate-fade-in stagger-3">
        <h3 className="text-base font-bold text-text mb-3 px-1">📖 أقسام التعلم</h3>
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`bg-white rounded-2xl p-4 text-right hover:shadow-card-hover transition-all duration-200 active:scale-[0.97] shadow-card border border-border-light group animate-fade-in stagger-${Math.min(i + 1, 8)}`}
            >
              <div className={`w-11 h-11 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-xl mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-text text-sm">{item.label}</h3>
              <p className="text-[10px] text-text-secondary mt-0.5 font-medium">{item.sublabel}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Community Button */}
      <button
        onClick={() => onNavigate('community')}
        className="w-full bg-white rounded-2xl p-5 text-right shadow-card border border-border-light hover:shadow-card-hover transition-all active:scale-[0.98] animate-fade-in stagger-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-text text-base">💬 المجتمع العربي</h3>
            <p className="text-xs text-text-secondary mt-1 font-medium">تواصل مع متعلمين آخرين وشارك تجربتك</p>
          </div>
          <div className="w-14 h-14 bg-pastel-purple rounded-2xl flex items-center justify-center text-3xl">
            💬
          </div>
        </div>
      </button>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-border-light animate-fade-in stagger-6">
        <h3 className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-wider">📊 الإحصائيات</h3>
        <div className="space-y-3.5">
          {[
            { label: 'الدروس المكتملة', value: `${completedLessons.length} / ${lessons.length}`, icon: '📚', color: 'text-primary' },
            { label: 'الامتحانات التجريبية', value: `${examResults.length}`, icon: '📝', color: 'text-primary' },
            { label: 'الأخطاء المتبقية', value: `${mistakes.length}`, icon: '🔄', color: 'text-accent' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-base">{stat.icon}</span>
                <span className="text-xs text-text-secondary font-medium">{stat.label}</span>
              </div>
              <span className={`text-sm font-extrabold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
          {examResults.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-border-light">
              <span className="text-xs text-text-secondary font-medium">آخر نتيجة</span>
              <span className={`text-sm font-extrabold ${examResults[examResults.length - 1].passed ? 'text-success' : 'text-danger'}`}>
                {examResults[examResults.length - 1].score}/{examResults[examResults.length - 1].total}
                {examResults[examResults.length - 1].passed ? ' ✓' : ' ✗'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-4 pt-2">
        <p className="text-[10px] text-text-muted font-medium">Patente B — v2.0</p>
      </div>
    </div>
  );
}
