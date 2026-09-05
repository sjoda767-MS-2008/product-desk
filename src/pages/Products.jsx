import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, X, Image as ImageIcon, TrendingUp, DollarSign, ShoppingBag, Upload, Tag } from 'lucide-react';

const translations = {
  ar: {
    title: 'المنتجات',
    subtitle: 'إدارة معرض المنتجات، التفاصيل، الأرباح والمبيعات',
    searchPlaceholder: 'ابحث بالاسم، الكود، الفئة أو المواصفات...',
    addProduct: 'إضافة منتج جديد',
    sortBy: 'ترتيب حسب:',
    sortOptions: { newest: 'الحديثة', mostSold: 'الأكثر مبيعاً', leastSold: 'الأدنى مبيعاً' },
    filters: { all: 'الكل', inStock: 'متوفر', outOfStock: 'غير متوفر' },
    status: { inStock: 'متوفر', lowStock: 'مخزون منخفض', outOfStock: 'نفد من المخزون' },
    details: { title: 'تفاصيل المنتج', sales: 'المبيعات', unitPrice: 'سعر القطعة', unitProfit: 'صافي الربح', stock: 'الكمية الحالية', description: 'وصف ومواصفات المنتج', similar: 'منتجات مشابهة', edit: 'تعديل', delete: 'حذف', confirmDelete: 'هل أنت متأكد من الحذف؟' },
    form: { addTitle: 'إضافة منتج', editTitle: 'تعديل المنتج', name: 'الاسم', mainImage: 'الصورة الأساسية', extraImages: 'صور إضافية', quantity: 'الكمية', code: 'الكود (تلقائي)', price: 'السعر', netProfit: 'الربح الصافي', category: 'الفئة', description: 'الوصف', save: 'حفظ', cancel: 'إلغاء' }
  },
  en: {
    title: 'Products',
    subtitle: 'Manage product gallery, details, profits, and sales',
    searchPlaceholder: 'Search by name, code, category...',
    addProduct: 'Add New Product',
    sortBy: 'Sort by:',
    sortOptions: { newest: 'Newest', mostSold: 'Most Sold', leastSold: 'Least Sold' },
    filters: { all: 'All', inStock: 'In Stock', outOfStock: 'Out of Stock' },
    status: { inStock: 'In Stock', lowStock: 'Low Stock', outOfStock: 'Out of Stock' },
    details: { title: 'Product Details', sales: 'Sales', unitPrice: 'Unit Price', unitProfit: 'Net Profit', stock: 'Current Stock', description: 'Description & Specs', similar: 'Similar Products', edit: 'Edit', delete: 'Delete', confirmDelete: 'Are you sure?' },
    form: { addTitle: 'Add Product', editTitle: 'Edit Product', name: 'Name', mainImage: 'Main Image', extraImages: 'Extra Images', quantity: 'Quantity', code: 'Code', price: 'Price', netProfit: 'Net Profit', category: 'Category', description: 'Description', save: 'Save', cancel: 'Cancel' }
  }
};

const generateUniqueCode = () => 'PRD-' + Math.random().toString(36).substr(2, 6).toUpperCase();

