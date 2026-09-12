import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, 
  CheckCircle2, CreditCard, Truck 
} from 'lucide-react';

const translations = {
  ar: {
    title: 'سلة التسوق',
    emptyTitle: 'سلة التسوق فارغة',
    emptySubtitle: 'لم تقم بإضافة أي منتجات إلى سلتك بعد. اكتشف منتجاتنا الرائعة وابدأ التسوق!',
    startShopping: 'ابدأ التسوق الآن',
    product: 'المنتج',
    price: 'السعر',
    quantity: 'الكمية',
    total: 'المجموع',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    shipping: 'تكلفة التوصيل',
    shippingCalculated: 'تُحسب عند إتمام الطلب',
    finalTotal: 'الإجمالي',
    checkoutBtn: 'إتمام الطلب (الدفع عند الاستلام)',
    orderSuccess: 'تم استلام طلبك بنجاح!',
    orderSuccessDesc: 'سيتواصل معك فريقنا قريباً لتأكيد الطلب وتحديد موعد التوصيل.'
  },
  en: {
    title: 'Shopping Cart',
    emptyTitle: 'Your cart is empty',
    emptySubtitle: 'You have not added any products to your cart yet. Discover our amazing products and start shopping!',
    startShopping: 'Start Shopping Now',
    product: 'Product',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    shippingCalculated: 'Calculated at checkout',
    finalTotal: 'Total',
    checkoutBtn: 'Proceed to Checkout (COD)',
    orderSuccess: 'Order Received Successfully!',
    orderSuccessDesc: 'Our team will contact you shortly to confirm the order and schedule delivery.'
  }
};

export default function Cart() {
  const { cartItems, setCartItems, lang, isRtl } = useOutletContext();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  
  const t = translations[lang] || translations.ar;

  // دوال التحكم في السلة
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // محاكاة عملية إتمام الطلب وإرساله لقاعدة البيانات
    setIsOrderPlaced(true);
    setTimeout(() => {
      setCartItems([]); // تفريغ السلة بعد نجاح الطلب
    }, 3000);
  };

  // حساب المجموع
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // واجهة النجاح (بعد إتمام الطلب)
  if (isOrderPlaced) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">{t.orderSuccess}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">{t.orderSuccessDesc}</p>
          <Link 
            to="/shop" 
            onClick={() => setIsOrderPlaced(false)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md"
          >
            {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            العودة للسوق
          </Link>
        </div>
      </div>
    );
  }

  // واجهة السلة الفارغة
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-dashed border-slate-300 dark:border-slate-700">
          <ShoppingBag className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{t.emptyTitle}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">{t.emptySubtitle}</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm"
          >
            {t.startShopping}
          </Link>
        </div>
      </div>
    );
  }

  // واجهة السلة (تحتوي على منتجات)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-indigo-600" /> {t.title}
        <span className="text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
          {cartItems.length} {t.product}
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* قائمة المنتجات في السلة */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm">
              
              {/* صورة المنتج */}
              <div className="w-full sm:w-28 h-28 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* تفاصيل المنتج */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 truncate">{item.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{item.category || item.storeName}</p>
                <div className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg" dir="ltr">{item.price} $</div>
              </div>

              {/* أدوات التحكم (الكمية والحذف) */}
              <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
                
                {/* عداد الكمية */}
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                  <button 
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-800 dark:text-white">{item.qty}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* زر الحذف */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> <span className="sm:hidden">إزالة</span>
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* ملخص الطلب الدبق (Sticky Sidebar) */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.orderSummary}</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-300 font-medium">
                <span>{t.subtotal}</span>
                <span dir="ltr">{subtotal} $</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300 font-medium pb-4 border-b border-slate-100 dark:border-slate-700">
                <span>{t.shipping}</span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400">{t.shippingCalculated}</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white font-extrabold text-xl pt-2">
                <span>{t.finalTotal}</span>
                <span className="text-indigo-600 dark:text-indigo-400" dir="ltr">{subtotal} $</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md mb-4"
            >
              {t.checkoutBtn}
            </button>

            <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
               <div className="flex items-center gap-1"><Truck className="w-4 h-4"/> توصيل سريع</div>
               <div className="flex items-center gap-1"><CreditCard className="w-4 h-4"/> دفع آمن</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}