import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';

type QuizMode = 'menu' | 'trueFalse' | 'signs' | 'words' | 'understand';

export function QuizPage() {
  const { questions, signs, glossary, addMistake, aiExplanation, explainQuestion, clearExplanation } = useStore();
  const [mode, setMode] = useState<QuizMode>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState(questions);
  const [wordIndex, setWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [signQuizAnswer, setSignQuizAnswer] = useState<string | null>(null);

  const shuffle = useCallback(<T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5), []);

  const startQuiz = (m: QuizMode) => {
    setMode(m);
    setCurrentIndex(0);
    setAnswered(null);
    setUserAnswer(null);
    setScore(0);
    setTotal(0);
    setWordIndex(0);
    setShowMeaning(false);
    setSignQuizAnswer(null);
    clearExplanation();
    if (m === 'trueFalse' || m === 'understand') {
      setQuizQuestions(shuffle(questions).slice(0, 10));
    }
  };

  const handleAnswer = (answer: boolean) => {
    if (answered !== null) return;
    const q = quizQuestions[currentIndex];
    const correct = q.answer === answer;
    setUserAnswer(answer);
    setAnswered(correct);
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
    else addMistake(q.id);
  };

  const nextQuestion = () => {
    clearExplanation();
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setAnswered(null);
      setUserAnswer(null);
      setSignQuizAnswer(null);
    } else {
      setMode('menu');
    }
  };

  // Menu
  if (mode === 'menu') {
    return (
      <div className="px-5 space-y-4 animate-fade-in">
        {total > 0 && (
          <div className={`rounded-3xl p-6 text-center shadow-card border ${score / total >= 0.7 ? 'bg-success-light border-success/10' : 'bg-danger-light border-danger/10'}`}>
            <p className="text-5xl font-extrabold text-text">{score}/{total}</p>
            <p className="text-sm font-bold text-text-secondary mt-2">
              {score / total >= 0.7 ? '🎉 أحسنت!' : '💪 حاول مرة أخرى'}
            </p>
          </div>
        )}
        <div className="space-y-3">
          {[
            { id: 'trueFalse' as QuizMode, icon: '✅', title: 'صح وغلط', desc: 'أجب بصح أو غلط على الأسئلة', gradient: 'from-[#00C48C] to-[#44D9A8]', pastel: 'bg-pastel-green' },
            { id: 'understand' as QuizMode, icon: '🤔', title: 'فهم السؤال', desc: 'اقرأ السؤال بالإيطالي وافهمه', gradient: 'from-[#4A90D9] to-[#67B8F0]', pastel: 'bg-pastel-blue' },
            { id: 'signs' as QuizMode, icon: '🚦', title: 'اختبار إشارات', desc: 'تعرف على الإشارة الصحيحة', gradient: 'from-[#6C5CE7] to-[#A29BFE]', pastel: 'bg-pastel-purple' },
            { id: 'words' as QuizMode, icon: '🔤', title: 'اختبار كلمات', desc: 'تعلم المصطلحات الإيطالية', gradient: 'from-[#FF9F43] to-[#FFD093]', pastel: 'bg-pastel-orange' },
          ].map((item, i) => (
            <button key={item.id} onClick={() => startQuiz(item.id)}
              className={`w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-card-hover transition-all active:scale-[0.98] shadow-card border border-border-light animate-fade-in stagger-${i + 1}`}>
              <div className={`w-13 h-13 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`} style={{ width: '52px', height: '52px' }}>
                {item.icon}
              </div>
              <div className="text-right flex-1">
                <h3 className="font-bold text-text text-sm">{item.title}</h3>
                <p className="text-[11px] text-text-secondary mt-0.5 font-medium">{item.desc}</p>
              </div>
              <span className="text-text-muted text-base">←</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // True/False & Understand
  if (mode === 'trueFalse' || mode === 'understand') {
    const q = quizQuestions[currentIndex];
    if (!q) { setMode('menu'); return null; }
    
    return (
      <div className="px-5 space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setMode('menu')} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-sm shadow-card border border-border-light active:scale-95">
            ✕
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-white text-text-secondary px-3.5 py-2 rounded-full font-bold shadow-card border border-border-light">
              {currentIndex + 1}/{quizQuestions.length}
            </span>
            <span className="text-[11px] bg-success-light text-success px-3 py-2 rounded-full font-extrabold border border-success/10">{score} ✓</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-surface rounded-full h-2 overflow-hidden">
          <div className="gradient-primary h-2 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }} />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl border border-border-light overflow-hidden shadow-card">
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold ${
                q.difficulty === 'easy' ? 'bg-pastel-green text-emerald-600' :
                q.difficulty === 'medium' ? 'bg-pastel-orange text-amber-600' :
                'bg-pastel-pink text-red-600'
              }`}>
                {q.difficulty === 'easy' ? '🟢 سهل' : q.difficulty === 'medium' ? '🟡 متوسط' : '🔴 صعب'}
              </span>
              <span className="text-[10px] text-text-muted font-bold bg-surface px-3 py-1.5 rounded-full">{q.category}</span>
            </div>

            {/* Question Image */}
            {q.imageUrl && (
              <img src={q.imageUrl} alt="صورة السؤال" className="w-full h-40 object-cover rounded-2xl border border-border-light" />
            )}

            {/* Italian Text */}
            <div className="bg-surface rounded-2xl p-4 border border-border-light">
              <p className="text-[13px] font-bold text-text leading-8" dir="ltr">{q.textIt}</p>
            </div>

            {mode === 'understand' && (
              <div className="bg-pastel-blue rounded-2xl p-4 border border-blue-100">
                <p className="text-[13px] text-blue-800 leading-8 font-medium">{q.textAr}</p>
              </div>
            )}
          </div>

          {/* Answers */}
          <div className="px-5 pb-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleAnswer(true)}
                disabled={answered !== null}
                className={`py-4 rounded-2xl font-bold text-sm transition-all ${
                  answered !== null && q.answer === true
                    ? 'gradient-green text-white shadow-success-glow/50' :
                  answered !== null && userAnswer === true && !answered
                    ? 'gradient-pink text-white shadow-danger-glow/50' :
                  answered !== null
                    ? 'bg-surface text-text-muted' :
                  'bg-pastel-green text-success border-2 border-success/20 hover:shadow-card active:scale-95'
                }`}>
                صح ✓
                <br /><span className="text-[10px] opacity-70 font-medium">Vero</span>
              </button>
              <button onClick={() => handleAnswer(false)}
                disabled={answered !== null}
                className={`py-4 rounded-2xl font-bold text-sm transition-all ${
                  answered !== null && q.answer === false
                    ? 'gradient-green text-white shadow-success-glow/50' :
                  answered !== null && userAnswer === false && !answered
                    ? 'gradient-pink text-white shadow-danger-glow/50' :
                  answered !== null
                    ? 'bg-surface text-text-muted' :
                  'bg-pastel-pink text-danger border-2 border-danger/20 hover:shadow-card active:scale-95'
                }`}>
                غلط ✗
                <br /><span className="text-[10px] opacity-70 font-medium">Falso</span>
              </button>
            </div>

            {answered !== null && (
              <div className={`rounded-2xl p-4 animate-scale-in ${answered ? 'bg-success-light border-2 border-success/10' : 'bg-danger-light border-2 border-danger/10'}`}>
                <p className={`font-bold text-sm mb-1.5 ${answered ? 'text-success' : 'text-danger'}`}>
                  {answered ? '✓ إجابة صحيحة! 🎉' : '✗ إجابة خاطئة'}
                </p>
                <p className="text-[12px] text-text-secondary leading-7 font-medium">{q.explanation}</p>
              </div>
            )}

            {answered !== null && (
              <button onClick={() => explainQuestion(q.id)}
                className="w-full bg-pastel-purple text-primary py-3.5 rounded-2xl font-bold text-xs hover:shadow-card transition-all border border-primary-100">
                🤖 مش فاهم السؤال؟ — اشرح لي
              </button>
            )}

            {aiExplanation && (
              <div className="bg-pastel-purple border-2 border-primary-100 rounded-2xl p-4 animate-scale-in">
                <pre className="text-[11px] text-primary-dark whitespace-pre-wrap leading-7 font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>{aiExplanation}</pre>
              </div>
            )}

            {answered !== null && (
              <button onClick={nextQuestion}
                className="w-full gradient-primary text-white py-4 rounded-2xl font-bold text-sm shadow-primary-glow active:scale-[0.97] transition-transform">
                {currentIndex < quizQuestions.length - 1 ? 'السؤال التالي ←' : '📊 عرض النتائج'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Signs Quiz
  if (mode === 'signs') {
    const shuffledSigns = shuffle(signs);
    const correctSign = shuffledSigns[currentIndex % shuffledSigns.length];
    if (!correctSign) { setMode('menu'); return null; }
    const options = shuffle([correctSign, ...shuffle(signs.filter(s => s.id !== correctSign.id)).slice(0, 3)]);

    return (
      <div className="px-5 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <button onClick={() => setMode('menu')} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-sm shadow-card border border-border-light active:scale-95">✕</button>
          <span className="text-[11px] bg-white text-text-secondary px-3.5 py-2 rounded-full font-bold shadow-card border border-border-light">
            السؤال {currentIndex + 1}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-border-light p-6 text-center shadow-card">
          <p className="text-xs text-text-secondary mb-5 font-bold">🚦 ما اسم هذه الإشارة؟</p>
          <span className="text-8xl block mb-4 animate-float">{correctSign.imageEmoji}</span>
          <p className="text-xs text-text-muted font-bold" dir="ltr">{correctSign.nameIt}</p>
        </div>

        <div className="space-y-2.5">
          {options.map(opt => (
            <button key={opt.id}
              onClick={() => {
                if (signQuizAnswer) return;
                setSignQuizAnswer(opt.id);
                setTotal(t => t + 1);
                if (opt.id === correctSign.id) setScore(s => s + 1);
              }}
              disabled={signQuizAnswer !== null}
              className={`w-full p-4 rounded-2xl font-bold text-sm transition-all ${
                signQuizAnswer === null ? 'bg-white border-2 border-border-light hover:border-primary/30 hover:bg-primary-50 active:scale-[0.98] shadow-card' :
                opt.id === correctSign.id ? 'gradient-green text-white shadow-success-glow/50' :
                signQuizAnswer === opt.id ? 'gradient-pink text-white shadow-danger-glow/50' :
                'bg-surface border border-border-light text-text-muted'
              }`}>
              {opt.name}
            </button>
          ))}
        </div>

        {signQuizAnswer && (
          <button onClick={() => { setCurrentIndex(i => i + 1); setSignQuizAnswer(null); }}
            className="w-full gradient-primary text-white py-4 rounded-2xl font-bold text-sm shadow-primary-glow active:scale-[0.97] transition-transform">
            التالي ←
          </button>
        )}
      </div>
    );
  }

  // Words Quiz
  if (mode === 'words') {
    const word = glossary[wordIndex % glossary.length];
    if (!word) { setMode('menu'); return null; }

    return (
      <div className="px-5 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <button onClick={() => setMode('menu')} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-sm shadow-card border border-border-light active:scale-95">✕</button>
          <span className="text-[11px] bg-white text-text-secondary px-3.5 py-2 rounded-full font-bold shadow-card border border-border-light">
            {wordIndex + 1}/{glossary.length}
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-border-light p-6 text-center shadow-card space-y-5">
          <div className="bg-pastel-purple rounded-2xl p-7 border border-primary-100">
            <p className="text-[10px] text-primary/50 mb-3 font-bold uppercase tracking-wider">المصطلح الإيطالي</p>
            <p className="text-3xl font-extrabold text-primary" dir="ltr">{word.termIt}</p>
          </div>

          {!showMeaning ? (
            <button onClick={() => setShowMeaning(true)}
              className="w-full gradient-orange text-white py-4 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform shadow-sm">
              👁️ اكشف المعنى
            </button>
          ) : (
            <div className="space-y-4 animate-scale-in">
              <div className="bg-pastel-green rounded-2xl p-5 border border-emerald-100">
                <p className="text-[10px] text-success/50 mb-2 font-bold uppercase tracking-wider">المعنى بالعربي</p>
                <p className="text-2xl font-extrabold text-success">{word.termAr}</p>
              </div>
              <div className="bg-pastel-orange rounded-2xl p-4 border border-orange-100">
                <p className="text-[10px] text-orange-600 mb-1.5 font-bold">💡 مثال</p>
                <p className="text-xs text-orange-800 font-medium leading-6">{word.example}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { setWordIndex(i => Math.max(0, i - 1)); setShowMeaning(false); }}
            disabled={wordIndex === 0}
            className="bg-white py-4 rounded-2xl font-bold text-sm text-text-secondary disabled:opacity-30 border border-border-light shadow-card">
            → السابق
          </button>
          <button onClick={() => { setWordIndex(i => i + 1); setShowMeaning(false); }}
            className="gradient-primary text-white py-4 rounded-2xl font-bold text-sm shadow-primary-glow active:scale-[0.97] transition-transform">
            التالي ←
          </button>
        </div>
      </div>
    );
  }

  return null;
}
