import React, { useState } from 'react';
import { Language, PanchayatOfficial } from '../types';
import { OFFICIALS_DATA, PANCHAYAT_INFO } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  Users, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Building2, 
  Calendar, 
  Send, 
  CheckCircle2,
  ShieldCheck,
  User
} from 'lucide-react';

interface PanchayatDirectoryProps {
  lang: Language;
}

export const PanchayatDirectory: React.FC<PanchayatDirectoryProps> = ({ lang }) => {
  const t = UI_TRANSLATIONS[lang];

  const [bookingOfficer, setBookingOfficer] = useState<PanchayatOfficial | null>(null);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [meetingPurpose, setMeetingPurpose] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold mb-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Panchayat Raj Authority • Who's Who Directory</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.directory}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Elected representatives, administrative officers, and staff contact directory for Halashi Gram Panchayat.
          </p>
        </div>

        <div className="bg-indigo-950 text-white p-4 rounded-xl border border-indigo-900 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Clock className="w-4 h-4" />
            <span>Office Hours</span>
          </div>
          <p className="text-[11px] text-slate-300">{lang === 'kn' ? PANCHAYAT_INFO.workingHoursKn : PANCHAYAT_INFO.workingHoursEn}</p>
        </div>
      </div>

      {/* Leadership Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFICIALS_DATA.map((off) => (
          <div
            key={off.id}
            className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between space-y-4 ${
              off.isLeader ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-slate-200'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {off.photoUrl ? (
                  <img
                    src={off.photoUrl}
                    alt={off.nameEn}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-amber-400 shadow shrink-0 flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {lang === 'kn' ? off.designationKn : off.designationEn}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {lang === 'kn' ? off.nameKn : off.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {lang === 'kn' ? off.wardOrRoleKn : off.wardOrRoleEn}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                  <a href={`tel:${off.phone}`} className="font-bold text-indigo-900 hover:underline">
                    {off.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-mono text-slate-600 truncate">{off.email}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{off.officeHours}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setBookingOfficer(off);
                setBookingConfirmed(false);
              }}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book Office Meeting</span>
            </button>
          </div>
        ))}
      </div>

      {/* Appointment Modal */}
      {bookingOfficer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Book Official Meeting with {bookingOfficer.nameEn}
            </h3>
            <p className="text-xs text-indigo-700 font-bold mb-4">
              {bookingOfficer.designationEn}
            </p>

            {!bookingConfirmed ? (
              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs text-slate-800">
                <div>
                  <label className="block font-bold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basavaraj Patil"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone number"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Preferred Meeting Date</label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Purpose of Visit / Agenda</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. e-Swathu Form 9 verification inquiry"
                    value={meetingPurpose}
                    onChange={(e) => setMeetingPurpose(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingOfficer(null)}
                    className="px-4 py-2 border rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-900 text-white font-bold px-4 py-2 rounded-xl"
                  >
                    Confirm Meeting Slip
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-3 py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-sm text-slate-900">Meeting Token Confirmed!</h4>
                <p className="text-xs text-slate-600">
                  Appointment registered for {meetingDate}. Confirmation SMS sent to {citizenPhone}.
                </p>
                <button
                  onClick={() => setBookingOfficer(null)}
                  className="bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-xl"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
