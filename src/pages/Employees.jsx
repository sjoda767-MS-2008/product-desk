import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, UserPlus, Mail, Phone, Shield, Trash2, Edit, X, Check, Building, Send, Key } from 'lucide-react';

const translations = {
  ar: {
    title: 'إدارة الموظفين',
    subtitle: 'إدارة فريق العمل، الصلاحيات، وإرسال الدعوات الجديدة',
    searchPlaceholder: 'ابحث بالاسم، البريد الإلكتروني، أو رقم الهاتف...',
    inviteBtn: 'دعوة موظف جديد',
    tabs: { current: 'الموظفون الحاليون', pending: 'الدعوات المعلقة' },
    form: {
      title: 'دعوة موظف جديد',
      email: 'البريد الإلكتروني',
      jobCode: 'الرمز الوظيفي المقترح',
      permissions: 'تحديد الصلاحيات',
      perms: { products: 'تعديل المنتجات', sales: 'تعديل وتسجيل المبيعات', employees: 'إدارة الموظفين' },
      send: 'إرسال الدعوة',
      cancel: 'إلغاء'
    },
    card: {
      jobCode: 'الرمز الوظيفي:',
      permissions: 'الصلاحيات الممنوحة:',
      edit: 'تعديل الصلاحيات',
      delete: 'إقالة / إبطال الرمز',
      confirmDelete: 'هل أنت متأكد من حذف الموظف؟ سيتم إبطال الرمز الوظيفي الخاص به فوراً ولن يتمكن من الدخول للنظام.',
      noEmployees: 'لا يوجد موظفين يطابقون بحثك.'
    },
    emailSim: {
      from: 'From: no-reply@',
      inviteTitle: 'دعوة للانضمام إلى فريق العمل',
      inviteBody: 'مرحباً، لقد تمت دعوتك للانضمام إلى نظام الإدارة الخاص بنا. تم تجهيز حسابك وتحديد صلاحياتك. يرجى استخدام الرمز الوظيفي أدناه لتسجيل الدخول إلى حسابك.',
      yourCode: 'الرمز الوظيفي الخاص بك:',
      loginBtn: 'الذهاب إلى صفحة تسجيل الدخول',
      pendingTag: 'بانتظار التسجيل'
    }
  },
  en: {
    title: 'Employees Management',
    subtitle: 'Manage your team, permissions, and send new invites',
    searchPlaceholder: 'Search by name, email, or phone...',
    inviteBtn: 'Invite Employee',
    tabs: { current: 'Current Employees', pending: 'Pending Invites' },
    form: {
      title: 'Invite New Employee',
      email: 'Email Address',
      jobCode: 'Suggested Job Code',
      permissions: 'Set Permissions',
      perms: { products: 'Manage Products', sales: 'Manage Sales', employees: 'Manage Employees' },
      send: 'Send Invite',
      cancel: 'Cancel'
    },
    card: {
      jobCode: 'Job Code:',
      permissions: 'Granted Permissions:',
      edit: 'Edit Permissions',
      delete: 'Revoke Access / Delete',
      confirmDelete: 'Are you sure you want to delete this employee? Their job code will be revoked immediately.',
      noEmployees: 'No employees match your search.'
    },
    emailSim: {
      from: 'From: no-reply@',
      inviteTitle: 'Invitation to Join the Team',
      inviteBody: 'Hello, you have been invited to join our management system. Your account and permissions have been set up. Please use the job code below to log in.',
      yourCode: 'Your Job Code:',
      loginBtn: 'Go to Login Page',
      pendingTag: 'Pending Registration'
    }
  }
};

const generateJobCode = () => 'EMP-' + Math.floor(1000 + Math.random() * 9000);

const initialEmployees = [
  { id: 1, name: 'أحمد محمود', email: 'ahmed@example.com', phone: '0555 123 456', avatar: 'https://ui-avatars.com/api/?name=أحمد+محمود&background=6366f1&color=fff', jobCode: 'EMP-9921', permissions: { products: true, sales: true, employees: false } },
  { id: 2, name: 'سارة خالد', email: 'sara@example.com', phone: '0666 987 654', avatar: 'https://ui-avatars.com/api/?name=سارة+خالد&background=10b981&color=fff', jobCode: 'EMP-4452', permissions: { products: false, sales: true, employees: false } },
];

const initialPending = [
  { id: 1, email: 'omar.dev@example.com', jobCode: 'EMP-7710', permissions: { products: true, sales: false, employees: false } }
];

