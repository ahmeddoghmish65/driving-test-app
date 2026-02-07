import { useState } from 'react';
import { useStore } from '../store/useStore';
import { IconArrowRight, IconBook, IconLightbulb, IconImage } from '../components/Icons';

const categoryNames: Record<string, string> = {
  warning: 'تحذيرية',
  prohibition: 'منع',
  obligation: 'إجبارية',
  information: 'إرشادية',
};

const categoryStyles: Record<string, { bg: string; border: string; badge: string }> = {
  warning: { bg: 'bg-pastel-orange', border: 'border-orange-100', badge: 'bg-orange-100 text-orange-700' },
  prohibition: { bg: 'bg-pastel-pink', border: 'border-red-100', badge: 'bg-red-100 text-red-700' },
  obligation: { bg: 'bg-pastel-blue', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700' },
  information: { bg: 'bg-pastel-green', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' },
};

export function SignsPage() {
  const { signs } = useStore();
  const [filter, setFilter] = useState<string>('all');
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  const categories = [...new Set(signs.map(s => s.category))];
  const filtered = filter === 'all' ? signs : signs.filter(s => s.category === filter);
  const sign = signs.find(s => s.id === selectedSign);

  if (sign) {
    const styles = categoryStyles[sign.category];
    return (
      <div className="px-5 space-y-4 animate-fade-in">
        <button onClick={() => setSelectedSign(null)} className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-dark transition-colors">
          <span className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
            <IconArrowRight size={14} />
          </span>
          <span>العودة للإشارات</span>
        </button>
        
        <div className="bg-white rounded-3xl border border-border-light overflow-hidden shadow-card">
          <div className={`${styles.bg} ${styles.border} border-b py-12 flex items-center justify-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30" />
            {sign.imageUrl ? (
              <img src={sign.imageUrl} alt={sign.name} className="w-32 h-32 object-contain relative z-10 animate-float" />
            ) : (
              <div className="w-32 h-32 bg-white/30 rounded-3xl flex items-center justify-center relative z-10">
                <IconImage size={40} className="text-text-muted" />
              </div>
            )}
          </div>
          
          <div className="p-5 space-y-4">
            <div className="text-center">
              <span className={`inline-flex text-[11px] ${styles.badge} px-4 py-1.5 rounded-full font-bold`}>
                {categoryNames[sign.category]}
              </span>
              <h2 className="text-xl font-extrabold text-text mt-3">{sign.name}</h2>
              <p className="text-sm text-primary font-bold mt-1" dir="ltr">{sign.nameIt}</p>
            </div>

            <div className="bg-pastel-blue rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <IconBook size={16} className="text-blue-600" />
                <p className="text-xs font-bold text-blue-700">الشرح</p>
              </div>
              <p className="text-[13px] text-text leading-8">{sign.description}</p>
            </div>

            <div className="bg-pastel-orange rounded-2xl p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <IconLightbulb size={16} className="text-orange-600" />
                <p className="text-xs font-bold text-orange-700">مثال واقعي</p>
              </div>
              <p className="text-[13px] text-orange-800 leading-8">{sign.realExample}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 space-y-4 animate-fade-in">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
            filter === 'all' ? 'gradient-primary text-white shadow-primary-glow/30' : 'bg-white text-text-secondary border border-border-light hover:shadow-card'
          }`}>
          الكل
        </button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              filter === cat ? 'gradient-primary text-white shadow-primary-glow/30' : 'bg-white text-text-secondary border border-border-light hover:shadow-card'
            }`}>
            {categoryNames[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((s, i) => {
          const styles = categoryStyles[s.category];
          return (
            <button key={s.id} onClick={() => setSelectedSign(s.id)}
              className={`${styles.bg} ${styles.border} border rounded-2xl p-5 text-center hover:shadow-card-hover transition-all active:scale-[0.97] shadow-card animate-fade-in stagger-${(i % 6) + 1}`}>
              {s.imageUrl ? (
                <img src={s.imageUrl} alt={s.name} className="w-16 h-16 object-contain mx-auto mb-3" />
              ) : (
                <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <IconImage size={24} className="text-text-muted" />
                </div>
              )}
              <h3 className="font-bold text-text text-sm">{s.name}</h3>
              <p className="text-[10px] text-text-secondary mt-1 font-medium" dir="ltr">{s.nameIt}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
