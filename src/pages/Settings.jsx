import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Globe, Moon, Sun, User, Building, Mail, Phone, Key, ShieldAlert, ChevronDown, CheckCircle, Upload, Info, MapPin } from 'lucide-react';

const translations = {
  ar: {
    title: 'الإعدادات',
    subtitle: 'إدارة تفضيلات النظام، الحساب، ومعلومات الشركة',
    searchPlaceholder: 'ابحث في الإعدادات (مثال: اللغة، البريد، العملة)...',
    sections: {
      appearance: { title: 'المظهر واللغة', desc: 'تخصيص الواجهة، لغة النظام، والعملة الافتراضية.' },
      account: { title: 'معلومات الحساب', desc: 'تحديث البيانات الشخصية، وطرق التواصل.' },
      company: { title: 'معلومات الشركة', desc: 'إدارة اسم وشعار الشركة (للمدير فقط).' }
    },
    fields: {
      language: 'لغة النظام',
      theme: 'مظهر الواجهة',
      currency: 'العملة المعتمدة',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني المرتبط',
      phone: 'رقم الهاتف',
      country: 'الدولة',
      jobCode: 'الرمز الوظيفي الحالي',
      companyName: 'اسم الشركة',
      companyLogo: 'شعار الشركة',
    },
    actions: {
      save: 'حفظ التغييرات',
      requestCodeChange: 'طلب تغيير الرمز الوظيفي',
      dark: 'داكن',
      light: 'فاتح',
      uploadLogo: 'رفع شعار',
      adminOnly: 'عذراً، التعديل متاح للمدير العام فقط.',
      confirmAccount: 'سيتم تحديث معلومات الحساب، هل تود المتابعة؟',
      confirmRequest: 'هل أنت متأكد من إرسال طلب للمدير لتغيير رمزك الوظيفي الحالي؟'
    }
  },
  en: {
    title: 'Settings',
    subtitle: 'Manage system preferences, account, and company info',
    searchPlaceholder: 'Search settings (e.g., Language, Email, Currency)...',
    sections: {
      appearance: { title: 'Appearance & Language', desc: 'Customize UI, language, and default currency.' },
      account: { title: 'Account Information', desc: 'Update personal data and contact methods.' },
      company: { title: 'Company Information', desc: 'Manage company name and logo (Admin only).' }
    },
    fields: {
      language: 'System Language',
      theme: 'UI Theme',
      currency: 'Default Currency',
      name: 'Full Name',
      email: 'Linked Email',
      phone: 'Phone Number',
      country: 'Country',
      jobCode: 'Current Job Code',
      companyName: 'Company Name',
      companyLogo: 'Company Logo',
    },
    actions: {
      save: 'Save Changes',
      requestCodeChange: 'Request Code Change',
      dark: 'Dark',
      light: 'Light',
      uploadLogo: 'Upload Logo',
      adminOnly: 'Editing is restricted to Administrators only.',
      confirmAccount: 'Account information will be updated. Proceed?',
      confirmRequest: 'Send a request to your manager to change your job code?'
    }
  },
  fr: {
    title: 'Paramètres',
    subtitle: 'Gérer les préférences, le compte et les infos de l\'entreprise',
    searchPlaceholder: 'Rechercher...',
    sections: {
      appearance: { title: 'Apparence et langue', desc: 'Personnaliser l\'interface, la langue et la devise.' },
      account: { title: 'Informations du compte', desc: 'Mettre à jour les données personnelles.' },
      company: { title: 'Informations de l\'entreprise', desc: 'Gérer le nom et le logo (Admin).' }
    },
    fields: {
      language: 'Langue du système',
      theme: 'Thème',
      currency: 'Devise par défaut',
      name: 'Nom complet',
      email: 'Adresse e-mail',
      phone: 'Numéro de téléphone',
      country: 'Pays',
      jobCode: 'Code d\'emploi',
      companyName: 'Nom de l\'entreprise',
      companyLogo: 'Logo de l\'entreprise',
    },
    actions: {
      save: 'Enregistrer',
      requestCodeChange: 'Demander un changement de code',
      dark: 'Sombre',
      light: 'Clair',
      uploadLogo: 'Télécharger le logo',
      adminOnly: 'Modification réservée à l\'administrateur.',
      confirmAccount: 'Les informations seront mises à jour. Continuer ?',
      confirmRequest: 'Demander à votre responsable de changer le code ?'
    }
  }
};

