import React from 'react';
import { Language } from '../types';
import { PANCHAYAT_INFO } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  Eye,
  Award
} from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigateTab }) => {
  const t = UI_TRANSLATIONS[lang];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
      
      {/* Top Banner Link Strip */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[11px] font-bold text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-amber-400 font-extrabold uppercase tracking-wider">Karnataka Gov Portals:</span>
            <a href="https://panchatantra.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">
              Panchatantra 2.0 <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a href="https://e-swathu.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">
              e-Swathu Portal <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a href="https://sakala.kar.nic.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">
              Sakala Services <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a href="https://egramswaraj.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-300 flex items-center gap-1">
              e-GramSwaraj GOI <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Portal Visitors: 42,918</span>
            <span>|</span>
            <span>Updated: July 2026</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Panchayat Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {lang === 'kn' ? PANCHAYAT_INFO.gpNameKn : PANCHAYAT_INFO.gpNameEn}
              </h3>
              <span className="text-[10px] text-amber-400 font-bold block">
                LGD Code: {PANCHAYAT_INFO.lgdCode}
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            Khanapur Taluk, Belagavi District, Karnataka - 591120. Committed to 100% digital e-governance, time-bound citizen services, and sustainable rural development.
          </p>

          <div className="text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {lang === 'kn' ? PANCHAYAT_INFO.officeAddressKn : PANCHAYAT_INFO.officeAddressEn}
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Office: {PANCHAYAT_INFO.officePhone}</span>
            </p>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            Quick Navigation
          </h4>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li>
              <button onClick={() => onNavigateTab('services')} className="hover:text-amber-300 transition">
                Bapuji Seva Kendra Services
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('tax')} className="hover:text-amber-300 transition">
                e-Swathu Form 9 & Tax Payment
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('mgnregs')} className="hover:text-amber-300 transition">
                MGNREGS Job Card & Wages
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('gpdp')} className="hover:text-amber-300 transition">
                GPDP 15th FC Grants & Budget
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('grievance')} className="hover:text-amber-300 transition">
                Janaspandana Grievance Redressal
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: RTI Officers */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            Right to Information (RTI Act)
          </h4>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] space-y-2">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Public Information Officer (PIO)</span>
              <span className="font-bold text-white">Shri Basagouda Biradar (PDO)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">First Appellate Authority</span>
              <span className="font-bold text-white">Executive Officer (EO), TP Khanapur</span>
            </div>
            <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              RTI Applications accepted at BSK counter on all working days.
            </p>
          </div>
        </div>

        {/* Col 4: Emergency Contacts */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
            Emergency Hotlines
          </h4>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800">
              <span>Police Helpline:</span>
              <span className="font-mono font-bold text-amber-400">112 / 100</span>
            </div>
            <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800">
              <span>Ambulance / Health Center:</span>
              <span className="font-mono font-bold text-amber-400">108</span>
            </div>
            <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800">
              <span>BESCOM / HESCOM Electricity:</span>
              <span className="font-mono font-bold text-amber-400">1912</span>
            </div>
            <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800">
              <span>Jal Jeevan Mission Helpline:</span>
              <span className="font-mono font-bold text-amber-400">1800-425-9988</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Copyright Strip */}
      <div className="bg-slate-900 text-slate-400 text-[11px] py-4 px-4 sm:px-6 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>{t.nicFooter}</p>
          <p>{t.rightsReserved}</p>
        </div>
      </div>

    </footer>
  );
};
