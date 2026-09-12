import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Globe, ArrowRight, ArrowLeft, Sun, Moon, Phone, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase'; // استدعاء ملف الاتصال بقاعدة البيانات

const translations = {
  ar: {
    title: 'إنشاء حساب جديد',
    subtitle: 'أدخل بياناتك لإنشاء حساب صاحب العمل',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    country: 'الدولة',
    selectCountry: 'اختر الدولة...',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'حفظ معلومات الدخول',
    registerBtn: 'إنشاء الحساب',
    loading: 'جاري إنشاء الحساب...',
    hasAccount: 'لدي حساب بالفعل',
    loginLink: 'تسجيل الدخول',
    other: 'أخرى...',
    successMsg: 'تم التسجيل بنجاح! سيتم توجيهك لاختيار نوع الحساب...',
    errorMsg: 'حدث خطأ أثناء التسجيل. تأكد من صحة البيانات أو أن البريد غير مستخدم مسبقاً.'
  },
  en: {
    title: 'Create New Account',
    subtitle: 'Enter your details to create an owner account',
    fullName: 'Full Name',
    phone: 'Phone Number',
    country: 'Country',
    selectCountry: 'Select Country...',
    email: 'Email Address',
    password: 'Password',
    rememberMe: 'Remember Me',
    registerBtn: 'Create Account',
    loading: 'Creating account...',
    hasAccount: 'Already have an account?',
    loginLink: 'Sign In',
    other: 'Other...',
    successMsg: 'Registration successful! Redirecting to account setup...',
    errorMsg: 'Registration failed. Please check your details or try a different email.'
  },
  fr: {
    title: 'Créer un nouveau compte',
    subtitle: 'Entrez vos coordonnées pour créer un compte propriétaire',
    fullName: 'Nom complet',
    phone: 'Numéro de téléphone',
    country: 'Pays',
    selectCountry: 'Sélectionner le pays...',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    registerBtn: 'Créer un compte',
    loading: 'Création du compte...',
    hasAccount: 'Vous avez déjà un compte ?',
    loginLink: 'Se connecter',
    other: 'Autre...',
    successMsg: 'Inscription réussie ! Redirection vers la configuration...',
    errorMsg: 'Échec de l\'inscription. Vérifiez vos informations ou utilisez un autre e-mail.'
  }
};

// قائمة الدول باستخدام صور الأعلام
const countries = [
  { code: 'dz', dialCode: '+213', name: 'Algeria' },
  { code: 'sa', dialCode: '+966', name: 'Saudi Arabia' },
  { code: 'ae', dialCode: '+971', name: 'UAE' },
  { code: 'eg', dialCode: '+20', name: 'Egypt' },
  { code: 'ma', dialCode: '+212', name: 'Morocco' },
  { code: 'us', dialCode: '+1', name: 'USA' },
  { code: 'fr', dialCode: '+33', name: 'France' },
  { code: 'gb', dialCode: '+44', name: 'UK' },
];

export default function Register() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [lang, setLang] = useState('ar');
  const [theme, setTheme] = useState('light');
  const [rememberMe, setRememberMe] = useState(false);

  // حالات الحقول لتخزين البيانات
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // حالات قائمة الدول المخصصة
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // حالات الأمان والاتصال بقاعدة البيانات
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState({ type: '', message: '' });

  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // إغلاق قائمة الدول عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // دالة تنفيذ إنشاء الحساب الآمنة
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatus({ type: '', message: '' });
    
    const fullPhone = `${selectedCountry.dialCode} ${phoneNumber}`;

    // إرسال البيانات إلى Supabase Auth للتسجيل الآمن
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          phone: fullPhone,
          country: selectedCountry.code.toUpperCase(),
          lang: lang
        }
      }
    });

    if (error) {
      setAuthStatus({ type: 'error', message: t.errorMsg });
      setIsLoading(false);
    } else {
      setAuthStatus({ type: 'success', message: t.successMsg });
      
      // حفظ بيانات مبدئية لكي تستخدمها صفحة Onboarding لاحقاً
      const userData = {
        name: fullName,
        email: email,
        phone: fullPhone,
        country: selectedCountry.code.toUpperCase(),
        lang: lang,
        jobCode: 'EMP-0001' // كود افتراضي
      };
      localStorage.setItem('productDeskUser', JSON.stringify(userData));

      // تفريغ الحقول بعد النجاح
      setFullName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');

      // توجيه المستخدم لصفحة الاختيار بعد 3 ثوانٍ
      setTimeout(() => {
        navigate('/onboarding');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white transition-colors">
          {t.title}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 transition-colors">
          {t.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200 dark:border-slate-700 transition-colors">
          
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="relative flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 py-1.5 px-3 outline-none cursor-pointer transition-colors"
              >
                <option value="ar">العربية (AR)</option>
                <option value="en">English (EN)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>
          </div>

          {/* عرض رسائل النجاح أو الخطأ */}
          {authStatus.message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${authStatus.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
              {authStatus.type === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />}
              <p className="text-sm font-medium leading-relaxed">{authStatus.message}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegisterSubmit}>
            
            {/* الاسم الكامل */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                {t.fullName}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${isRtl ? 'pr-10' : 'pl-10'}`}
                />
              </div>
            </div>

            {/* حقل رقم الهاتف المخصص مع علم الدولة */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                {t.phone}
              </label>
              <div className="mt-1 flex rounded-lg shadow-sm border border-slate-300 dark:border-slate-600 overflow-visible dark:bg-slate-700 transition-colors">
                
                <div className="relative flex items-center" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 border-slate-300 dark:border-slate-600 ${isRtl ? 'border-l' : 'border-r'} hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors min-w-[80px]`}
                    dir="ltr"
                  >
                    <img src={`https://flagcdn.com/w20/${selectedCountry.code}.png`} alt={selectedCountry.code} className="w-5 h-auto rounded-[2px]" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1.5">{selectedCountry.dialCode}</span>
                  </button>

                  {/* قائمة الدول المنسدلة */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[100] max-h-48 overflow-y-auto" dir="ltr">
                      {countries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <img src={`https://flagcdn.com/w20/${c.code}.png`} alt={c.code} className="w-5 h-auto rounded-[2px]" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-12">{c.dialCode}</span>
                          <span className="text-xs text-slate-500 truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 block w-full px-3 py-2 bg-transparent dark:text-white placeholder-slate-400 focus:outline-none sm:text-sm transition-colors"
                  placeholder="555 123 456"
                  dir="ltr"
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                {t.email}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${isRtl ? 'pr-10' : 'pl-10'}`}
                  dir="ltr"
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                {t.password}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${isRtl ? 'pr-10' : 'pl-10'}`}
                  dir="ltr"
                  minLength="6"
                />
              </div>
            </div>

            {/* حفظ المعلومات */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded dark:border-slate-600 dark:bg-slate-700 cursor-pointer"
              />
              <label htmlFor="remember-me" className={`block text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none ${isRtl ? 'mr-2' : 'ml-2'}`}>
                {t.rememberMe}
              </label>
            </div>

            {/* زر الإنشاء */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? t.loading : t.registerBtn}
              </button>
            </div>
          </form>

          {/* خيار لدي حساب بالفعل */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600 transition-colors" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                  {t.hasAccount}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center justify-center gap-1 transition-colors">
                {t.loginLink}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}