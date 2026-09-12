import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, ShoppingBag, Clock, CheckCircle, XCircle, Package, MoreHorizontal, Filter } from 'lucide-react';

const translations = {
  ar: {
    title: 'إدارة الطلبات',
    subtitle: 'متابعة طلبات الزبائن، وتحديث حالات الشحن والتوصيل',
    searchPlaceholder: 'ابحث برقم الطلب، اسم الزبون، أو رقم الهاتف...',
    status: {
      pending: 'قيد الانتظار',
      processing: 'جاري التجهيز',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    },
    table: {
      orderId: 'رقم الطلب',
      customer: 'الزبون',
      product: 'المنتج',
      total: 'الإجمالي',
      status: 'الحالة',
      date: 'التاريخ',
      actions: 'إجراءات'
    },
    noOrders: 'لا توجد طلبات تطابق بحثك حالياً.',
    changeStatus: 'تغيير الحالة'
  },
  en: {
    title: 'Orders Management',
    subtitle: 'Track customer orders and update shipping statuses',
    searchPlaceholder: 'Search by order ID, customer name, or phone...',
    status: {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    table: {
      orderId: 'Order ID',
      customer: 'Customer',
      product: 'Product',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      actions: 'Actions'
    },
    noOrders: 'No orders match your search currently.',
    changeStatus: 'Change Status'
  }
};

// بيانات وهمية للطلبات (سيتم ربطها بقاعدة البيانات لاحقاً)
const initialOrders = [
  { id: 'ORD-1001', customerName: 'ياسين محمد', phone: '0555 11 22 33', productName: 'سماعات رأس لاسلكية', qty: 2, total: 700, status: 'pending', date: Date.now() - 3600000 },
  { id: 'ORD-1002', customerName: 'كريم أحمد', phone: '0666 99 88 77', productName: 'لوحة مفاتيح ميكانيكية', qty: 1, total: 150, status: 'processing', date: Date.now() - 86400000 },
  { id: 'ORD-1003', customerName: 'ليلى عبد الله', phone: '0777 44 55 66', productName: 'شاشة حاسوب 27 بوصة', qty: 1, total: 320, status: 'completed', date: Date.now() - 172800000 },
  { id: 'ORD-1004', customerName: 'عمر فاروق', phone: '0555 00 11 22', productName: 'فأرة ألعاب احترافية', qty: 3, total: 270, status: 'cancelled', date: Date.now() - 259200000 },
];

export default function Orders() {
  const { globalSettings, addNotification } = useOutletContext() || { globalSettings: { lang: 'ar', currency: '$' } };
  
  const lang = globalSettings.lang === 'en' ? 'en' : 'ar';
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';
  const currency = globalSettings.currency;

  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const formatDate = (timestamp) => {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-DZ' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return orders.filter(order => {
      const matchSearch = order.id.toLowerCase().includes(search) || order.customerName.toLowerCase().includes(search) || order.phone.includes(search);
      const matchStatus = filterStatus === 'all' || order.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    setActiveDropdown(null);
    if (addNotification) addNotification('success', lang === 'ar' ? `تم تحديث حالة الطلب ${orderId} بنجاح` : `Order ${orderId} status updated`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'processing': return <Package className="w-3.5 h-3.5" />;
      case 'completed': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t.subtitle}</p>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
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

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="w-full sm:w-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
          >
            <option value="all">جميع الطلبات</option>
            <option value="pending">{t.status.pending}</option>
            <option value="processing">{t.status.processing}</option>
            <option value="completed">{t.status.completed}</option>
            <option value="cancelled">{t.status.cancelled}</option>
          </select>
        </div>
      </div>

      {/* قائمة الطلبات (على شكل بطاقات لتناسب الجوال والشاشات الكبيرة) */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-visible flex flex-col lg:flex-row transition-all hover:shadow-md">
            
            {/* معلومات الطلب والزبون */}
            <div className={`flex flex-col sm:flex-row gap-4 p-5 flex-1 border-b lg:border-b-0 ${isRtl ? 'lg:border-l' : 'lg:border-r'} border-slate-100 dark:border-slate-700/50`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded text-xs">
                    {order.id}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400" dir="ltr">{formatDate(order.date)}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{order.customerName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1" dir="ltr">
                   {order.phone}
                </p>
              </div>

              {/* تفاصيل المنتج المشتراة */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.table.product}</p>
                <p className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{order.productName}</p>
                <div className="flex items-center gap-2 mt-2 text-sm font-bold">
                  <span className="text-slate-500 dark:text-slate-400">الكمية: {order.qty}</span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="text-emerald-600 dark:text-emerald-400" dir="ltr">{order.total.toLocaleString()} {currency}</span>
                </div>
              </div>
            </div>

            {/* الإجراءات وحالة الطلب */}
            <div className="p-5 flex flex-row lg:flex-col justify-between items-center lg:items-end w-full lg:w-48 gap-3">
              
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${getStatusStyle(order.status)}`}>
                {getStatusIcon(order.status)}
                {t.status[order.status]}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" /> {t.changeStatus}
                </button>
                
                {/* القائمة المنسدلة لتغيير الحالة */}
                {activeDropdown === order.id && (
                  <div className={`absolute top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-10 ${isRtl ? 'left-0' : 'right-0'}`}>
                    {Object.keys(t.status).map(statusKey => (
                      <button
                        key={statusKey}
                        onClick={() => handleStatusChange(order.id, statusKey)}
                        className={`w-full text-start px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${order.status === statusKey ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        {t.status[statusKey]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">{t.noOrders}</p>
          </div>
        )}
      </div>

    </div>
  );
}