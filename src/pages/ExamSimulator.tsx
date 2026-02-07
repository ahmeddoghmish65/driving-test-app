import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';

export function ExamSimulator() {
  const { questions, user, addExamResult, addMistake } = useStore();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [examQuestions, setExamQuestions] = useState(questions);

  const startExam = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 20);
    setExamQuestions(shuffled);
    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(30 * 60);
  };

  const finishExam = useCallback(() => {
    setFinished(true);
    setStarted(false);
    const results = examQuestions.map(q => ({
      questionId: q.id,
      userAnswer: answers[q.id] ?? false,
      correct: answers[q.id] === q.answer
    }));
    const correctCount = results.filter(r => r.correct).length;
    results.filter(r => !r.correct).forEach(r => addMistake(r.questionId));
    addExamResult({
      userId: user?.id || '',
      date: new Date().toISOString(),
      score: correctCount,
      total: examQuestions.length,
      passed: correctCount >= examQuestions.length * 0.8,
      answers: results,
      timeSpent: 30 * 60 - timeLeft
    });
  }, [examQuestions, answers, user, addExamResult, addMistake, timeLeft]);

  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { finishExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished, finishExam]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // Results
  if (finished) {
    const results = examQuestions.map(q => ({
      question: q,
      userAnswer: answers[q.id],
      correct: answers[q.id] === q.answer
    }));
    const correctCount = results.filter(r => r.correct).length;
    const passed = correctCount >= examQuestions.length * 0.8;
    const percentage = Math.round((correctCount / examQuestions.length) * 100);

    return (
      <div className="px-5 space-y-4 animate-fade-in">
        {/* Result Card */}
        <div className={`rounded-3xl p-8 text-center text-white relative overflow-hidden ${passed ? 'gradient-green shadow-success-glow' : 'gradient-pink shadow-danger-glow'}`}>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 translate-y-8" />
          <div className="relative">
            <span className="text-6xl block mb-4">{passed ? '🎉' : '😔'}</span>
            <h2 className="text-2xl font-extrabold">{passed ? 'مبروك! نجحت' : 'لم تنجح هذه المرة'}</h2>
            <p className="text-5xl font-extrabold mt-3">{percentage}%</p>
            <p className="text-sm text-white/60 mt-2 font-medium">{correctCount} صحيح من {examQuestions.length}</p>
            <p className="text-xs text-white/40 mt-1 font-medium">⏱ {formatTime(30 * 60 - timeLeft)}</p>
          </div>
        </div>

        {/* Analysis */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-success-light rounded-2xl p-4 text-center border border-success/10 shadow-card">
            <p className="text-2xl font-extrabold text-success">{correctCount}</p>
            <p className="text-[10px] text-success font-bold mt-1">صحيح ✓</p>
          </div>
          <div className="bg-danger-light rounded-2xl p-4 text-center border border-danger/10 shadow-card">
            <p className="text-2xl font-extrabold text-danger">{examQuestions.length - correctCount}</p>
            <p className="text-[10px] text-danger font-bold mt-1">خطأ ✗</p>
          </div>
          <div className={`rounded-2xl p-4 text-center border shadow-card ${passed ? 'bg-success-light border-success/10' : 'bg-danger-light border-danger/10'}`}>
            <p className="text-2xl font-extrabold">{passed ? '✓' : '✗'}</p>
            <p className="text-[10px] font-bold text-text-secondary mt-1">{passed ? 'ناجح' : 'راسب'}</p>
          </div>
        </div>

        {/* Review */}
        <div className="bg-white rounded-2xl border border-border-light p-5 shadow-card">
          <h3 className="font-bold text-text text-sm mb-4">📋 مراجعة الأسئلة</h3>
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className={`p-3.5 rounded-2xl text-xs border-2 ${r.correct ? 'bg-success-light border-success/10' : 'bg-danger-light border-danger/10'}`}>
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white ${r.correct ? 'bg-success' : 'bg-danger'}`}>
                    {r.correct ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text leading-6" dir="ltr">{r.question.textIt}</p>
                    <p className="text-text-secondary mt-1 leading-6 font-medium">{r.question.textAr}</p>
                    <p className="mt-2 font-bold text-text-secondary">
                      الصحيح: {r.question.answer ? 'صح' : 'غلط'}
                      {r.userAnswer !== undefined && ` | إجابتك: ${r.userAnswer ? 'صح' : 'غلط'}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={startExam} className="w-full gradient-primary text-white py-4 rounded-2xl font-bold text-sm shadow-primary-glow active:scale-[0.97] transition-transform">
          🔄 إعادة الامتحان
        </button>
      </div>
    );
  }

  // Exam in Progress
  if (started) {
    const q = examQuestions[currentIndex];
    if (!q) return null;

    return (
      <div className="px-5 space-y-4 animate-fade-in">
        {/* Timer & Progress */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-card ${
            timeLeft < 300 ? 'bg-danger-light text-danger animate-pulse border-2 border-danger/20' : 'bg-white text-text-secondary border border-border-light'
          }`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <span className="text-[11px] bg-white text-text-secondary px-4 py-2.5 rounded-2xl font-bold shadow-card border border-border-light">
            {currentIndex + 1}/{examQuestions.length}
          </span>
        </div>

        {/* Progress */}
        <div className="bg-surface rounded-full h-2 overflow-hidden">
          <div className="gradient-primary h-2 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / examQuestions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl border border-border-light p-5 space-y-4 shadow-card">
          {q.imageUrl && (
            <img src={q.imageUrl} alt="صورة السؤال" className="w-full h-40 object-cover rounded-2xl border border-border-light" />
          )}
          <div className="bg-surface rounded-2xl p-4 border border-border-light">
            <p className="text-[13px] font-bold text-text leading-8" dir="ltr">{q.textIt}</p>
          </div>
          <div className="bg-pastel-blue rounded-2xl p-4 border border-blue-100">
            <p className="text-[13px] text-blue-800 leading-8 font-medium">{q.textAr}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setAnswers(a => ({ ...a, [q.id]: true }))}
              className={`py-4 rounded-2xl font-bold text-sm transition-all ${
                answers[q.id] === true ? 'gradient-primary text-white shadow-primary-glow/50' : 'bg-pastel-green text-success border-2 border-success/20 hover:shadow-card active:scale-95'
              }`}>
              صح ✓
            </button>
            <button onClick={() => setAnswers(a => ({ ...a, [q.id]: false }))}
              className={`py-4 rounded-2xl font-bold text-sm transition-all ${
                answers[q.id] === false ? 'gradient-primary text-white shadow-primary-glow/50' : 'bg-pastel-pink text-danger border-2 border-danger/20 hover:shadow-card active:scale-95'
              }`}>
              غلط ✗
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="bg-white py-3.5 rounded-2xl font-bold text-sm text-text-secondary disabled:opacity-30 border border-border-light shadow-card">
            → السابق
          </button>
          {currentIndex < examQuestions.length - 1 ? (
            <button onClick={() => setCurrentIndex(i => i + 1)}
              className="gradient-primary text-white py-3.5 rounded-2xl font-bold text-sm shadow-primary-glow active:scale-[0.97]">
              التالي ←
            </button>
          ) : (
            <button onClick={finishExam}
              disabled={Object.keys(answers).length < examQuestions.length}
              className="gradient-orange text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-40 shadow-sm active:scale-[0.97]">
              🏁 إنهاء الامتحان
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-2xl border border-border-light p-4 shadow-card">
          <p className="text-[10px] text-text-muted mb-3 font-bold">📋 تنقل سريع بين الأسئلة</p>
          <div className="flex flex-wrap gap-2">
            {examQuestions.map((eq, i) => (
              <button key={eq.id} onClick={() => setCurrentIndex(i)}
                className={`w-9 h-9 rounded-xl text-[10px] font-extrabold transition-all ${
                  i === currentIndex ? 'gradient-primary text-white shadow-sm scale-110' :
                  answers[eq.id] !== undefined ? 'bg-primary-50 text-primary border border-primary-100' :
                  'bg-surface text-text-muted border border-border-light'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Start Screen
  return (
    <div className="px-5 space-y-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-border-light p-8 text-center shadow-card">
        <div className="w-20 h-20 gradient-pink rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-danger-glow/30 animate-float">
          📝
        </div>
        <h2 className="text-2xl font-extrabold text-text">محاكي الامتحان</h2>
        <p className="text-sm text-text-secondary mt-2 font-medium">نفس نظام الامتحان الحقيقي في إيطاليا 🇮🇹</p>
      </div>

      <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4 shadow-card">
        <h3 className="font-bold text-text text-base">📋 قواعد الامتحان</h3>
        <div className="space-y-3">
          {[
            { icon: '📊', text: '20 سؤال عشوائي', bg: 'bg-pastel-purple' },
            { icon: '⏱', text: '30 دقيقة كحد أقصى', bg: 'bg-pastel-blue' },
            { icon: '✅', text: 'أسئلة صح وغلط (Vero/Falso)', bg: 'bg-pastel-green' },
            { icon: '🎯', text: 'النجاح: 80% أو أكثر (16 من 20)', bg: 'bg-pastel-orange' },
            { icon: '🔄', text: 'يمكنك تعديل إجاباتك قبل الإنهاء', bg: 'bg-pastel-pink' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center text-base flex-shrink-0`}>{item.icon}</span>
              <span className="text-sm text-text-secondary font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        <button onClick={startExam}
          className="w-full gradient-primary text-white py-4 rounded-2xl font-bold text-base mt-3 active:scale-[0.97] transition-transform shadow-primary-glow">
          🚀 ابدأ الامتحان الآن
        </button>
      </div>

      <div className="bg-pastel-orange border border-orange-100 rounded-2xl p-4">
        <p className="text-[12px] text-orange-700 font-bold">💡 نصيحة: تدرب على الأسئلة أولاً من قسم التدريب قبل بدء الامتحان.</p>
      </div>
    </div>
  );
}
