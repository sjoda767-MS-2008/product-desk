import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Plus, Search, Eye, UploadCloud, Settings, Edit, Trash2, X, Tag, Clock, CheckCircle2, Image as ImageIcon, Package 
} from 'lucide-react';

const translations = {
  ar: {
    title: 'تخصيص المتجر',
    subtitle: 'إدارة المنتجات المعروضة في واجهة متجرك',
    preview: 'معاينة المتجر',
    publish: 'نشر التغييرات',
    settings: 'إعدادات المتجر',
    addProduct: 'إضافة منتج للواجهة',
    searchPlaceholder: 'ابحث عن منتج من مخزنك...',
    discountPercent: 'نسبة الخصم (%)',
    priceAfter: 'السعر بعد الخصم',
    duration: 'مدة الخصم (أيام)',
    description: 'وصف المنتج (للعرض)',
    cancel: 'إلغاء',
    save: 'حفظ المنتج',
    qty: 'الكمية الحالية:',
    price: 'السعر الأصلي:',
    empty: 'لم تقم بإضافة أي منتجات لواجهة متجرك بعد.',
    published: 'تم نشر التغييرات بنجاح!'
  },
  en: {
    title: 'Store Builder',
    subtitle: 'Manage products displayed on your storefront',
    preview: 'Preview Store',
    publish: 'Publish Changes',
    settings: 'Store Settings',
    addProduct: 'Add Product to Storefront',
    searchPlaceholder: 'Search for a product in your inventory...',
    discountPercent: 'Discount (%)',
    priceAfter: 'Price After Discount',
    duration: 'Discount Duration (Days)',
    description: 'Product Description (Display)',
    cancel: 'Cancel',
    save: 'Save Product',
    qty: 'Current Stock:',
    price: 'Original Price:',
    empty: 'You haven\'t added any products to your storefront yet.',
    published: 'Changes published successfully!'
  }
};

