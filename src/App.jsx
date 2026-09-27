import React, { useState, useMemo } from 'react';
import { Loader2, ChevronRight } from 'lucide-react';
import { useMenuData } from './hooks/useMenuData';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import MenuItemCard from './components/MenuItemCard';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState('public');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { 
    categories, 
    menuItems, 
    loading, 
    cart, 
    cartTotalCount, 
    cartTotalPrice, 
    addToCart, 
    updateQuantity, 
    refreshData 
  } = useMenuData();

  const filteredMenu = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category_id === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  if (view === 'admin') {
    return <AdminDashboard onBackToPublic={() => { setView('public'); refreshData(); }} />;
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950 font-sans pb-24">
      {/* Header */}
      <Header 
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setView('admin')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Filter Kategori */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        categories={categories} 
        setActiveCategory={setActiveCategory}
      />

      {/* Grid Menu Utama */}
      <main className="max-w-3xl mx-auto px-3.5 pt-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#0052FF]"/>
            <p className="text-xs font-black uppercase tracking-wider text-zinc-700">Loading Medium Brewspace Menu...</p>
          </div>
        ) : filteredMenu.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-zinc-950">
            <p className="text-zinc-500 text-xs font-black uppercase tracking-wider">Menu tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredMenu.map(item => (
              <MenuItemCard 
                key={item.id}
                item={item} 
                onAddToCart={addToCart}
                formatRupiah={formatRupiah}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Bar Order */}
      {cartTotalCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-zinc-950 text-white p-3.5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,82,255,1)] flex items-center justify-between transition active:translate-x-0.5 active:translate-y-0.5 border-2 border-zinc-950"
          >
            <div className="flex items-center gap-2">
              <span className="bg-[#CCFF00] text-zinc-950 text-xs font-black px-2 py-0.5 rounded border border-zinc-950">
                {cartTotalCount} ITEM
              </span>
              <span className="text-xs text-zinc-300 font-bold uppercase tracking-wider">Checkout Order</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-[#CCFF00]">{formatRupiah(cartTotalPrice)}</span>
              <ChevronRight className="w-4 h-4 text-zinc-400 stroke-[3]"/>
            </div>
          </button>
        </div>
      )}

      {/* Drawer Cart */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        totalPrice={cartTotalPrice}
        formatRupiah={formatRupiah}
      />
    </div>
  );
}