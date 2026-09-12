import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ShoppingCart, Search, Check, TrendingUp } from 'lucide-react';

const translations = {
  ar: {
    searchPlaceholder: 'ابحث عن منتج، تصنيف، أو علامة تجارية...',
    addToCart: 'أضف للسلة',
    added: 'تمت الإضافة',
    price: 'السعر',
    empty: 'عذراً، لا توجد منتجات تطابق بحثك.',
    trending: 'المنتجات الرائجة'
  },
  en: {
    searchPlaceholder: 'Search for products, categories, or brands...',
    addToCart: 'Add to Cart',
    added: 'Added',
    price: 'Price',
    empty: 'Sorry, no products match your search.',
    trending: 'Trending Products'
  }
};

// بيانات وهمية للمتجر (ستأتي لاحقاً من قاعدة البيانات)
const storeProducts = [
  { id: 1, name: 'سماعات رأس لاسلكية سوني مع عزل الضوضاء', category: 'إلكترونيات', price: 350, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80', storeName: 'الإلكترونيات الحديثة' },
  { id: 2, name: 'لوحة مفاتيح ميكانيكية احترافية للألعاب', category: 'إكسسوارات', price: 120, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80', storeName: 'جيمنج زون' },
  { id: 3, name: 'ساعة ذكية رياضية مقاومة للماء', category: 'إلكترونيات', price: 199, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80', storeName: 'فيتنس ستور' },
  { id: 4, name: 'حقيبة ظهر لابتوب عملية ومقاومة للماء', category: 'مستلزمات', price: 45, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80', storeName: 'حقيبتي' },
  { id: 5, name: 'حذاء رياضي مريح للجري', category: 'أزياء', price: 85, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', storeName: 'سبورتس لاين' },
  { id: 6, name: 'نظارات شمسية كلاسيكية', category: 'إكسسوارات', price: 25, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281501f?auto=format&fit=crop&w=400&q=80', storeName: 'عالم النظارات' },
];

export default function Shop() {
  const { cartItems, setCartItems, lang, isRtl } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const t = translations[lang] || translations.ar;

  const filteredProducts = storeProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // منع الانتقال لصفحة المنتج عند الضغط على زر السلة
    e.stopPropagation();

    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const isProductInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* شريط البحث المطور (أسلوب الأسواق العالمية) */}
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="relative group">
          <Search className={`w-6 h-6 text-slate-400 absolute top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-600 ${isRtl ? 'right-5' : 'left-5'}`} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full py-4 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors shadow-sm text-lg ${isRtl ? 'pr-14 pl-6' : 'pl-14 pr-6'}`}
          />
          <button className={`absolute top-2 bottom-2 ${isRtl ? 'left-2' : 'right-2'} bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-full font-bold transition-colors`}>
            بحث
          </button>
        </div>
      </div>

      {/* عنوان الأقسام */}
      {!searchTerm && (
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.trending}</h2>
        </div>
      )}

      {/* شبكة المنتجات (بطاقات قابلة للضغط) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map(product => {
            const inCart = isProductInCart(product.id);
            return (
              <Link 
                to={`/p/${product.id}`} 
                key={product.id} 
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
              >
                {/* صورة المنتج */}
                <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-900 p-4 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* شارة المتجر */}
                  <div className={`absolute bottom-2 ${isRtl ? 'right-2' : 'left-2'} bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700`}>
                    {product.storeName}
                  </div>
                </div>
                
                {/* تفاصيل المنتج */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm text-slate-700 dark:text-slate-200 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="font-extrabold text-lg text-slate-900 dark:text-white" dir="ltr">{product.price} $</p>
                    </div>
                    
                    {/* زر الإضافة للسلة */}
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm z-10 ${
                        inCart 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' 
                        : 'bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-indigo-500'
                      }`}
                      title={inCart ? t.added : t.addToCart}
                    >
                      {inCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">لا توجد نتائج!</h3>
          <p className="text-slate-500 dark:text-slate-400">{t.empty}</p>
        </div>
      )}

    </div>
  );
}