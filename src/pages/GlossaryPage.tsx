import { useState } from 'react';
import { useStore } from '../store/useStore';

export function GlossaryPage() {
  const { glossary } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const categories = [...new Set(glossary.map(g => g.category))];

  const filtered = glossary.filter(g => {
    const matchSearch = search === '' || 
      g.termIt.toLowerCase().includes(search.toLowerCase()) ||
      g.termAr.includes(search);
    const matchCategory = filter === 'all' || g.category === filter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="px-5 space-y-4 animate-fade-in">
      <p className="text-sm text-text-secondary font-medium">📚 أهم المصطلحات في امتحان القيادة</p>

      {/* Search */}
      <div className="relative">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ابحث بالعربي أو الإيطالي..."
          className="w-full px-4 py-4 pr-12 rounded-2xl border border-border bg-white focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 text-sm transition-all shadow-card" />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-lg">🔍</span>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
            filter === 'all' ? 'gradient-primary text-white shadow-primary-glow/30' : 'bg-white text-text-secondary border border-border-light'
          }`}>
          الكل ({glossary.length})
        </button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              filter === cat ? 'gradient-primary text-white shadow-primary-glow/30' : 'bg-white text-text-secondary border border-border-light'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Words */}
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <div key={item.id} className={`bg-white rounded-2xl border border-border-light p-5 shadow-card hover:shadow-card-hover transition-all animate-fade-in stagger-${(i % 6) + 1}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-extrabold text-primary text-lg" dir="ltr">{item.termIt}</p>
                <p className="font-bold text-text text-base mt-1">{item.termAr}</p>
              </div>
              <span className="text-[10px] bg-surface px-3 py-1.5 rounded-full text-text-muted font-bold border border-border-light">{item.category}</span>
            </div>
            <div className="bg-pastel-blue rounded-xl p-3.5 border border-blue-100">
              <p className="text-[12px] text-blue-800 leading-6 font-medium">💡 {item.example}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4 opacity-30">🔍</span>
          <p className="text-text-secondary text-base font-bold">لم يتم العثور على نتائج</p>
          <p className="text-text-muted text-xs mt-1 font-medium">جرب كلمة بحث مختلفة</p>
        </div>
      )}
    </div>
  );
}
