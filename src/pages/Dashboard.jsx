import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, DollarSign, Package, AlertTriangle, ArrowUpRight, TrendingDown, Activity } from 'lucide-react';

export default function Dashboard() {
  const { products, globalSettings } = useOutletContext() || { products: [], globalSettings: { lang: 'ar', currency: '$' } };
  
  const isRtl = globalSettings.lang === 'ar';
  const currency = globalSettings.currency;

  const availableProductsCount = products.filter(p => p.stock > 0).length;
  const totalSalesVolume = products.reduce((acc, p) => acc + (p.sales || 0), 0);
  const totalRevenue = products.reduce((acc, p) => acc + (p.price * (p.sales || 0)), 0);
  const totalNetProfit = products.reduce((acc, p) => acc + ((p.netProfit || 0) * (p.sales || 0)), 0);
  
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  const mostSoldProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 4);
  const leastSoldProducts = [...products].sort((a, b) => a.sales - b.sales).slice(0, 4);

  const chartData = [
    { label: isRtl ? 'أبريل' : 'Apr', value: 1200 },
    { label: isRtl ? 'مايو' : 'May', value: 2500 },
    { label: isRtl ? 'يونيو' : 'Jun', value: 1800 },
    { label: isRtl ? 'يوليو' : 'Jul', value: 3200 },
    { label: isRtl ? 'أغسطس' : 'Aug', value: 2800 },
    { label: isRtl ? 'سبتمبر' : 'Sep', value: totalRevenue > 0 ? totalRevenue : 1500 }, 
  ];

  const maxChartValue = Math.max(...chartData.map(d => d.value), 100);
  const chartHeight = 180;
  const chartWidth = 600;
  const paddingX = 45;
  const paddingY = 20;
  const dx = (chartWidth - paddingX * 2) / (chartData.length - 1);

  const chartPoints = chartData.map((d, i) => {
    const x = paddingX + i * dx;
    const y = paddingY + chartHeight - (d.value / maxChartValue) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${paddingX},${paddingY + chartHeight} ${chartPoints} ${paddingX + (chartData.length - 1) * dx},${paddingY + chartHeight}`;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
          {isRtl ? 'الصفحة الرئيسية' : 'Dashboard'}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{isRtl ? 'إجمالي سعر المبيعات' : 'Total Revenue'}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white" dir="ltr">{totalRevenue.toLocaleString()} {currency}</h3>
            </div>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md mt-auto">
            <ArrowUpRight className="w-3 h-3" /> {isRtl ? `مبنية على ${totalSalesVolume} قطعة` : `Based on ${totalSalesVolume} units`}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{isRtl ? 'إجمالي الأرباح الصافية' : 'Total Net Profit'}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white" dir="ltr">{totalNetProfit.toLocaleString()} {currency}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{isRtl ? 'عدد المنتجات المتوفرة' : 'Available Products'}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{availableProductsCount} {isRtl ? 'منتج' : 'Items'}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${outOfStockCount > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}><AlertTriangle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{isRtl ? 'نواقص المخزون' : 'Stock Alerts'}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{outOfStockCount + lowStockCount} {isRtl ? 'تنبيه' : 'Alerts'}</h3>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1 mt-auto">
            <span className={outOfStockCount > 0 ? 'text-red-600 dark:text-red-400 font-bold' : ''}>• {outOfStockCount} {isRtl ? 'منتج نفذ تماماً' : 'out of stock'}</span>
            <span>• {lowStockCount} {isRtl ? 'أوشك على النفاذ' : 'low stock'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-slate-800 dark:text-white">{isRtl ? 'منحنى المبيعات الشهري' : 'Monthly Sales Chart'}</h2>
            </div>
            <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
              {isRtl ? 'عام 2026' : 'Year 2026'}
            </span>
          </div>

          <div className="flex-1 w-full overflow-x-auto relative">
            <div className="min-w-[500px]">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight + paddingY * 2}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                  const y = paddingY + chartHeight - (pct * chartHeight);
                  const value = Math.round(maxChartValue * pct);
                  return (
                    <g key={pct}>
                      <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-700" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x={isRtl ? chartWidth - 10 : 0} y={y + 4} fill="currentColor" className="text-[10px] text-slate-400 dark:text-slate-500" textAnchor={isRtl ? "end" : "start"}>
                        {value >= 1000 ? (value/1000).toFixed(1)+'k' : value} {currency}
                      </text>
                    </g>
                  );
                })}

                <polygon points={areaPoints} fill="url(#lineGradient)" />
                <polyline points={chartPoints} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {chartData.map((d, i) => {
                  const x = paddingX + i * dx;
                  const y = paddingY + chartHeight - (d.value / maxChartValue) * chartHeight;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#fff" stroke="#6366f1" strokeWidth="3" className="dark:fill-slate-800" />
                      <text x={x} y={y - 12} fill="currentColor" className="text-[10px] font-bold text-slate-600 dark:text-slate-300" textAnchor="middle">{d.value} {currency}</text>
                      <text x={x} y={paddingY + chartHeight + 20} fill="currentColor" className="text-[12px] font-medium text-slate-500 dark:text-slate-400" textAnchor="middle">{d.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3 bg-emerald-50/30 dark:bg-emerald-900/10">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h2 className="font-bold text-slate-800 dark:text-white text-sm">{isRtl ? 'الأكثر مبيعاً' : 'Top Selling'}</h2>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2">
              {mostSoldProducts.filter(p => p.sales > 0).length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-4">{isRtl ? 'لا توجد مبيعات بعد.' : 'No sales yet.'}</div>
              ) : (
                mostSoldProducts.filter(p => p.sales > 0).map((p, index) => (
                  <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors">
                    <span className="font-bold text-slate-300 dark:text-slate-600 w-4">{index + 1}.</span>
                    <img src={p.mainImage} className="w-10 h-10 rounded-md object-cover border border-slate-200 dark:border-slate-700" alt={p.name} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 dark:text-white text-xs truncate">{p.name}</p>
                    </div>
                    <div className="text-left" dir="ltr">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{p.sales} <span className="text-[10px] font-normal text-slate-400">Sold</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3 bg-amber-50/30 dark:bg-amber-900/10">
              <TrendingDown className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-800 dark:text-white text-sm">{isRtl ? 'الأقل مبيعاً' : 'Least Selling'}</h2>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2">
              {leastSoldProducts.map((p, index) => (
                <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors">
                  <span className="font-bold text-slate-300 dark:text-slate-600 w-4">{index + 1}.</span>
                  <img src={p.mainImage} className="w-10 h-10 rounded-md object-cover border border-slate-200 dark:border-slate-700" alt={p.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white text-xs truncate">{p.name}</p>
                  </div>
                  <div className="text-left" dir="ltr">
                    <p className="font-bold text-amber-600 dark:text-amber-400 text-sm">{p.sales} <span className="text-[10px] font-normal text-slate-400">Sold</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}