import React from 'react';
import { Plus } from 'lucide-react';

export default function MenuItemCard({ item, onAddToCart, formatRupiah }) {
  const isOutOfStock = !item.is_available || (item.stock_quantity !== undefined && item.stock_quantity <= 0);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-3 flex gap-3 transition hover:border-slate-400 shadow-xs ${
      isOutOfStock ? 'opacity-50 grayscale' : ''
    }`}>
      <img 
        src={item.image_url || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'} 
        alt={item.name}
        className="w-20 h-20 sm:w-22 sm:h-22 object-cover rounded-xl bg-slate-100 flex-shrink-0 border border-slate-100"
      />

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-black text-slate-900 text-xs sm:text-sm truncate uppercase tracking-tight leading-tight">
              {item.name}
            </h3>
            {item.is_popular && (
              <span className="bg-[#FF4500] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0">
                FAVORIT
              </span>
            )}
          </div>
          <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium leading-tight line-clamp-2 mt-1">
            {item.description || 'Racikan khas Medium Brewspace.'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 gap-2">
          <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight truncate">
            {formatRupiah(item.price)}
          </span>

          {!isOutOfStock ? (
            <button
              onClick={() => onAddToCart(item)}
              className="px-2.5 py-1.5 bg-[#0052FF] hover:bg-slate-900 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition flex items-center gap-1 active:scale-95 flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]"/>
              Order
            </button>
          ) : (
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase flex-shrink-0">
              Habis
            </span>
          )}
        </div>
      </div>
    </div>
  );
}