export default function StoreBuilder() {
  // تم تصحيح طريقة استدعاء المتغيرات من السياق
  const { products, globalSettings } = useOutletContext();
  const lang = globalSettings?.lang || 'ar';
  
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  const [publishedProducts, setPublishedProducts] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [editForm, setEditForm] = useState({
    description: '',
    discountPercent: '',
    discountPrice: '',
    duration: ''
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDiscountPercentChange = (val) => {
    const percent = parseFloat(val);
    setEditForm(prev => ({ ...prev, discountPercent: val }));
    
    if (selectedProduct && !isNaN(percent) && percent >= 0 && percent <= 100) {
      const originalPrice = selectedProduct.price;
      const newPrice = originalPrice - (originalPrice * (percent / 100));
      setEditForm(prev => ({ ...prev, discountPrice: newPrice.toFixed(2) }));
    } else {
      setEditForm(prev => ({ ...prev, discountPrice: '' }));
    }
  };

  const handleDiscountPriceChange = (val) => {
    const newPrice = parseFloat(val);
    setEditForm(prev => ({ ...prev, discountPrice: val }));
    
    if (selectedProduct && !isNaN(newPrice) && newPrice >= 0 && newPrice <= selectedProduct.price) {
      const originalPrice = selectedProduct.price;
      const percent = ((originalPrice - newPrice) / originalPrice) * 100;
      setEditForm(prev => ({ ...prev, discountPercent: percent.toFixed(0) }));
    } else {
      setEditForm(prev => ({ ...prev, discountPercent: '' }));
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setSearchTerm('');
    setEditForm({ description: '', discountPercent: '', discountPrice: '', duration: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (pubProduct) => {
    setModalMode('edit');
    setSelectedProduct(pubProduct.originalProduct);
    setEditForm({
      description: pubProduct.customDescription || pubProduct.originalProduct.description,
      discountPercent: pubProduct.discountPercent || '',
      discountPrice: pubProduct.discountPrice || '',
      duration: pubProduct.duration || ''
    });
    setIsModalOpen(true);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setEditForm({
      description: product.description,
      discountPercent: '',
      discountPrice: '',
      duration: ''
    });
  };

  const handleSaveProduct = () => {
    if (!selectedProduct) return;

    const newPublishedProduct = {
      id: modalMode === 'add' ? Date.now() : selectedProduct.id,
      originalProduct: selectedProduct,
      customDescription: editForm.description,
      discountPercent: editForm.discountPercent,
      discountPrice: editForm.discountPrice,
      duration: editForm.duration
    };

    if (modalMode === 'add') {
      setPublishedProducts([newPublishedProduct, ...publishedProducts]);
    } else {
      setPublishedProducts(publishedProducts.map(p => p.originalProduct.id === selectedProduct.id ? newPublishedProduct : p));
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(window.confirm('هل أنت متأكد من إزالة هذا المنتج من الواجهة؟')) {
      setPublishedProducts(publishedProducts.filter(p => p.id !== id));
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <Settings className="w-4 h-4" /> {t.settings}
          </button>
          <Link to="/shop" target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <Eye className="w-4 h-4" /> {t.preview}
          </Link>
          <button onClick={handlePublish} disabled={isPublishing} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
            {showSuccess ? <CheckCircle2 className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
            {isPublishing ? 'جاري النشر...' : showSuccess ? t.published : t.publish}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={openAddModal} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-1">
          <Plus className="w-5 h-5" /> {t.addProduct}
        </button>
      </div>

      {publishedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publishedProducts.map(pubProduct => (
            <div key={pubProduct.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col relative">
              
              {pubProduct.discountPercent && (
                <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm flex items-center gap-1`}>
                  <Tag className="w-3 h-3" /> -{pubProduct.discountPercent}%
                </div>
              )}

              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer" onClick={() => openEditModal(pubProduct)}>
                <img src={pubProduct.originalProduct.mainImage || pubProduct.originalProduct.image} alt={pubProduct.originalProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => openEditModal(pubProduct)}>
                  {pubProduct.originalProduct.name}
                </h3>
                
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {t.qty} <span className="font-bold text-slate-700 dark:text-slate-200">{pubProduct.originalProduct.stock}</span>
                </div>

                <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-100 dark:border-slate-700">
                  <div>
                    {pubProduct.discountPrice ? (
                      <>
                        <p className="text-xs text-slate-400 line-through mb-0.5" dir="ltr">{pubProduct.originalProduct.price} $</p>
                        <p className="font-black text-lg text-red-500" dir="ltr">{pubProduct.discountPrice} $</p>
                      </>
                    ) : (
                      <p className="font-black text-lg text-indigo-600 dark:text-indigo-400" dir="ltr">{pubProduct.originalProduct.price} $</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(pubProduct)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(pubProduct.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">الواجهة فارغة!</h3>
          <p className="text-slate-500 dark:text-slate-400">{t.empty}</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {modalMode === 'add' ? (selectedProduct ? 'ضبط إعدادات العرض' : 'اختيار منتج للنشر') : 'تعديل بيانات العرض'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar">
              
              {modalMode === 'add' && !selectedProduct && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isRtl ? 'right-4' : 'left-4'}`} />
                    <input 
                      type="text" 
                      placeholder={t.searchPlaceholder}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                    />
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {filteredProducts.map(p => (
                      <div key={p.id} onClick={() => handleSelectProduct(p)} className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-100 dark:border-slate-700 rounded-xl cursor-pointer transition-colors group">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100">
                          <img src={p.mainImage || p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-indigo-600">{p.name}</h4>
                          <p className="text-xs text-slate-500">{t.qty} {p.stock}</p>
                        </div>
                        <div className="font-bold text-indigo-600" dir="ltr">{p.price} $</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                      <img src={selectedProduct.mainImage || selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">{selectedProduct.name}</h4>
                      <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {t.qty} {selectedProduct.stock}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400" dir="ltr">{t.price} {selectedProduct.price} $</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <div>
                      <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">{t.discountPercent}</label>
                      <div className="relative">
                        <input type="number" min="0" max="100" value={editForm.discountPercent} onChange={e => handleDiscountPercentChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="مثال: 20" dir="ltr" />
                        <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">{t.priceAfter}</label>
                      <div className="relative">
                        <input type="number" min="0" value={editForm.discountPrice} onChange={e => handleDiscountPriceChange(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-red-500" placeholder="0.00" dir="ltr" />
                        <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400">$</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {t.duration}
                      </label>
                      <input type="number" min="1" value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="مثال: 7" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.description}</label>
                    <textarea 
                      rows="4" 
                      value={editForm.description}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    ></textarea>
                  </div>

                </div>
              )}
            </div>

            {selectedProduct && (
              <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  {t.cancel}
                </button>
                <button onClick={handleSaveProduct} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors">
                  {t.save}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}