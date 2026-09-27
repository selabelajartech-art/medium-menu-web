import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Upload, Link as LinkIcon, X, ArrowLeft, 
  Package, Flame, Eye, EyeOff, Loader2, Image as ImageIcon,
  Lock, KeyRound, Layers, Utensils
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AdminDashboard({ onBackToPublic }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "1234";

  const [activeTab, setActiveTab] = useState('items');

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [imageSourceType, setImageSourceType] = useState('url');
  
  const [itemFormData, setItemFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    stock_quantity: 10,
    is_available: true,
    is_popular: false,
    image_url: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catFormData, setCatFormData] = useState({ name: '', sort_order: 1 });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

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
      console.error('Error fetching admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const openItemModal = (item = null) => {
    if (item) {
      setEditingItemId(item.id);
      setItemFormData({
        name: item.name || '',
        category_id: item.category_id || '',
        price: item.price || '',
        description: item.description || '',
        stock_quantity: item.stock_quantity ?? 10,
        is_available: item.is_available ?? true,
        is_popular: item.is_popular ?? false,
        image_url: item.image_url || '',
      });
      setImagePreview(item.image_url || '');
      setImageSourceType(item.image_url ? 'url' : 'file');
    } else {
      setEditingItemId(null);
      setItemFormData({
        name: '',
        category_id: categories[0]?.id || '',
        price: '',
        description: '',
        stock_quantity: 10,
        is_available: true,
        is_popular: false,
        image_url: '',
      });
      setImagePreview('');
      setImageSourceType('url');
    }
    setSelectedFile(null);
    setIsItemModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setItemFormData(prev => ({ ...prev, image_url: url }));
    setImagePreview(url);
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = itemFormData.image_url;

      if (imageSourceType === 'file' && selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      const payload = {
        name: itemFormData.name,
        category_id: itemFormData.category_id || categories[0]?.id,
        price: parseFloat(itemFormData.price),
        description: itemFormData.description,
        stock_quantity: parseInt(itemFormData.stock_quantity, 10),
        is_available: itemFormData.is_available,
        is_popular: itemFormData.is_popular,
        image_url: finalImageUrl,
      };

      if (editingItemId) {
        const { error } = await supabase
          .from('menu_items')
          .update(payload)
          .eq('id', editingItemId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert([payload]);
        if (error) throw error;
      }

      setIsItemModalOpen(false);
      fetchData();
    } catch (err) {
      alert(`Gagal menyimpan menu: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailable = async (item) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !item.is_available })
        .eq('id', item.id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      alert(`Gagal mengubah status: ${err.message}`);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Hapus menu ini secara permanen?')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      alert(`Gagal menghapus menu: ${err.message}`);
    }
  };

  const openCatModal = (cat = null) => {
    if (cat) {
      setEditingCatId(cat.id);
      setCatFormData({ name: cat.name || '', sort_order: cat.sort_order || 1 });
    } else {
      setEditingCatId(null);
      setCatFormData({ name: '', sort_order: categories.length + 1 });
    }
    setIsCatModalOpen(true);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: catFormData.name,
        sort_order: parseInt(catFormData.sort_order, 10),
      };

      if (editingCatId) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCatId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([payload]);
        if (error) throw error;
      }

      setIsCatModalOpen(false);
      fetchData();
    } catch (err) {
      alert(`Gagal menyimpan kategori: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      alert(`Gagal menghapus kategori: ${err.message}`);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number || 0);
  };

  // LIGHT MODE UNLOCK PIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-lg">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 bg-[#0052FF] text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">ACCESS RESTRICTED</h2>
            <p className="text-xs text-slate-500 font-medium">Masukkan PIN Admin Medium Brewspace.</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="PIN Kunci"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono font-bold tracking-widest text-lg focus:border-[#0052FF] focus:outline-none transition"
                />
              </div>
              {pinError && (
                <p className="text-xs font-bold text-red-600 text-center mt-2 uppercase tracking-wider">
                  PIN Salah! Coba lagi.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0052FF] hover:bg-slate-900 text-white font-black py-3 rounded-xl uppercase tracking-wider text-xs transition active:scale-95 shadow-xs"
            >
              Unlock Dashboard
            </button>

            <button
              type="button"
              onClick={onBackToPublic}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl uppercase tracking-wider text-[11px] transition"
            >
              Kembali ke Menu
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LIGHT MODE DASHBOARD ADMIN
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-3.5 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToPublic}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition"
              title="Ke Menu Pelanggan"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-black uppercase tracking-tight text-slate-900">
                MEDIUM BREWSPACE <span className="text-[#0052FF]">• ADMIN</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">
                Realtime Menu Management
              </p>
            </div>
          </div>

          <button
            onClick={() => activeTab === 'items' ? openItemModal() : openCatModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0052FF] hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {activeTab === 'items' ? 'Tambah Menu' : 'Tambah Kategori'}
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'items'
                ? 'bg-[#0052FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Menu ({menuItems.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              activeTab === 'categories'
                ? 'bg-[#0052FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Kategori ({categories.length})
          </button>
        </div>

        {/* TAB 1: DAFTAR MENU (LIGHT MOBILE CARDS) */}
        {activeTab === 'items' && (
          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#0052FF]" />
                <p className="text-xs font-bold uppercase tracking-wider">Memuat data menu...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Belum ada menu tersimpan.</p>
              </div>
            ) : (
              menuItems.map(item => (
                <div key={item.id} className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'} 
                      alt="" 
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate uppercase tracking-tight">{item.name}</h4>
                        {item.is_popular && (
                          <span className="bg-[#FF4500] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            FAVORIT
                          </span>
                        )}
                      </div>
                      <p className="text-[#0052FF] font-black text-xs mt-0.5">{formatRupiah(item.price)}</p>
                      <p className="text-slate-500 font-semibold text-[10px] truncate mt-0.5">
                        {categories.find(c => c.id === item.category_id)?.name || 'Tanpa Kategori'} • Stok: {item.stock_quantity ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleAvailable(item)}
                      className={`p-2 rounded-xl text-xs font-black transition ${
                        item.is_available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                      }`}
                      title={item.is_available ? 'Tersedia' : 'Habis'}
                    >
                      {item.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openItemModal(item)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: KATEGORI LIST */}
        {activeTab === 'categories' && (
          <div className="space-y-3">
            {categories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Belum ada kategori.</p>
              </div>
            ) : (
              categories.map(cat => {
                const count = menuItems.filter(i => i.category_id === cat.id).length;
                return (
                  <div key={cat.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#0052FF]">#{cat.sort_order}</span>
                        <h4 className="font-black text-slate-900 text-xs sm:text-sm uppercase tracking-tight">{cat.name}</h4>
                      </div>
                      <p className="text-slate-500 text-[10px] font-semibold mt-0.5">{count} Menu Terhubung</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openCatModal(cat)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCat(cat.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* MODAL LIGHT FORM ITEM MENU */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
                {editingItemId ? 'EDIT MENU' : 'TAMBAH MENU BARU'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200">
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs font-bold">
              
              {/* Option Foto */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-black uppercase tracking-wider text-slate-800">Foto Menu</label>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setImageSourceType('url')}
                      className={`px-2.5 py-1 rounded-md transition font-black uppercase ${
                        imageSourceType === 'url' ? 'bg-[#0052FF] text-white' : 'text-slate-600'
                      }`}
                    >
                      Link URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceType('file')}
                      className={`px-2.5 py-1 rounded-md transition font-black uppercase ${
                        imageSourceType === 'file' ? 'bg-[#0052FF] text-white' : 'text-slate-600'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview('')} />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {imageSourceType === 'url' ? (
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={itemFormData.image_url}
                          onChange={handleUrlChange}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0052FF] focus:outline-none text-xs font-mono"
                        />
                      </div>
                    ) : (
                      <label className="cursor-pointer px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl hover:bg-slate-100 transition flex items-center gap-2 text-xs font-black text-slate-700">
                        <Upload className="w-4 h-4 text-[#0052FF]" />
                        Pilih Berkas Foto
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">Nama Menu</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kopi Susu Aren"
                  value={itemFormData.name}
                  onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0052FF] focus:outline-none font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">Kategori</label>
                  <select
                    value={itemFormData.category_id}
                    onChange={(e) => setItemFormData({ ...itemFormData, category_id: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0052FF] focus:outline-none font-bold text-slate-900"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={itemFormData.price}
                    onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0052FF] focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">Sisa Stok (Porsi)</label>
                <input
                  type="number"
                  required
                  placeholder="10"
                  value={itemFormData.stock_quantity}
                  onChange={(e) => setItemFormData({ ...itemFormData, stock_quantity: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0052FF] focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows="2"
                  placeholder="Tuliskan racikan atau deskripsi singkat..."
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0052FF] focus:outline-none resize-none font-medium"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemFormData.is_available}
                    onChange={(e) => setItemFormData({ ...itemFormData, is_available: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0052FF] focus:ring-0"
                  />
                  <span className="font-bold text-slate-800 uppercase">Tersedia</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemFormData.is_popular}
                    onChange={(e) => setItemFormData({ ...itemFormData, is_popular: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0052FF] focus:ring-0"
                  />
                  <span className="font-bold text-slate-800 uppercase flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#FF4500]" />
                    Favorit
                  </span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold uppercase"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#0052FF] text-white rounded-xl font-black uppercase tracking-wider hover:bg-slate-900 transition flex items-center gap-2 active:scale-95"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? 'PROSES...' : 'SIMPAN MENU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LIGHT FORM KATEGORI */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900">
                {editingCatId ? 'EDIT KATEGORI' : 'TAMBAH KATEGORI'}
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200">
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <form onSubmit={handleCatSubmit} className="p-5 space-y-4 text-xs font-bold">
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: WASHED / ESPRESSO"
                  value={catFormData.name}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0052FF] focus:outline-none uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">Urutan Tampilan</label>
                <input
                  type="number"
                  required
                  value={catFormData.sort_order}
                  onChange={(e) => setCatFormData({ ...catFormData, sort_order: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0052FF] focus:outline-none font-mono font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold uppercase"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#0052FF] text-white rounded-xl font-black uppercase tracking-wider hover:bg-slate-900 transition flex items-center gap-2 active:scale-95"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? 'PROSES...' : 'SIMPAN KATEGORI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}