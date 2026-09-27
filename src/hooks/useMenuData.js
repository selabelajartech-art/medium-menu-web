import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';

export function useMenuData() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (catError) console.error('Category error:', catError.message);

      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (menuError) console.error('Menu error:', menuError.message);

      setCategories(catData || []);
      setMenuItems(menuData || []);
    } catch (err) {
      console.error('Data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1, 
        imageUrl: item.image_url 
      }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const cartTotalCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartTotalPrice = useMemo(() => cart.reduce((s, i) => s + (i.price * i.quantity), 0), [cart]);

  return {
    categories,
    menuItems,
    loading,
    cart,
    cartTotalCount,
    cartTotalPrice,
    addToCart,
    updateQuantity,
    refreshData: fetchData
  };
}