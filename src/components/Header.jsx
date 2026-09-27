import React from 'react';
import { ShoppingBag, Settings, Search } from 'lucide-react';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  onOpenAdmin, 
  searchQuery, 
  setSearchQuery,
  logoUrl = "/logo.png"
}) {
  return (
    <header className="bg-[#0052FF] text-white sticky top-0 z-30 border-b-2 border-zinc-950 shadow-md">
      <div className="max-w-3xl mx-auto px-3.5 pt-3 pb-2.5 flex items-center justify-between gap-2">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=mediumbrew";
              }}
            />
          </div>

          <div className="min-w-0">
            <span className="bg-[#CCFF00] text-zinc-950 font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded border border-zinc-950 tracking-widest uppercase">
              EST. 2026
            </span>
            <h1 className="text-sm sm:text-lg font-black tracking-tight uppercase leading-tight truncate mt-0.5">
              MEDIUM BREWSPACE<span className="text-[#CCFF00]">.</span>
            </h1>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={onOpenAdmin}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-950 hover:bg-white hover:text-zinc-950 text-white transition font-black text-xs flex items-center gap-1.5 border-2 border-zinc-950 active:translate-x-0.5 active:translate-y-0.5"
            title="Admin"
          >
            <Settings className="w-4 h-4 stroke-[2.5]"/>
            <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Admin</span>
          </button>

          <button 
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-[#CCFF00] text-zinc-950 hover:bg-white transition font-black border-2 border-zinc-950 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]"/>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF4500] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-3xl mx-auto px-3.5 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200"/>
          <input
            type="text"
            placeholder="Cari racikan kopi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-blue-700/80 placeholder-blue-200 text-white text-xs font-bold rounded-xl border-2 border-zinc-950 focus:outline-none focus:bg-zinc-950 focus:border-[#CCFF00] transition"
          />
        </div>
      </div>
    </header>
  );
}