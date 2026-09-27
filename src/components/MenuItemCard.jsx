import React from 'react';
import { Plus } from 'lucide-react';

export default function MenuItemCard({ item, onAddToCart, formatRupiah }) {
  const isOutOfStock = !item.is_available || (item.stock_quantity !== undefined && item.stock_quantity <= 0);

  return (
    <div className={`bg-white rounded-2xl border-2 border-zinc-950 p-3 flex gap-3 transition hover:translate-x-0.5 hover:-translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] ${
      isOutOfStock ? 'opacity-50 grayscale' : ''
    }`}>
      <img 
        src={item.image_url || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'} 
        alt={item.name}
        className="w-20 h-20 sm:w-22 sm:h-22 object-cover rounded-xl bg-zinc-100 border-2 border-zinc-950 flex-shrink-0"
      />

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-black text-zinc-950 text-xs sm:text-sm truncate uppercase tracking-tight leading-tight">
              {item.name}
            </h3>
            {item.is_popular && (
              <span className="bg-[#FF4500] text-white text-[8px] font-black px-1.5 py-0.5 rounded border border-zinc-950 uppercase flex-shrink-0">
                FAVORIT
              </span>
            )}
          </div>
          <p className="text-zinc-600 text-[10px] sm:text-[11px] font-semibold leading-tight line-clamp-2 mt-1">
            {item.description || 'Racikan khas Medium Brewspace.'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-zinc-100 gap-2">
          <span className="font-black text-zinc-950 text-xs sm:text-sm tracking-tight truncate">
            {formatRupiah(item.price)}
          </span>

          {!isOutOfStock ? (
            <button
              onClick={() => onAddToCart(item)}
              className="px-2.5 py-1.5 bg-[#0052FF] hover:bg-zinc-950 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition flex items-center gap-1 border-2 border-zinc-950 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]"/>
              Order
            </button>
          ) : (
            <span className="text-[9px] font-black text-zinc-500 bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded uppercase flex-shrink-0">
              Habis
            </span>
          )}
        </div>
      </div>
    </div>
  );
}