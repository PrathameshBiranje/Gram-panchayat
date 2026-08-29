import React, { useState } from 'react';
import { Language, ServiceItem, ServiceCategory } from '../types';
import { SERVICES_DATA } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  Search, 
  Clock, 
  FileCheck, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface OnlineServicesGridProps {
  lang: Language;
  onSelectService: (service: ServiceItem) => void;
}

export const OnlineServicesGrid: React.FC<OnlineServicesGridProps> = ({
  lang,
  onSelectService,
}) => {
  const t = UI_TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [expandedDocsId, setExpandedDocsId] = useState<string | null>(null);

  // Sakala Tracking State
  const [trackInput, setTrackInput] = useState('');
  const [trackedResult, setTrackedResult] = useState<{
    no: string;
    name: string;
    service: string;
    status: string;
    submittedDate: string;
    expectedDate: string;
  } | null>(null);

  const categories: { id: ServiceCategory | 'all'; labelEn: string; labelKn: string }[] = [
    { id: 'all', labelEn: 'All Services', labelKn: 'ಎಲ್ಲಾ ಸೇವೆಗಳು' },
    { id: 'eswathu', labelEn: 'e-Swathu (Khata)', labelKn: 'ಇ-ಸ್ವತ್ತು' },
    { id: 'certificates', labelEn: 'Certificates', labelKn: 'ಪ್ರಮಾಣಪತ್ರಗಳು' },
    { id: 'licenses', labelEn: 'Trade & Building', labelKn: 'ಪರವಾನಗಿಗಳು' },
    { id: 'sanitation_water', labelEn: 'Water & Sanitation', labelKn: 'ನೀರು ಮತ್ತು ನೈರ್ಮಲ್ಯ' },
    { id: 'mgnregs', labelEn: 'MGNREGS Work', labelKn: 'ಉದ್ಯೋಗ ಖಾತರಿ' },
  ];

  const filteredServices = SERVICES_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.titleEn.toLowerCase().includes(query) ||
      item.titleKn.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query) ||
      item.departmentEn.toLowerCase().includes(query) ||
      item.departmentKn.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryTerm = trackInput.trim().toUpperCase();
    if (!queryTerm) return;

    // Check LocalStorage first for submitted applications
    let localSubmissions: any[] = [];
    try {
      localSubmissions = JSON.parse(localStorage.getItem('hgp_sakala_applications') || '[]');
    } catch(err) {}

    const match = localSubmissions.find(
      (sub: any) =>
        sub.sakalaNumber?.toUpperCase().includes(queryTerm) ||
        sub.applicationNo?.toUpperCase().includes(queryTerm) ||
        sub.applicantName?.toUpperCase().includes(queryTerm)
    );

    if (match) {
      setTrackedResult({
        no: match.sakalaNumber || match.applicationNo,
        name: match.applicantName,
        service: match.serviceName,
        status: match.status || 'Under Process (BSK Counter Desk)',
        submittedDate: match.submittedAt,
        expectedDate: `${match.estimatedDeliveryDate} (Sakala Guaranteed)`,
      });
    } else {
      // Sample tracking fallback for demonstration numbers
      setTrackedResult({
        no: queryTerm,
        name: 'Basavaraj Patil',
        service: 'e-Swathu Form 9 Issuance',
        status: 'In Verification (Field Inspection Completed)',
        submittedDate: '2026-07-18',
        expectedDate: '2026-07-25 (Within 7 Sakala Days)',
      });
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header Title Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Bapuji Seva Kendra (BSK) & Sakala Services</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {lang === 'kn' ? 'ಆನ್‌ಲೈನ್ ನಾಗರಿಕ ಸೇವೆಗಳ ಪೋರ್ಟಲ್' : 'Online Citizen Services & Sakala Guarantee'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'kn'
                ? 'ಹಳಸಿ ಗ್ರಾಮ ಪಂಚಾಯತಿ ವ್ಯಾಪ್ತಿಯ ಸಾರ್ವಜನಿಕರಿಗೆ ಕಾಲಮಿತಿಯಲ್ಲಿ ಸರ್ಕಾರದ ದೃಢೀಕೃತ ಆನ್‌ಲೈನ್ ಸೇವೆಗಳು.'
                : 'Time-bound guaranteed digital services under Sakala Services Act 2011 for Halashi citizens.'}
            </p>
          </div>

          {/* Quick Sakala Application Tracker Box */}
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md border border-slate-800 max-w-md w-full">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-2">
              <Search className="w-3.5 h-3.5" /> {t.trackStatus}
            </h3>
            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Sakala No (e.g. SKL-2026-HL-9821)"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                className="bg-slate-800 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-400 flex-1 font-mono"
              />
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-2 rounded-lg text-xs transition"
              >
                Track
              </button>
            </form>

            {trackedResult && (
              <div className="mt-3 bg-slate-800/90 rounded-lg p-2.5 border border-amber-500/40 text-xs space-y-1">
                <div className="flex justify-between font-mono text-[11px] text-amber-300">
                  <span>No: {trackedResult.no}</span>
                  <span className="text-emerald-400 font-bold">{trackedResult.status}</span>
                </div>
                <p className="text-slate-200 font-medium">{trackedResult.service}</p>
                <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-700">
                  <span>Applicant: {trackedResult.name}</span>
                  <span>Target Date: {trackedResult.expectedDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search & Category Filters */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'kn' ? cat.labelKn : cat.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const isDocsExpanded = expandedDocsId === service.id;

          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {service.code}
                  </span>
                  {service.sakalaEligible && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sakala 2011 Act
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {lang === 'kn' ? service.titleKn : service.titleEn}
                </h3>
                
                <p className="text-xs text-blue-700 font-semibold mt-1">
                  {lang === 'kn' ? service.departmentKn : service.departmentEn}
                </p>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {lang === 'kn' ? service.descriptionKn : service.descriptionEn}
                </p>

                {/* Key Attributes (Days & Fees) */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.processingTime}</span>
                      <span className="font-bold text-slate-900">{service.processingTimeDays} {t.days}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-700">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.fee}</span>
                      <span className="font-bold text-slate-900">
                        {service.feeRs === 0 ? t.free : `₹ ${service.feeRs}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Toggle Mandatory Docs */}
                <div className="mt-3">
                  <button
                    onClick={() => setExpandedDocsId(isDocsExpanded ? null : service.id)}
                    className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>{t.requiredDocs} ({service.mandatoryDocsEn.length})</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isDocsExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {isDocsExpanded && (
                    <ul className="mt-2 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                      {(lang === 'kn' ? service.mandatoryDocsKn : service.mandatoryDocsEn).map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Bapuji Seva Kendra Counter</span>
                <button
                  onClick={() => onSelectService(service)}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-200/50 flex items-center gap-1.5"
                >
                  <span>{t.applyNow}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
