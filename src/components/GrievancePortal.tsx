import React, { useState, useEffect } from 'react';
import { Language, CitizenGrievance } from '../types';
import { GRIEVANCES_SAMPLE } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { 
  AlertCircle, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  MapPin, 
  Upload, 
  ShieldCheck, 
  PhoneCall,
  Sparkles
} from 'lucide-react';

interface GrievancePortalProps {
  lang: Language;
}

export const GrievancePortal: React.FC<GrievancePortalProps> = ({ lang }) => {
  const t = UI_TRANSLATIONS[lang];

  const [activeSubTab, setActiveSubTab] = useState<'submit' | 'track'>('submit');
  const [grievancesList, setGrievancesList] = useState<CitizenGrievance[]>(GRIEVANCES_SAMPLE);

  // Form State
  const [category, setCategory] = useState<CitizenGrievance['category']>('water_supply');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationWard, setLocationWard] = useState('Ward 1 (Temple Street)');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<CitizenGrievance | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Search State
  const [searchTicketNo, setSearchTicketNo] = useState('');
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<CitizenGrievance | null>(GRIEVANCES_SAMPLE[0]);

  // Sync reporter name if logged in
  useEffect(() => {
    if (auth.currentUser?.displayName) {
      setReporterName(auth.currentUser.displayName);
    }
  }, [auth.currentUser]);

  // Realtime Firestore subscription for grievances
  useEffect(() => {
    const q = query(collection(db, 'grievances'), orderBy('submittedDate', 'desc'), limit(30));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreList: CitizenGrievance[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          firestoreList.push({
            id: docSnap.id,
            ticketNo: data.ticketNo || 'HGP-GR-000',
            category: data.category || 'water_supply',
            categoryEn: data.categoryEn || 'Civic Issue',
            categoryKn: data.categoryKn || 'ನಾಗರಿಕ ಸಮಸ್ಯೆ',
            title: data.title || '',
            description: data.description || '',
            locationWard: data.locationWard || '',
            reporterName: data.reporterName || '',
            reporterPhone: data.reporterPhone || '',
            submittedDate: data.submittedDate || new Date().toISOString().split('T')[0],
            status: data.status || 'Submitted',
            assignedOfficer: data.assignedOfficer || 'SANTOSH CHOUGULE (PDO / Nodal Officer)',
            resolutionRemark: data.resolutionRemark || 'Complaint registered in Panchayat Janaspandana portal.',
          });
        });
        if (firestoreList.length > 0) {
          setGrievancesList([...firestoreList, ...GRIEVANCES_SAMPLE]);
        }
      },
      (err) => {
        console.warn('Firestore grievances listener:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    const randomNo = Math.floor(1000 + Math.random() * 9000);
    const newTicketNo = `HGP-2026-GR-${randomNo}`;

    const categoriesMap: Record<string, { en: string; kn: string }> = {
      water_supply: { en: 'Drinking Water Leakage', kn: 'ಕುಡಿಯುವ ನೀರು ಪೂರೈಕೆ ಸೋರಿಕೆ' },
      street_light: { en: 'Street Light Failure', kn: 'ಬೀದಿ ದೀಪ ದುರಸ್ತಿ' },
      drainage_clean: { en: 'Drainage Desilting', kn: 'ಚರಂಡಿ ಹೂಳೆತ್ತುವುದು' },
      road_repair: { en: 'Road Damage / Pothole', kn: 'ರಸ್ತೆ ಹಾನಿ ಮತ್ತು ಗುಂಡಿ' },
      waste_mgmt: { en: 'Garbage Collection Issue', kn: 'ಕಸ ಸಂಗ್ರಹಣೆ ಸಮಸ್ಯೆ' },
      other: { en: 'Other Civic Grievance', kn: 'ಇತರ ನಾಗರಿಕ ದೂರು' },
    };

    const newGrievance: CitizenGrievance = {
      id: `gr-${Date.now()}`,
      ticketNo: newTicketNo,
      category,
      categoryEn: categoriesMap[category].en,
      categoryKn: categoriesMap[category].kn,
      title,
      description,
      locationWard,
      reporterName,
      reporterPhone,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      assignedOfficer: 'SANTOSH CHOUGULE (PDO / Nodal Officer)',
      resolutionRemark: 'Complaint registered in Janaspandana portal. Panchayat field officer notified for inspection within 24 hours.',
    };

    // 1. Save to LocalStorage for instant admin access
    try {
      const local = JSON.parse(localStorage.getItem('hgp_grievances') || '[]');
      localStorage.setItem('hgp_grievances', JSON.stringify([newGrievance, ...local]));
    } catch (e) {}

    // 2. Save to Firestore
    try {
      await addDoc(collection(db, 'grievances'), {
        ...newGrievance,
        userId: auth.currentUser ? auth.currentUser.uid : 'guest'
      });
    } catch (err) {
      console.warn('Error saving grievance to Firestore:', err);
    } finally {
      setSubmitting(false);
    }

    setGrievancesList([newGrievance, ...grievancesList]);
    setSubmittedTicket(newGrievance);
    setSelectedTicketDetail(newGrievance);
  };

  const handleSearchTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const found = grievancesList.find(
      (g) => g.ticketNo.toLowerCase() === searchTicketNo.trim().toLowerCase()
    );
    if (found) {
      setSelectedTicketDetail(found);
    } else {
      alert('Ticket No not found. Please verify the ticket number (e.g. HGP-2026-GR-0042)');
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Title Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold mb-2">
            <AlertCircle className="w-4 h-4 text-blue-400" />
            <span>Janaspandana • Panchayat Grievance Redressal</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{t.grievanceTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.grievanceSub}</p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
          <button
            onClick={() => {
              setActiveSubTab('submit');
              setSubmittedTicket(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'submit'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t.submitNewGrievance}
          </button>
          <button
            onClick={() => setActiveSubTab('track')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'track'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t.trackGrievance}
          </button>
        </div>
      </div>

      {activeSubTab === 'submit' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto">
          {!submittedTicket ? (
            <form onSubmit={handleSubmitGrievance} className="space-y-5 text-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                Lodge Civic Complaint Form / ಸಾರ್ವಜನಿಕ ದೂರು ಅರ್ಜಿ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.selectCategory} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="water_supply">Drinking Water Leakage / ನೀರು ಸರಬರಾಜು ಸೋರಿಕೆ</option>
                    <option value="street_light">Street Light Failure / ಬೀದಿ ದೀಪ ದುರಸ್ತಿ</option>
                    <option value="drainage_clean">Drainage Blockage / ಚರಂಡಿ ಹೂಳೆತ್ತುವುದು</option>
                    <option value="road_repair">Road Damage / ರಸ್ತೆ ಹಾನಿ</option>
                    <option value="waste_mgmt">Solid Waste Collection / ಕಸ ವಿಲೇವಾರಿ</option>
                    <option value="other">Other Issue / ಇತರ ವಿಷಯ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.selectWard} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={locationWard}
                    onChange={(e) => setLocationWard(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Ward 1 (Temple Street)">Ward 1 - Temple Street / ದೇವಸ್ಥಾನ ರಸ್ತೆ</option>
                    <option value="Ward 2 (Kadamba Circle)">Ward 2 - Kadamba Circle / ಕದಂಬ ವೃತ್ತ</option>
                    <option value="Ward 3 (Sanjeevini Layout)">Ward 3 - Sanjeevini Layout / ಸಂಜೀವಿನಿ ಲೇಔಟ್</option>
                    <option value="Ward 4 (Suvarneshwara Lane)">Ward 4 - Suvarneshwara Lane / ಸುವರ್ಣೇಶ್ವರ ಲೇನ್</option>
                    <option value="Ward 5 (Fort Area)">Ward 5 - Fort Area / ಕೋಟೆ ಏರಿಯಾ</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.issueTitle} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief title of the issue..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.description} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe exact spot, landmark, and problem details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.yourName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kamble"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.yourPhone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md shadow-blue-200 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.submitTicketBtn}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Ticket Confirmation Card */
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-black text-slate-900">Grievance Ticket Registered!</h3>
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Janaspandana Ticket ID</span>
                  <span className="font-mono font-black text-rose-900 text-sm">{submittedTicket.ticketNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Issue</span>
                  <span className="font-bold text-slate-900">{submittedTicket.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location: {submittedTicket.locationWard}</span>
                  <span>Status: <strong className="text-emerald-700">{submittedTicket.status}</strong></span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setActiveSubTab('track')}
                  className="bg-rose-900 text-white font-bold text-xs px-5 py-2 rounded-xl"
                >
                  Track Ticket Status
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Track Grievance Status */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ticket List Sidebar */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b pb-2">Recent Grievances List</h3>

            <form onSubmit={handleSearchTrack} className="flex gap-2">
              <input
                type="text"
                placeholder="Search Ticket No (e.g. HGP-2026-GR-0042)"
                value={searchTicketNo}
                onChange={(e) => setSearchTicketNo(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono w-full"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold shrink-0"
              >
                Search
              </button>
            </form>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {grievancesList.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedTicketDetail(g)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                    selectedTicketDetail?.id === g.id
                      ? 'bg-rose-50 border-rose-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between font-mono font-bold text-[11px] text-rose-900">
                    <span>{g.ticketNo}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        g.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1 line-clamp-1">{g.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{g.locationWard}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Detail Panel */}
          {selectedTicketDetail && (
            <div className="lg:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-5">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <span className="font-mono text-xs font-extrabold bg-rose-100 text-rose-900 px-2.5 py-1 rounded">
                    Ticket ID: {selectedTicketDetail.ticketNo}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    {selectedTicketDetail.title}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    {selectedTicketDetail.locationWard}
                  </p>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Status: {selectedTicketDetail.status}
                </span>
              </div>

              {/* Resolution Workflow Stepper */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-3">
                  Resolution Progress Workflow
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                  <div className="p-2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    1. Submitted
                  </div>
                  <div className="p-2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    2. Under Review
                  </div>
                  <div className={`p-2 rounded ${selectedTicketDetail.status === 'In Progress' || selectedTicketDetail.status === 'Resolved' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-400'}`}>
                    3. Field Work
                  </div>
                  <div className={`p-2 rounded ${selectedTicketDetail.status === 'Resolved' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-400'}`}>
                    4. Resolved
                  </div>
                </div>
              </div>

              {/* Action Log Details */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Nodal Officer</span>
                  <span className="font-bold text-slate-900">{selectedTicketDetail.assignedOfficer}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Officer Remarks</span>
                  <p className="text-slate-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-medium mt-1">
                    {selectedTicketDetail.resolutionRemark || 'Inspection under progress.'}
                  </p>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t">
                  <span>Reported By: {selectedTicketDetail.reporterName}</span>
                  <span>Date: {selectedTicketDetail.submittedDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
