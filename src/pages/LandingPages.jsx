import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Layout, Plus, Edit, Trash2, ExternalLink, Settings, 
  Palette, MonitorSmartphone, CheckCircle2, X, Search, Image as ImageIcon
} from 'lucide-react';

const translations = {
  ar: {
    title: 'إدارة صفحات الهبوط',
    subtitle: 'أنشئ صفحات هبوط مخصصة لمنتجاتك وحسّن معدل التحويل (الطلبات).',
    tabs: { pages: 'صفحات الهبوط', settings: 'القوالب والإعدادات' },
    createBtn: 'إنشاء صفحة جديدة',
    templates: {
      title: 'قالب استمارة الشراء (Checkout)',
      classic: 'كلاسيكي (جميع التفاصيل)',
      modern: 'حديث (جانبي لاصق)',
      fast: 'سريع (الاسم والهاتف فقط)',
    },
    form: {
      selectProduct: 'اختر المنتج',
      pageTitle: 'عنوان الصفحة (الرئيسي)',
      buttonText: 'نص زر الطلب',
      cancel: 'إلغاء',
      save: 'حفظ ونشر الصفحة'
    },
    empty: 'لم تقم بإنشاء أي صفحة هبوط بعد.',
    preview: 'معاينة',
    success: 'تم الحفظ بنجاح!'
  }
};

export default function LandingPages() {
  const { products, lang, globalSettings } = useOutletContext();
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = useState('pages');
  
  // بيانات صفحات الهبوط الوهمية (للعرض)
  const [landingPages, setLandingPages] = useState([
    { id: 1, productId: 1, title: 'عرض حصري: سماعات سوني اللاسلكية', views: 1250, orders: 45, conversion: '3.6%' }
  ]);

  // إعدادات القوالب
  const [checkoutTemplate, setCheckoutTemplate] = useState('modern');

  // حالات النافذة المنبثقة
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [buttonText, setButtonText] = useState(isRtl ? 'اطلب الآن - الدفع عند الاستلام' : 'Order Now - COD');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePage = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const product = products.find(p => p.id === parseInt(selectedProduct));
      const newPage = {
        id: Date.now(),
        productId: product?.id || 1,
        title: pageTitle || (product ? `عرض: ${product.name}` : 'صفحة جديدة'),
        views: 0,
        orders: 0,
        conversion: '0%'
      };
      setLandingPages([newPage, ...landingPages]);
      setIsModalOpen(false);
      setIsSaving(false);
      setPageTitle('');
      setSelectedProduct('');
    }, 1000);
  };

  const getProductDetails = (id) => products.find(p => p.id === id) || products[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* رأس الصفحة */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Layout className="w-6 h-6 text-indigo-600" /> {t.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
        </div>
        
        {activeTab === 'pages' && (
          <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
            <Plus className="w-4 h-4" /> {t.createBtn}
          </button>
        )}
      </div>

      {/* التبويبات */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'pages' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
        >
          <MonitorSmartphone className="w-4 h-4" /> {t.tabs.pages}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'settings' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
        >
          <Palette className="w-4 h-4" /> {t.tabs.settings}
        </button>
      </div>

      {/* محتوى التبويبات */}
      {activeTab === 'pages' ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          {landingPages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landingPages.map(page => {
                const prod = getProductDetails(page.productId);
                return (
                  <div key={page.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden bg-slate-100 relative">
                      <img src={prod.mainImage || prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-bold line-clamp-1">{page.title}</h3>
                        <p className="text-xs opacity-80">{prod.name}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-2 text-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <div>
                          <p className="text-xs text-slate-500">الزيارات</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{page.views}</p>
                        </div>
                        <div className="border-x border-slate-100 dark:border-slate-700">
                          <p className="text-xs text-slate-500">الطلبات</p>
                          <p className="font-bold text-emerald-600">{page.orders}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">التحويل</p>
                          <p className="font-bold text-indigo-600">{page.conversion}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/p/${page.productId}`} target="_blank" className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-sm font-bold transition-colors">
                          <ExternalLink className="w-4 h-4" /> {t.preview}
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-700 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setLandingPages(landingPages.filter(p => p.id !== page.id))} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 dark:bg-slate-700 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
              <Layout className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">{t.empty}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" /> {t.templates.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Template 1 */}
            <div onClick={() => setCheckoutTemplate('classic')} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${checkoutTemplate === 'classic' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
              <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-lg mb-4 p-2 flex flex-col gap-2">
                <div className="h-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-1/2 bg-indigo-200 dark:bg-indigo-900/50 rounded flex flex-col justify-end p-1 gap-1">
                  <div className="h-2 w-full bg-indigo-300 rounded"></div>
                  <div className="h-2 w-full bg-indigo-300 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checkoutTemplate === 'classic' ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {checkoutTemplate === 'classic' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{t.templates.classic}</span>
              </div>
            </div>

            {/* Template 2 */}
            <div onClick={() => setCheckoutTemplate('modern')} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${checkoutTemplate === 'modern' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
              <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-lg mb-4 p-2 flex gap-2">
                <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="w-1/3 bg-indigo-200 dark:bg-indigo-900/50 rounded flex flex-col gap-1 p-1">
                   <div className="h-2 w-full bg-indigo-300 rounded"></div>
                   <div className="h-2 w-full bg-indigo-300 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checkoutTemplate === 'modern' ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {checkoutTemplate === 'modern' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{t.templates.modern}</span>
              </div>
            </div>

            {/* Template 3 */}
            <div onClick={() => setCheckoutTemplate('fast')} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${checkoutTemplate === 'fast' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
              <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-lg mb-4 p-2 flex flex-col items-center justify-center gap-2">
                <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="w-3/4 h-8 bg-indigo-500 rounded-lg mt-2"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checkoutTemplate === 'fast' ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {checkoutTemplate === 'fast' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{t.templates.fast}</span>
              </div>
            </div>

          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
             <button className="flex items-center gap-2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90">
                <CheckCircle2 className="w-4 h-4" /> حفظ الإعدادات
             </button>
          </div>
        </div>
      )}

      {/* النافذة المنبثقة لإنشاء صفحة هبوط */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.createBtn}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSavePage} className="p-4 md:p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.form.selectProduct}</label>
                <select 
                  required
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="" disabled>-- اختر منتجاً --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.form.pageTitle}</label>
                <input 
                  type="text" 
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="مثال: عرض خاص ومحدود جداً!"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.form.buttonText}</label>
                <input 
                  type="text" 
                  required
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                  {t.form.cancel}
                </button>
                <button type="submit" disabled={isSaving || !selectedProduct} className="flex-[2] py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-md">
                  {isSaving ? 'جاري الحفظ...' : t.form.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}