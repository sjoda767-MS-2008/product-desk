import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Truck, Plus, Edit, Trash2, CheckCircle2, X, MapPin, Package, Settings2, Power
} from 'lucide-react';

const translations = {
  ar: {
    title: 'شركات التوصيل',
    subtitle: 'أضف شركات الشحن وحدد أسعار التوصيل لعملائك.',
    addBtn: 'إضافة شركة جديدة',
    types: {
      api: 'ربط تلقائي (API)',
      manual: 'توصيل يدوي (مندوب خاص)'
    },
    table: {
      company: 'الشركة / المندوب',
      homePrice: 'توصيل للمنزل',
      deskPrice: 'توصيل للمكتب',
      status: 'الحالة',
      actions: 'إجراءات'
    },
    form: {
      addTitle: 'إضافة شركة توصيل',
      editTitle: 'تعديل أسعار التوصيل',
      name: 'اسم الشركة',
      type: 'نوع الربط',
      homePrice: 'سعر التوصيل للمنزل (الافتراضي)',
      deskPrice: 'سعر التوصيل للمكتب / نقطة الاستلام',
      cancel: 'إلغاء',
      save: 'حفظ البيانات'
    },
    empty: 'لم تقم بإضافة أي شركات توصيل بعد.',
    currency: 'د.ج' // دينار جزائري كافتراضي
  }
};

export default function ShippingCompanies() {
  const { lang } = useOutletContext();
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  // بيانات افتراضية لشركات التوصيل
  const [companies, setCompanies] = useState([
    { id: 1, name: 'Yalidine Express', type: 'api', status: true, homePrice: 800, deskPrice: 400 },
    { id: 2, name: 'توصيل العاصمة (مندوب)', type: 'manual', status: true, homePrice: 500, deskPrice: 0 }
  ]);

  // حالات النافذة المنبثقة
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ id: null, name: '', type: 'manual', homePrice: '', deskPrice: '' });

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: null, name: '', type: 'manual', homePrice: '', deskPrice: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (company) => {
    setModalMode('edit');
    setFormData({ ...company });
    setIsModalOpen(true);
  };

  const toggleStatus = (id) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: !c.status } : c));
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الشركة؟')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      setCompanies([...companies, { ...formData, id: Date.now(), status: true }]);
    } else {
      setCompanies(companies.map(c => c.id === formData.id ? { ...c, ...formData } : c));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* رأس الصفحة */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" /> {t.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
        </div>
        
        <button onClick={openAddModal} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
          <Plus className="w-4 h-4" /> {t.addBtn}
        </button>
      </div>

      {/* قائمة شركات التوصيل */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {companies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-bold">{t.table.company}</th>
                  <th className="px-6 py-4 font-bold">{t.table.homePrice}</th>
                  <th className="px-6 py-4 font-bold">{t.table.deskPrice}</th>
                  <th className="px-6 py-4 font-bold text-center">{t.table.status}</th>
                  <th className="px-6 py-4 font-bold text-center">{t.table.actions}</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${company.type === 'api' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {company.type === 'api' ? <Settings2 className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white">{company.name}</div>
                          <div className="text-xs text-slate-500">{company.type === 'api' ? t.types.api : t.types.manual}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700 dark:text-slate-200" dir="ltr">{company.homePrice} {t.currency}</span>
                    </td>
                    <td className="px-6 py-4">
                      {company.deskPrice > 0 ? (
                        <span className="font-bold text-slate-700 dark:text-slate-200" dir="ltr">{company.deskPrice} {t.currency}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => toggleStatus(company.id)} 
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${company.status ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${company.status ? (isRtl ? '-translate-x-6' : 'translate-x-6') : (isRtl ? '-translate-x-1' : 'translate-x-1')}`} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(company)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(company.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 dark:bg-slate-700 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">{t.empty}</p>
          </div>
        )}
      </div>

      {/* النافذة المنبثقة (Modal) لإضافة أو تعديل شركة */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {modalMode === 'add' ? t.form.addTitle : t.form.editTitle}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 md:p-6 space-y-5">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.form.name}</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="مثال: Yalidine Express"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.form.type}</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="api">{t.types.api}</option>
                  <option value="manual">{t.types.manual}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.form.homePrice}</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.homePrice}
                      onChange={(e) => setFormData({...formData, homePrice: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.form.deskPrice}</label>
                  <div className="relative">
                    <input 
                      type="number"
                      min="0"
                      value={formData.deskPrice}
                      onChange={(e) => setFormData({...formData, deskPrice: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                      dir="ltr"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                  {t.form.cancel}
                </button>
                <button type="submit" className="flex-[2] py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                  {t.form.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}