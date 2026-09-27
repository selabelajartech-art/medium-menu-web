import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, totalPrice, formatRupiah }) {
  const [tableNumber, setTableNumber] = useState('');
  const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || "6281234567890";

  if (!isOpen) return null;

  const handleCheckoutWA = () => {
    if (cart.length === 0) return;

    let message = `*HALO MEDIUM BREWSPACE!* ☕\n`;
    message += `Saya ingin memesan menu berikut:\n`;
    if (tableNumber.trim()) {
      message += `📍 *Nomor Meja:* ${tableNumber.trim()}\n`;
    }
    message += `-----------------------------------\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (${item.quantity}x) = ${formatRupiah(item.price * item.quantity)}\n`;
    });

    message += `-----------------------------------\n`;
    message += `*TOTAL BAYAR:* ${formatRupiah(totalPrice)}\n\n`;
    message += `Mohon konfirmasi pesanan saya, terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 flex justify-end font-sans">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-4 sm:p-5 border-l-4 border-zinc-950 shadow-2xl">
        
        {/* Header Drawer */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-950">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#0052FF] text-white rounded-lg border border-zinc-950">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]"/>
              </div>
              <h2 className="font-black text-zinc-950 text-sm sm:text-base uppercase tracking-tight">RINGKASAN ORDER</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-zinc-100 border border-zinc-950 text-zinc-950 hover:bg-zinc-200 font-black">
              <X className="w-4 h-4 stroke-[3]"/>
            </button>
          </div>

          {/* Nomor Meja */}
          <div className="mt-3.5">
            <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-700 mb-1">
              Nomor Meja (Opsional)
            </label>
            <input 
              type="text" 
              placeholder="Contoh: Meja 04"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border-2 border-zinc-950 rounded-xl text-xs font-bold text-zinc-950 focus:outline-none focus:border-[#0052FF]"
            />
          </div>

          {/* List Cart Items */}
          <div className="py-3.5 space-y-2.5 max-h-[55vh] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400 text-xs font-black uppercase tracking-wider">Keranjang belanja kosong.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2.5 bg-zinc-50 p-2.5 rounded-xl border-2 border-zinc-950">
                  <img 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'} 
                    alt="" 
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-950 flex-shrink-0" 
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-zinc-950 text-xs truncate uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[#0052FF] font-black text-[11px]">{formatRupiah(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-zinc-950 flex-shrink-0">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5 text-zinc-700 hover:text-zinc-950">
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-600"/> : <Minus className="w-3.5 h-3.5 stroke-[3]"/>}
                    </button>
                    <span className="text-xs font-black min-w-[16px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5 text-zinc-700 hover:text-zinc-950">
                      <Plus className="w-3.5 h-3.5 stroke-[3]"/>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="pt-3.5 border-t-2 border-zinc-950 space-y-3">
            <div className="flex justify-between items-center text-zinc-950">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Total Pembayaran</span>
              <span className="text-base sm:text-lg font-black text-[#0052FF]">{formatRupiah(totalPrice)}</span>
            </div>

            <button 
              onClick={handleCheckoutWA}
              className="w-full bg-[#CCFF00] hover:bg-[#FF4500] hover:text-white text-zinc-950 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 border-2 border-zinc-950 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              KIRIM PESANAN VIA WHATSAPP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}