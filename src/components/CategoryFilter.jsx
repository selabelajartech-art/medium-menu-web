import React from 'react';
import { Utensils } from 'lucide-react';

export default function CategoryFilter({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="bg-zinc-900 text-white py-2.5 sticky top-[108px] z-20 border-b-2 border-zinc-950 shadow-sm">
      <div className="max-w-3xl mx-auto px-3.5 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase transition whitespace-nowrap border-2 border-zinc-950 ${
            activeCategory === 'all'
              ? 'bg-[#CCFF00] text-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase transition whitespace-nowrap border-2 border-zinc-950 ${
                isActive
                  ? 'bg-[#CCFF00] text-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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