import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, totalPrice, formatRupiah }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-5 border-l-4 border-zinc-950">
        <div>
          <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-900">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#0052FF] text-white rounded-md">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]"/>
              </div>
              <h2 className="font-black text-zinc-900 text-base uppercase tracking-tight">RINGKASAN ORDER</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-md bg-zinc-100 text-zinc-600 hover:bg-zinc-200 font-bold">
              <X className="w-4 h-4 stroke-[3]"/>
            </button>
          </div>

          <div className="py-4 space-y-3 max-h-[65vh] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Keranjang masih kosong.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                  <img src={item.imageUrl || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'} alt="" className="w-12 h-12 rounded-md object-cover border border-zinc-200" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-zinc-900 text-xs truncate uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[#0052FF] font-black text-[11px]">{formatRupiah(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-zinc-300">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-zinc-600 hover:text-zinc-950">
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-600"/> : <Minus className="w-3.5 h-3.5 stroke-[3]"/>}
                    </button>
                    <span className="text-xs font-black min-w-[16px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-zinc-600 hover:text-zinc-950">
                      <Plus className="w-3.5 h-3.5 stroke-[3]"/>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="pt-4 border-t-2 border-zinc-900 space-y-3">
            <div className="flex justify-between items-center text-zinc-900">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Bayar</span>
              <span className="text-xl font-black text-[#0052FF]">{formatRupiah(totalPrice)}</span>
            </div>
            <button 
              onClick={() => alert('Pesanan berhasil dibuat!')}
              className="w-full bg-[#CCFF00] hover:bg-[#FF4500] hover:text-white text-zinc-950 py-3.5 rounded-lg font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              KIRIM PESANAN SEKARANG
              <ArrowRight className="w-4 h-4 stroke-[3]"/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}