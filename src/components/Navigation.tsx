import type { PageType } from '../App';
import { IconHome, IconBook, IconPen, IconChat, IconUser } from './Icons';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'الرئيسية', icon: <IconHome size={20} /> },
  { id: 'lessons', label: 'الدروس', icon: <IconBook size={20} /> },
  { id: 'quiz', label: 'تدريب', icon: <IconPen size={20} /> },
  { id: 'community', label: 'المجتمع', icon: <IconChat size={20} /> },
  { id: 'profile', label: 'حسابي', icon: <IconUser size={20} /> },
];

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 w-full max-w-md z-50">
      <div className="mx-4 mb-4">
        <div className="bg-white rounded-3xl shadow-card-hover border border-border-light px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center py-2.5 px-3 rounded-2xl transition-all duration-300 relative ${
                    isActive ? 'bg-primary-50' : 'hover:bg-surface'
                  }`}
                >
                  <div className={`mb-1 transition-all duration-300 ${
                    isActive ? 'text-primary scale-110' : 'text-text-muted'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-[9px] font-bold tracking-tight transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -top-0.5 w-5 h-1 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
