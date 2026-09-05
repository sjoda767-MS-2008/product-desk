import React, { useState } from 'react';
import { Boxes, Search, PlusCircle, MinusCircle, AlertTriangle, XCircle, CheckCircle2, ArrowUpDown } from 'lucide-react';

export default function Inventory({ user }) {
  const isRtl = user?.lang !== 'en';
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [inventory, setInventory] = useState([
    { id: 'inv-1', name: isRtl ? 'لابتوب ديل XPS 13' : 'Dell XPS 13 Laptop', code: 'LAP-DXPS-01', quantity: 15, minStock: 5 },
    { id: 'inv-2', name: isRtl ? 'شاشة سامسونج 27 بوصة' : 'Samsung 27" Monitor', code: 'MON-SAM-27', quantity: 3, minStock: 5 },
    { id: 'inv-3', name: isRtl ? 'طابعة إتش بي ليزر' : 'HP LaserJet Printer', code: 'PRN-HP-001', quantity: 0, minStock: 2 }
  ]);

  // تحديث الكمية (إضافة أو سحب)
  const handleUpdateQuantity = (id, delta) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const getStatusBadge = (qty, min) => {
    if (qty === 0) return { label: isRtl ? 'نفد' : 'Out of Stock', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle };
    if (qty <= min) return { label: isRtl ? 'منخفض' : 'Low Stock', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle };
    return { label: isRtl ? 'متوفر' : 'In Stock', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
  };

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'low') return matchesSearch && item.quantity > 0 && item.quantity <= item.minStock;
    if (filterStatus === 'out') return matchesSearch && item.quantity === 0;
    if (filterStatus === 'available') return matchesSearch && item.quantity > item.minStock;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{isRtl ? 'إدارة المخزون' : 'Inventory Control'}</h1>
        <p className="text-sm text-slate-500 mt-1">{isRtl ? 'تتبع الكميات الحالية وتحديث المخزون بشكل فوري.' : 'Track stock levels and update stock quantities.'}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full md:w-auto">
          {['all', 'available', 'low', 'out'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? (isRtl ? 'الكل' : 'All') : status === 'available' ? (isRtl ? 'المتوفر' : 'In Stock') : status === 'low' ? (isRtl ? 'منخفض' : 'Low Stock') : (isRtl ? 'منتهي' : 'Out of Stock')}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72 relative">
          <Search className={`w-4 h-4 text-slate-400 absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={isRtl ? 'ابحث في المخزون...' : 'Search inventory...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-sm focus:ring-2 focus:ring-indigo-500`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4 text-start">{isRtl ? 'اسم المنتج' : 'Product Name'}</th>
              <th className="p-4 text-center">{isRtl ? 'الكود' : 'Code'}</th>
              <th className="p-4 text-center">{isRtl ? 'الحد الأدنى' : 'Min Stock'}</th>
              <th className="p-4 text-center">{isRtl ? 'الكمية الحالية' : 'Current Stock'}</th>
              <th className="p-4 text-center">{isRtl ? 'حالة المخزون' : 'Status'}</th>
              <th className="p-4 text-center">{isRtl ? 'تعديل المخزون' : 'Adjust Stock'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => {
              const status = getStatusBadge(item.quantity, item.minStock);
              const Icon = status.icon;
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-slate-800 text-start">{item.name}</td>
                  <td className="p-4 text-center font-mono text-slate-500">{item.code}</td>
                  <td className="p-4 text-center text-slate-500">{item.minStock}</td>
                  <td className="p-4 text-center font-bold text-slate-800 text-base">{item.quantity}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 transition"
                        title={isRtl ? 'إنقاص الكمية' : 'Decrease'}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="p-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition"
                        title={isRtl ? 'زيادة الكمية' : 'Increase'}
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}