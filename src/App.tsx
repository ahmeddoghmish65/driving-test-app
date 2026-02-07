import { useState } from 'react';
import { useStore } from './store/useStore';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { LessonsPage } from './pages/LessonsPage';
import { SignsPage } from './pages/SignsPage';
import { QuizPage } from './pages/QuizPage';
import { ExamSimulator } from './pages/ExamSimulator';
import { GlossaryPage } from './pages/GlossaryPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProgressPage } from './pages/ProgressPage';
import { MistakesPage } from './pages/MistakesPage';
import { AdminPanel } from './pages/AdminPanel';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { Navigation } from './components/Navigation';
import { IconSettings, IconArrowRight } from './components/Icons';

export type PageType = 'home' | 'lessons' | 'signs' | 'quiz' | 'exam' | 'glossary' | 'community' | 'progress' | 'mistakes' | 'admin' | 'auth' | 'profile';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [showLanding, setShowLanding] = useState(true);
  const { isAuthenticated, user } = useStore();

  if (showLanding && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthPage onBack={() => setShowLanding(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'lessons': return <LessonsPage />;
      case 'signs': return <SignsPage />;
      case 'quiz': return <QuizPage />;
      case 'exam': return <ExamSimulator />;
      case 'glossary': return <GlossaryPage />;
      case 'community': return <CommunityPage />;
      case 'progress': return <ProgressPage />;
      case 'mistakes': return <MistakesPage />;
      case 'profile': return <ProfilePage onNavigate={setCurrentPage} />;
      case 'admin': return user?.email === 'admin@patente.com' ? <AdminPanel /> : <HomePage onNavigate={setCurrentPage} />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home': return '';
      case 'lessons': return 'الدروس';
      case 'signs': return 'الإشارات';
      case 'quiz': return 'التدريب';
      case 'exam': return 'الامتحان التجريبي';
      case 'glossary': return 'القاموس';
      case 'community': return 'المجتمع';
      case 'progress': return 'تقدمي';
      case 'mistakes': return 'أخطائي';
      case 'profile': return 'حسابي';
      case 'admin': return 'لوحة التحكم';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-md min-h-screen bg-bg relative">
        {/* Header */}
        {currentPage === 'home' ? (
          <header className="px-5 pt-6 pb-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-primary-glow/40">
                  <span className="text-white text-xl font-extrabold">P</span>
                </div>
                <div>
                  <p className="text-text-secondary text-xs font-medium">مرحباً بك</p>
                  <h1 className="font-bold text-lg text-text leading-tight">{user?.name}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user?.email === 'admin@patente.com' && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className="w-10 h-10 bg-pastel-orange rounded-2xl flex items-center justify-center hover:shadow-card transition-all"
                  >
                    <IconSettings size={18} className="text-orange-600" />
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage('profile')}
                  className="w-11 h-11 gradient-primary rounded-2xl flex items-center justify-center text-sm font-bold text-white shadow-sm active:scale-95 transition-transform"
                >
                  {user?.name?.charAt(0) || '؟'}
                </button>
              </div>
            </div>
          </header>
        ) : (
          <header className="px-5 pt-6 pb-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-card border border-border-light hover:shadow-card-hover transition-all active:scale-95"
                >
                  <IconArrowRight size={16} className="text-text" />
                </button>
                <h1 className="font-bold text-xl text-text">{getPageTitle()}</h1>
              </div>
              <div className="flex items-center gap-2">
                {user?.email === 'admin@patente.com' && currentPage !== 'admin' && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className="w-10 h-10 bg-pastel-orange rounded-2xl flex items-center justify-center"
                  >
                    <IconSettings size={18} className="text-orange-600" />
                  </button>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <main className="pb-28 pt-2">
          {renderPage()}
        </main>

        {/* Navigation */}
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
    </div>
  );
}
