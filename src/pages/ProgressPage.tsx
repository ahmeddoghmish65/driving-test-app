import { useStore } from '../store/useStore';

export function ProgressPage() {
  const { completedLessons, lessons, examResults, mistakes, signs, getReadinessScore } = useStore();
  const readiness = getReadinessScore();

  const lessonProgress = Math.round((completedLessons.length / Math.max(lessons.length, 1)) * 100);
  const avgExamScore = examResults.length > 0
    ? Math.round(examResults.reduce((sum, e) => sum + (e.score / e.total) * 100, 0) / examResults.length)
    : 0;
  const passRate = examResults.length > 0
    ? Math.round((examResults.filter(e => e.passed).length / examResults.length) * 100)
    : 0;

  return (
    <div className="px-5 space-y-5 animate-fade-in">
      {/* Readiness Circle - Big Gradient Card */}
      <div className="gradient-primary rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-primary-glow">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/5 rounded-full translate-x-10 translate-y-10" />
        <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white/5 rounded-full" />
        
        <div className="relative">
          <p className="text-xs text-white/40 font-bold mb-4 uppercase tracking-wider">نسبة الاستعداد للامتحان</p>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="white" strokeWidth="10"
                strokeDasharray={`${readiness * 3.14} 314`} strokeLinecap="round" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-extrabold">{readiness}%</span>
            </div>
          </div>
          <p className="text-sm text-white/50 font-medium">
            {readiness < 30 ? '🌱 مبتدئ — تحتاج مزيد من التدريب' :
             readiness < 60 ? '📈 متوسط — في الطريق الصحيح!' :
             readiness < 85 ? '🔥 متقدم — أداء ممتاز!' :
             '🌟 جاهز — يمكنك دخول الامتحان!'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'الدروس', value: `${lessonProgress}%`, sub: `${completedLessons.length}/${lessons.length}`, bg: 'bg-pastel-blue', color: 'text-blue-600', icon: '📚' },
          { label: 'الامتحانات', value: `${examResults.length}`, sub: 'امتحان', bg: 'bg-pastel-purple', color: 'text-primary', icon: '📝' },
          { label: 'المعدل', value: `${avgExamScore}%`, sub: 'متوسط', bg: 'bg-pastel-green', color: 'text-emerald-600', icon: '📊' },
          { label: 'النجاح', value: `${passRate}%`, sub: 'نسبة', bg: 'bg-pastel-orange', color: 'text-amber-600', icon: '🏆' },
        ].map(item => (
          <div key={item.label} className={`${item.bg} rounded-2xl p-5 text-center shadow-card border border-transparent`}>
            <span className="text-xl block mb-1">{item.icon}</span>
            <p className={`text-2xl font-extrabold ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-text-secondary font-bold mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-border-light p-5 shadow-card">
        <h3 className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-wider">📋 التفاصيل</h3>
        <div className="space-y-4">
          {[
            { icon: '📚', label: 'الدروس', value: `${completedLessons.length} / ${lessons.length}`, bg: 'bg-pastel-blue' },
            { icon: '🚦', label: 'الإشارات', value: `${signs.length} إشارة`, bg: 'bg-pastel-orange' },
            { icon: '🔄', label: 'الأخطاء', value: `${mistakes.length} خطأ`, bg: 'bg-pastel-pink' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center text-base`}>{item.icon}</span>
                <span className="text-sm text-text-secondary font-medium">{item.label}</span>
              </div>
              <span className="text-sm font-extrabold text-text">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exam History */}
      {examResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-card">
          <h3 className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-wider">📜 سجل الامتحانات</h3>
          <div className="space-y-2.5">
            {examResults.slice().reverse().map((exam, i) => (
              <div key={exam.id || i} className={`flex items-center justify-between p-4 rounded-2xl border-2 ${
                exam.passed ? 'bg-success-light border-success/10' : 'bg-danger-light border-danger/10'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white ${exam.passed ? 'bg-success' : 'bg-danger'}`}>
                    {exam.passed ? '✓' : '✗'}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-text">{exam.passed ? 'ناجح' : 'راسب'}</p>
                    <p className="text-[10px] text-text-muted font-medium mt-0.5">
                      {new Date(exam.date).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-lg font-extrabold text-text">{exam.score}/{exam.total}</p>
                  <p className="text-[10px] text-text-muted font-bold">{Math.round((exam.score / exam.total) * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Coach */}
      <div className="bg-pastel-purple rounded-2xl p-5 border-2 border-primary-100 shadow-card">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center text-lg shadow-sm">🤖</span>
          <h3 className="font-bold text-primary text-base">نصيحة المدرب الذكي</h3>
        </div>
        <p className="text-sm text-primary-dark leading-7 font-medium">
          {readiness < 30
            ? '🌱 أنت في بداية الطريق! ابدأ بإنهاء الدروس ثم انتقل للتدريب. ركز على المصطلحات الإيطالية.'
            : readiness < 60
            ? '📈 تقدم جيد! ركز على الأسئلة اللي غلطت فيها من قسم "أخطائي". جرب امتحان تجريبي كل يوم.'
            : readiness < 85
            ? '🔥 أداء ممتاز! ركز على المواضيع الصعبة مثل الأولويات والتجاوز. حافظ على التدريب اليومي.'
            : '🌟 مبروك! أنت جاهز للامتحان! راجع أخطاءك الأخيرة وتأكد من فهم المصطلحات. بالتوفيق!'}
        </p>
      </div>
    </div>
  );
}
