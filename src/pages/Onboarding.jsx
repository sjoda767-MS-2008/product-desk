import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const translations = {
  ar: {
    title: 'مرحباً بك في المنصة!',
    subtitle: 'أخبرنا، كيف تخطط لاستخدام الموقع؟ يمكنك تغيير هذا لاحقاً.',
    shopperTitle: 'أريد التسوق',
    shopperDesc: 'استكشاف المنتجات، متابعة العروض، والشراء من مختلف المتاجر.',
    merchantTitle: 'أريد فتح متجر',
    merchantDesc: 'إضافة منتجاتي، إدارة المبيعات، واستقبال طلبات الزبائن.',
    continueBtn: 'متابعة',
  },
  en: {
    title: 'Welcome to the Platform!',
    subtitle: 'Tell us, how do you plan to use the site? You can change this later.',
    shopperTitle: 'I want to Shop',
    shopperDesc: 'Explore products, follow offers, and buy from various stores.',
    merchantTitle: 'I want to Sell',
    merchantDesc: 'Add my products, manage sales, and receive customer orders.',
    continueBtn: 'Continue',
  },
  fr: {
    title: 'Bienvenue sur la plateforme !',
    subtitle: 'Dites-nous, comment comptez-vous utiliser le site ?',
    shopperTitle: 'Je veux acheter',
    shopperDesc: 'Explorer des produits et acheter dans diverses boutiques.',
    merchantTitle: 'Je veux vendre',
    merchantDesc: 'Ajouter mes produits, gérer les ventes et recevoir des commandes.',
    continueBtn: 'Continuer',
  }
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null); // 'shopper' أو 'merchant'
  
  // قراءة إعدادات اللغة (افتراضياً العربية)
  const storedUser = JSON.parse(localStorage.getItem('productDeskUser')) || {};
  const lang = storedUser.lang || 'ar';
  const isRtl = lang === 'ar';
  const t = translations[lang] || translations.ar;

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const handleContinue = () => {
    if (!selectedRole) return;

    // تحديث بيانات المستخدم في الذاكرة (ولاحقاً في Supabase)
    const updatedUser = { 
      ...storedUser, 
      role: selectedRole === 'merchant' ? 'admin' : 'shopper',
      // إذا كان تاجراً نعطيه صلاحيات، وإذا كان متسوقاً لا يحتاجها
      permissions: selectedRole === 'merchant' ? { products: true, sales: true, employees: true } : {}
    };
    
    localStorage.setItem('productDeskUser', JSON.stringify(updatedUser));

    // التوجيه بناءً على الاختيار
    if (selectedRole === 'shopper') {
      navigate('/shop'); // توجيه المتسوق للسوق العام
    } else {
      // إذا كان تاجراً، سنوجهه لاحقاً لصفحة "إعداد المتجر"، حالياً نوجهه للوحة التحكم مباشرة
      navigate('/admin'); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* العناوين */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            {t.title}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* بطاقات الاختيار */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          
          {/* بطاقة المتسوق */}
          <div 
            onClick={() => setSelectedRole('shopper')}
            className={`relative p-6 md:p-8 rounded-3xl cursor-pointer border-2 transition-all duration-300 ${
              selectedRole === 'shopper' 
              ? 'bg-indigo-50 border-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]' 
              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
            }`}
          >
            {selectedRole === 'shopper' && (
              <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} text-indigo-600 dark:text-indigo-400 animate-in zoom-in duration-200`}>
                <CheckCircle2 className="w-6 h-6 fill-indigo-100 dark:fill-indigo-900/50" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedRole === 'shopper' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.shopperTitle}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.shopperDesc}</p>
          </div>

          {/* بطاقة التاجر */}
          <div 
            onClick={() => setSelectedRole('merchant')}
            className={`relative p-6 md:p-8 rounded-3xl cursor-pointer border-2 transition-all duration-300 ${
              selectedRole === 'merchant' 
              ? 'bg-indigo-50 border-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]' 
              : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
            }`}
          >
            {selectedRole === 'merchant' && (
              <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} text-indigo-600 dark:text-indigo-400 animate-in zoom-in duration-200`}>
                <CheckCircle2 className="w-6 h-6 fill-indigo-100 dark:fill-indigo-900/50" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedRole === 'merchant' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
              <Store className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.merchantTitle}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.merchantDesc}</p>
          </div>

        </div>

        {/* زر المتابعة */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`flex items-center gap-2 px-10 py-4 rounded-full text-lg font-bold transition-all ${
              selectedRole 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30' 
              : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            {t.continueBtn}
            {selectedRole && (isRtl ? <ArrowLeft className="w-5 h-5 animate-pulse" /> : <ArrowRight className="w-5 h-5 animate-pulse" />)}
          </button>
        </div>

      </div>
    </div>
  );
}