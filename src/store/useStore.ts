import { create } from 'zustand';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  banned?: boolean;
  bio?: string;
}

export interface LessonSection {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  titleIt: string;
  category: string;
  sectionId: string;
  content: string;
  example: string;
  imageUrl?: string;
  order: number;
  completed?: boolean;
}

export interface Sign {
  id: string;
  name: string;
  nameIt: string;
  category: 'warning' | 'prohibition' | 'obligation' | 'information';
  description: string;
  realExample: string;
  imageEmoji: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  textIt: string;
  textAr: string;
  answer: boolean;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  signId?: string;
  imageUrl?: string;
  lessonId?: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  date: string;
  score: number;
  total: number;
  passed: boolean;
  answers: { questionId: string; userAnswer: boolean; correct: boolean }[];
  timeSpent: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  parentId?: string; // for replies
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
  reports: Report[];
  reported?: boolean;
  pinned?: boolean;
}

export interface GlossaryItem {
  id: string;
  termIt: string;
  termAr: string;
  example: string;
  category: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  
  // Users
  users: User[];
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  
  // Sections
  sections: LessonSection[];
  addSection: (section: Omit<LessonSection, 'id'>) => void;
  updateSection: (id: string, data: Partial<LessonSection>) => void;
  deleteSection: (id: string) => void;
  
