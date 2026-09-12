import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Store, Search, Star, MapPin, BadgeCheck, ChevronRight, ChevronLeft } from 'lucide-react';

const translations = {
  ar: {
    title: 'اكتشف المتاجر',
    subtitle: 'تسوق مباشرة من أفضل الماركات والتجار الموثوقين في منصتنا.',
    searchPlaceholder: 'ابحث عن متجر أو علامة تجارية...',
    visitStore: 'زيارة المتجر',
    reviews: 'تقييم',
    empty: 'لم يتم العثور على أي متاجر تطابق بحثك.'
  },
  en: {
    title: 'Discover Stores',
    subtitle: 'Shop directly from the best brands and trusted merchants on our platform.',
    searchPlaceholder: 'Search for a store or brand...',
    visitStore: 'Visit Store',
    reviews: 'reviews',
    empty: 'No stores found matching your search.'
  }
};

// بيانات وهمية للمتاجر (ستأتي لاحقاً من قاعدة البيانات)
const mockStores = [
  { 
    id: 1, 
    name: 'الإلكترونيات الحديثة', 
    category: 'أجهزة إلكترونية', 
    rating: 4.8, 
    reviewsCount: 1240, 
    location: 'الجزائر العاصمة',
    verified: true,
    logo: 'https://ui-avatars.com/api/?name=Tech+Store&background=4f46e5&color=fff&bold=true',
    cover: 'https://images.unsplash.com/photo-1550009158-9ebf6d0f98be?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 2, 
    name: 'سبورتس لاين', 
    category: 'ألبسة وأحذية رياضية', 
    rating: 4.5, 
    reviewsCount: 850, 
    location: 'وهران',
    verified: true,
    logo: 'https://ui-avatars.com/api/?name=Sports+Line&background=10b981&color=fff&bold=true',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 3, 
    name: 'أناقة وعطور', 
    category: 'عطور وتجميل', 
    rating: 4.9, 
    reviewsCount: 3200, 
    location: 'قسنطينة',
    verified: true,
    logo: 'https://ui-avatars.com/api/?name=Beauty&background=ec4899&color=fff&bold=true',
    cover: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 4, 
    name: 'عالم المنزل', 
    category: 'ديكور وأثاث', 
    rating: 4.2, 
    reviewsCount: 410, 
    location: 'سطيف',
    verified: false,
    logo: 'https://ui-avatars.com/api/?name=Home+World&background=f59e0b&color=fff&bold=true',
    cover: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 5, 
    name: 'جيمنج زون', 
    category: 'ألعاب فيديو وإكسسوارات', 
    rating: 4.7, 
    reviewsCount: 180, 
    location: 'الجزائر العاصمة',
    verified: true,
    logo: 'https://ui-avatars.com/api/?name=Gaming+Zone&background=8b5cf6&color=fff&bold=true',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
  },
];

export default function Stores() {
  const { lang, isRtl } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const t = translations[lang] || translations.ar;

  const filteredStores = mockStores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* رأس الصفحة والبحث */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="text-center md:text-start">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-3">
            <Store className="w-8 h-8 text-indigo-600" /> {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">{t.subtitle}</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 transition-colors ${isRtl ? 'right-4' : 'left-4'}`} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full py-3 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors shadow-sm ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
          />
        </div>
      </div>

      {/* شبكة المتاجر */}
      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStores.map(store => (
            <div key={store.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
              
              {/* صورة الغلاف */}
              <div className="h-32 w-full relative bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <img 
                  src={store.cover} 
                  alt={`${store.name} cover`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>

              {/* تفاصيل المتجر */}
              <div className="px-5 pb-5 flex-1 flex flex-col relative pt-10">
                
                {/* الشعار المطفو */}
                <div className={`absolute -top-10 ${isRtl ? 'right-5' : 'left-5'} w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-800 bg-white shadow-md overflow-hidden z-10`}>
                  <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                </div>

                {/* اسم المتجر والشارة */}
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                  {store.name}
                  {store.verified && <BadgeCheck className="w-5 h-5 text-blue-500" title="متجر موثوق" />}
                </h3>

                {/* التقييم */}
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{store.rating}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">({store.reviewsCount} {t.reviews})</span>
                </div>

                {/* التصنيف والمكان */}
                <div className="flex items-center gap-3 mt-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-md">{store.category}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {store.location}</span>
                </div>

                {/* زر الزيارة */}
                {/* ملاحظة: سنقوم ببرمجة صفحة تفاصيل المتجر (StoreDetails) لاحقاً */}
                <Link 
                  to={`/shop?store=${store.id}`} 
                  className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-center items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-2.5 rounded-xl transition-colors w-full"
                >
                  {t.visitStore} {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Link>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <Store className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">لا توجد متاجر!</h3>
          <p className="text-slate-500 dark:text-slate-400">{t.empty}</p>
        </div>
      )}

    </div>
  );
}