export default function Employees() {
  // سحب الإعدادات المركزية
  const { addNotification, globalSettings } = useOutletContext() || { globalSettings: { lang: 'ar', companyName: 'Product Desk', companyLogo: null } };
  
  const lang = globalSettings.lang === 'en' ? 'en' : 'ar';
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  const [employees, setEmployees] = useState(initialEmployees);
  const [pendingInvites, setPendingInvites] = useState(initialPending);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', jobCode: '', permissions: { products: true, sales: true, employees: false } });
  
  const [simulatedEmail, setSimulatedEmail] = useState(null);

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(search) || 
      emp.email.toLowerCase().includes(search) || 
      emp.phone.includes(search)
    );
  }, [employees, searchTerm]);

  const handleOpenInvite = () => {
    setInviteForm({ email: '', jobCode: generateJobCode(), permissions: { products: true, sales: true, employees: false } });
    setIsInviteModalOpen(true);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.email) return;

    const newInvite = { id: Date.now(), ...inviteForm };
    setPendingInvites([newInvite, ...pendingInvites]);
    setIsInviteModalOpen(false);
    
    setSimulatedEmail(newInvite);
    if(addNotification) addNotification('success', lang === 'ar' ? 'تم إرسال دعوة الانضمام بنجاح!' : 'Invitation sent successfully!');
  };

  const handleDeleteEmployee = (id, name) => {
    if (window.confirm(t.card.confirmDelete)) {
      setEmployees(employees.filter(emp => emp.id !== id));
      if(addNotification) addNotification('info', lang === 'ar' ? `تم حذف الموظف "${name}" وإبطال رمزه الوظيفي.` : `Employee "${name}" has been removed.`);
    }
  };

  const PermissionBadge = ({ label, allowed }) => (
    <span className={`text-[10px] px-2 py-1 rounded-md font-bold flex items-center gap-1 ${allowed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
      {allowed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {label}
    </span>
  );

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t.subtitle}</p>
        </div>
        <button onClick={handleOpenInvite} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm w-full sm:w-auto justify-center">
          <UserPlus className="w-4 h-4" /> {t.inviteBtn}
        </button>
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
      </div>

      {/* قسم الموظفون الحاليون */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-500" /> {t.tabs.current}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
              <div className="p-5 flex items-start gap-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20">
                <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg truncate">{emp.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 w-fit px-2 py-0.5 rounded-md">
                    <Key className="w-3 h-3" /> {t.card.jobCode} <span className="font-mono" dir="ltr">{emp.jobCode}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4 flex-1">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> <span dir="ltr">{emp.email}</span></p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> <span dir="ltr" className={isRtl ? 'text-right' : 'text-left'}>{emp.phone}</span></p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{t.card.permissions}</p>
                  <div className="flex flex-wrap gap-2">
                    <PermissionBadge label={t.form.perms.products} allowed={emp.permissions.products} />
                    <PermissionBadge label={t.form.perms.sales} allowed={emp.permissions.sales} />
                    <PermissionBadge label={t.form.perms.employees} allowed={emp.permissions.employees} />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <button className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex justify-center items-center gap-2">
                  <Edit className="w-3.5 h-3.5" /> {t.card.edit}
                </button>
                <button onClick={() => handleDeleteEmployee(emp.id, emp.name)} className="py-2 px-3 text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex justify-center items-center" title={t.card.delete}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && <p className="col-span-full py-8 text-center text-slate-500">{t.card.noEmployees}</p>}
        </div>
      </div>

      {/* قسم الدعوات المعلقة */}
      {pendingInvites.length > 0 && (
        <div className="pt-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-500" /> {t.tabs.pending}
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {pendingInvites.map((invite, idx) => (
              <div key={invite.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${idx !== pendingInvites.length -1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}`}>
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${invite.email}&background=cbd5e1&color=475569`} alt="avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm" dir="ltr">{invite.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{t.card.jobCode} {invite.jobCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{t.emailSim.pendingTag}</span>
                  <button onClick={() => setPendingInvites(pendingInvites.filter(i => i.id !== invite.id))} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* نافذة دعوة موظف */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-auto" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.form.title}</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSendInvite} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.email}</label>
                <input type="email" required value={inviteForm.email} onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" placeholder="employee@company.com" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t.form.jobCode}</label>
                <input type="text" readOnly value={inviteForm.jobCode} className="w-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-mono font-bold rounded-lg px-4 py-2.5 text-center text-lg outline-none cursor-not-allowed" />
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-bold text-slate-800 dark:text-white mb-3">{t.form.permissions}</label>
                <div className="space-y-3">
                  {Object.entries(t.form.perms).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:border-indigo-300 transition-colors">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={inviteForm.permissions[key]} onChange={(e) => setInviteForm({...inviteForm, permissions: {...inviteForm.permissions, [key]: e.target.checked}})} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${inviteForm.permissions[key] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        <div className={`dot absolute ${isRtl ? 'right-1' : 'left-1'} top-1 bg-white w-4 h-4 rounded-full transition-transform ${inviteForm.permissions[key] ? (isRtl ? 'transform -translate-x-4' : 'transform translate-x-4') : ''}`}></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t.form.cancel}</button>
                <button type="submit" className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/30 flex justify-center items-center gap-2"><Send className="w-4 h-4" />{t.form.send}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* محاكاة شكل البريد الإلكتروني المرسل للموظف */}
      {simulatedEmail && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300" dir="ltr">
            <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2">
              <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400"></span><span className="w-3 h-3 rounded-full bg-amber-400"></span><span className="w-3 h-3 rounded-full bg-emerald-400"></span></div>
              <span className="text-xs text-slate-500 ml-4 font-mono">{t.emailSim.from}{globalSettings.companyName.replace(/\s+/g, '').toLowerCase()}.com</span>
            </div>
            
            <div className="p-8 flex flex-col items-center text-center bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200 overflow-hidden">
                {/* استخدام شعار الشركة من الإعدادات إذا كان متاحاً */}
                {globalSettings.companyLogo ? (
                  <img src={globalSettings.companyLogo} alt="Logo" className="w-full h-full object-cover bg-white" />
                ) : (
                  <Building className="w-8 h-8" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{globalSettings.companyName}</h2>
              <h3 className="text-lg font-bold text-slate-600 mb-4">{t.emailSim.inviteTitle}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {t.emailSim.inviteBody}
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full mb-6">
                <p className="text-xs text-slate-500 mb-1">{t.emailSim.yourCode}</p>
                <p className="text-3xl font-mono font-bold text-indigo-600 tracking-widest">{simulatedEmail.jobCode}</p>
              </div>

              <button onClick={() => setSimulatedEmail(null)} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
                {t.emailSim.loginBtn}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}