import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Tags, Search, Monitor, Shirt, Home, Watch, 
  Dumbbell, Sparkles, Glasses, Gamepad2, ChevronRight, ChevronLeft 
} from 'lucide-react';

const translations = {
  ar: {
    title: 'جميع التصنيفات',
    subtitle: 'تصفح آلاف المنتجات الموزعة على تصنيفاتنا المتنوعة.',
    searchPlaceholder: 'ابحث عن تصنيف...',
    items: 'منتج',
    empty: 'لم يتم العثور على أي تصنيفات تطابق بحثك.'
  },
  en: {
    title: 'All Categories',
    subtitle: 'Browse thousands of products across our diverse categories.',
    searchPlaceholder: 'Search for a category...',
    items: 'items',
    empty: 'No categories found matching your search.'
  }
};

// بيانات وهمية للتصنيفات
const mockCategories = [
  { id: 1, name: 'أجهزة إلكترونية', icon: Monitor, count: 1240, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 2, name: 'الأزياء والموضة', icon: Shirt, count: 3450, color: 'text-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  { id: 3, name: 'المنزل والديكور', icon: Home, count: 890, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 4, name: 'الساعات والمجوهرات', icon: Watch, count: 420, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 5, name: 'الرياضة واللياقة', icon: Dumbbell, count: 650, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 6, name: 'الصحة والجمال', icon: Sparkles, count: 2100, color: 'text-rose-600', bgColor: 'bg-rose-50 dark:bg-rose-900/20' },
  { id: 7, name: 'نظارات وإكسسوارات', icon: Glasses, count: 780, color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 8, name: 'ألعاب فيديو وتسلية', icon: Gamepad2, count: 540, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
];

export default function Categories() {
  const { lang, isRtl } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const t = translations[lang] || translations.ar;

  const filteredCategories = mockCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* رأس الصفحة والبحث */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="text-center md:text-start">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-3">
            <Tags className="w-8 h-8 text-indigo-600" /> {t.title}
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

      {/* شبكة التصنيفات */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link 
                to={`/shop?category=${category.name}`} 
                key={category.id} 
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all group p-6 flex flex-col items-center text-center"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${category.bgColor}`}>
                  <Icon className={`w-10 h-10 ${category.color}`} />
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {category.count} {t.items}
                </p>

                <div className={`mt-4 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                  {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <Tags className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">لا توجد نتائج!</h3>
          <p className="text-slate-500 dark:text-slate-400">{t.empty}</p>
        </div>
      )}

    </div>
  );
}