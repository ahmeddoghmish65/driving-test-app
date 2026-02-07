import { useState } from 'react';
import { useStore } from '../store/useStore';

export function MistakesPage() {
  const { mistakes, questions, removeMistake, explainQuestion, aiExplanation, clearExplanation } = useStore();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const mistakeQuestions = questions.filter(q => mistakes.includes(q.id));

  return (
    <div className="px-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary font-medium">🔄 راجع الأسئلة اللي غلطت فيها</p>
        <span className="text-[11px] bg-danger-light text-danger px-4 py-2 rounded-full font-extrabold border-2 border-danger/10">
          {mistakeQuestions.length} خطأ
        </span>
      </div>

      {mistakeQuestions.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 gradient-green rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-success-glow/30 animate-float">
            🎉
          </div>
          <h3 className="text-xl font-extrabold text-text">لا توجد أخطاء!</h3>
          <p className="text-sm text-text-secondary mt-2 font-medium">واصل التدريب للحفاظ على مستواك ✨</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mistakeQuestions.map((q, i) => (
            <div key={q.id} className={`bg-white border-2 border-border-light rounded-2xl overflow-hidden shadow-card animate-fade-in stagger-${(i % 5) + 1}`}>
              <div className="p-5 space-y-4">
                {/* Meta */}
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

                {/* Question */}
                <div className="bg-surface rounded-2xl p-4 border border-border-light">
                  <p className="text-xs font-bold text-text leading-7" dir="ltr">{q.textIt}</p>
                </div>
                <p className="text-xs text-text-secondary leading-7 font-medium">{q.textAr}</p>

                {/* Answer */}
                <div className="bg-success-light rounded-2xl p-4 border-2 border-success/10">
                  <p className="text-[12px] font-bold text-success mb-1">✓ الإجابة: {q.answer ? 'صح (Vero)' : 'غلط (Falso)'}</p>
                  <p className="text-[12px] text-text-secondary leading-6 font-medium">{q.explanation}</p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { 
                    if (selectedQuestion === q.id) {
                      clearExplanation();
                      setSelectedQuestion(null);
                    } else {
                      explainQuestion(q.id);
                      setSelectedQuestion(q.id);
                    }
                  }}
                    className="bg-pastel-purple text-primary py-3 rounded-2xl text-[11px] font-bold hover:shadow-card transition-all border border-primary-100">
                    🤖 شرح مفصل
                  </button>
                  <button onClick={() => removeMistake(q.id)}
                    className="bg-success-light text-success py-3 rounded-2xl text-[11px] font-bold hover:shadow-card transition-all border border-success/10">
                    ✓ فهمتها — إزالة
                  </button>
                </div>

                {/* AI Explanation */}
                {selectedQuestion === q.id && aiExplanation && (
                  <div className="bg-pastel-purple border-2 border-primary-100 rounded-2xl p-4 animate-scale-in">
                    <pre className="text-[11px] text-primary-dark whitespace-pre-wrap leading-7 font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>{aiExplanation}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
