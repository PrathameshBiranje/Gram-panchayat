import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { Phone, Shield, Eye, Sun, Moon, Volume2, Globe, Clock, Landmark, User as UserIcon, LogIn, MessageSquare } from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (s: 'sm' | 'md' | 'lg') => void;
  highContrast: boolean;
  setHighContrast: (c: boolean) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  onOpenAi: () => void;
  currentUser: User | null;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  activeTab,
  setActiveTab,
  onOpenAi,
  currentUser,
  onOpenAuthModal,
}) => {
  const t = UI_TRANSLATIONS[lang];
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  const speakAnnouncement = () => {
    if ('speechSynthesis' in window) {
      const text = lang === 'kn'
        ? 'ಹಳಸಿ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಡಿಜಿಟಲ್ ಪೋರ್ಟಲ್‌ಗೆ ಸ್ವಾಗತ. ಎಲ್ಲಾ ಆನ್‌ಲೈನ್ ಸೇವೆಗಳು ಲಭ್ಯವಿವೆ.'
        : 'Welcome to Halashi Gram Panchayat Digital Portal. All online citizen services are active.';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'services', label: t.onlineServices },
    { id: 'tax', label: t.eswathu },
    { id: 'mgnregs', label: t.mgnregs },
    { id: 'gpdp', label: t.gpdpProjects },
    { id: 'gramsabha', label: t.gramSabha },
    { id: 'grievance', label: t.grievances },
    { id: 'feedback', label: lang === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆ / Rating' : 'Feedback & Ratings' },
    { id: 'tenders', label: t.tenders },
    { id: 'directory', label: t.directory },
    { id: 'heritage', label: t.heritage },
    { id: 'admin', label: lang === 'kn' ? 'ಅಧಿಕಾರಿ ಆಡಳಿತ' : 'Admin Portal' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Gov Accessibility & Language Bar */}
      <div className="bg-slate-900 text-white text-xs px-4 sm:px-6 py-2 flex flex-wrap justify-between items-center border-b border-slate-700">
        <div className="flex items-center space-x-3 font-medium tracking-wide">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded text-[11px] font-bold">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            {t.govTag}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-300 text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            {currentTime}
          </span>
        </div>

        {/* Accessibility Controls & Citizen Auth & Language Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3 mt-1 sm:mt-0">
          
          {/* Citizen Sign In / Account Profile Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md text-[11px] font-bold transition shadow-xs"
            title="Citizen Account Login / Register"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>
              {currentUser 
                ? (currentUser.displayName || currentUser.email?.split('@')[0] || 'My Account')
                : (lang === 'kn' ? 'ನಾಗರಿಕ ಸೈನ್ ಇನ್' : 'Citizen Sign In')}
            </span>
          </button>

          {/* Admin Officer Login Button */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition shadow-xs ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
            }`}
            title="Official Gram Panchayat Admin Login"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'kn' ? 'ಅಧಿಕಾರಿ ಲಾಗಿನ್' : 'Admin Portal'}</span>
          </button>

          <div className="flex items-center bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700 space-x-1">
            <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">{t.accessibilityText}:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'sm' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              title="Small Text"
            >
              {t.fontDecrease}
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'md' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              title="Standard Text"
            >
              {t.fontReset}
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-1.5 py-0.5 rounded text-[11px] ${fontSize === 'lg' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              title="Large Text"
            >
              {t.fontIncrease}
            </button>
          </div>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] transition ${
              highContrast
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle High Contrast Mode"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">{t.contrastToggle}</span>
          </button>

          <button
            onClick={speakAnnouncement}
            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition"
            title="Read Page Title Aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Language Switcher */}
          <div className="flex bg-slate-800 p-0.5 rounded border border-slate-700">
            <button
              onClick={() => setLang('kn')}
              className={`px-2 py-0.5 text-[11px] rounded transition font-medium ${
                lang === 'kn' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.kannadaBtn}
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 text-[11px] rounded transition font-medium ${
                lang === 'en' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.englishBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Main Professional Header with Govt Branding & Login Quick Controls */}
      <div className="bg-white px-3 sm:px-8 py-3.5 flex flex-wrap justify-between items-center gap-3 shadow-xs border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200 shadow-xs shrink-0">
            <Landmark className="w-6 h-6 sm:w-7 sm:h-7 text-blue-700" />
          </div>
          <div>
            <h1 className="text-base sm:text-2xl font-bold text-slate-900 leading-tight uppercase tracking-tight">
              {lang === 'kn' ? 'ಹಳಸಿ ಗ್ರಾಮ ಪಂಚಾಯತಿ' : 'Halashi Gram Panchayat'}
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-500 font-medium">
              Khanapur Taluk, Belagavi District, Karnataka
            </p>
          </div>
        </div>

        {/* Action Controls: Login Buttons & PDO Official Contact */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
          {/* Citizen Login Button in Main Header */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-md border border-blue-600/40"
            title="Citizen Sign In or Profile"
          >
            <UserIcon className="w-4 h-4 text-blue-200" />
            <div className="text-left leading-tight">
              <span className="block text-[9px] text-blue-200 uppercase font-extrabold tracking-wider">
                {currentUser ? 'Logged In' : 'Citizen Access'}
              </span>
              <span>
                {currentUser 
                  ? (currentUser.displayName || currentUser.email?.split('@')[0] || 'My Account')
                  : (lang === 'kn' ? 'ನಾಗರಿಕ ಸೈನ್ ಇನ್' : 'Citizen Sign In')}
              </span>
            </div>
          </button>

          {/* Admin Login Button in Main Header */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-md border ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                : 'bg-slate-900 hover:bg-slate-950 text-amber-400 border-amber-500/30'
            }`}
            title="Official Admin Portal Access"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <div className="text-left leading-tight">
              <span className="block text-[9px] text-amber-300/80 uppercase font-extrabold tracking-wider">
                Official Access
              </span>
              <span>{lang === 'kn' ? 'ಅಧಿಕಾರಿ ಲಾಗಿನ್' : 'Admin Portal'}</span>
            </div>
          </button>

          {/* PDO Contact Button */}
          <button
            onClick={onOpenAi}
            className="hidden lg:flex bg-gradient-to-r from-blue-950 to-slate-900 hover:from-blue-900 hover:to-slate-800 text-white px-3.5 py-2 rounded-xl border border-blue-500/30 shadow-sm transition-all items-center gap-2.5 text-left shrink-0"
            title="Contact PDO Santosh Chougule"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-amber-400 shadow-sm flex items-center justify-center text-slate-300">
                <UserIcon className="w-4 h-4 text-slate-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider bg-amber-500/20 px-1 py-0.1 rounded">
                  PDO
                </span>
                <span className="text-xs font-extrabold text-white">S. CHOUGULE</span>
              </div>
              <p className="text-[10px] text-emerald-300 font-mono font-bold flex items-center gap-1">
                <Phone className="w-2.5 h-2.5 text-emerald-400" />
                <span>8095983201</span>
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 py-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                  activeTab === item.id
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
