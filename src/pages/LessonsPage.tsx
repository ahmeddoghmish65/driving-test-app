import { useState } from 'react';
import { useStore } from '../store/useStore';
import { IconArrowRight, IconBook, IconCheck, IconLightbulb, IconGlobe, IconQuestion, IconX } from '../components/Icons';

export function LessonsPage() {
  const { lessons, sections, questions, completedLessons, completeLesson } = useStore();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, boolean | null>>({});

  const lesson = lessons.find(l => l.id === selectedLesson);
  const section = sections.find(s => s.id === selectedSection);

  // Single lesson view - Enhanced
  if (lesson) {
    const lessonQuestions = questions.filter(q => q.lessonId === lesson.id);

    return (
      <div className="px-5 space-y-4 animate-fade-in">
        <button onClick={() => { setSelectedLesson(null); setShowQuestions(false); setQuestionAnswers({}); }} className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-dark transition-colors">
          <span className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
            <IconArrowRight size={14} />
          </span>
          <span>العودة للقسم</span>
        </button>
        
        <div className="bg-white rounded-3xl border border-border-light overflow-hidden shadow-card">
          <div className="gradient-primary p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-8 translate-y-8" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-[11px] font-bold mb-4">
                <IconBook size={12} /> الدرس {lesson.order}
              </div>
              <h2 className="text-xl font-extrabold leading-relaxed">{lesson.title}</h2>
              <p className="text-sm text-white/50 mt-1 font-medium" dir="ltr">{lesson.titleIt}</p>
            </div>
          </div>

          {lesson.imageUrl && (
            <div className="px-5 pt-5">
              <img src={lesson.imageUrl} alt={lesson.title} className="w-full h-44 object-cover rounded-2xl border border-border-light" />
            </div>
          )}

          <div className="p-5 space-y-4">
            {/* Lesson content */}
            <div className="bg-pastel-blue rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <IconBook size={16} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-text text-sm">الشرح بالعربي</h3>
              </div>
              <p className="text-[13px] text-text-secondary leading-8">{lesson.content}</p>
            </div>

            {/* Italian term */}
            <div className="bg-pastel-purple rounded-2xl p-5 border border-primary-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
                  <IconGlobe size={16} className="text-primary" />
                </div>
                <p className="text-sm font-bold text-primary">المصطلح بالإيطالي</p>
              </div>
              <p className="text-primary font-extrabold text-2xl" dir="ltr">{lesson.titleIt}</p>
            </div>

            {/* Practical example */}
            <div className="bg-pastel-orange rounded-2xl p-5 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                  <IconLightbulb size={16} className="text-orange-600" />
                </div>
                <p className="text-sm font-bold text-orange-700">مثال عملي</p>
              </div>
              <p className="text-[13px] text-orange-800 leading-8">{lesson.example}</p>
            </div>

            {/* Related questions section */}
            {lessonQuestions.length > 0 && (
              <div className="border-t border-border-light pt-4">
                <button onClick={() => setShowQuestions(!showQuestions)}
                  className="w-full flex items-center justify-between bg-surface rounded-2xl p-4 hover:bg-primary-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <IconQuestion size={18} className="text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text">أسئلة هذا الدرس</p>
                      <p className="text-[10px] text-text-secondary font-medium">{lessonQuestions.length} سؤال متعلق بهذا الدرس</p>
                    </div>
                  </div>
                  <span className={`text-text-muted transition-transform ${showQuestions ? 'rotate-90' : ''}`}>←</span>
                </button>

                {showQuestions && (
                  <div className="space-y-3 mt-3 animate-fade-in">
                    {lessonQuestions.map((q, qi) => {
                      const answered = questionAnswers[q.id];
                      const isCorrect = answered === q.answer;
                      return (
                        <div key={q.id} className={`rounded-2xl border-2 p-4 space-y-3 animate-fade-in stagger-${qi + 1} ${
                          answered !== null && answered !== undefined
                            ? isCorrect ? 'bg-success-light border-success/20' : 'bg-danger-light border-danger/20'
                            : 'bg-white border-border-light'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${
                              q.difficulty === 'easy' ? 'bg-pastel-green text-emerald-600' :
                              q.difficulty === 'medium' ? 'bg-pastel-orange text-amber-600' :
                              'bg-pastel-pink text-red-600'
                            }`}>
                              {q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                            </span>
                            <span className="text-[10px] text-text-muted font-bold">سؤال {qi + 1}</span>
                          </div>
                          <div className="bg-surface rounded-xl p-3 border border-border-light">
                            <p className="text-[12px] font-bold text-text leading-7" dir="ltr">{q.textIt}</p>
                          </div>
                          <p className="text-[12px] text-text-secondary leading-7">{q.textAr}</p>
                          
                          {answered === null || answered === undefined ? (
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => setQuestionAnswers(a => ({...a, [q.id]: true}))}
                                className="py-3 rounded-xl text-xs font-bold bg-pastel-green text-success border border-success/20 hover:shadow-card active:scale-95 transition-all flex items-center justify-center gap-1">
                                <IconCheck size={14} /> صح
                              </button>
                              <button onClick={() => setQuestionAnswers(a => ({...a, [q.id]: false}))}
                                className="py-3 rounded-xl text-xs font-bold bg-pastel-pink text-danger border border-danger/20 hover:shadow-card active:scale-95 transition-all flex items-center justify-center gap-1">
                                <IconX size={14} /> غلط
                              </button>
                            </div>
                          ) : (
                            <div className={`rounded-xl p-3 text-[11px] leading-6 font-medium ${isCorrect ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              <p className="font-bold mb-1">{isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}</p>
                              <p className="text-text-secondary">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!completedLessons.includes(lesson.id) ? (
              <button onClick={() => completeLesson(lesson.id)}
                className="w-full gradient-green text-white py-4 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform shadow-success-glow flex items-center justify-center gap-2">
                <IconCheck size={16} /> أنهيت هذا الدرس
              </button>
            ) : (
              <div className="w-full bg-success-light text-success py-4 rounded-2xl font-bold text-sm text-center border-2 border-success/20 flex items-center justify-center gap-2">
                <IconCheck size={16} /> تم إنهاء هذا الدرس
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Section lessons list
  if (section) {
    const sectionLessons = lessons.filter(l => l.sectionId === section.id).sort((a, b) => a.order - b.order);
    const completedCount = sectionLessons.filter(l => completedLessons.includes(l.id)).length;
    const progress = sectionLessons.length > 0 ? Math.round((completedCount / sectionLessons.length) * 100) : 0;

    return (
      <div className="px-5 space-y-5 animate-fade-in">
        <button onClick={() => setSelectedSection(null)} className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-dark transition-colors">
          <span className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
            <IconArrowRight size={14} />
          </span>
          <span>العودة للأقسام</span>
        </button>

        <div className="bg-white rounded-3xl border border-border-light overflow-hidden shadow-card">
          {section.imageUrl && (
            <img src={section.imageUrl} alt={section.name} className="w-full h-40 object-cover" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                <IconBook size={22} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-text">{section.name}</h2>
                <p className="text-xs text-text-secondary font-medium">{sectionLessons.length} درس</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-text-secondary font-bold">التقدم</span>
              <span className="text-[11px] font-extrabold text-primary">{progress}%</span>
            </div>
            <div className="bg-surface rounded-full h-3 overflow-hidden">
              <div className="gradient-primary h-3 rounded-full transition-all duration-500 relative"
                style={{ width: `${progress}%` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {sectionLessons.map((l, i) => {
            const lQuestions = questions.filter(q => q.lessonId === l.id);
            return (
              <button key={l.id} onClick={() => setSelectedLesson(l.id)}
                className={`w-full bg-white border border-border-light rounded-2xl p-4 text-right hover:shadow-card-hover hover:border-primary/20 transition-all flex items-center gap-3.5 group shadow-card animate-fade-in stagger-${Math.min(i + 1, 8)}`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${
                  completedLessons.includes(l.id) 
                    ? 'bg-success text-white shadow-success-glow/30' 
                    : 'bg-surface text-text-muted group-hover:bg-primary-50 group-hover:text-primary'
                }`}>
                  {completedLessons.includes(l.id) ? <IconCheck size={16} /> : <span className="text-sm font-bold">{l.order}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-text text-sm">{l.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5 font-medium" dir="ltr">{l.titleIt}</p>
                  {lQuestions.length > 0 && (
                    <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                      <IconQuestion size={10} /> {lQuestions.length} سؤال
                    </p>
                  )}
                </div>
                <span className="text-text-muted group-hover:text-primary transition-colors text-sm">←</span>
              </button>
            );
          })}
        </div>

        {sectionLessons.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-3">
              <IconBook size={28} className="text-text-muted" />
            </div>
            <p className="text-text-secondary text-sm font-bold">لا توجد دروس في هذا القسم بعد</p>
          </div>
        )}
      </div>
    );
  }

  // Sections overview
  const totalCompleted = completedLessons.length;
  const totalLessons = lessons.length;

  return (
    <div className="px-5 space-y-5 animate-fade-in">
      <div className="bg-white rounded-2xl p-5 shadow-card border border-border-light">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-text-secondary font-bold flex items-center gap-2">
            <IconBook size={14} /> التقدم الإجمالي
          </span>
          <span className="text-sm font-extrabold text-primary bg-primary-50 px-3 py-1 rounded-full">{totalCompleted}/{totalLessons}</span>
        </div>
        <div className="bg-surface rounded-full h-3 overflow-hidden">
          <div className="gradient-primary h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${(totalCompleted / Math.max(totalLessons, 1)) * 100}%` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 rounded-full" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sections.sort((a, b) => a.order - b.order).map((sec, i) => {
          const secLessons = lessons.filter(l => l.sectionId === sec.id);
          const secCompleted = secLessons.filter(l => completedLessons.includes(l.id)).length;
          const secProgress = secLessons.length > 0 ? Math.round((secCompleted / secLessons.length) * 100) : 0;

          return (
            <button key={sec.id} onClick={() => setSelectedSection(sec.id)}
              className={`w-full bg-white rounded-2xl border border-border-light overflow-hidden shadow-card hover:shadow-card-hover transition-all active:scale-[0.98] text-right animate-fade-in stagger-${Math.min(i + 1, 8)}`}>
              <div className="flex">
                {sec.imageUrl ? (
                  <img src={sec.imageUrl} alt={sec.name} className="w-28 h-28 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-28 h-28 gradient-primary flex items-center justify-center flex-shrink-0">
                    <IconBook size={32} className="text-white" />
                  </div>
                )}
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                      <IconBook size={14} className="text-primary" />
                    </div>
                    <h3 className="font-bold text-text text-sm">{sec.name}</h3>
                  </div>
                  <p className="text-[11px] text-text-secondary font-medium mb-3">{secLessons.length} درس · {secCompleted} مكتمل</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                      <div className="gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${secProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-extrabold text-primary">{secProgress}%</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconBook size={28} className="text-text-muted" />
          </div>
          <p className="text-text-secondary text-base font-bold">لا توجد أقسام بعد</p>
        </div>
      )}
    </div>
  );
}