export default function Products() {
  const { addNotification, products, setProducts, globalSettings } = useOutletContext() || { products: [], setProducts: () => {}, globalSettings: { lang: 'ar', currency: '$' } };
  
  const lang = globalSettings.lang === 'en' ? 'en' : 'ar';
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';
  const currency = globalSettings.currency;

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stockFilter, setStockFilter] = useState('all');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (p.name.toLowerCase().includes(search) || p.code.toLowerCase().includes(search) || p.category.toLowerCase().includes(search) || (p.description && p.description.toLowerCase().includes(search)));
      const matchesStock = stockFilter === 'all' ? true : stockFilter === 'inStock' ? p.stock > 0 : p.stock <= 0;
      return matchesSearch && matchesStock;
    });
    switch (sortBy) {
      case 'mostSold': return result.sort((a, b) => b.sales - a.sales);
      case 'leastSold': return result.sort((a, b) => a.sales - b.sales);
      case 'newest': default: return result.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [products, searchTerm, sortBy, stockFilter]);

  const getProductStatus = (stock) => {
    if (stock <= 0) return { label: t.status.outOfStock, color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' };
    if (stock <= 5) return { label: t.status.lowStock, color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' };
    return { label: t.status.inStock, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' };
  };

  const handleOpenAddForm = () => {
    setIsEditMode(false);
    setFormData({ id: Date.now(), name: '', code: generateUniqueCode(), category: '', price: '', netProfit: '', stock: '', sales: 0, description: '', mainImage: '', extraImages: [], createdAt: Date.now() });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product) => {
    setIsEditMode(true);
    setFormData({ ...product });
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setProducts(products.map(p => p.id === formData.id ? formData : p));
      if(addNotification) addNotification('info', `تم تعديل بيانات المنتج: ${formData.name}`);
    } else {
      setProducts([formData, ...products]);
      if(addNotification) addNotification('success', `تمت إضافة منتج جديد بنجاح: ${formData.name}`);
    }
    if (formData.stock <= 5 && formData.stock > 0 && addNotification) addNotification('warning', `تحذير: منتج "${formData.name}" أوشك على النفاذ.`);
    else if (formData.stock === 0 && addNotification) addNotification('warning', `تنبيه هام: منتج "${formData.name}" نفد تماماً!`);
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    const productToDelete = products.find(p => p.id === id);
    if (window.confirm(t.details.confirmDelete)) {
      setProducts(products.filter(p => p.id !== id));
      setSelectedProduct(null);
      if(addNotification) addNotification('info', `تم حذف المنتج: ${productToDelete?.name}`);
    }
  };

  const handleImageUpload = (e, isMain = true) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (isMain) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, mainImage: url }));
    } else {
      const files = Array.from(e.target.files);
      const newUrls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, extraImages: [...(prev.extraImages || []), ...newUrls] }));
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t.subtitle}</p>
        </div>
        <button onClick={handleOpenAddForm} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> {t.addProduct}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-4 transition-colors">
        <div className="relative flex-1">
          <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} />
        </div>
        <div className="flex bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg p-1 overflow-x-auto">
          <button onClick={() => setStockFilter('all')} className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${stockFilter === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>{t.filters.all}</button>
          <button onClick={() => setStockFilter('inStock')} className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${stockFilter === 'inStock' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>{t.filters.inStock}</button>
          <button onClick={() => setStockFilter('outOfStock')} className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${stockFilter === 'outOfStock' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>{t.filters.outOfStock}</button>
        </div>
        <div className="flex items-center gap-2 lg:w-48 xl:w-64">
          <label className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">{t.sortBy}</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer">
            <option value="newest">{t.sortOptions.newest}</option>
            <option value="mostSold">{t.sortOptions.mostSold}</option>
            <option value="leastSold">{t.sortOptions.leastSold}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => {
          const status = getProductStatus(product.stock);
          const isOutOfStock = product.stock <= 0;
          return (
            <div key={product.id} onClick={() => setSelectedProduct(product)} className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer group ${isOutOfStock ? 'opacity-75 grayscale-[50%]' : ''}`}>
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden">
                {product.mainImage ? <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600"><ImageIcon className="w-16 h-16" /></div>}
                <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-1 rounded-md text-xs font-bold backdrop-blur-md ${status.color}`}>{status.label}</span>
                <span className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} bg-black/50 text-white px-2.5 py-1 rounded-md text-xs font-mono font-bold backdrop-blur-md`} dir="ltr">{product.price.toLocaleString()} {currency}</span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{product.code} • {product.category}</p>
              </div>
            </div>
          );
        })}
        {filteredAndSortedProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">لا توجد منتجات مطابقة.</div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.details.title}</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div onClick={() => selectedProduct.mainImage && setPreviewImage(selectedProduct.mainImage)} className={`aspect-square rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden ${selectedProduct.mainImage ? 'cursor-pointer group' : ''}`}>
                    {selectedProduct.mainImage ? <img src={selectedProduct.mainImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-20 h-20" /></div>}
                  </div>
                  {selectedProduct.extraImages?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedProduct.extraImages.map((img, idx) => (
                        <img key={idx} src={img} onClick={() => setPreviewImage(img)} className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{selectedProduct.name}</h2>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-mono">{selectedProduct.code}</span>
                      <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full flex items-center gap-1"><Tag className="w-3 h-3"/> {selectedProduct.category}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><ShoppingBag className="w-4 h-4"/> {t.details.stock}</p>
                      <p className={`text-xl font-bold ${selectedProduct.stock <= 0 ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>{selectedProduct.stock}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> {t.details.sales}</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">{selectedProduct.sales}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> {t.details.unitPrice}</p>
                      <p className="text-xl font-bold text-emerald-600" dir="ltr">{selectedProduct.price.toLocaleString()} {currency}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> {t.details.unitProfit}</p>
                      <p className="text-xl font-bold text-emerald-600" dir="ltr">{selectedProduct.netProfit.toLocaleString()} {currency}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{t.details.description}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">{selectedProduct.description || 'لا يوجد وصف.'}</p>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => handleOpenEditForm(selectedProduct)} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-medium transition-colors shadow-sm"><Edit className="w-4 h-4" /> {t.details.edit}</button>
                    <button onClick={() => handleDelete(selectedProduct.id)} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl text-sm font-medium transition-colors border border-red-200 dark:border-red-500/30"><Trash2 className="w-4 h-4" /> {t.details.delete}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors"><X className="w-8 h-8" /></button>
          <img src={previewImage} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{isEditMode ? t.form.editTitle : t.form.addTitle}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.form.mainImage}</label>
                  <label htmlFor="main-image-upload" className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer overflow-hidden transition-colors">
                    {formData.mainImage ? <img src={formData.mainImage} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-slate-400"><Upload className="w-6 h-6 mb-2" /><span className="text-xs font-medium">رفع صورة</span></div>}
                    <input id="main-image-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.form.extraImages}</label>
                  <label htmlFor="extra-images-upload" className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                     <div className="flex flex-col items-center text-slate-400"><Plus className="w-6 h-6 mb-2" /><span className="text-xs font-medium">إضافة صور أخرى</span></div>
                    <input id="extra-images-upload" type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(e, false)} />
                  </label>
                  {formData.extraImages?.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {formData.extraImages.map((img, idx) => <img key={idx} src={img} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />)}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.name}</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.code}</label><input type="text" disabled value={formData.code} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500 font-mono cursor-not-allowed" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.category}</label><input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.quantity}</label><input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.price}</label><input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" /></div>
                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.netProfit}</label><input type="number" required min="0" value={formData.netProfit} onChange={e => setFormData({...formData, netProfit: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" /></div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.description}</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none resize-none"></textarea>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">{t.form.cancel}</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">{t.form.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}