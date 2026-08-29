import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { db, auth, googleProvider } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  LogIn, 
  LogOut, 
  MessageSquare, 
  AlertTriangle, 
  Users, 
  Star, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Search, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Send,
  Eye,
  RefreshCw,
  FileText,
  UserCheck
} from 'lucide-react';

interface AdminPortalProps {
  lang: Language;
  currentUser: User | null;
  onOpenCitizenLogin?: () => void;
}

const ADMIN_EMAIL = 'prathameshbiranje01@gmail.com';

export const AdminPortal: React.FC<AdminPortalProps> = ({ lang, currentUser, onOpenCitizenLogin }) => {
  // Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('prathameshbiranje01@gmail.com');
  const [passwordInput, setPasswordInput] = useState<string>('pattya07');
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Active Dashboard Tab
  const [adminTab, setAdminTab] = useState<'pdo_messages' | 'grievances' | 'feedbacks' | 'users' | 'sakala'>('pdo_messages');

  // Firestore Data Collections
  const [pdoMessages, setPdoMessages] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [sakalaApplications, setSakalaApplications] = useState<any[]>([]);
  
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing modal / state for grievance update
  const [selectedGrievance, setSelectedGrievance] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>('In Progress');
  const [newRemark, setNewRemark] = useState<string>('');
  const [updatingGrievance, setUpdatingGrievance] = useState<boolean>(false);

  // Check admin login status automatically
  useEffect(() => {
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setIsAdminLoggedIn(true);
    } else {
      // Check session storage in case logged in via credentials
      const sessionAdmin = sessionStorage.getItem('hgp_admin_logged_in');
      if (sessionAdmin === 'true') {
        setIsAdminLoggedIn(true);
      }
    }
  }, [currentUser]);

  // Handle explicit admin login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const emailClean = emailInput.trim().toLowerCase();
    const passClean = passwordInput.trim();

    if (emailClean === ADMIN_EMAIL.toLowerCase() && passClean === 'pattya07') {
      try {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      } catch (err: any) {
        console.warn('SignIn attempt error, trying account creation:', err);
        try {
          await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
        } catch (createErr) {
          console.warn('Account creation warning:', createErr);
        }
      }
      sessionStorage.setItem('hgp_admin_logged_in', 'true');
      setIsAdminLoggedIn(true);
      setAuthLoading(false);
    } else {
      setAuthError(lang === 'kn' ? 'ಅಮಾನ್ಯ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್' : 'Invalid Admin Credentials! Please enter correct admin email & password.');
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    sessionStorage.removeItem('hgp_admin_logged_in');
    setIsAdminLoggedIn(false);
  };

  // Real-time Firestore listeners when logged in
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    setLoadingData(true);

    // Initial populate from localStorage for all sections to ensure instant offline & online display
    try {
      const locSakala = JSON.parse(localStorage.getItem('hgp_sakala_applications') || '[]');
      if (locSakala.length > 0) setSakalaApplications(locSakala);

      const locPdo = JSON.parse(localStorage.getItem('hgp_pdo_messages') || '[]');
      if (locPdo.length > 0) setPdoMessages(locPdo);

      const locGriev = JSON.parse(localStorage.getItem('hgp_grievances') || '[]');
      if (locGriev.length > 0) setGrievances(locGriev);

      const locFb = JSON.parse(localStorage.getItem('hgp_feedbacks') || '[]');
      if (locFb.length > 0) setFeedbacks(locFb);

      const locUsers = JSON.parse(localStorage.getItem('hgp_users') || '[]');
      if (locUsers.length > 0) setUsersList(locUsers);
    } catch (e) {}

    // 1. PDO Messages
    const unsubPdo = onSnapshot(collection(db, 'pdo_messages'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      
      let local: any[] = [];
      try {
        local = JSON.parse(localStorage.getItem('hgp_pdo_messages') || '[]');
      } catch(e) {}

      const combined = [...list];
      local.forEach(loc => {
        if (!combined.some(c => c.id === loc.id || (c.citizenName === loc.citizenName && c.createdAt === loc.createdAt))) combined.push(loc);
      });

      setPdoMessages(combined);
    }, (err) => {
      console.warn('PDO messages listener error:', err);
      try {
        const local = JSON.parse(localStorage.getItem('hgp_pdo_messages') || '[]');
        if (local.length > 0) setPdoMessages(local);
      } catch(e) {}
    });

    // 2. Grievances
    const unsubGrievances = onSnapshot(collection(db, 'grievances'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      let local: any[] = [];
      try {
        local = JSON.parse(localStorage.getItem('hgp_grievances') || '[]');
      } catch(e) {}

      const combined = [...list];
      local.forEach(loc => {
        if (!combined.some(c => c.id === loc.id || c.ticketNo === loc.ticketNo)) combined.push(loc);
      });

      setGrievances(combined);
    }, (err) => {
      console.warn('Grievances listener error:', err);
      try {
        const local = JSON.parse(localStorage.getItem('hgp_grievances') || '[]');
        if (local.length > 0) setGrievances(local);
      } catch(e) {}
    });

    // 3. Feedbacks
    const unsubFeedbacks = onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      let local: any[] = [];
      try {
        local = JSON.parse(localStorage.getItem('hgp_feedbacks') || '[]');
      } catch(e) {}

      const combined = [...list];
      local.forEach(loc => {
        if (!combined.some(c => c.id === loc.id || (c.fullName === loc.fullName && c.comment === loc.comment))) combined.push(loc);
      });

      setFeedbacks(combined);
    }, (err) => {
      console.warn('Feedbacks listener error:', err);
      try {
        const local = JSON.parse(localStorage.getItem('hgp_feedbacks') || '[]');
        if (local.length > 0) setFeedbacks(local);
      } catch(e) {}
    });

    // 4. Users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      let local: any[] = [];
      try {
        local = JSON.parse(localStorage.getItem('hgp_users') || '[]');
      } catch(e) {}

      const combined = [...list];
      local.forEach(loc => {
        if (!combined.some(c => c.uid === loc.uid || c.email === loc.email)) combined.push(loc);
      });

      setUsersList(combined);
      setLoadingData(false);
    }, (err) => {
      console.warn('Users listener error:', err);
      try {
        const local = JSON.parse(localStorage.getItem('hgp_users') || '[]');
        if (local.length > 0) setUsersList(local);
      } catch(e) {}
      setLoadingData(false);
    });

    // 5. Sakala Applications
    const unsubSakala = onSnapshot(collection(db, 'sakala_applications'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      let local: any[] = [];
      try {
        local = JSON.parse(localStorage.getItem('hgp_sakala_applications') || '[]');
      } catch(e) {}

      const combined = [...list];
      local.forEach(loc => {
        if (!combined.some(c => c.id === loc.id || c.sakalaNumber === loc.sakalaNumber)) combined.push(loc);
      });

      setSakalaApplications(combined);
    }, (err) => {
      console.warn('Sakala listener error:', err);
      try {
        const local = JSON.parse(localStorage.getItem('hgp_sakala_applications') || '[]');
        if (local.length > 0) setSakalaApplications(local);
      } catch(e) {}
    });

    return () => {
      unsubPdo();
      unsubGrievances();
      unsubFeedbacks();
      unsubUsers();
      unsubSakala();
    };
  }, [isAdminLoggedIn]);

  // Handle Grievance Status Update
  const handleUpdateGrievanceStatus = async () => {
    if (!selectedGrievance) return;
    setUpdatingGrievance(true);

    // Optimistic UI update
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === selectedGrievance.id
          ? { ...g, status: newStatus, resolutionRemark: newRemark, updatedAt: new Date().toISOString() }
          : g
      )
    );

    try {
      const grRef = doc(db, 'grievances', selectedGrievance.id);
      await updateDoc(grRef, {
        status: newStatus,
        resolutionRemark: newRemark,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Firestore update warning (optimistic state preserved):', err);
    } finally {
      setUpdatingGrievance(false);
      setSelectedGrievance(null);
    }
  };

  // Handle deleting PDO message
  const handleDeletePdoMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this PDO message?')) return;
    setPdoMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteDoc(doc(db, 'pdo_messages', id));
    } catch (err) {
      console.warn('Delete warning:', err);
    }
  };

  // Handle deleting feedback
  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    try {
      await deleteDoc(doc(db, 'feedbacks', id));
    } catch (err) {
      console.warn('Delete warning:', err);
    }
  };

  // LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 text-white p-6 border-b border-slate-800 text-center space-y-2">
            <div className="w-14 h-14 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">
              {lang === 'kn' ? 'ಅಧಿಕಾರಿ ಆಡಳಿತ ಪೋರ್ಟಲ್' : 'Gram Panchayat Admin Portal'}
            </h2>
            <p className="text-xs text-amber-300 font-medium">
              Halashi Gram Panchayat Nodal Officer & PDO Login
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="p-6 space-y-4 text-xs">
            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Admin Email Address / ಅಧಿಕಾರಿ ಇಮೇಲ್
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-mono focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Admin Password / ಪಾಸ್‌ವರ್ಡ್
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold">Official Admin Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput('prathameshbiranje01@gmail.com');
                    setPasswordInput('pattya07');
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2 py-0.5 rounded transition"
                >
                  Auto-Fill Demo
                </button>
              </div>
              <div className="font-mono text-[10px]">Email: prathameshbiranje01@gmail.com</div>
              <div className="font-mono text-[10px]">Password: pattya07</div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-3 rounded-xl transition shadow flex items-center justify-center gap-2 text-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>{authLoading ? 'Verifying Admin Access...' : 'Login as GP Admin Officer'}</span>
            </button>

            {/* Switch to Citizen Login */}
            {onOpenCitizenLogin && (
              <div className="pt-3 border-t border-slate-200 text-center">
                <p className="text-[11px] text-slate-500 mb-1">Are you a Citizen looking to access online services?</p>
                <button
                  type="button"
                  onClick={onOpenCitizenLogin}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>Switch to Citizen Account Login</span>
                </button>
              </div>
            )}
          </form>

        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN WHEN LOGGED IN
  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Authorized Officer Portal • Halashi Gram Panchayat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {lang === 'kn' ? 'ಗ್ರಾಮ ಪಂಚಾಯತಿ ಆಡಳಿತ ಮತ್ತು ಪರಿಶೀಲನೆ ಮಂಡಳಿ' : 'Gram Panchayat Official Administration Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Logged in as <span className="text-amber-400 font-bold">{ADMIN_EMAIL}</span> (PDO / Nodal Admin)
          </p>
        </div>

        <button
          onClick={handleAdminLogout}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow text-xs flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* PDO Messages */}
        <div 
          onClick={() => setAdminTab('pdo_messages')}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-sm ${
            adminTab === 'pdo_messages'
              ? 'bg-blue-900 text-white border-blue-700 ring-2 ring-blue-500'
              : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">PDO Direct Messages</span>
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black mt-2 font-mono">{pdoMessages.length}</div>
          <span className="text-[10px] opacity-70 block mt-1">Incoming citizen requests</span>
        </div>

        {/* Grievances */}
        <div 
          onClick={() => setAdminTab('grievances')}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-sm ${
            adminTab === 'grievances'
              ? 'bg-amber-900 text-white border-amber-700 ring-2 ring-amber-500'
              : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Janaspandana Grievances</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black mt-2 font-mono">{grievances.length}</div>
          <span className="text-[10px] opacity-70 block mt-1">Civic complaint tickets</span>
        </div>

        {/* Feedbacks */}
        <div 
          onClick={() => setAdminTab('feedbacks')}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-sm ${
            adminTab === 'feedbacks'
              ? 'bg-emerald-900 text-white border-emerald-700 ring-2 ring-emerald-500'
              : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Citizen Feedbacks</span>
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black mt-2 font-mono">{feedbacks.length}</div>
          <span className="text-[10px] opacity-70 block mt-1">Service ratings & comments</span>
        </div>

        {/* Registered Users */}
        <div 
          onClick={() => setAdminTab('users')}
          className={`p-5 rounded-2xl border transition cursor-pointer shadow-sm ${
            adminTab === 'users'
              ? 'bg-indigo-900 text-white border-indigo-700 ring-2 ring-indigo-500'
              : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Registered Citizens</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black mt-2 font-mono">{usersList.length}</div>
          <span className="text-[10px] opacity-70 block mt-1">Firebase Auth user accounts</span>
        </div>

      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAdminTab('pdo_messages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                adminTab === 'pdo_messages'
                  ? 'bg-slate-900 text-amber-400 shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>PDO Messages ({pdoMessages.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('grievances')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                adminTab === 'grievances'
                  ? 'bg-slate-900 text-amber-400 shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Grievances Management ({grievances.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('feedbacks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                adminTab === 'feedbacks'
                  ? 'bg-slate-900 text-amber-400 shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Citizen Feedbacks ({feedbacks.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                adminTab === 'users'
                  ? 'bg-slate-900 text-amber-400 shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Citizen Users ({usersList.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('sakala')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                adminTab === 'sakala'
                  ? 'bg-slate-900 text-amber-400 shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Sakala Applications ({sakalaApplications.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search record..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* TAB 1: PDO MESSAGES */}
        {adminTab === 'pdo_messages' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Direct Messages & Queries Received by PDO Office</span>
            </h3>

            {pdoMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                No PDO messages received yet.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-900 text-slate-300 text-[11px] uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3">Citizen Name</th>
                      <th className="px-4 py-3">Phone Number</th>
                      <th className="px-4 py-3">Message / Note Text</th>
                      <th className="px-4 py-3">Submitted At</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {pdoMessages
                      .filter((m) => 
                        !searchQuery || 
                        m.citizenName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        m.citizenPhone?.includes(searchQuery) ||
                        m.noteText?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((msg) => (
                        <tr key={msg.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-900">{msg.citizenName || 'Citizen'}</td>
                          <td className="px-4 py-3 font-mono text-slate-800">{msg.citizenPhone || 'N/A'}</td>
                          <td className="px-4 py-3 max-w-md text-slate-800 leading-relaxed">{msg.noteText}</td>
                          <td className="px-4 py-3 text-slate-500 text-[11px]">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Recent'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeletePdoMessage(msg.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GRIEVANCES MANAGEMENT */}
        {adminTab === 'grievances' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Civic Complaints & Grievance Tickets (Janaspandana)</span>
            </h3>

            {grievances.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                No grievance tickets found in Firestore.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-900 text-slate-300 text-[11px] uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3">Ticket No</th>
                      <th className="px-4 py-3">Complaint Title</th>
                      <th className="px-4 py-3">Category & Ward</th>
                      <th className="px-4 py-3">Reporter</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {grievances
                      .filter((g) => 
                        !searchQuery || 
                        g.ticketNo?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        g.locationWard?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((gr) => (
                        <tr key={gr.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-extrabold text-blue-700">{gr.ticketNo}</td>
                          <td className="px-4 py-3 max-w-xs">
                            <span className="font-bold text-slate-900 block">{gr.title}</span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">{gr.description}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800 block">{gr.categoryEn || gr.category}</span>
                            <span className="text-[10px] text-slate-500">{gr.locationWard}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-800 block">{gr.reporterName || 'Citizen'}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{gr.reporterPhone}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-block ${
                              gr.status === 'Resolved' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : gr.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                              {gr.status || 'Submitted'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedGrievance(gr);
                                setNewStatus(gr.status || 'In Progress');
                                setNewRemark(gr.resolutionRemark || '');
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-1.5 rounded-lg text-xs transition inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Update Ticket</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FEEDBACKS */}
        {adminTab === 'feedbacks' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>Citizen Service Ratings & Experience Reviews</span>
            </h3>

            {feedbacks.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                No feedback records submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacks.map((f) => (
                  <div key={f.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs relative">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900">{f.fullName || 'Citizen'}</h4>
                        <span className="text-[10px] text-slate-500">{f.serviceType}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{f.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-slate-800 leading-relaxed font-medium">"{f.comment}"</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Phone: {f.phone || 'N/A'}</span>
                      <button
                        onClick={() => handleDeleteFeedback(f.id)}
                        className="text-rose-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REGISTERED USERS */}
        {adminTab === 'users' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Registered Citizens Database (`users` collection)</span>
            </h3>

            {usersList.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                No citizen user records found.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-900 text-slate-300 text-[11px] uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Ward</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{usr.fullName || 'Citizen'}</td>
                        <td className="px-4 py-3 text-slate-800">{usr.email}</td>
                        <td className="px-4 py-3 font-mono">{usr.phone || 'N/A'}</td>
                        <td className="px-4 py-3">{usr.ward || 'Ward 1'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                            {usr.role || 'Citizen'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-[11px]">
                          {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SAKALA APPLICATIONS */}
        {adminTab === 'sakala' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>Bapuji Seva Kendra Sakala Submissions (`sakala_applications` collection)</span>
            </h3>

            {sakalaApplications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                No Sakala application submissions found yet. Submit a form in Online Services to populate real entries.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-900 text-slate-300 text-[11px] uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3">Sakala No / Ref ID</th>
                      <th className="px-4 py-3">Applicant Name</th>
                      <th className="px-4 py-3">Mobile / Aadhaar</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Target Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {sakalaApplications
                      .filter((app) => {
                        if (!searchQuery.trim()) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          app.sakalaNumber?.toLowerCase().includes(q) ||
                          app.applicationNo?.toLowerCase().includes(q) ||
                          app.applicantName?.toLowerCase().includes(q) ||
                          app.serviceName?.toLowerCase().includes(q) ||
                          app.applicantPhone?.toLowerCase().includes(q)
                        );
                      })
                      .map((app) => (
                      <tr key={app.id || app.sakalaNumber} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-indigo-900 block">{app.sakalaNumber}</span>
                          <span className="font-mono text-[10px] text-slate-500">{app.applicationNo}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">{app.applicantName}</td>
                        <td className="px-4 py-3 font-mono">
                          {app.applicantPhone}
                          {app.applicantAadhaar && <span className="block text-[10px] text-slate-400">{app.applicantAadhaar}</span>}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">{app.serviceName}</td>
                        <td className="px-4 py-3 text-slate-600">{app.submittedAt}</td>
                        <td className="px-4 py-3 font-bold text-amber-700">{app.estimatedDeliveryDate}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {app.status || 'Submitted'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL: UPDATE GRIEVANCE TICKET */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-white">Update Ticket #{selectedGrievance.ticketNo}</h3>
                <p className="text-xs text-amber-300">Janaspandana Redressal Officer Panel</p>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">{selectedGrievance.title}</span>
                <p className="text-slate-600">{selectedGrievance.description}</p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Location: <span className="font-bold text-slate-800">{selectedGrievance.locationWard}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Update Ticket Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Submitted">Submitted (Pending Review)</option>
                  <option value="In Inspection">In Inspection (Field Officer Assigned)</option>
                  <option value="In Progress">In Progress (Work Underway)</option>
                  <option value="Resolved">Resolved (Completed & Verified)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Panchayat Official Resolution Remarks / Notes
                </label>
                <textarea
                  rows={3}
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  placeholder="e.g. Field inspection completed by PDO. Water pipe repair executed on 24th July 2026."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateGrievanceStatus}
                  disabled={updatingGrievance}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>{updatingGrievance ? 'Saving...' : 'Save Ticket Status'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
