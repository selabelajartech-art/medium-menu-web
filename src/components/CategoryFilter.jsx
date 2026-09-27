import React from 'react';
import { Utensils } from 'lucide-react';

export default function CategoryFilter({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="bg-white border-b border-slate-200 py-2.5 sticky top-[105px] z-20 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase transition whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-[#0052FF] text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 stroke-[2.5]"/>
          Semua
        </button>

        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#0052FF] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}