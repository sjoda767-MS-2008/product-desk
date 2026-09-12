import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, Star, User, Phone, MapPin, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const translations = {
  ar: {
    orderNow: 'اطلب الآن',
    formTitle: 'أدخل معلوماتك للطلب',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    address: 'عنوان التوصيل (الولاية، البلدية)',
    qty: 'الكمية المطلوبة',
    submitOrder: 'تأكيد الطلب والدفع عند الاستلام',
    successTitle: 'تم استلام طلبك بنجاح!',
    successDesc: 'شكراً لك. سيقوم فريقنا بالاتصال بك قريباً لتأكيد الطلب وتحديد موعد التوصيل.',
    backToStore: 'العودة للمتجر',
    trust: {
      delivery: 'توصيل سريع',
      deliveryDesc: 'الدفع عند الاستلام',
      quality: 'جودة مضمونة',
      qualityDesc: 'فحص شامل قبل الشحن',
      support: 'دعم 24/7',
      supportDesc: 'في خدمتك دائماً'
    }
  },
  en: {
    orderNow: 'Order Now',
    formTitle: 'Enter details to order',
    fullName: 'Full Name',
    phone: 'Phone Number',
    address: 'Delivery Address',
    qty: 'Quantity',
    submitOrder: 'Confirm Order (Cash on Delivery)',
    successTitle: 'Order Received Successfully!',
    successDesc: 'Thank you. Our team will contact you soon to confirm the order and arrange delivery.',
    backToStore: 'Back to Store',
    trust: {
      delivery: 'Fast Delivery',
      deliveryDesc: 'Cash on Delivery',
      quality: 'Guaranteed',
      qualityDesc: 'Checked before shipping',
      support: '24/7 Support',
      supportDesc: 'Always here for you'
    }
  }
};

// بيانات منتج وهمية (في الواقع سيتم جلبها عبر الـ id من قاعدة البيانات)
const mockProduct = {
  id: '1',
  name: 'سماعات رأس لاسلكية سوني بخاصية عزل الضوضاء',
  price: 350,
  currency: '$',
  description: 'استمتع بتجربة صوتية استثنائية مع سماعات سوني الرائدة. عزل تام للضوضاء، بطارية تدوم لـ 30 ساعة، وتصميم مريح طوال اليوم ليوفر لك أفضل تجربة استماع أينما كنت.',
  image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
  features: ['بطارية تدوم حتى 30 ساعة', 'عزل ضوضاء نشط وذكي', 'ميكروفون مدمج نقي للمكالمات', 'تصميم خفيف الوزن ومريح']
};

export default function ProductLanding() {
  const { id } = useParams(); // لاستخراج رقم المنتج من الرابط لاحقاً
  
  // سنفترض اللغة العربية كافتراضية لصفحة الهبوط المستقلة
  const lang = 'ar'; 
  const isRtl = lang === 'ar';
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const [formData, setFormData] = useState({ name: '', phone: '', address: '', qty: 1 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // محاكاة إرسال الطلب لقاعدة البيانات
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // في الحقيقة هنا سنقوم بإرسال البيانات إلى جدول "Orders" ليراها التاجر
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-slate-100 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{t.successTitle}</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">{t.successDesc}</p>
          <div className="bg-slate-50 rounded-xl p-4 mb-8 text-start border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">المنتج: <span className="font-bold text-slate-800">{mockProduct.name}</span></p>
            <p className="text-sm text-slate-500 mb-1">الإجمالي: <span className="font-bold text-indigo-600" dir="ltr">{(mockProduct.price * formData.qty)} {mockProduct.currency}</span></p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-full font-bold transition-colors">
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t.backToStore}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* القسم الأيمن: تفاصيل المنتج */}
          <div className="flex-[1.5] p-6 md:p-10 lg:p-12">
            <div className="aspect-video sm:aspect-[4/3] lg:aspect-video rounded-2xl overflow-hidden mb-8 bg-slate-100">
              <img src={mockProduct.image} alt={mockProduct.name} className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
              {mockProduct.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-indigo-600" dir="ltr">{mockProduct.price} {mockProduct.currency}</span>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold animate-pulse">متوفر في المخزون</span>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {mockProduct.description}
            </p>

            <div className="space-y-3 mb-10">
              {mockProduct.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* شارات الثقة */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-indigo-500" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{t.trust.delivery}</h4>
                  <p className="text-xs text-slate-500">{t.trust.deliveryDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-indigo-500" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{t.trust.quality}</h4>
                  <p className="text-xs text-slate-500">{t.trust.qualityDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-indigo-500" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{t.trust.support}</h4>
                  <p className="text-xs text-slate-500">{t.trust.supportDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* القسم الأيسر: استمارة الطلب (Sticky Form) */}
          <div className="flex-1 bg-slate-50 border-t lg:border-t-0 lg:border-r border-slate-100 p-6 md:p-10 lg:p-12">
            <div className="sticky top-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.orderNow}</h3>
                <p className="text-slate-500 text-sm">{t.formTitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.fullName}</label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                    <input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className={`w-full bg-white border border-slate-300 rounded-xl py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`} placeholder="مثال: أحمد محمد" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.phone}</label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                    <input type="tel" required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className={`w-full bg-white border border-slate-300 rounded-xl py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`} placeholder="0555 XX XX XX" dir="ltr" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.address}</label>
                  <div className="relative">
                    <MapPin className={`absolute top-3 w-5 h-5 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                    <textarea required value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} rows="2" className={`w-full bg-white border border-slate-300 rounded-xl py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`} placeholder="الولاية، الدائرة، والبلدية..."></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.qty}</label>
                  <div className="flex items-center gap-4 bg-white border border-slate-300 rounded-xl px-4 py-2 w-fit">
                    <button type="button" onClick={()=>setFormData({...formData, qty: Math.max(1, formData.qty - 1)})} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xl">-</button>
                    <span className="font-bold text-lg w-8 text-center">{formData.qty}</span>
                    <button type="button" onClick={()=>setFormData({...formData, qty: formData.qty + 1})} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xl">+</button>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200">
                  <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                    {isLoading ? (
                      <span className="animate-pulse">جاري تأكيد الطلب...</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" /> {t.submitOrder}
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> معلوماتك آمنة ولن يتم مشاركتها
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}