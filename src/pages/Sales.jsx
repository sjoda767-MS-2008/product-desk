import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, ShoppingCart, TrendingUp, DollarSign, Calendar, Package, CheckCircle, X, LayoutGrid, List } from 'lucide-react';

const translations = {
  ar: {
    title: 'سجل المبيعات والأرباح',
    subtitle: 'متابعة أداء المنتجات، الأرباح الصافية، وتاريخ آخر المبيعات',
    searchPlaceholder: 'ابحث عن منتج بالاسم أو الكود...',
    sortBy: 'ترتيب حسب:',
    sortOptions: { 
      latest: 'آخر عملية بيع (الحديثة)', 
      mostSold: 'الأكثر مبيعاً', 
      leastSold: 'الأقل مبيعاً' 
    },
    card: {
      unitPrice: 'سعر القطعة',
      qtySold: 'المباع',
      totalRevenue: 'إجمالي سعر المبيعات',
      netProfit: 'إجمالي الربح',
      lastSale: 'تاريخ آخر بيع',
      noSales: 'لم يتم البيع بعد',
      recordSaleBtn: 'تسجيل بيع',
      stockLeft: 'متبقي:'
    },
    modal: {
      title: 'تسجيل عملية بيع',
      qtyLabel: 'الكمية المباعة',
      cancel: 'إلغاء',
      confirm: 'تأكيد البيع'
    }
  },
  en: {
    title: 'Sales & Profits Ledger',
    subtitle: 'Track product performance, net profits, and latest sales',
    searchPlaceholder: 'Search product by name or code...',
    sortBy: 'Sort by:',
    sortOptions: { 
      latest: 'Latest Sale', 
      mostSold: 'Most Sold', 
      leastSold: 'Least Sold' 
    },
    card: {
      unitPrice: 'Unit Price',
      qtySold: 'Qty Sold',
      totalRevenue: 'Total Revenue',
      netProfit: 'Net Profit',
      lastSale: 'Last Sale Date',
      noSales: 'No sales yet',
      recordSaleBtn: 'Record Sale',
      stockLeft: 'Left:'
    },
    modal: {
      title: 'Record a Sale',
      qtyLabel: 'Quantity Sold',
      cancel: 'Cancel',
      confirm: 'Confirm Sale'
    }
  }
};

