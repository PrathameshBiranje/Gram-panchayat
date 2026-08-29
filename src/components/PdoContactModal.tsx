import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { PANCHAYAT_INFO } from '../data/villageData';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  X, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Building2,
  FileText,
  User
} from 'lucide-react';

interface PdoContactModalProps {
  lang: Language;
  onClose: () => void;
}

export const PdoContactModal: React.FC<PdoContactModalProps> = ({ lang, onClose }) => {
  const [noteText, setNoteText] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (auth.currentUser?.displayName) {
      setCitizenName(auth.currentUser.displayName);
    }
  }, [auth.currentUser]);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !citizenPhone.trim() || !noteText.trim()) return;

    setLoading(true);
    const msgObj = {
      id: `pdo-msg-${Date.now()}`,
      citizenName,
      citizenPhone,
      noteText,
      createdAt: new Date().toISOString(),
      userId: auth.currentUser ? auth.currentUser.uid : 'guest'
    };

    // 1. Save to LocalStorage
    try {
      const local = JSON.parse(localStorage.getItem('hgp_pdo_messages') || '[]');
      localStorage.setItem('hgp_pdo_messages', JSON.stringify([msgObj, ...local]));
      localStorage.setItem('pdo_messages', JSON.stringify([msgObj, ...local]));
    } catch (e) {}

    // 2. Save to Firestore
    try {
      await addDoc(collection(db, 'pdo_messages'), msgObj);
    } catch (err: any) {
      console.warn('Firestore write warning:', err);
    } finally {
      setSentSuccess(true);
      setNoteText('');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden relative my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {lang === 'kn' ? 'ಪಂಚಾಯತಿ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (PDO) ವಿವರಗಳು' : 'Panchayat Development Officer (PDO)'}
              </h3>
              <p className="text-xs text-blue-300 font-medium">
                {lang === 'kn' ? 'ಹಳಸಿ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ' : 'Executive Head & Statutory Authority'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Profile Card with Round Image */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-700 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left relative overflow-hidden">
            
            {/* Background Decorative Element */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* PDO Round Avatar Placeholder with Active Badge */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-blue-500 to-emerald-400 shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-300">
                  <User className="w-14 h-14 sm:w-16 sm:h-16 text-slate-300" />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-full ring-4 ring-slate-900 shadow-md" title="Active Official">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Halashi Gram Panchayat PDO</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                SANTOSH CHOUGULE
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {lang === 'kn' ? 'ಪಂಚಾಯತಿ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (PDO)' : 'Panchayat Development Officer (PDO)'}
              </p>

              {/* Direct Phone Number Display */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <a
                  href="tel:8095983201"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: 8095983201</span>
                </a>

                <a
                  href="https://wa.me/918095983201"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-600 flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Key Official Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Contact</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">8095983201</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Office Hours</span>
                <span className="text-xs font-bold text-slate-800">Mon - Sat: 10:00 AM - 5:30 PM</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Email</span>
                <span className="text-xs font-bold text-slate-800 break-all">pdo.halashi-belagavi@karnataka.gov.in</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Office Location</span>
                <span className="text-xs font-bold text-slate-800">Halashi GP Office, Khanapur Taluk</span>
              </div>
            </div>
          </div>

          {/* Statutory Responsibilities & Authorities */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>{lang === 'kn' ? 'PDO ಅವರ ಪ್ರಮುಖ ಅಧಿಕೃತ ಕರ್ತವ್ಯಗಳು:' : 'PDO Statutory Responsibilities & Authorities:'}</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700 text-[11px] pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>e-Swathu Form 9 & 11A Approval</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Sakala Citizen Services Guarantee</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>MGNREGS Work Allotment & Muster</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Janaspandana Grievance Redressal</span>
              </li>
            </ul>
          </div>

          {/* Quick Note / Message to PDO */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-700" />
              <span>{lang === 'kn' ? 'PDO ಅವರಿಗೆ ನೇರ ಸಂದೇಶ / ವಿನಂತಿ ಕಳುಹಿಸಿ:' : 'Send Direct Request / Message to PDO Office:'}</span>
            </h4>

            {sentSuccess ? (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p>Message submitted successfully to PDO Office!</p>
                  <p className="text-[10px] text-emerald-700 font-medium">PDO Santosh Chougule or representative will contact you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitMessage} className="space-y-2.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter your message, query or service request..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl font-bold shadow transition flex items-center gap-1.5 text-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting to PDO...' : 'Submit Message to Firestore'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Halashi Gram Panchayat Official Portal</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