const countriesList = [
  { code: 'DZ', nameAr: 'الجزائر', nameEn: 'Algeria', nameFr: 'Algérie' },
  { code: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia', nameFr: 'Arabie Saoudite' },
  { code: 'AE', nameAr: 'الإمارات', nameEn: 'UAE', nameFr: 'Émirats Arabes Unis' },
  { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt', nameFr: 'Égypte' },
  { code: 'MA', nameAr: 'المغرب', nameEn: 'Morocco', nameFr: 'Maroc' },
  { code: 'US', nameAr: 'الولايات المتحدة', nameEn: 'USA', nameFr: 'États-Unis' },
  { code: 'FR', nameAr: 'فرنسا', nameEn: 'France', nameFr: 'France' },
  { code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'UK', nameFr: 'Royaume-Uni' }
];

export default function Settings() {
  const { 
    addNotification, 
    globalSettings, setGlobalSettings, 
    currentUser, setCurrentUser 
  } = useOutletContext();

  const lang = globalSettings.lang === 'en' ? 'en' : globalSettings.lang === 'fr' ? 'fr' : 'ar';
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState('appearance');

  // تحديث النماذج لتشمل الاسم والدولة مع البريد والهاتف
  const [accountForm, setAccountForm] = useState({ 
    name: currentUser?.name || '',
    email: currentUser?.email || '', 
    phone: currentUser?.phone || '',
    country: currentUser?.country || 'DZ'
  });
  const [companyName, setCompanyName] = useState(globalSettings.companyName || '');

  const handleSettingChange = (key, value) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }));
    addNotification('success', lang === 'ar' ? 'تم تحديث الإعدادات بنجاح!' : 'Settings updated successfully!');
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (window.confirm(t.actions.confirmAccount)) {
      const updatedUser = { 
        ...currentUser, 
        name: accountForm.name,
        email: accountForm.email, 
        phone: accountForm.phone,
        country: accountForm.country
      };
      // تحديث الحالة
      setCurrentUser(updatedUser);
      // تحديث التخزين المحلي لضمان عدم ضياع التعديلات عند تحديث الصفحة
      localStorage.setItem('productDeskUser', JSON.stringify(updatedUser));
      
      addNotification('success', lang === 'ar' ? 'تم تحديث معلومات الحساب بنجاح!' : 'Account updated successfully!');
    }
  };

  const handleRequestCodeChange = () => {
    if (window.confirm(t.actions.confirmRequest)) {
      addNotification('info', lang === 'ar' ? 'تم إرسال طلب تغيير الرمز الوظيفي إلى المدير العام بنجاح.' : 'Request sent to Administrator successfully.');
    }
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (currentUser?.role !== 'admin') return;
    setGlobalSettings(prev => ({ ...prev, companyName }));
    addNotification('success', lang === 'ar' ? 'تم تحديث معلومات الشركة بنجاح!' : 'Company info updated successfully!');
  };

  const handleLogoUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setGlobalSettings(prev => ({ ...prev, companyLogo: url }));
    addNotification('success', lang === 'ar' ? 'تم تحديث شعار الشركة بنجاح!' : 'Company logo updated successfully!');
    e.target.value = ''; 
  };

  const sectionsData = [
    {
      id: 'appearance',
      icon: <Globe className="w-5 h-5 text-indigo-500" />,
      title: t.sections.appearance.title,
      desc: t.sections.appearance.desc,
      keywords: ['لغة', 'مظهر', 'عملة', 'داكن', 'فاتح', 'language', 'theme', 'currency'],
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.fields.language}</label>
              <select value={globalSettings.lang} onChange={(e) => handleSettingChange('lang', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors">
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.fields.currency}</label>
              <select value={globalSettings.currency} onChange={(e) => handleSettingChange('currency', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors" dir="ltr">
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="DA">DZD (DA)</option>
                <option value="SAR">SAR (ر.س)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.fields.theme}</label>
            <div className="flex gap-4">
              <button onClick={() => handleSettingChange('theme', 'light')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${globalSettings.theme === 'light' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Sun className="w-5 h-5" /> {t.actions.light}
              </button>
              <button onClick={() => handleSettingChange('theme', 'dark')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${globalSettings.theme === 'dark' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <Moon className="w-5 h-5" /> {t.actions.dark}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'account',
      icon: <User className="w-5 h-5 text-emerald-500" />,
      title: t.sections.account.title,
      desc: t.sections.account.desc,
      keywords: ['حساب', 'بريد', 'هاتف', 'رمز', 'موظف', 'اسم', 'email', 'phone', 'account', 'password', 'code', 'name'],
      content: (
        <form onSubmit={handleSaveAccount} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* الاسم الكامل */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1"><User className="w-4 h-4"/> {t.fields.name}</label>
              <input type="text" required value={accountForm.name} onChange={e => setAccountForm({...accountForm, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors" />
            </div>

            {/* الدولة */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1"><MapPin className="w-4 h-4"/> {t.fields.country}</label>
              <select value={accountForm.country} onChange={e => setAccountForm({...accountForm, country: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors cursor-pointer">
                {countriesList.map(c => (
                  <option key={c.code} value={c.code}>
                    {lang === 'ar' ? c.nameAr : lang === 'fr' ? c.nameFr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1"><Mail className="w-4 h-4"/> {t.fields.email}</label>
              <input type="email" required value={accountForm.email} onChange={e => setAccountForm({...accountForm, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors" dir="ltr" />
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1"><Phone className="w-4 h-4"/> {t.fields.phone}</label>
              <input type="tel" required value={accountForm.phone} onChange={e => setAccountForm({...accountForm, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors" dir="ltr" />
            </div>
            
          </div>
          
          {/* إظهار الرمز الوظيفي فقط للموظفين وليس للمدير */}
          {currentUser?.role !== 'admin' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><Key className="w-4 h-4"/> {t.fields.jobCode}</p>
                <p className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{currentUser?.jobCode}</p>
              </div>
              <button type="button" onClick={handleRequestCodeChange} className="px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-amber-200 dark:border-amber-800">
                <ShieldAlert className="w-4 h-4" /> {t.actions.requestCodeChange}
              </button>
            </div>
          )}
          
          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm">
              <CheckCircle className="w-4 h-4" /> {t.actions.save}
            </button>
          </div>
        </form>
      )
    },
    {
      id: 'company',
      icon: <Building className="w-5 h-5 text-blue-500" />,
      title: t.sections.company.title,
      desc: t.sections.company.desc,
      keywords: ['شركة', 'اسم', 'مؤسسة', 'company', 'name', 'business', 'logo', 'شعار'],
      content: (
        <form onSubmit={handleSaveCompany} className="space-y-6">
          {currentUser?.role !== 'admin' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm flex items-center gap-2 border border-blue-200 dark:border-blue-800">
              <Info className="w-5 h-5 flex-shrink-0" /> {t.actions.adminOnly}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.fields.companyLogo}</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {globalSettings.companyLogo ? (
                    <img src={globalSettings.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                {currentUser?.role === 'admin' && (
                  <label className="cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm dark:text-white">
                    <Upload className="w-4 h-4" /> {t.actions.uploadLogo}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.fields.companyName}</label>
              <input 
                type="text" 
                required 
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)} 
                disabled={currentUser?.role !== 'admin'}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>
          </div>

          {currentUser?.role === 'admin' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm">
                <CheckCircle className="w-4 h-4" /> {t.actions.save}
              </button>
            </div>
          )}
        </form>
      )
    }
  ];

  const filteredSections = useMemo(() => {
    const search = searchTerm.toLowerCase();
    if (!search) return sectionsData;
    return sectionsData.filter(section => 
      section.title.toLowerCase().includes(search) || 
      section.desc.toLowerCase().includes(search) ||
      section.keywords.some(kw => kw.includes(search))
    );
  }, [searchTerm, lang, globalSettings, accountForm, companyName, currentUser]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{t.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 transition-colors">
        <Search className={`w-5 h-5 text-slate-400 ml-2 ${isRtl ? 'mr-3 ml-0' : 'ml-3 mr-0'}`} />
        <input 
          type="text" 
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value) setExpandedSection('all'); 
            else setExpandedSection('appearance');
          }}
          className="flex-1 bg-transparent border-none outline-none py-2 text-slate-800 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        {filteredSections.map(section => {
          const isOpen = expandedSection === 'all' || expandedSection === section.id;
          return (
            <div key={section.id} className={`bg-white dark:bg-slate-800 rounded-2xl border transition-colors duration-300 overflow-hidden shadow-sm ${isOpen ? 'border-indigo-500 dark:border-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
              <button onClick={() => setExpandedSection(isOpen && expandedSection !== 'all' ? null : section.id)} className="w-full px-6 py-5 flex items-center justify-between bg-transparent outline-none">
                <div className="flex items-center gap-4 text-left" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-slate-50 dark:bg-slate-900'}`}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 dark:text-white text-base">{section.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{section.desc}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
              </button>
              <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-700/50 mt-2">
                  {section.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}