import React from 'react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { PANCHAYAT_INFO } from '../data/villageData';
import { 
  Building2, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Home, 
  MapPin, 
  Award,
  Sparkles,
  Search
} from 'lucide-react';

interface HeroBannerProps {
  lang: Language;
  onNavigateTab: (tab: string) => void;
  onOpenTaxModal: () => void;
  onOpenGrievanceModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lang,
  onNavigateTab,
  onOpenTaxModal,
  onOpenGrievanceModal,
}) => {
  const t = UI_TRANSLATIONS[lang];

  return (
    <div className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800 shadow-md">
      {/* Background Subtle Gradient & Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
        {/* Top Hero Card & Content */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-5 text-center md:text-left">
            {/* Emblem / Badge Graphic */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-800 border-2 border-blue-500/50 p-1 shadow-xl shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-xl flex flex-col items-center justify-center p-2 border border-slate-700">
                <Building2 className="w-8 h-8 text-blue-400" />
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tight mt-1">LGD {PANCHAYAT_INFO.lgdCode}</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-slate-900" />
                <span>Heritage Gram Panchayat • {PANCHAYAT_INFO.districtEn} District</span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Welcome to {lang === 'kn' ? PANCHAYAT_INFO.gpNameKn : PANCHAYAT_INFO.gpNameEn}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 max-w-xl font-normal mt-1.5 leading-relaxed">
                {t.portalSubheading}
              </p>
              <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1 mt-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {lang === 'kn' ? PANCHAYAT_INFO.officeAddressKn : PANCHAYAT_INFO.officeAddressEn}
              </p>
            </div>
          </div>

          {/* Government Scheme Accreditation Badges */}
          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <div className="bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2 text-center shadow-xs">
              <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Govt of Karnataka</span>
              <span className="text-xs font-bold text-white"> Seva Kendra</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2 text-center shadow-xs">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Digital Swathu</span>
              <span className="text-xs font-bold text-white">e-Swathu Form 9 & 11A</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2 text-center shadow-xs">
              <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider">Guarantee Act</span>
              <span className="text-xs font-bold text-white">Sakala Services</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2 text-center shadow-xs">
              <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">Jal Jeevan Mission</span>
              <span className="text-xs font-bold text-white">Har Ghar Jal</span>
            </div>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={onOpenTaxModal}
            className="group bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-900/30 border border-blue-600 transition-all transform hover:-translate-y-0.5 flex flex-col items-center justify-center text-center"
          >
            <CreditCard className="w-6 h-6 mb-1 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-extrabold">{t.quickPayTax}</span>
            <span className="text-[10px] text-blue-100 font-medium opacity-90 mt-0.5">Instant e-Receipt</span>
          </button>

          <button
            onClick={() => onNavigateTab('services')}
            className="group bg-slate-800 hover:bg-slate-700 hover:border-blue-400 text-white p-4 rounded-2xl font-bold border border-slate-700 shadow-md transition-all transform hover:-translate-y-0.5 flex flex-col items-center justify-center text-center"
          >
            <FileText className="w-6 h-6 mb-1 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-extrabold">{t.applyServices}</span>
            <span className="text-[10px] text-slate-300 opacity-90 mt-0.5">Certificates & NOCs</span>
          </button>

          <button
            onClick={() => onNavigateTab('services')}
            className="group bg-slate-800 hover:bg-slate-700 hover:border-blue-400 text-white p-4 rounded-2xl font-bold border border-slate-700 shadow-md transition-all transform hover:-translate-y-0.5 flex flex-col items-center justify-center text-center"
          >
            <Search className="w-6 h-6 mb-1 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-extrabold">{t.trackStatus}</span>
            <span className="text-[10px] text-slate-300 opacity-90 mt-0.5">Check Application No</span>
          </button>

          <button
            onClick={onOpenGrievanceModal}
            className="group bg-slate-800 hover:bg-slate-700 hover:border-rose-400 text-white p-4 rounded-2xl font-bold border border-slate-700 shadow-md transition-all transform hover:-translate-y-0.5 flex flex-col items-center justify-center text-center"
          >
            <AlertCircle className="w-6 h-6 mb-1 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-extrabold">{t.lodgeComplaint}</span>
            <span className="text-[10px] text-slate-300 opacity-90 mt-0.5">Janaspandana Ticket</span>
          </button>
        </div>

        {/* Quick Panchayat Metrics Strip */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="flex items-center space-x-3 pt-2 md:pt-0">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{t.statPopulation}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{t.statPopLabel}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2 md:pt-0 pl-0 md:pl-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{t.statHouseholds}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{t.statHouseLabel}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2 md:pt-0 pl-0 md:pl-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{t.statWards}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{t.statWardsLabel}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2 md:pt-0 pl-0 md:pl-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{t.statProjects}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{t.statProjectsLabel}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
