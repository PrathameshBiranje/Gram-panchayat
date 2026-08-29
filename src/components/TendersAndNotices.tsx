import React from 'react';
import { Language } from '../types';
import { TENDERS_SAMPLE } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Building2, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

interface TendersAndNoticesProps {
  lang: Language;
}

export const TendersAndNotices: React.FC<TendersAndNoticesProps> = ({ lang }) => {
  const t = UI_TRANSLATIONS[lang];

  const handleDownloadPdf = (docName: string) => {
    alert(`Downloading Official Government Document: ${docName}`);
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold mb-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Karnataka e-Procurement Portal • Public Notices</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.tenders}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Official tenders, quotations, public notices, and audit disclosure documents for Halashi Gram Panchayat.
          </p>
        </div>
      </div>

      {/* Active Tenders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 font-bold text-sm flex items-center justify-between">
          <span>Active Village Procurement Tenders & Quotations</span>
          <span className="text-xs font-mono font-normal text-amber-400">Total Active: {TENDERS_SAMPLE.length}</span>
        </div>

        <div className="divide-y divide-slate-200">
          {TENDERS_SAMPLE.map((tender) => (
            <div key={tender.id} className="p-6 hover:bg-slate-50 transition space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded">
                    {tender.tenderNo}
                  </span>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {tender.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-700">
                  Estimated Cost: <span className="text-indigo-900 font-extrabold">₹ {(tender.estimatedCostRs / 100000).toFixed(2)} Lakhs</span>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-slate-900">
                {lang === 'kn' ? tender.titleKn : tender.titleEn}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 font-medium">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Department</span>
                  <span>{lang === 'kn' ? tender.departmentKn : tender.departmentEn}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Published Date</span>
                  <span>{tender.publishDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Closing Date</span>
                  <span className="text-rose-700 font-bold">{tender.closingDate}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleDownloadPdf(tender.documentName)}
                  className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Tender Document (PDF)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