  // Lessons
  lessons: Lesson[];
  completedLessons: string[];
  completeLesson: (id: string) => void;
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (id: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  importLessons: (lessons: Lesson[]) => void;
  
  // Signs
  signs: Sign[];
  addSign: (sign: Omit<Sign, 'id'>) => void;
  updateSign: (id: string, sign: Partial<Sign>) => void;
  deleteSign: (id: string) => void;
  importSigns: (signs: Sign[]) => void;
  
  // Questions
  questions: Question[];
  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, q: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  importQuestions: (questions: Question[]) => void;
  
  // Exams
  examResults: ExamResult[];
  addExamResult: (result: Omit<ExamResult, 'id'>) => void;
  
  // Mistakes
  mistakes: string[];
  addMistake: (questionId: string) => void;
  removeMistake: (questionId: string) => void;
  
  // Community
  posts: Post[];
  addPost: (content: string, imageUrl?: string) => void;
  updatePost: (id: string, content: string, imageUrl?: string) => void;
  deletePost: (id: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string, parentId?: string) => void;
  updateComment: (postId: string, commentId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  pinPost: (postId: string) => void;
  unpinPost: (postId: string) => void;
  
  // Glossary
  glossary: GlossaryItem[];
  
  // AI
  aiExplanation: string | null;
  explainQuestion: (questionId: string) => void;
  clearExplanation: () => void;
  
  // Progress
  getReadinessScore: () => number;
  getDailyPlan: () => { lessonsToday: number; questionsToday: number; signToday: string };
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Sample Sections
const sampleSections: LessonSection[] = [
  { id: 'sec1', name: 'إشارات المرور', icon: '🚦', imageUrl: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=250&fit=crop', order: 1 },
  { id: 'sec2', name: 'قواعد الطريق', icon: '📋', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop', order: 2 },
  { id: 'sec3', name: 'السلامة', icon: '🛡️', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop', order: 3 },
];

// Sample Data
const sampleLessons: Lesson[] = [
  {
    id: '1', title: 'إشارات المرور الضوئية', titleIt: 'Semaforo',
    category: 'إشارات', sectionId: 'sec1', content: 'الإشارة الضوئية (Semaforo) هي جهاز ينظم حركة المرور عند التقاطعات. الأحمر يعني قف تماماً، الأصفر يعني استعد للوقوف، والأخضر يعني يمكنك المرور بحذر.',
    example: 'عندما تكون الإشارة حمراء (Rosso) يجب أن تتوقف تماماً قبل خط الوقوف. إذا تجاوزتها ستحصل على مخالفة كبيرة.', order: 1
  },
  {
    id: '2', title: 'حدود السرعة', titleIt: 'Limiti di velocità',
    category: 'قواعد', sectionId: 'sec2', content: 'في إيطاليا توجد حدود سرعة محددة: داخل المدينة 50 كم/س، خارج المدينة 90 كم/س، الطريق السريع المزدوج 110 كم/س، الأوتوسترادا 130 كم/س.',
    example: 'إذا كنت تقود في مدينة روما، السرعة القصوى هي 50 كم/س. على الأوتوسترادا مثل A1 بين روما وميلانو، السرعة القصوى 130 كم/س.', order: 2
  },
  {
    id: '3', title: 'أولوية المرور', titleIt: 'Precedenza',
    category: 'قواعد', sectionId: 'sec2', content: 'الأولوية (Precedenza) تعني من يحق له المرور أولاً. القاعدة الأساسية: أعط الأولوية للقادم من يمينك إلا إذا كانت هناك إشارة تقول غير ذلك.',
    example: 'عند تقاطع بدون إشارات، إذا جاءت سيارة من يمينك يجب أن تتوقف وتتركها تمر أولاً.', order: 3
  },
  {
    id: '4', title: 'المسافة الآمنة', titleIt: 'Distanza di sicurezza',
    category: 'سلامة', sectionId: 'sec3', content: 'المسافة الآمنة (Distanza di sicurezza) هي المسافة التي يجب أن تتركها بينك وبين السيارة أمامك. تزداد كلما زادت السرعة أو كان الطريق مبللاً.',
    example: 'على سرعة 50 كم/س تحتاج مسافة 25 متر على الأقل. على سرعة 130 كم/س تحتاج أكثر من 100 متر.', order: 4
  },
  {
    id: '5', title: 'التجاوز', titleIt: 'Sorpasso',
    category: 'قواعد', sectionId: 'sec2', content: 'التجاوز (Sorpasso) يعني تخطي سيارة أمامك. يجب أن يتم من الجهة اليسرى فقط. ممنوع التجاوز عند المنعطفات والتقاطعات وممرات المشاة.',
    example: 'إذا أردت تجاوز شاحنة بطيئة، انظر في المرايا، أشر يساراً، تأكد أن الطريق خالٍ، ثم تجاوز من اليسار.', order: 5
  },
  {
    id: '6', title: 'الوقوف والتوقف', titleIt: 'Sosta e Fermata',
    category: 'قواعد', sectionId: 'sec2', content: 'التوقف (Fermata) هو وقوف مؤقت قصير. الوقوف (Sosta) هو ترك السيارة لفترة. هناك أماكن ممنوع فيها الوقوف مثل التقاطعات والمنحنيات.',
    example: 'الخط الأصفر على الرصيف يعني ممنوع الوقوف. الخط الأزرق يعني وقوف مدفوع. الخط الأبيض يعني وقوف مجاني.', order: 6
  },
  {
    id: '7', title: 'إشارات التحذير', titleIt: 'Segnali di pericolo',
    category: 'إشارات', sectionId: 'sec1', content: 'إشارات التحذير (Segnali di pericolo) تكون مثلثة الشكل برأسها للأعلى وحافتها حمراء. تنبهك لخطر قادم مثل منعطف أو تقاطع.',
    example: 'إذا رأيت مثلث أحمر مع رسمة منعطف، يعني أمامك منعطف خطر. أبطئ السرعة واستعد.', order: 7
  },
  {
    id: '8', title: 'حزام الأمان', titleIt: 'Cintura di sicurezza',
    category: 'سلامة', sectionId: 'sec3', content: 'حزام الأمان (Cintura di sicurezza) إجباري لجميع الركاب في المقاعد الأمامية والخلفية. عدم ربطه يعرضك لمخالفة مالية.',
    example: 'قبل تشغيل السيارة، تأكد أن جميع الركاب ربطوا أحزمة الأمان. هذا إجباري وليس اختياري.', order: 8
  },
];

const sampleSigns: Sign[] = [
  { id: '1', name: 'قف', nameIt: 'Stop', category: 'prohibition', description: 'يجب التوقف تماماً عند هذه الإشارة وإعطاء الأولوية لجميع السيارات', realExample: 'ستجد هذه الإشارة عند التقاطعات الخطرة. توقف تماماً حتى لو لم تكن هناك سيارات', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/STOP_sign.svg/200px-STOP_sign.svg.png' },
  { id: '2', name: 'ممنوع الدخول', nameIt: 'Divieto di accesso', category: 'prohibition', description: 'ممنوع دخول هذا الطريق من هذا الاتجاه', realExample: 'تراها عند مداخل الشوارع ذات الاتجاه الواحد من الجهة الخاطئة', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Italian_traffic_signs_-_divieto_di_accesso.svg/200px-Italian_traffic_signs_-_divieto_di_accesso.svg.png' },
  { id: '3', name: 'أعط الأولوية', nameIt: 'Dare precedenza', category: 'warning', description: 'يجب إبطاء السرعة وإعطاء الأولوية للسيارات القادمة', realExample: 'عند دخول دوار أو تقاطع فرعي مع طريق رئيسي', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Italian_traffic_signs_-_dare_precedenza.svg/200px-Italian_traffic_signs_-_dare_precedenza.svg.png' },
  { id: '4', name: 'ممنوع التجاوز', nameIt: 'Divieto di sorpasso', category: 'prohibition', description: 'ممنوع تجاوز أي سيارة في هذه المنطقة', realExample: 'على الطرق الجبلية والمنعطفات الخطرة حيث لا ترى الطريق أمامك', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Italian_traffic_signs_-_divieto_di_sorpasso.svg/200px-Italian_traffic_signs_-_divieto_di_sorpasso.svg.png' },
  { id: '5', name: 'حد السرعة 50', nameIt: 'Limite di velocità 50', category: 'prohibition', description: 'السرعة القصوى المسموحة هي 50 كم/ساعة', realExample: 'داخل المدن والقرى. هذه السرعة القصوى في المناطق السكنية', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Italian_traffic_signs_-_limite_di_velocit%C3%A0_50.svg/200px-Italian_traffic_signs_-_limite_di_velocit%C3%A0_50.svg.png' },
  { id: '6', name: 'طريق ذو أولوية', nameIt: 'Strada con diritto di precedenza', category: 'information', description: 'أنت على طريق له الأولوية على الطرق المتقاطعة', realExample: 'عندما ترى هذه الإشارة، السيارات من الشوارع الجانبية يجب أن تنتظرك', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Italian_traffic_signs_-_strada_con_diritto_di_precedenza.svg/200px-Italian_traffic_signs_-_strada_con_diritto_di_precedenza.svg.png' },
  { id: '7', name: 'ممر مشاة', nameIt: 'Attraversamento pedonale', category: 'warning', description: 'تنبيه: يوجد ممر مشاة قريب. أبطئ واستعد للتوقف', realExample: 'قرب المدارس والأسواق. يجب أن تتوقف إذا كان هناك شخص يريد العبور', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Italian_traffic_signs_-_attraversamento_pedonale.svg/200px-Italian_traffic_signs_-_attraversamento_pedonale.svg.png' },
  { id: '8', name: 'اتجاه إجباري يمين', nameIt: 'Direzione obbligatoria a destra', category: 'obligation', description: 'يجب الانعطاف يميناً. لا يمكنك الذهاب مباشرة أو يساراً', realExample: 'عند بعض التقاطعات حيث يكون الاتجاه الوحيد المسموح هو اليمين', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Italian_traffic_signs_-_direzione_obbligatoria_a_destra.svg/200px-Italian_traffic_signs_-_direzione_obbligatoria_a_destra.svg.png' },
  { id: '9', name: 'منطقة وقوف', nameIt: 'Parcheggio', category: 'information', description: 'يُسمح بالوقوف في هذه المنطقة', realExample: 'مواقف السيارات العامة والخاصة', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Italian_traffic_signs_-_parcheggio.svg/200px-Italian_traffic_signs_-_parcheggio.svg.png' },
  { id: '10', name: 'منحنى خطر', nameIt: 'Curva pericolosa', category: 'warning', description: 'تنبيه: منحنى خطر أمامك. أبطئ السرعة', realExample: 'على الطرق الجبلية حيث توجد منعطفات حادة', imageEmoji: '', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Italian_traffic_signs_-_curva_pericolosa_a_destra.svg/200px-Italian_traffic_signs_-_curva_pericolosa_a_destra.svg.png' },
];

const sampleQuestions: Question[] = [
  { id: '1', textIt: 'Il semaforo rosso obbliga a fermarsi.', textAr: 'الإشارة الحمراء تُلزمك بالتوقف.', answer: true, explanation: 'نعم، الإشارة الحمراء تعني التوقف الكامل وعدم تجاوز خط الوقوف.', category: 'إشارات', difficulty: 'easy', lessonId: '1' },
  { id: '2', textIt: 'Il limite di velocità in centro urbano è di 70 km/h.', textAr: 'حد السرعة داخل المدينة هو 70 كم/ساعة.', answer: false, explanation: 'خطأ! حد السرعة داخل المدينة (centro urbano) هو 50 كم/ساعة وليس 70.', category: 'قواعد', difficulty: 'easy', lessonId: '2' },
  { id: '3', textIt: 'Il sorpasso va effettuato a destra.', textAr: 'التجاوز يجب أن يتم من جهة اليمين.', answer: false, explanation: 'خطأ! التجاوز يجب أن يتم دائماً من جهة اليسار (sinistra) وليس اليمين.', category: 'قواعد', difficulty: 'easy', lessonId: '5' },
  { id: '4', textIt: 'La distanza di sicurezza deve aumentare con l\'aumentare della velocità.', textAr: 'المسافة الآمنة يجب أن تزداد كلما زادت السرعة.', answer: true, explanation: 'صحيح! كلما زادت سرعتك، تحتاج مسافة أكبر للتوقف، لذلك يجب زيادة المسافة الآمنة.', category: 'سلامة', difficulty: 'medium', lessonId: '4' },
  { id: '5', textIt: 'Il segnale di stop obbliga a fermarsi e dare la precedenza.', textAr: 'إشارة الوقوف تُلزمك بالتوقف وإعطاء الأولوية.', answer: true, explanation: 'صحيح! إشارة Stop تعني أنك يجب أن تتوقف تماماً وتعطي الأولوية لجميع السيارات.', category: 'إشارات', difficulty: 'easy', lessonId: '1' },
  { id: '6', textIt: 'È consentito superare i limiti di velocità in caso di emergenza.', textAr: 'يُسمح بتجاوز حدود السرعة في حالة الطوارئ.', answer: false, explanation: 'خطأ! لا يُسمح أبداً بتجاوز حدود السرعة حتى في حالات الطوارئ. فقط سيارات الطوارئ المرخصة يمكنها ذلك.', category: 'قواعد', difficulty: 'medium', lessonId: '2' },
  { id: '7', textIt: 'La patente di categoria B consente di guidare autoveicoli di massa complessiva non superiore a 3,5 t.', textAr: 'رخصة الفئة B تسمح بقيادة مركبات لا يزيد وزنها عن 3.5 طن.', answer: true, explanation: 'صحيح! رخصة B تسمح بقيادة السيارات حتى 3.5 طن ومع 8 ركاب كحد أقصى بالإضافة للسائق.', category: 'رخصة', difficulty: 'medium' },
  { id: '8', textIt: 'In autostrada il limite massimo di velocità è di 150 km/h.', textAr: 'على الأوتوسترادا الحد الأقصى للسرعة هو 150 كم/ساعة.', answer: false, explanation: 'خطأ! الحد الأقصى على الأوتوسترادا هو 130 كم/ساعة وليس 150.', category: 'قواعد', difficulty: 'medium', lessonId: '2' },
  { id: '9', textIt: 'Il conducente deve sempre allacciare la cintura di sicurezza.', textAr: 'يجب على السائق دائماً ربط حزام الأمان.', answer: true, explanation: 'صحيح! حزام الأمان إجباري لجميع الركاب في جميع المقاعد.', category: 'سلامة', difficulty: 'easy', lessonId: '8' },
  { id: '10', textIt: 'È vietato usare il telefono cellulare durante la guida senza dispositivo vivavoce.', textAr: 'ممنوع استخدام الهاتف أثناء القيادة بدون سماعة.', answer: true, explanation: 'صحيح! استخدام الهاتف باليد أثناء القيادة ممنوع. يمكنك فقط استخدام السماعة أو البلوتوث.', category: 'قواعد', difficulty: 'easy' },
  { id: '11', textIt: 'Si può parcheggiare in doppia fila.', textAr: 'يمكنك الوقوف في صف مزدوج.', answer: false, explanation: 'خطأ! الوقوف في صف مزدوج (doppia fila) ممنوع دائماً لأنه يعيق حركة المرور.', category: 'قواعد', difficulty: 'easy', lessonId: '6' },
  { id: '12', textIt: 'Il tasso alcolemico massimo consentito per i neopatentati è 0 g/l.', textAr: 'نسبة الكحول المسموحة للسائقين الجدد هي 0.', answer: true, explanation: 'صحيح! السائقون الجدد (أقل من 3 سنوات) يجب أن تكون نسبة الكحول صفر تماماً.', category: 'قواعد', difficulty: 'hard' },
  { id: '13', textIt: 'Il segnale triangolare con il vertice verso l\'alto indica pericolo.', textAr: 'الإشارة المثلثة برأسها للأعلى تشير إلى خطر.', answer: true, explanation: 'صحيح! المثلث برأسه للأعلى مع حافة حمراء يعني إشارة تحذير من خطر.', category: 'إشارات', difficulty: 'easy', lessonId: '7' },
  { id: '14', textIt: 'La precedenza a destra vale anche nelle rotatorie.', textAr: 'أولوية اليمين تسري أيضاً في الدوارات.', answer: false, explanation: 'خطأ! في الدوارات عادةً تكون الأولوية للسيارات داخل الدوار.', category: 'قواعد', difficulty: 'hard', lessonId: '3' },
  { id: '15', textIt: 'I pneumatici invernali sono obbligatori dal 15 novembre al 15 aprile.', textAr: 'الإطارات الشتوية إجبارية من 15 نوفمبر إلى 15 أبريل.', answer: true, explanation: 'صحيح! في العديد من الطرق الإيطالية، الإطارات الشتوية أو السلاسل إجبارية في هذه الفترة.', category: 'سلامة', difficulty: 'medium' },
  { id: '16', textIt: 'Il casco è obbligatorio solo per il conducente del motociclo.', textAr: 'الخوذة إجبارية فقط لسائق الدراجة النارية.', answer: false, explanation: 'خطأ! الخوذة إجبارية لكل من السائق والراكب على الدراجة النارية.', category: 'سلامة', difficulty: 'medium' },
  { id: '17', textIt: 'L\'ABS impedisce il bloccaggio delle ruote in frenata.', textAr: 'نظام ABS يمنع انغلاق العجلات عند الفرملة.', answer: true, explanation: 'صحيح! نظام ABS يمنع العجلات من الانغلاق عند الفرملة القوية مما يساعد في الحفاظ على السيطرة.', category: 'سلامة', difficulty: 'medium' },
  { id: '18', textIt: 'È consentito trasportare bambini senza seggiolino se il viaggio è breve.', textAr: 'يُسمح بنقل الأطفال بدون كرسي أطفال إذا كانت الرحلة قصيرة.', answer: false, explanation: 'خطأ! كرسي الأطفال إجباري دائماً بغض النظر عن طول الرحلة.', category: 'سلامة', difficulty: 'medium' },
  { id: '19', textIt: 'La strada extraurbana principale ha carreggiate separate.', textAr: 'الطريق الرئيسي خارج المدينة له مسارات منفصلة.', answer: true, explanation: 'صحيح! الطريق الرئيسي خارج المدينة يتميز بمسارات منفصلة وحد سرعة 110 كم/س.', category: 'قواعد', difficulty: 'hard' },
  { id: '20', textIt: 'Il conducente deve dare la precedenza ai pedoni sulle strisce pedonali.', textAr: 'يجب على السائق إعطاء الأولوية للمشاة على ممر المشاة.', answer: true, explanation: 'صحيح! يجب دائماً إعطاء الأولوية للمشاة عند ممرات المشاة المخططة.', category: 'قواعد', difficulty: 'easy', lessonId: '3' },
];

const sampleGlossary: GlossaryItem[] = [
  { id: '1', termIt: 'Semaforo', termAr: 'إشارة ضوئية', example: 'Il semaforo è rosso = الإشارة حمراء', category: 'إشارات' },
  { id: '2', termIt: 'Precedenza', termAr: 'أولوية المرور', example: 'Dare la precedenza = أعطِ الأولوية', category: 'قواعد' },
  { id: '3', termIt: 'Sorpasso', termAr: 'التجاوز', example: 'Divieto di sorpasso = ممنوع التجاوز', category: 'قواعد' },
  { id: '4', termIt: 'Velocità', termAr: 'السرعة', example: 'Limite di velocità = حد السرعة', category: 'قواعد' },
  { id: '5', termIt: 'Patente', termAr: 'رخصة القيادة', example: 'Patente di guida = رخصة القيادة', category: 'عام' },
  { id: '6', termIt: 'Conducente', termAr: 'السائق', example: 'Il conducente deve... = يجب على السائق...', category: 'عام' },
  { id: '7', termIt: 'Pedone', termAr: 'مشاة / ماشي', example: 'Attraversamento pedonale = ممر المشاة', category: 'عام' },
  { id: '8', termIt: 'Frenata', termAr: 'الفرملة', example: 'Spazio di frenata = مسافة الفرملة', category: 'سلامة' },
  { id: '9', termIt: 'Cintura di sicurezza', termAr: 'حزام الأمان', example: 'Allacciare la cintura = ربط الحزام', category: 'سلامة' },
  { id: '10', termIt: 'Incrocio', termAr: 'تقاطع', example: 'Incrocio pericoloso = تقاطع خطر', category: 'طريق' },
  { id: '11', termIt: 'Curva', termAr: 'منعطف / منحنى', example: 'Curva pericolosa = منعطف خطر', category: 'طريق' },
  { id: '12', termIt: 'Autostrada', termAr: 'أوتوسترادا / طريق سريع', example: 'Entrare in autostrada = الدخول للأوتوسترادا', category: 'طريق' },
  { id: '13', termIt: 'Divieto', termAr: 'ممنوع / حظر', example: 'Divieto di sosta = ممنوع الوقوف', category: 'إشارات' },
  { id: '14', termIt: 'Obbligo', termAr: 'إجباري / واجب', example: 'Obbligo di catene = سلاسل إجبارية', category: 'إشارات' },
  { id: '15', termIt: 'Pneumatico', termAr: 'إطار / عجلة', example: 'Pneumatici invernali = إطارات شتوية', category: 'سلامة' },
  { id: '16', termIt: 'Rotatoria', termAr: 'دوّار', example: 'Precedenza in rotatoria = أولوية في الدوار', category: 'طريق' },
  { id: '17', termIt: 'Sosta', termAr: 'وقوف / ركن', example: 'Divieto di sosta = ممنوع الوقوف', category: 'قواعد' },
  { id: '18', termIt: 'Fermata', termAr: 'توقف مؤقت', example: 'Fermata dell\'autobus = موقف الباص', category: 'قواعد' },
  { id: '19', termIt: 'Multa', termAr: 'مخالفة / غرامة', example: 'Prendere una multa = أخذ مخالفة', category: 'عام' },
  { id: '20', termIt: 'Casco', termAr: 'خوذة', example: 'Il casco è obbligatorio = الخوذة إجبارية', category: 'سلامة' },
];

const samplePosts: Post[] = [
  {
    id: '1', userId: 'user1', userName: 'أحمد', content: 'مرحباً بالجميع! أنا جديد هنا وبدأت التحضير لامتحان الباتينتي. هل عندكم نصائح؟',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), likes: ['user2'], pinned: true, reports: [], comments: [
      { id: 'c1', userId: 'user2', userName: 'سارة', content: 'أهلاً أحمد! نصيحتي ركز على حفظ إشارات المرور أولاً ثم القواعد. بالتوفيق!', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ]
  },
  {
    id: '2', userId: 'user2', userName: 'سارة', content: 'اليوم نجحت في الامتحان التجريبي بنسبة 90%! التطبيق ساعدني كثيراً في فهم الأسئلة بالإيطالي.',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    createdAt: new Date(Date.now() - 86400000).toISOString(), likes: ['user1', 'user3'], reports: [], comments: []
  },
  {
    id: '3', userId: 'user3', userName: 'محمد', content: 'سؤال: ما الفرق بين Sosta و Fermata؟ دائماً أخلط بينهم في الامتحان',
    createdAt: new Date().toISOString(), likes: [], reports: [], comments: [
      { id: 'c2', userId: 'user1', userName: 'أحمد', content: 'Fermata = توقف قصير (مثل إنزال شخص)\nSosta = وقوف طويل (مثل ركن السيارة)', createdAt: new Date().toISOString() }
    ]
  },
];

const storedPasswords: Record<string, string> = {
  'admin@patente.com': 'admin123',
};

const storedUsers: User[] = [
  { id: 'admin', name: 'المدير', email: 'admin@patente.com', role: 'admin', createdAt: new Date().toISOString() },
  { id: 'user1', name: 'أحمد', email: 'ahmed@test.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'user2', name: 'سارة', email: 'sara@test.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'user3', name: 'محمد', email: 'mohammed@test.com', role: 'user', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
];

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: (email: string, password: string) => {
    const stored = storedPasswords[email];
    if (stored && stored === password) {
      const u = storedUsers.find(u => u.email === email);
      if (u && !u.banned) {
        set({ user: u, isAuthenticated: true });
        return true;
      }
    }
    const allUsers = get().users;
    const found = allUsers.find(u => u.email === email);
    if (found && !found.banned && storedPasswords[email] === password) {
      set({ user: found, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: (name: string, email: string, password: string) => {
    const allUsers = get().users;
    if (allUsers.find(u => u.email === email) || storedPasswords[email]) return false;
    const newUser: User = { id: generateId(), name, email, role: 'user', createdAt: new Date().toISOString() };
    storedPasswords[email] = password;
    storedUsers.push(newUser);
    set({ users: [...allUsers, newUser], user: newUser, isAuthenticated: true });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (data) => set(s => {
    if (!s.user) return {};
    const updated = { ...s.user, ...data };
    return { user: updated, users: s.users.map(u => u.id === updated.id ? updated : u) };
  }),

  // Users
  users: storedUsers,
  banUser: (userId) => set(s => ({ users: s.users.map(u => u.id === userId ? { ...u, banned: true } : u) })),
  unbanUser: (userId) => set(s => ({ users: s.users.map(u => u.id === userId ? { ...u, banned: false } : u) })),
  deleteUser: (userId) => set(s => ({ users: s.users.filter(u => u.id !== userId) })),

  // Sections
  sections: sampleSections,
  addSection: (section) => set(s => ({ sections: [...s.sections, { ...section, id: generateId() }] })),
  updateSection: (id, data) => set(s => ({ sections: s.sections.map(sec => sec.id === id ? { ...sec, ...data } : sec) })),
  deleteSection: (id) => set(s => ({ sections: s.sections.filter(sec => sec.id !== id) })),

  // Lessons
  lessons: sampleLessons,
  completedLessons: [],
  completeLesson: (id) => set(s => ({ completedLessons: [...new Set([...s.completedLessons, id])] })),
  addLesson: (lesson) => set(s => ({ lessons: [...s.lessons, { ...lesson, id: generateId() }] })),
  updateLesson: (id, data) => set(s => ({ lessons: s.lessons.map(l => l.id === id ? { ...l, ...data } : l) })),
  deleteLesson: (id) => set(s => ({ lessons: s.lessons.filter(l => l.id !== id) })),
  importLessons: (imported) => set(s => ({ lessons: [...s.lessons, ...imported.map(l => ({ ...l, id: generateId() }))] })),

  // Signs
  signs: sampleSigns,
  addSign: (sign) => set(s => ({ signs: [...s.signs, { ...sign, id: generateId() }] })),
  updateSign: (id, data) => set(s => ({ signs: s.signs.map(sg => sg.id === id ? { ...sg, ...data } : sg) })),
  deleteSign: (id) => set(s => ({ signs: s.signs.filter(sg => sg.id !== id) })),
  importSigns: (imported) => set(s => ({ signs: [...s.signs, ...imported.map(sg => ({ ...sg, id: generateId() }))] })),

  // Questions
  questions: sampleQuestions,
  addQuestion: (q) => set(s => ({ questions: [...s.questions, { ...q, id: generateId() }] })),
  updateQuestion: (id, data) => set(s => ({ questions: s.questions.map(q => q.id === id ? { ...q, ...data } : q) })),
  deleteQuestion: (id) => set(s => ({ questions: s.questions.filter(q => q.id !== id) })),
  importQuestions: (imported) => set(s => ({ questions: [...s.questions, ...imported.map(q => ({ ...q, id: generateId() }))] })),

  // Exams
  examResults: [],
  addExamResult: (result) => set(s => ({ examResults: [...s.examResults, { ...result, id: generateId() }] })),

  // Mistakes
  mistakes: [],
  addMistake: (qId) => set(s => ({ mistakes: [...new Set([...s.mistakes, qId])] })),
  removeMistake: (qId) => set(s => ({ mistakes: s.mistakes.filter(m => m !== qId) })),

  // Community
  posts: samplePosts,
  addPost: (content, imageUrl) => {
    const user = get().user;
    if (!user) return;
    const newPost: Post = { id: generateId(), userId: user.id, userName: user.name, userAvatar: user.avatar, content, imageUrl, createdAt: new Date().toISOString(), likes: [], comments: [], reports: [] };
    set(s => ({ posts: [newPost, ...s.posts] }));
  },
  updatePost: (id, content, imageUrl) => set(s => ({ posts: s.posts.map(p => p.id === id ? { ...p, content, ...(imageUrl !== undefined ? { imageUrl } : {}) } : p) })),
  deletePost: (id) => set(s => ({ posts: s.posts.filter(p => p.id !== id) })),
  likePost: (postId) => {
    const user = get().user;
    if (!user) return;
    set(s => ({
      posts: s.posts.map(p => {
        if (p.id !== postId) return p;
        const liked = p.likes.includes(user.id);
        return { ...p, likes: liked ? p.likes.filter(l => l !== user.id) : [...p.likes, user.id] };
      })
    }));
  },
  addComment: (postId, content, parentId) => {
    const user = get().user;
    if (!user) return;
    const comment: Comment = { id: generateId(), userId: user.id, userName: user.name, content, createdAt: new Date().toISOString(), parentId };
    set(s => ({ posts: s.posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p) }));
  },
  updateComment: (postId, commentId, content) => set(s => ({
    posts: s.posts.map(p => p.id === postId ? { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, content } : c) } : p)
  })),
  deleteComment: (postId, commentId) => set(s => ({
    posts: s.posts.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p)
  })),
  reportPost: (postId, reason) => {
    const user = get().user;
    if (!user) return;
    const report: Report = { id: generateId(), userId: user.id, userName: user.name, reason, createdAt: new Date().toISOString() };
    set(s => ({ posts: s.posts.map(p => p.id === postId ? { ...p, reported: true, reports: [...(p.reports || []), report] } : p) }));
  },
  pinPost: (postId) => set(s => ({ posts: s.posts.map(p => p.id === postId ? { ...p, pinned: true } : p) })),
  unpinPost: (postId) => set(s => ({ posts: s.posts.map(p => p.id === postId ? { ...p, pinned: false } : p) })),

  // Glossary
  glossary: sampleGlossary,

  // AI
  aiExplanation: null,
  explainQuestion: (questionId) => {
    const q = get().questions.find(q => q.id === questionId);
    if (!q) return;
    const explanation = `المدرب الذكي يشرح لك:\n\nالسؤال بالإيطالي:\n"${q.textIt}"\n\nالترجمة العربية:\n"${q.textAr}"\n\nالإجابة الصحيحة: ${q.answer ? 'صح (Vero)' : 'غلط (Falso)'}\n\nالشرح المبسط:\n${q.explanation}\n\nكلمات مهمة في السؤال:\n${q.textIt.split(' ').filter(w => w.length > 3).slice(0, 5).map(w => `• ${w}`).join('\n')}\n\nنصيحة للحفظ:\nحاول تقرأ السؤال بالإيطالي ببطء وتربط الكلمات اللي تعرفها بالمعنى العربي.`;
    set({ aiExplanation: explanation });
  },
  clearExplanation: () => set({ aiExplanation: null }),

  // Progress
  getReadinessScore: () => {
    const state = get();
    const lessonScore = (state.completedLessons.length / Math.max(state.lessons.length, 1)) * 30;
    const examResults = state.examResults;
    const examScore = examResults.length > 0 ? (examResults.slice(-3).reduce((sum, e) => sum + (e.score / e.total), 0) / Math.min(examResults.length, 3)) * 50 : 0;
    const mistakeRatio = state.mistakes.length > 0 ? Math.max(0, 20 - (state.mistakes.length * 2)) : 20;
    return Math.min(100, Math.round(lessonScore + examScore + mistakeRatio));
  },
  getDailyPlan: () => {
    const state = get();
    const remainingLessons = state.lessons.length - state.completedLessons.length;
    return {
      lessonsToday: Math.min(2, remainingLessons),
      questionsToday: 10,
      signToday: state.signs[Math.floor(Math.random() * state.signs.length)]?.name || 'قف'
    };
  },
}));
