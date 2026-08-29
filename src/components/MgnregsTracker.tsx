import React, { useState } from 'react';
import { Language } from '../types';
import { MGNREGS_WORKS } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  MapPin, 
  Search, 
  CheckCircle2, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface MgnregsTrackerProps {
  lang: Language;
}

export const MgnregsTracker: React.FC<MgnregsTrackerProps> = ({ lang }) => {
  const t = UI_TRANSLATIONS[lang];

  const [searchJobCard, setSearchJobCard] = useState('');
  const [jobCardResult, setJobCardResult] = useState<{
    cardNo: string;
    headName: string;
    membersCount: number;
    daysWorkedThisYear: number;
    wagesPaidRs: number;
    bankDbtStatus: string;
  } | null>(null);

  const handleSearchCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchJobCard.trim()) return;

    setJobCardResult({
      cardNo: searchJobCard.toUpperCase(),
      headName: 'Kallappa Yallappa Pujari',
      membersCount: 3,
      daysWorkedThisYear: 68,
      wagesPaidRs: 21080,
      bankDbtStatus: 'Credited directly to Canara Bank A/c (DBT Verified)',
    });
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-slate-950 p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-bold mb-2">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>NREGA Karnataka • MGNREGS Guarantee</span>
          </div>
          <h2 className="text-2xl font-black text-slate-950">
            {lang === 'kn' ? 'ಉದ್ಯೋಗ ಖಾತರಿ (MGNREGS) ಪೋರ್ಟಲ್' : 'Mahatma Gandhi NREGS Portal & Job Card Tracker'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-900 font-medium mt-1">
            Guaranteed 100 days wage employment, muster roll verification, and direct DBT wage status for Halashi laborers.
          </p>
        </div>

        <div className="bg-slate-950 text-amber-400 p-3.5 rounded-xl border border-amber-600 text-center font-mono text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Wage Rate 2025-26</span>
          <span className="text-lg font-black text-white">₹ 349.00 / Day</span>
        </div>
      </div>

      {/* Job Card & Muster Roll Checker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 border-b pb-2">
          Verify Job Card & Wage Credit Status (DBT)
        </h3>

        <form onSubmit={handleSearchCard} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Enter NREGA Job Card No (e.g. KA-02-004-012-001/42)"
              value={searchJobCard}
              onChange={(e) => setSearchJobCard(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition shadow"
          >
            Check Job Card
          </button>
        </form>

        {jobCardResult && (
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-xs space-y-3">
            <div className="flex justify-between items-center border-b border-amber-200 pb-2">
              <span className="font-mono font-extrabold text-amber-950 text-sm">{jobCardResult.cardNo}</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Active Card</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Head of Household</span>
                <span className="font-bold text-slate-900">{jobCardResult.headName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Registered Laborers</span>
                <span className="font-bold text-slate-900">{jobCardResult.membersCount} Members</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Days Worked (2025-26)</span>
                <span className="font-bold text-amber-900">{jobCardResult.daysWorkedThisYear} / 100 Days</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Total Wage Disbursed</span>
                <span className="font-black text-emerald-800">₹ {jobCardResult.wagesPaidRs}</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50 p-2 rounded border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {jobCardResult.bankDbtStatus}
            </p>
          </div>
        )}
      </div>

      {/* Active Muster Roll Works Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900">
          Active NREGA Worksites in Halashi Gram Panchayat
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MGNREGS_WORKS.map((work) => (
            <div
              key={work.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {work.workCode}
                  </span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {work.category}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {lang === 'kn' ? work.workNameKn : work.workNameEn}
                </h4>

                <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {work.location}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Est. Cost</span>
                  <span className="font-bold">₹ {work.estimatedCostLakhs} Lakhs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Laborers Employed</span>
                  <span className="font-bold text-amber-900">{work.beneficiariesCount} Persons</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
