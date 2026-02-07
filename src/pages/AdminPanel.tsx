import { useState, useRef, useMemo } from 'react';
import { useStore } from '../store/useStore';
import type { Sign, Question } from '../store/useStore';
import { ImageUpload } from '../components/ImageUpload';
import {
  IconChart, IconUsers, IconFolder, IconBook, IconSignal, IconQuestion, IconChat,
  IconCheck, IconX, IconEdit, IconTrash, IconPin, IconDownload, IconUpload,
  IconPlus, IconBan, IconFlag, IconAlertTriangle, IconHeart, IconImage,
  IconTrendingUp, IconActivity, IconPieChart, IconAward, IconZap,
  IconCheckCircle, IconXCircle, IconPercent, IconClipboard, IconUserCheck,
  IconTarget, IconTrophy, IconStar, IconClock, IconSearch
} from '../components/Icons';

type AdminTab = 'stats' | 'users' | 'sections' | 'lessons' | 'signs' | 'questions' | 'posts';

export function AdminPanel() {
  const store = useStore();
  const [tab, setTab] = useState<AdminTab>('stats');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const importRef = useRef<HTMLInputElement>(null);

  // Section form
  const [secName, setSecName] = useState('');
  const [secIcon, setSecIcon] = useState('');
  const [secImage, setSecImage] = useState('');

  // Lesson form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonTitleIt, setLessonTitleIt] = useState('');
  const [lessonSectionId, setLessonSectionId] = useState('');
  const [lessonCategory, setLessonCategory] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonExample, setLessonExample] = useState('');
  const [lessonImage, setLessonImage] = useState('');

  // Sign form
  const [signName, setSignName] = useState('');
  const [signNameIt, setSignNameIt] = useState('');
  const [signCategory, setSignCategory] = useState<Sign['category']>('warning');
  const [signDesc, setSignDesc] = useState('');
  const [signExample, setSignExample] = useState('');
  const [signImage, setSignImage] = useState('');

  // Question form
  const [qTextIt, setQTextIt] = useState('');
  const [qTextAr, setQTextAr] = useState('');
  const [qAnswer, setQAnswer] = useState(true);
  const [qExplanation, setQExplanation] = useState('');
  const [qCategory, setQCategory] = useState('');
  const [qDifficulty, setQDifficulty] = useState<Question['difficulty']>('easy');
  const [qImage, setQImage] = useState('');

  const resetForms = () => {
    setShowAdd(false); setEditingId(null);
    setSecName(''); setSecIcon(''); setSecImage('');
    setLessonTitle(''); setLessonTitleIt(''); setLessonSectionId(''); setLessonCategory(''); setLessonContent(''); setLessonExample(''); setLessonImage('');
    setSignName(''); setSignNameIt(''); setSignDesc(''); setSignExample(''); setSignImage('');
    setQTextIt(''); setQTextAr(''); setQExplanation(''); setQCategory(''); setQImage('');
    setQAnswer(true); setQDifficulty('easy');
  };

  // Handlers
  const handleSaveSection = () => {
    if (!secName) return;
    if (editingId) store.updateSection(editingId, { name: secName, icon: secIcon, imageUrl: secImage || undefined });
    else store.addSection({ name: secName, icon: secIcon, imageUrl: secImage || undefined, order: store.sections.length + 1 });
    resetForms();
  };
  const startEditSection = (id: string) => { const s = store.sections.find(x => x.id === id); if (!s) return; setEditingId(id); setShowAdd(true); setSecName(s.name); setSecIcon(s.icon); setSecImage(s.imageUrl || ''); };
  const handleSaveLesson = () => {
    if (!lessonTitle || !lessonTitleIt) return;
    const data = { title: lessonTitle, titleIt: lessonTitleIt, sectionId: lessonSectionId || store.sections[0]?.id || '', category: lessonCategory || 'عام', content: lessonContent, example: lessonExample, imageUrl: lessonImage || undefined, order: store.lessons.length + 1 };
    if (editingId) store.updateLesson(editingId, data); else store.addLesson(data);
    resetForms();
  };
  const startEditLesson = (id: string) => { const l = store.lessons.find(x => x.id === id); if (!l) return; setEditingId(id); setShowAdd(true); setLessonTitle(l.title); setLessonTitleIt(l.titleIt); setLessonSectionId(l.sectionId); setLessonCategory(l.category); setLessonContent(l.content); setLessonExample(l.example); setLessonImage(l.imageUrl || ''); };
  const handleSaveSign = () => {
    if (!signName || !signNameIt) return;
    const data = { name: signName, nameIt: signNameIt, category: signCategory, description: signDesc, realExample: signExample, imageEmoji: '', imageUrl: signImage || undefined };
    if (editingId) store.updateSign(editingId, data); else store.addSign(data);
    resetForms();
  };
  const startEditSign = (id: string) => { const s = store.signs.find(x => x.id === id); if (!s) return; setEditingId(id); setShowAdd(true); setSignName(s.name); setSignNameIt(s.nameIt); setSignCategory(s.category); setSignDesc(s.description); setSignExample(s.realExample); setSignImage(s.imageUrl || ''); };
  const handleSaveQuestion = () => {
    if (!qTextIt || !qTextAr) return;
    const data = { textIt: qTextIt, textAr: qTextAr, answer: qAnswer, explanation: qExplanation, category: qCategory || 'عام', difficulty: qDifficulty, imageUrl: qImage || undefined };
    if (editingId) store.updateQuestion(editingId, data); else store.addQuestion(data);
    resetForms();
  };
  const startEditQuestion = (id: string) => { const q = store.questions.find(x => x.id === id); if (!q) return; setEditingId(id); setShowAdd(true); setQTextIt(q.textIt); setQTextAr(q.textAr); setQAnswer(q.answer); setQExplanation(q.explanation); setQCategory(q.category); setQDifficulty(q.difficulty); setQImage(q.imageUrl || ''); };

  // Import/Export
  const exportData = (type: 'lessons' | 'signs' | 'questions') => {
    const data = type === 'lessons' ? store.lessons : type === 'signs' ? store.signs : store.questions;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${type}_export.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (type: 'lessons' | 'signs' | 'questions') => {
    const input = importRef.current;
    if (!input) return;
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (Array.isArray(data)) {
            if (type === 'lessons') store.importLessons(data);
            else if (type === 'signs') store.importSigns(data);
            else store.importQuestions(data);
          }
        } catch { /* ignore */ }
      };
      reader.readAsText(file);
      input.value = '';
    };
    input.click();
  };

  // ====== Enhanced Stats Computations ======
  const statsData = useMemo(() => {
    const totalUsers = store.users.length;
    const activeUsers = store.users.filter(u => !u.banned).length;
    const bannedUsers = store.users.filter(u => u.banned).length;
    const adminUsers = store.users.filter(u => u.role === 'admin').length;

    const totalLessons = store.lessons.length;
    const totalSigns = store.signs.length;
    const totalQuestions = store.questions.length;
    const totalPosts = store.posts.length;
    const totalSections = store.sections.length;

    const totalComments = store.posts.reduce((sum, p) => sum + p.comments.length, 0);
    const totalLikes = store.posts.reduce((sum, p) => sum + p.likes.length, 0);
    const totalReports = store.posts.filter(p => p.reported).length;
    const pinnedPosts = store.posts.filter(p => p.pinned).length;

    const totalExams = store.examResults.length;
    const passedExams = store.examResults.filter(e => e.passed).length;
    const failedExams = totalExams - passedExams;
    const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
    const avgScore = totalExams > 0
      ? Math.round(store.examResults.reduce((s, e) => s + (e.score / e.total) * 100, 0) / totalExams)
      : 0;
    const bestScore = totalExams > 0
      ? Math.round(Math.max(...store.examResults.map(e => (e.score / e.total) * 100)))
      : 0;
    const avgTime = totalExams > 0
      ? Math.round(store.examResults.reduce((s, e) => s + e.timeSpent, 0) / totalExams)
      : 0;

    // Question difficulty distribution
    const easyQ = store.questions.filter(q => q.difficulty === 'easy').length;
    const mediumQ = store.questions.filter(q => q.difficulty === 'medium').length;
    const hardQ = store.questions.filter(q => q.difficulty === 'hard').length;

    // Question category distribution
    const qCategories: Record<string, number> = {};
    store.questions.forEach(q => { qCategories[q.category] = (qCategories[q.category] || 0) + 1; });
    const topCategories = Object.entries(qCategories).sort((a, b) => b[1] - a[1]).slice(0, 6);

    // Sign category distribution
    const signCats = {
      warning: store.signs.filter(s => s.category === 'warning').length,
      prohibition: store.signs.filter(s => s.category === 'prohibition').length,
      obligation: store.signs.filter(s => s.category === 'obligation').length,
      information: store.signs.filter(s => s.category === 'information').length,
    };

    // Section lesson distribution
    const sectionStats = store.sections.map(sec => ({
      name: sec.name,
      lessons: store.lessons.filter(l => l.sectionId === sec.id).length,
      completed: store.lessons.filter(l => l.sectionId === sec.id && store.completedLessons.includes(l.id)).length,
    }));

    // Mistakes
    const totalMistakes = store.mistakes.length;

    // Content completeness
    const lessonsWithImages = store.lessons.filter(l => l.imageUrl).length;
    const signsWithImages = store.signs.filter(s => s.imageUrl).length;
    const questionsWithImages = store.questions.filter(q => q.imageUrl).length;
    const questionsWithLessons = store.questions.filter(q => q.lessonId).length;

    // Community engagement
    const postsWithImages = store.posts.filter(p => p.imageUrl).length;
    const avgCommentsPerPost = totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : '0';
    const avgLikesPerPost = totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : '0';

    // Most active poster
    const posterCounts: Record<string, { name: string; count: number }> = {};
    store.posts.forEach(p => {
      if (!posterCounts[p.userId]) posterCounts[p.userId] = { name: p.userName, count: 0 };
      posterCounts[p.userId].count++;
    });
    const topPoster = Object.values(posterCounts).sort((a, b) => b.count - a.count)[0];

    // Recent registrations (by counting users)
    const recentUsers = store.users.filter(u => {
      const d = new Date(u.createdAt);
      const now = new Date();
      return (now.getTime() - d.getTime()) < 7 * 86400000;
    }).length;

    return {
      totalUsers, activeUsers, bannedUsers, adminUsers,
      totalLessons, totalSigns, totalQuestions, totalPosts, totalSections,
      totalComments, totalLikes, totalReports, pinnedPosts,
      totalExams, passedExams, failedExams, passRate, avgScore, bestScore, avgTime,
      easyQ, mediumQ, hardQ, topCategories,
      signCats, sectionStats, totalMistakes,
      lessonsWithImages, signsWithImages, questionsWithImages, questionsWithLessons,
      postsWithImages, avgCommentsPerPost, avgLikesPerPost, topPoster,
      recentUsers,
    };
  }, [store]);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'stats', label: 'إحصائيات', icon: <IconChart size={14} /> },
    { id: 'users', label: 'مستخدمين', icon: <IconUsers size={14} /> },
    { id: 'sections', label: 'أقسام', icon: <IconFolder size={14} /> },
    { id: 'lessons', label: 'دروس', icon: <IconBook size={14} /> },
    { id: 'signs', label: 'إشارات', icon: <IconSignal size={14} /> },
    { id: 'questions', label: 'أسئلة', icon: <IconQuestion size={14} /> },
    { id: 'posts', label: 'منشورات', icon: <IconChat size={14} /> },
  ];

  const inputClass = "w-full px-4 py-3 rounded-2xl border border-border-light text-sm bg-surface focus:bg-white focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 transition-all";

  // Circular progress component
  const CircularProgress = ({ value, size = 80, color = '#6C5CE7', label, sub }: { value: number; size?: number; color?: string; label: string; sub?: string }) => {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
      <div className="flex flex-col items-center gap-1">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0f0f0" strokeWidth="6" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
          <span className="text-lg font-extrabold" style={{ color }}>{value}%</span>
        </div>
        <p className="text-[10px] font-bold text-text-secondary mt-1">{label}</p>
        {sub && <p className="text-[9px] text-text-muted font-medium">{sub}</p>}
      </div>
    );
  };

  // Mini bar chart
  const MiniBar = ({ value, max, color, label, count }: { value: number; max: number; color: string; label: string; count: number }) => {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-text">{label}</span>
          <span className="text-[10px] font-bold text-text-muted">{count}</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>
    );
  };

  const filteredUsers = store.users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="px-5 space-y-4 animate-fade-in">
      <input ref={importRef} type="file" accept=".json" className="hidden" />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); resetForms(); }}
            className={`px-4 py-2.5 rounded-2xl text-[11px] font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 ${
              tab === t.id ? 'gradient-primary text-white shadow-primary-glow/30' : 'bg-white text-text-secondary border border-border-light hover:shadow-card'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* =============== ENHANCED STATS =============== */}
      {tab === 'stats' && (
        <div className="space-y-5 animate-fade-in pb-6">

          {/* === Section 1: Overview Hero Cards === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center">
                <IconActivity size={14} className="text-white" />
              </div>
              <h3 className="text-sm font-extrabold text-text">نظرة عامة</h3>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: 'المستخدمين', value: statsData.totalUsers, icon: <IconUsers size={18} />, gradient: 'from-blue-500 to-blue-600' },
                { label: 'الدروس', value: statsData.totalLessons, icon: <IconBook size={18} />, gradient: 'from-emerald-500 to-emerald-600' },
                { label: 'الأسئلة', value: statsData.totalQuestions, icon: <IconQuestion size={18} />, gradient: 'from-purple-500 to-purple-600' },
                { label: 'الإشارات', value: statsData.totalSigns, icon: <IconSignal size={18} />, gradient: 'from-amber-500 to-orange-500' },
                { label: 'المنشورات', value: statsData.totalPosts, icon: <IconChat size={18} />, gradient: 'from-pink-500 to-rose-500' },
                { label: 'الأقسام', value: statsData.totalSections, icon: <IconFolder size={18} />, gradient: 'from-cyan-500 to-teal-500' },
              ].map((item, i) => (
                <div key={i} className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-4 text-center shadow-lg relative overflow-hidden`}>
                  <div className="absolute top-1 left-1 opacity-10">
                    <div className="w-12 h-12 rounded-full bg-white" />
                  </div>
                  <div className="text-white/80 mb-1.5 flex justify-center">{item.icon}</div>
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="text-[9px] text-white/80 font-bold mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* === Section 2: Users Analytics === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center">
                <IconUsers size={14} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-extrabold text-text">تحليل المستخدمين</h3>
            </div>
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                  <div className="flex justify-center mb-1.5"><IconUserCheck size={18} className="text-emerald-600" /></div>
                  <p className="text-xl font-black text-emerald-700">{statsData.activeUsers}</p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-0.5">نشط</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 text-center border border-red-100">
                  <div className="flex justify-center mb-1.5"><IconBan size={18} className="text-red-500" /></div>
                  <p className="text-xl font-black text-red-600">{statsData.bannedUsers}</p>
                  <p className="text-[9px] text-red-500 font-bold mt-0.5">محظور</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
                  <div className="flex justify-center mb-1.5"><IconAward size={18} className="text-purple-600" /></div>
                  <p className="text-xl font-black text-purple-700">{statsData.adminUsers}</p>
                  <p className="text-[9px] text-purple-600 font-bold mt-0.5">مدير</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                  <div className="flex justify-center mb-1.5"><IconTrendingUp size={18} className="text-blue-600" /></div>
                  <p className="text-xl font-black text-blue-700">{statsData.recentUsers}</p>
                  <p className="text-[9px] text-blue-600 font-bold mt-0.5">هذا الأسبوع</p>
                </div>
              </div>
              {/* User ratio bar */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-text-muted">نسبة المستخدمين النشطين</p>
                <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 transition-all duration-1000 rounded-r-full"
                    style={{ width: `${statsData.totalUsers > 0 ? (statsData.activeUsers / statsData.totalUsers) * 100 : 0}%` }} />
                  <div className="h-full bg-red-400 transition-all duration-1000"
                    style={{ width: `${statsData.totalUsers > 0 ? (statsData.bannedUsers / statsData.totalUsers) * 100 : 0}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-text-muted font-medium">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> نشط {statsData.totalUsers > 0 ? Math.round((statsData.activeUsers / statsData.totalUsers) * 100) : 0}%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> محظور {statsData.totalUsers > 0 ? Math.round((statsData.bannedUsers / statsData.totalUsers) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* === Section 3: Exam Performance === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center">
                <IconClipboard size={14} className="text-purple-600" />
              </div>
              <h3 className="text-sm font-extrabold text-text">أداء الامتحانات</h3>
            </div>
            {statsData.totalExams === 0 ? (
              <div className="bg-white rounded-2xl border border-border-light shadow-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-50 rounded-full flex items-center justify-center">
                  <IconClipboard size={28} className="text-gray-300" />
                </div>
                <p className="text-sm font-bold text-text-secondary">لا توجد امتحانات بعد</p>
                <p className="text-[10px] text-text-muted mt-1">ستظهر الإحصائيات عندما يبدأ المستخدمون بإجراء الامتحانات</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Main exam stats */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-white/70 text-[10px] font-bold mb-1">إجمالي الامتحانات</p>
                      <p className="text-4xl font-black">{statsData.totalExams}</p>
                    </div>
                    <div className="relative">
                      <svg width={90} height={90} className="transform -rotate-90">
                        <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                        <circle cx="45" cy="45" r="36" fill="none" stroke="#fff" strokeWidth="7"
                          strokeDasharray={2 * Math.PI * 36} strokeDashoffset={2 * Math.PI * 36 - (statsData.passRate / 100) * 2 * Math.PI * 36}
                          strokeLinecap="round" className="transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white">{statsData.passRate}%</span>
                        <span className="text-[8px] text-white/70 font-bold">نجاح</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white rounded-2xl border border-border-light shadow-card p-4 text-center">
                    <div className="flex justify-center mb-2"><IconCheckCircle size={20} className="text-emerald-500" /></div>
                    <p className="text-2xl font-black text-emerald-600">{statsData.passedExams}</p>
                    <p className="text-[9px] text-text-muted font-bold mt-0.5">ناجح</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-border-light shadow-card p-4 text-center">
                    <div className="flex justify-center mb-2"><IconXCircle size={20} className="text-red-500" /></div>
                    <p className="text-2xl font-black text-red-600">{statsData.failedExams}</p>
                    <p className="text-[9px] text-text-muted font-bold mt-0.5">راسب</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-border-light shadow-card p-4 text-center">
                    <div className="flex justify-center mb-2"><IconPercent size={20} className="text-blue-500" /></div>
                    <p className="text-2xl font-black text-blue-600">{statsData.avgScore}%</p>
                    <p className="text-[9px] text-text-muted font-bold mt-0.5">متوسط النتيجة</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-border-light shadow-card p-4 text-center">
                    <div className="flex justify-center mb-2"><IconTrophy size={20} className="text-amber-500" /></div>
                    <p className="text-2xl font-black text-amber-600">{statsData.bestScore}%</p>
                    <p className="text-[9px] text-text-muted font-bold mt-0.5">أفضل نتيجة</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border-light shadow-card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <IconClock size={20} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted font-bold">متوسط وقت الامتحان</p>
                    <p className="text-lg font-black text-text">{Math.floor(statsData.avgTime / 60)}:{(statsData.avgTime % 60).toString().padStart(2, '0')} <span className="text-[10px] font-bold text-text-muted">دقيقة</span></p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted font-bold">الأخطاء المسجلة</p>
                    <p className="text-lg font-black text-danger">{statsData.totalMistakes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* === Section 4: Questions Analytics === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center">
                <IconQuestion size={14} className="text-amber-600" />
              </div>
              <h3 className="text-sm font-extrabold text-text">تحليل الأسئلة</h3>
            </div>
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5 space-y-5">
              {/* Difficulty Distribution */}
              <div>
                <p className="text-[11px] font-bold text-text mb-3 flex items-center gap-1.5">
                  <IconTarget size={12} className="text-text-muted" /> توزيع الصعوبة
                </p>
                <div className="space-y-3">
                  <MiniBar value={statsData.easyQ} max={statsData.totalQuestions} color="#10b981" label="سهل" count={statsData.easyQ} />
                  <MiniBar value={statsData.mediumQ} max={statsData.totalQuestions} color="#f59e0b" label="متوسط" count={statsData.mediumQ} />
                  <MiniBar value={statsData.hardQ} max={statsData.totalQuestions} color="#ef4444" label="صعب" count={statsData.hardQ} />
                </div>
              </div>

              <div className="h-px bg-border-light" />

              {/* Category Distribution */}
              <div>
                <p className="text-[11px] font-bold text-text mb-3 flex items-center gap-1.5">
                  <IconPieChart size={12} className="text-text-muted" /> توزيع حسب الفئة
                </p>
                <div className="space-y-3">
                  {statsData.topCategories.map(([cat, count], i) => {
                    const colors = ['#6C5CE7', '#0984e3', '#00b894', '#fdcb6e', '#e17055', '#a29bfe'];
                    return (
                      <MiniBar key={cat} value={count} max={statsData.totalQuestions} color={colors[i % colors.length]} label={cat} count={count} />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* === Section 5: Signs Distribution === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center">
                <IconSignal size={14} className="text-red-600" />
              </div>
              <h3 className="text-sm font-extrabold text-text">توزيع الإشارات</h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'تحذيرية', value: statsData.signCats.warning, icon: <IconAlertTriangle size={16} />, bg: 'bg-amber-50', border: 'border-amber-100', color: 'text-amber-600' },
                { label: 'منع', value: statsData.signCats.prohibition, icon: <IconBan size={16} />, bg: 'bg-red-50', border: 'border-red-100', color: 'text-red-600' },
                { label: 'إجبارية', value: statsData.signCats.obligation, icon: <IconCheckCircle size={16} />, bg: 'bg-blue-50', border: 'border-blue-100', color: 'text-blue-600' },
                { label: 'إرشادية', value: statsData.signCats.information, icon: <IconZap size={16} />, bg: 'bg-emerald-50', border: 'border-emerald-100', color: 'text-emerald-600' },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-2xl p-4 border ${item.border} shadow-sm`}>
                  <div className={`${item.color} mb-2 flex justify-center`}>{item.icon}</div>
                  <p className={`text-2xl font-black text-center ${item.color}`}>{item.value}</p>
                  <p className="text-[9px] text-center text-text-muted font-bold mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* === Section 6: Sections Progress === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-teal-100 flex items-center justify-center">
                <IconFolder size={14} className="text-teal-600" />
              </div>
              <h3 className="text-sm font-extrabold text-text">تقدم الأقسام</h3>
            </div>
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5 space-y-4">
              {statsData.sectionStats.map((sec, i) => {
                const pct = sec.lessons > 0 ? Math.round((sec.completed / sec.lessons) * 100) : 0;
                const colors = ['#6C5CE7', '#0984e3', '#00b894', '#fdcb6e', '#e17055'];
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-text">{sec.name}</span>
                      <span className="text-[10px] font-bold" style={{ color: colors[i % colors.length] }}>{sec.completed}/{sec.lessons} درس</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} />
                    </div>
                  </div>
                );
              })}
              {statsData.sectionStats.length === 0 && (
                <p className="text-center text-[11px] text-text-muted font-medium py-4">لا توجد أقسام بعد</p>
              )}
            </div>
          </div>

          {/* === Section 7: Community Analytics === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-pink-100 flex items-center justify-center">
                <IconHeart size={14} className="text-pink-600" />
              </div>
              <h3 className="text-sm font-extrabold text-text">تحليل المجتمع</h3>
            </div>
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-pink-50 rounded-xl p-3 text-center border border-pink-100">
                  <p className="text-lg font-black text-pink-600">{statsData.totalLikes}</p>
                  <p className="text-[8px] text-pink-500 font-bold flex items-center justify-center gap-0.5 mt-0.5"><IconHeart size={8} /> إعجاب</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                  <p className="text-lg font-black text-blue-600">{statsData.totalComments}</p>
                  <p className="text-[8px] text-blue-500 font-bold flex items-center justify-center gap-0.5 mt-0.5"><IconChat size={8} /> تعليق</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                  <p className="text-lg font-black text-red-600">{statsData.totalReports}</p>
                  <p className="text-[8px] text-red-500 font-bold flex items-center justify-center gap-0.5 mt-0.5"><IconFlag size={8} /> بلاغ</p>
                </div>
              </div>

              <div className="h-px bg-border-light" />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconChat size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-text">{statsData.avgCommentsPerPost}</p>
                    <p className="text-[8px] text-text-muted font-bold">تعليق/منشور</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconHeart size={16} className="text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-text">{statsData.avgLikesPerPost}</p>
                    <p className="text-[8px] text-text-muted font-bold">إعجاب/منشور</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border-light" />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconPin size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-text">{statsData.pinnedPosts}</p>
                    <p className="text-[8px] text-text-muted font-bold">منشور مثبت</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconImage size={16} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-text">{statsData.postsWithImages}</p>
                    <p className="text-[8px] text-text-muted font-bold">منشور بصورة</p>
                  </div>
                </div>
              </div>

              {statsData.topPoster && (
                <>
                  <div className="h-px bg-border-light" />
                  <div className="flex items-center gap-3 bg-gradient-to-l from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white">
                      <IconStar size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-amber-700 font-bold">الأكثر نشاطاً</p>
                      <p className="text-sm font-black text-text">{statsData.topPoster.name}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-black text-amber-600">{statsData.topPoster.count}</p>
                      <p className="text-[8px] text-amber-500 font-bold">منشور</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* === Section 8: Content Completeness === */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center">
                <IconCheckCircle size={14} className="text-indigo-600" />
              </div>
              <h3 className="text-sm font-extrabold text-text">اكتمال المحتوى</h3>
            </div>
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5 space-y-4">
              <div className="flex justify-around">
                <div className="relative">
                  <CircularProgress
                    value={statsData.totalLessons > 0 ? Math.round((statsData.lessonsWithImages / statsData.totalLessons) * 100) : 0}
                    color="#10b981" label="دروس بصور" size={75}
                    sub={`${statsData.lessonsWithImages}/${statsData.totalLessons}`} />
                </div>
                <div className="relative">
                  <CircularProgress
                    value={statsData.totalSigns > 0 ? Math.round((statsData.signsWithImages / statsData.totalSigns) * 100) : 0}
                    color="#f59e0b" label="إشارات بصور" size={75}
                    sub={`${statsData.signsWithImages}/${statsData.totalSigns}`} />
                </div>
                <div className="relative">
                  <CircularProgress
                    value={statsData.totalQuestions > 0 ? Math.round((statsData.questionsWithLessons / statsData.totalQuestions) * 100) : 0}
                    color="#6C5CE7" label="أسئلة مربوطة" size={75}
                    sub={`${statsData.questionsWithLessons}/${statsData.totalQuestions}`} />
                </div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                <p className="text-[10px] text-indigo-700 font-bold flex items-center gap-1">
                  <IconZap size={10} /> نصيحة
                </p>
                <p className="text-[10px] text-indigo-600 mt-1 leading-5">
                  {statsData.lessonsWithImages < statsData.totalLessons
                    ? `أضف صور لـ ${statsData.totalLessons - statsData.lessonsWithImages} درس لتحسين تجربة التعلم`
                    : statsData.questionsWithLessons < statsData.totalQuestions
                      ? `اربط ${statsData.totalQuestions - statsData.questionsWithLessons} سؤال بدروس محددة`
                      : 'المحتوى مكتمل بشكل ممتاز! استمر في إضافة المزيد'}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =============== USERS =============== */}
      {tab === 'users' && (
        <div className="space-y-2.5 animate-fade-in">
          {/* Search */}
          <div className="relative">
            <IconSearch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
              placeholder="بحث بالاسم أو البريد..."
              className="w-full pr-11 pl-4 py-3 rounded-2xl border border-border-light text-sm bg-white focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10" />
          </div>

          {filteredUsers.map(u => (
            <div key={u.id} className={`bg-white border-2 rounded-2xl p-4 flex items-center justify-between shadow-card ${u.banned ? 'border-danger/20 bg-danger-light' : 'border-border-light'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-text">
                    {u.name}
                    {u.role === 'admin' && <span className="text-[9px] text-primary bg-primary-50 px-2 py-0.5 rounded-full font-bold mr-1 border border-primary-100">مدير</span>}
                    {u.banned && <span className="text-danger text-[10px] font-extrabold mr-1">(محظور)</span>}
                  </p>
                  <p className="text-[10px] text-text-muted font-medium" dir="ltr">{u.email}</p>
                </div>
              </div>
              {u.email !== 'admin@patente.com' && (
                <div className="flex gap-1.5">
                  {u.banned ? (
                    <button onClick={() => store.unbanUser(u.id)}
                      className="text-[10px] bg-success-light text-success px-3 py-2 rounded-xl font-bold border border-success/10 flex items-center gap-1">
                      <IconCheck size={10} /> إلغاء
                    </button>
                  ) : (
                    <button onClick={() => store.banUser(u.id)}
                      className="text-[10px] bg-danger-light text-danger px-3 py-2 rounded-xl font-bold border border-danger/10 flex items-center gap-1">
                      <IconBan size={10} /> حظر
                    </button>
                  )}
                  <button onClick={() => store.deleteUser(u.id)}
                    className="text-[10px] bg-surface text-text-secondary px-3 py-2 rounded-xl font-bold border border-border-light flex items-center gap-1">
                    <IconTrash size={10} /> حذف
                  </button>
                </div>
              )}
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted font-bold">لا توجد نتائج</p>
            </div>
          )}
        </div>
      )}

      {/* =============== SECTIONS =============== */}
      {tab === 'sections' && (
        <div className="space-y-3 animate-fade-in">
          <button onClick={() => { resetForms(); setShowAdd(true); }}
            className="w-full gradient-primary text-white py-3.5 rounded-2xl font-bold text-sm shadow-primary-glow/40 active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
            <IconPlus size={16} /> إضافة قسم جديد
          </button>
          {showAdd && (
            <div className="bg-white rounded-2xl p-5 space-y-3 border-2 border-primary-100 animate-scale-in shadow-card">
              <h4 className="text-sm font-bold text-text flex items-center gap-2">{editingId ? <><IconEdit size={14} /> تعديل القسم</> : <><IconPlus size={14} /> قسم جديد</>}</h4>
              <input type="text" value={secName} onChange={e => setSecName(e.target.value)} placeholder="اسم القسم" className={inputClass} />
              <input type="text" value={secIcon} onChange={e => setSecIcon(e.target.value)} placeholder="أيقونة (اختياري)" className={inputClass} />
              <ImageUpload value={secImage} onChange={setSecImage} label="صورة القسم" compact />
              <div className="flex gap-2">
                <button onClick={handleSaveSection} className="flex-1 gradient-green text-white py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-1"><IconCheck size={14} /> حفظ</button>
                <button onClick={resetForms} className="px-5 py-3 rounded-2xl font-bold text-sm bg-surface text-text-secondary border border-border-light flex items-center justify-center gap-1"><IconX size={14} /> إلغاء</button>
              </div>
            </div>
          )}
          {store.sections.sort((a, b) => a.order - b.order).map(sec => (
            <div key={sec.id} className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-card">
              <div className="flex items-center">
                {sec.imageUrl ? (
                  <img src={sec.imageUrl} alt={sec.name} className="w-20 h-20 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 gradient-primary flex items-center justify-center flex-shrink-0">
                    <IconFolder size={24} className="text-white" />
                  </div>
                )}
                <div className="flex-1 p-3 min-w-0">
                  <p className="text-sm font-bold text-text">{sec.name}</p>
                  <p className="text-[10px] text-text-muted font-medium mt-1">{store.lessons.filter(l => l.sectionId === sec.id).length} درس</p>
                </div>
                <div className="flex gap-1.5 p-3">
                  <button onClick={() => startEditSection(sec.id)} className="text-[10px] bg-primary-50 text-primary p-2 rounded-xl border border-primary-100"><IconEdit size={12} /></button>
                  <button onClick={() => store.deleteSection(sec.id)} className="text-[10px] bg-danger-light text-danger p-2 rounded-xl border border-danger/10"><IconTrash size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =============== LESSONS =============== */}
      {tab === 'lessons' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex gap-2">
            <button onClick={() => { resetForms(); setShowAdd(true); setLessonSectionId(store.sections[0]?.id || ''); }}
              className="flex-1 gradient-primary text-white py-3 rounded-2xl font-bold text-xs shadow-primary-glow/40 active:scale-[0.97] flex items-center justify-center gap-1">
              <IconPlus size={14} /> إضافة درس
            </button>
            <button onClick={() => exportData('lessons')} className="bg-white border border-border-light px-4 py-3 rounded-2xl text-xs font-bold text-text-secondary flex items-center gap-1 hover:shadow-card">
              <IconDownload size={14} /> تصدير
            </button>
            <button onClick={() => handleImport('lessons')} className="bg-white border border-border-light px-4 py-3 rounded-2xl text-xs font-bold text-text-secondary flex items-center gap-1 hover:shadow-card">
              <IconUpload size={14} /> استيراد
            </button>
          </div>
          {showAdd && (
            <div className="bg-white rounded-2xl p-5 space-y-3 border-2 border-primary-100 animate-scale-in shadow-card">
              <h4 className="text-sm font-bold text-text flex items-center gap-2">{editingId ? <><IconEdit size={14} /> تعديل الدرس</> : <><IconPlus size={14} /> درس جديد</>}</h4>
              <input type="text" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="عنوان الدرس بالعربي" className={inputClass} />
              <input type="text" value={lessonTitleIt} onChange={e => setLessonTitleIt(e.target.value)} placeholder="Titolo in italiano" className={inputClass} dir="ltr" />
              <select value={lessonSectionId} onChange={e => setLessonSectionId(e.target.value)} className={inputClass}>
                <option value="">اختر القسم</option>
                {store.sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="text" value={lessonCategory} onChange={e => setLessonCategory(e.target.value)} placeholder="الفئة" className={inputClass} />
              <textarea value={lessonContent} onChange={e => setLessonContent(e.target.value)} placeholder="المحتوى" className={`${inputClass} resize-none h-24`} />
              <textarea value={lessonExample} onChange={e => setLessonExample(e.target.value)} placeholder="مثال عملي" className={`${inputClass} resize-none h-20`} />
              <ImageUpload value={lessonImage} onChange={setLessonImage} label="صورة الدرس" compact />
              <div className="flex gap-2">
                <button onClick={handleSaveLesson} className="flex-1 gradient-green text-white py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-1"><IconCheck size={14} /> حفظ</button>
                <button onClick={resetForms} className="px-5 py-3 rounded-2xl font-bold text-sm bg-surface text-text-secondary border border-border-light"><IconX size={14} /></button>
              </div>
            </div>
          )}
          {store.lessons.map(l => (
            <div key={l.id} className="bg-white border border-border-light rounded-2xl p-4 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {l.imageUrl ? (
                  <img src={l.imageUrl} alt="" className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 bg-surface rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconBook size={16} className="text-text-muted" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text truncate">{l.title}</p>
                  <p className="text-[10px] text-text-muted font-medium" dir="ltr">{l.titleIt}</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0 mr-2">
                <button onClick={() => startEditLesson(l.id)} className="bg-primary-50 text-primary p-2 rounded-xl border border-primary-100"><IconEdit size={12} /></button>
                <button onClick={() => store.deleteLesson(l.id)} className="bg-danger-light text-danger p-2 rounded-xl border border-danger/10"><IconTrash size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =============== SIGNS =============== */}
      {tab === 'signs' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex gap-2">
            <button onClick={() => { resetForms(); setShowAdd(true); }}
              className="flex-1 gradient-primary text-white py-3 rounded-2xl font-bold text-xs shadow-primary-glow/40 active:scale-[0.97] flex items-center justify-center gap-1">
              <IconPlus size={14} /> إضافة إشارة
            </button>
            <button onClick={() => exportData('signs')} className="bg-white border border-border-light px-4 py-3 rounded-2xl text-xs font-bold text-text-secondary flex items-center gap-1 hover:shadow-card">
              <IconDownload size={14} /> تصدير
            </button>
            <button onClick={() => handleImport('signs')} className="bg-white border border-border-light px-4 py-3 rounded-2xl text-xs font-bold text-text-secondary flex items-center gap-1 hover:shadow-card">
              <IconUpload size={14} /> استيراد
            </button>
          </div>
          {showAdd && (
            <div className="bg-white rounded-2xl p-5 space-y-3 border-2 border-primary-100 animate-scale-in shadow-card">
              <h4 className="text-sm font-bold text-text flex items-center gap-2">{editingId ? <><IconEdit size={14} /> تعديل الإشارة</> : <><IconPlus size={14} /> إشارة جديدة</>}</h4>
              <input type="text" value={signName} onChange={e => setSignName(e.target.value)} placeholder="اسم الإشارة" className={inputClass} />
              <input type="text" value={signNameIt} onChange={e => setSignNameIt(e.target.value)} placeholder="Nome del segnale" className={inputClass} dir="ltr" />
              <select value={signCategory} onChange={e => setSignCategory(e.target.value as Sign['category'])} className={inputClass}>
                <option value="warning">تحذيرية</option>
                <option value="prohibition">منع</option>
                <option value="obligation">إجبارية</option>
                <option value="information">إرشادية</option>
              </select>
              <textarea value={signDesc} onChange={e => setSignDesc(e.target.value)} placeholder="الوصف" className={`${inputClass} resize-none h-20`} />
              <textarea value={signExample} onChange={e => setSignExample(e.target.value)} placeholder="مثال واقعي" className={`${inputClass} resize-none h-20`} />
              <ImageUpload value={signImage} onChange={setSignImage} label="صورة الإشارة" />
              <div className="flex gap-2">
                <button onClick={handleSaveSign} className="flex-1 gradient-green text-white py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-1"><IconCheck size={14} /> حفظ</button>
                <button onClick={resetForms} className="px-5 py-3 rounded-2xl font-bold text-sm bg-surface text-text-secondary border border-border-light"><IconX size={14} /></button>
              </div>
            </div>
          )}
          <div className="space-y-2.5">
            {store.signs.map(s => (
              <div key={s.id} className="bg-white border border-border-light rounded-2xl p-4 flex items-center justify-between shadow-card">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt="" className="w-11 h-11 rounded-xl object-contain flex-shrink-0" />
                  ) : (
                    <div className="w-11 h-11 bg-surface rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconSignal size={16} className="text-text-muted" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text truncate">{s.name}</p>
                    <p className="text-[10px] text-text-muted font-medium" dir="ltr">{s.nameIt}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 mr-2">
                  <button onClick={() => startEditSign(s.id)} className="bg-primary-50 text-primary p-2 rounded-xl border border-primary-100"><IconEdit size={12} /></button>
                  <button onClick={() => store.deleteSign(s.id)} className="bg-danger-light text-danger p-2 rounded-xl border border-danger/10"><IconTrash size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =============== QUESTIONS =============== */}
      {tab === 'questions' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex gap-2">
            <button onClick={() => { resetForms(); setShowAdd(true); }}
              className="flex-1 gradient-primary text-white py-3 rounded-2xl font-bold text-xs shadow-primary-glow/40 active:scale-[0.97] flex items-center justify-center gap-1">
              <IconPlus size={14} /> إضافة سؤال
            </button>
            <button onClick={() => exportData('questions')} className="bg-white border border-border-light px-4 py-3 rounded-2xl text-xs font-bold text-text-secondary flex items-center gap-1 hover:shadow-card">
              <IconDownload size={14} /> تصدير
            </button>
            <button onClick={() => handleImport('questions')} className="bg-white border border-border-light px-4 py-3 rounded-2xl text-xs font-bold text-text-secondary flex items-center gap-1 hover:shadow-card">
              <IconUpload size={14} /> استيراد
            </button>
          </div>
          {showAdd && (
            <div className="bg-white rounded-2xl p-5 space-y-3 border-2 border-primary-100 animate-scale-in shadow-card">
              <h4 className="text-sm font-bold text-text flex items-center gap-2">{editingId ? <><IconEdit size={14} /> تعديل السؤال</> : <><IconPlus size={14} /> سؤال جديد</>}</h4>
              <textarea value={qTextIt} onChange={e => setQTextIt(e.target.value)} placeholder="السؤال بالإيطالي" className={`${inputClass} resize-none`} dir="ltr" />
              <textarea value={qTextAr} onChange={e => setQTextAr(e.target.value)} placeholder="السؤال بالعربي" className={`${inputClass} resize-none`} />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setQAnswer(true)}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${qAnswer ? 'gradient-green text-white shadow-sm' : 'bg-white text-text-secondary border border-border-light'}`}>
                  <IconCheck size={14} /> صح
                </button>
                <button onClick={() => setQAnswer(false)}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${!qAnswer ? 'gradient-pink text-white shadow-sm' : 'bg-white text-text-secondary border border-border-light'}`}>
                  <IconX size={14} /> غلط
                </button>
              </div>
              <textarea value={qExplanation} onChange={e => setQExplanation(e.target.value)} placeholder="شرح الإجابة" className={`${inputClass} resize-none h-20`} />
              <input type="text" value={qCategory} onChange={e => setQCategory(e.target.value)} placeholder="الفئة" className={inputClass} />
              <select value={qDifficulty} onChange={e => setQDifficulty(e.target.value as Question['difficulty'])} className={inputClass}>
                <option value="easy">سهل</option>
                <option value="medium">متوسط</option>
                <option value="hard">صعب</option>
              </select>
              <ImageUpload value={qImage} onChange={setQImage} label="صورة السؤال" compact />
              <div className="flex gap-2">
                <button onClick={handleSaveQuestion} className="flex-1 gradient-green text-white py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-1"><IconCheck size={14} /> حفظ</button>
                <button onClick={resetForms} className="px-5 py-3 rounded-2xl font-bold text-sm bg-surface text-text-secondary border border-border-light"><IconX size={14} /></button>
              </div>
            </div>
          )}
          <div className="space-y-2.5">
            {store.questions.map(q => (
              <div key={q.id} className="bg-white border border-border-light rounded-2xl p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-text-secondary truncate leading-6 font-medium" dir="ltr">{q.textIt}</p>
                    <p className="text-[11px] text-text mt-1 truncate leading-6 font-medium">{q.textAr}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${q.answer ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                        {q.answer ? <><IconCheck size={8} /> صح</> : <><IconX size={8} /> غلط</>}
                      </span>
                      <span className="text-[9px] text-text-muted font-bold bg-surface px-2.5 py-1 rounded-full">{q.category}</span>
                      <span className={`text-[9px] px-2 py-1 rounded-full font-bold ${
                        q.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                        q.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      }`}>{q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => startEditQuestion(q.id)} className="bg-primary-50 text-primary p-2 rounded-xl border border-primary-100"><IconEdit size={12} /></button>
                    <button onClick={() => store.deleteQuestion(q.id)} className="bg-danger-light text-danger p-2 rounded-xl border border-danger/10"><IconTrash size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =============== POSTS =============== */}
      {tab === 'posts' && (
        <div className="space-y-2.5 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pastel-orange border border-orange-100 rounded-2xl p-4 shadow-card">
              <p className="text-[10px] text-orange-700 font-bold mb-1 flex items-center gap-1"><IconAlertTriangle size={10} /> مبلغ عنها</p>
              <p className="text-2xl font-extrabold text-orange-600">{store.posts.filter(p => p.reported).length}</p>
            </div>
            <div className="bg-pastel-purple border border-primary-100 rounded-2xl p-4 shadow-card">
              <p className="text-[10px] text-primary font-bold mb-1 flex items-center gap-1"><IconPin size={10} /> مثبتة</p>
              <p className="text-2xl font-extrabold text-primary">{store.posts.filter(p => p.pinned).length}</p>
            </div>
          </div>
          {store.posts.map(post => (
            <div key={post.id} className={`bg-white border-2 rounded-2xl p-4 shadow-card ${post.reported ? 'border-danger/20' : post.pinned ? 'border-primary/20' : 'border-border-light'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-text">{post.userName}</p>
                    {post.pinned && <span className="text-[9px] bg-primary-50 text-primary px-2.5 py-1 rounded-full font-bold border border-primary-100 flex items-center gap-1"><IconPin size={8} /> مثبت</span>}
                    {post.reported && <span className="text-[9px] bg-danger-light text-danger px-2.5 py-1 rounded-full font-bold border border-danger/10 flex items-center gap-1"><IconFlag size={8} /> مبلغ</span>}
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1.5 line-clamp-2 leading-6 font-medium">{post.content}</p>
                  {post.reports && post.reports.length > 0 && (
                    <div className="mt-2 bg-danger-light rounded-xl p-2.5 space-y-1.5 border border-danger/10">
                      <p className="text-[9px] font-bold text-danger flex items-center gap-1"><IconFlag size={9} /> البلاغات ({post.reports.length})</p>
                      {post.reports.map((r, ri) => (
                        <p key={ri} className="text-[9px] text-red-700 font-medium bg-white/50 rounded-lg p-1.5">{r.userName}: {r.reason}</p>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-text-muted mt-2 font-bold flex items-center gap-3">
                    <span className="flex items-center gap-1"><IconHeart size={10} /> {post.likes.length}</span>
                    <span className="flex items-center gap-1"><IconChat size={10} /> {post.comments.length}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => post.pinned ? store.unpinPost(post.id) : store.pinPost(post.id)}
                    className={`p-2 rounded-xl border ${post.pinned ? 'bg-primary-50 text-primary border-primary-100' : 'bg-surface text-text-secondary border-border-light'}`}>
                    <IconPin size={12} />
                  </button>
                  <button onClick={() => store.deletePost(post.id)}
                    className="bg-danger-light text-danger p-2 rounded-xl border border-danger/10">
                    <IconTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
