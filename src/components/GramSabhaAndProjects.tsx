import React, { useState } from 'react';
import { Language } from '../types';
import { GPDP_PROJECTS, GRAM_SABHA_MEETINGS } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  ThumbsUp, 
  BarChart3, 
  Download,
  Users
} from 'lucide-react';

interface GramSabhaAndProjectsProps {
  lang: Language;
}

export const GramSabhaAndProjects: React.FC<GramSabhaAndProjectsProps> = ({ lang }) => {
  const t = UI_TRANSLATIONS[lang];

  // Poll state for proposed projects
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({
    'Digital Village Library': 142,
    'Solar Water Filter Kiosks': 210,
    'Heritage Eco-Park & Museum': 185,
    'Sports Complex & Gym': 98,
  });

  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (option: string) => {
    if (hasVoted) return;
    setPollVotes((prev) => ({
      ...prev,
      [option]: prev[option] + 1,
    }));
    setHasVoted(true);
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      
      {/* GPDP Development Works Tracker Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Sabki Yojana Sabka Vikas • GPDP 2025-26</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.gpdpTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.gpdpSub}
            </p>
          </div>

          <div className="bg-emerald-900 text-white px-4 py-3 rounded-xl border border-emerald-800 text-center shadow">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">15th FC Total Grant</span>
            <span className="text-xl font-black text-amber-400">₹ 61.30 Lakhs</span>
          </div>
        </div>

        {/* GPDP Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GPDP_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {project.projectCode}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {project.fundingScheme}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {lang === 'kn' ? project.titleKn : project.titleEn}
                </h3>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Sector: {lang === 'kn' ? project.sectorKn : project.sectorEn}</span>
                  <span className="font-bold text-slate-900">Budget: ₹ {project.budgetRsLakhs} Lakhs</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Execution Progress</span>
                    <span className="text-indigo-900">{project.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.completionPercentage === 100
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${project.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {project.geoTagLocation}
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gram Sabha Meetings Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Public Participatory Democracy</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{t.upcomingGramSabha}</h3>
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-blue-900/40 flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            <span>{t.downloadMinutes}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GRAM_SABHA_MEETINGS.map((sabha) => (
            <div key={sabha.id} className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-base font-bold text-amber-300">
                  {lang === 'kn' ? sabha.titleKn : sabha.titleEn}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full border border-slate-700">
                  {sabha.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{sabha.meetingDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{sabha.timeStr}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 mt-1 pt-1 border-t border-slate-800">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{lang === 'kn' ? sabha.venueKn : sabha.venueEn}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-blue-300 block mb-2">{t.agendaList}</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(lang === 'kn' ? sabha.agendaItemsKn : sabha.agendaItemsEn).map((agenda, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{agenda}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Public Voting Poll for Proposed Amenities */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Citizen Voice Poll</span>
            <h3 className="text-lg font-black text-slate-900">
              Vote for Halashi's Next Village Amenity (GPDP 2026-27 Proposal)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
            {hasVoted ? '✓ Vote Recorded' : 'Select One Option'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {Object.entries(pollVotes).map(([option, votes]) => (
            <button
              key={option}
              disabled={hasVoted}
              onClick={() => handleVote(option)}
              className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                hasVoted
                  ? 'bg-slate-50 border-slate-200 text-slate-700'
                  : 'bg-slate-50 hover:bg-indigo-50 border-slate-300 hover:border-indigo-400 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-bold">{option}</span>
              </div>
              <span className="text-xs font-mono font-extrabold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                {votes} Votes
              </span>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};