export default function Sales() {
  const { addNotification, products, setProducts, globalSettings } = useOutletContext() || { products: [], setProducts: () => {}, globalSettings: { lang: 'ar', currency: '$' } };
  
  const lang = globalSettings.lang === 'en' ? 'en' : 'ar';
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';
  const currency = globalSettings.currency;

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  
  const [sellingProduct, setSellingProduct] = useState(null);
  const [sellQty, setSellQty] = useState(1);

  const formatDate = (timestamp) => {
    if (!timestamp) return t.card.noSales;
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-DZ' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    switch (sortBy) {
      case 'mostSold': return result.sort((a, b) => b.sales - a.sales);
      case 'leastSold': return result.sort((a, b) => a.sales - b.sales);
      case 'latest': default: return result.sort((a, b) => (b.lastSaleDate || 0) - (a.lastSaleDate || 0));
    }
  }, [products, searchTerm, sortBy]);

  const handleConfirmSale = (e) => {
    e.preventDefault();
    if (!sellingProduct || sellQty <= 0) return;

    if (sellQty > sellingProduct.stock) {
      if(addNotification) addNotification('warning', `الكمية المطلوبة غير متوفرة! المتبقي: ${sellingProduct.stock}`);
      return;
    }

    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === sellingProduct.id) {
        return { ...p, stock: p.stock - sellQty, sales: p.sales + sellQty, lastSaleDate: Date.now() };
      }
      return p;
    }));

    if(addNotification) {
      const totalSaleValue = sellingProduct.price * sellQty;
      addNotification('success', `تم تسجيل بيع ${sellQty} قطع بإجمالي ${totalSaleValue.toLocaleString()} ${currency}`);
    }

    setSellingProduct(null);
    setSellQty(1);
  };

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-4 transition-colors">
        <div className="relative flex-1">
          <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">{t.sortBy}</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="w-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <option value="latest">{t.sortOptions.latest}</option>
              <option value="mostSold">{t.sortOptions.mostSold}</option>
              <option value="leastSold">{t.sortOptions.leastSold}</option>
            </select>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700 flex-shrink-0">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`} title="عرض كبطاقات">
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`} title="عرض كقائمة">
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
        {filteredAndSortedProducts.map((product) => {
          const totalRevenue = product.price * product.sales;
          const totalNetProfit = product.netProfit * product.sales;
          const isOutOfStock = product.stock <= 0;

          if (viewMode === 'grid') {
            return (
              <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
                <div className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-white truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{product.code}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${isOutOfStock ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {t.card.stockLeft} {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* تصحيح محاذاة الأرقام باستخدام span بدلاً من جعل السطر كله ltr */}
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.card.unitPrice}</p>
                    <p className="font-bold text-slate-800 dark:text-white">
                      <span dir="ltr">{product.price.toLocaleString()} {currency}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Package className="w-3 h-3"/> {t.card.qtySold}</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{product.sales}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {t.card.totalRevenue}</p>
                    <p className="font-bold text-slate-800 dark:text-white">
                      <span dir="ltr">{totalRevenue.toLocaleString()} {currency}</span>
                    </p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> {t.card.netProfit}</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      <span dir="ltr">{totalNetProfit.toLocaleString()} {currency}</span>
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{t.card.lastSale}:</span>
                  </div>
                  <span className={`font-medium ${!product.lastSaleDate ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    <span dir="ltr">{formatDate(product.lastSaleDate)}</span>
                  </span>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
                  <button 
                    onClick={() => { setSellingProduct(product); setSellQty(1); }}
                    disabled={isOutOfStock}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${isOutOfStock ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t.card.recordSaleBtn}
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col lg:flex-row items-center transition-all hover:shadow-md">
                <div className={`flex items-center gap-4 p-4 w-full lg:w-1/4 bg-slate-50/50 dark:bg-slate-900/20 border-b lg:border-b-0 ${isRtl ? 'lg:border-l' : 'lg:border-r'} border-slate-100 dark:border-slate-700/50 lg:h-full`}>
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-white truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{product.code}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isOutOfStock ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {t.card.stockLeft} {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:flex-1 lg:h-full items-center justify-items-center">
                  <div className="flex flex-col items-center text-center">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">{t.card.unitPrice}</p>
                    <p className="font-bold text-sm text-slate-800 dark:text-white">
                      <span dir="ltr">{product.price.toLocaleString()} {currency}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1"><Package className="w-3 h-3"/> {t.card.qtySold}</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{product.sales}</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3"/> {t.card.totalRevenue}</p>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">
                      <span dir="ltr">{totalRevenue.toLocaleString()} {currency}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mb-1 flex items-center justify-center gap-1"><DollarSign className="w-3 h-3"/> {t.card.netProfit}</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      <span dir="ltr">{totalNetProfit.toLocaleString()} {currency}</span>
                    </p>
                  </div>
                </div>

                <div className={`p-4 flex flex-row lg:flex-col justify-between items-center lg:items-end gap-3 w-full lg:w-48 bg-slate-50/30 dark:bg-slate-900/10 border-t lg:border-t-0 ${isRtl ? 'lg:border-r' : 'lg:border-l'} border-slate-100 dark:border-slate-700/50 lg:h-full`}>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col lg:items-end" dir="ltr">
                    <span className="text-[10px] uppercase opacity-70 mb-0.5 hidden lg:block">{t.card.lastSale}</span>
                    <span className="font-medium">{formatDate(product.lastSaleDate)}</span>
                  </div>
                  <button 
                    onClick={() => { setSellingProduct(product); setSellQty(1); }}
                    disabled={isOutOfStock}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${isOutOfStock ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm w-full lg:w-auto'}`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {t.card.recordSaleBtn}
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>

      {sellingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-slate-800 dark:text-white">{t.modal.title}</h3>
              <button onClick={() => setSellingProduct(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleConfirmSale} className="p-6">
              <div className="flex items-center gap-4 mb-6">
                 <img src={sellingProduct.mainImage} className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                 <div>
                   <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{sellingProduct.name}</p>
                   <p className="text-sm text-slate-500 dark:text-slate-400">
                     {t.card.unitPrice}: <span className="font-bold text-indigo-600 dark:text-indigo-400 px-1" dir="ltr">{sellingProduct.price.toLocaleString()} {currency}</span>
                   </p>
                 </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.modal.qtyLabel}</label>
                <input type="number" min="1" max={sellingProduct.stock} required value={sellQty} onChange={(e) => setSellQty(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none text-center" />
                <p className="text-xs text-slate-500 mt-2 text-center">المخزون المتاح: <span className="font-bold">{sellingProduct.stock}</span></p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSellingProduct(null)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t.modal.cancel}</button>
                <button type="submit" className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/30 flex justify-center items-center gap-2"><CheckCircle className="w-5 h-5" />{t.modal.confirm}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}