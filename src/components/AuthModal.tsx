import React, { useState } from 'react';
import { Language } from '../types';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  type User 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Building2,
  LogIn,
  UserPlus
} from 'lucide-react';

interface AuthModalProps {
  lang: Language;
  currentUser: User | null;
  onClose: () => void;
  onOpenAdminPortal?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ lang, currentUser, onClose, onOpenAdminPortal }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'profile'>(currentUser ? 'profile' : 'login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('Ward 1 (Temple Street)');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Quick Demo Citizen Login
  const handleQuickDemoCitizen = async () => {
    setErrorMsg('');
    setLoading(true);
    const demoEmail = `citizen.${Math.floor(1000 + Math.random() * 9000)}@halashi.gov.in`;
    const demoPass = 'Citizen123!';
    try {
      const res = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
      await saveUserProfile(res.user, 'Basavaraj Patil (Citizen)', '9880123456', 'Ward 1');
      setSuccessMsg(lang === 'kn' ? 'ನಾಗರಿಕ ಖಾತೆಗೆ ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ!' : 'Instant Citizen Demo Account logged in!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      // Fallback try signing in if user existed
      try {
        const res2 = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        await saveUserProfile(res2.user);
        setSuccessMsg('Logged in as Citizen!');
        setTimeout(() => onClose(), 1000);
      } catch (e2: any) {
        setErrorMsg('Failed quick login: ' + e2.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save or Update user profile in Firestore
  const saveUserProfile = async (user: User, customName?: string, customPhone?: string, customWard?: string) => {
    const userData = {
      uid: user.uid,
      id: user.uid,
      fullName: customName || user.displayName || 'Citizen User',
      email: user.email || '',
      phone: customPhone || '',
      ward: customWard || 'Ward 1',
      createdAt: new Date().toISOString(),
      role: 'Citizen'
    };

    // 1. Save to LocalStorage
    try {
      const local = JSON.parse(localStorage.getItem('hgp_users') || '[]');
      const filtered = local.filter((u: any) => u.uid !== user.uid);
      localStorage.setItem('hgp_users', JSON.stringify([userData, ...filtered]));
    } catch (e) {}

    // 2. Save to Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, userData, { merge: true });
    } catch (err) {
      console.warn('User profile sync error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await saveUserProfile(res.user);
      setSuccessMsg(lang === 'kn' ? 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ!' : 'Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!fullName.trim()) {
      setErrorMsg(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ' : 'Please enter your full name');
      return;
    }
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserProfile(res.user, fullName, phone, ward);
      setSuccessMsg(lang === 'kn' ? 'ನಾಗರಿಕ ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!' : 'Citizen account created successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      await saveUserProfile(res.user);
      setSuccessMsg(lang === 'kn' ? 'ಗೂಗಲ್ ಮೂಲಕ ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!' : 'Signed in with Google successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden relative my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {currentUser 
                  ? (lang === 'kn' ? 'ನಾಗರಿಕ ಪ್ರೊಫೈಲ್' : 'Citizen Account Profile')
                  : mode === 'login'
                  ? (lang === 'kn' ? 'ನಾಗರಿಕ ಲಾಗಿನ್' : 'Citizen Sign In')
                  : (lang === 'kn' ? 'ಹೊಸ ಖಾತೆ ನೋಂದಣಿ' : 'Create Citizen Account')}
              </h3>
              <p className="text-xs text-blue-300 font-medium">
                {lang === 'kn' ? 'ಹಳಸಿ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಸೇವೆಗಳು' : 'Halashi Gram Panchayat Digital Services'}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Success / Error Banners */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: LOGGED IN PROFILE */}
          {currentUser ? (
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-lg">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {currentUser.displayName || 'Registered Citizen'}
                </h4>
                <p className="text-xs text-slate-500 font-medium">{currentUser.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Citizen Account</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">User UID</span>
                  <span className="font-mono text-slate-700 font-bold text-[11px]">{currentUser.uid.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Gram Panchayat</span>
                  <span className="font-bold text-slate-800">Halashi - Khanapur</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Status</span>
                  <span className="font-bold text-emerald-700">Active Firebase Auth</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ಸೈನ್ ಔಟ್ ಮಾಡಿ' : 'Sign Out Account'}</span>
                </button>
              </div>
            </div>
          ) : mode === 'login' ? (
            /* MODE: LOGIN */
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {lang === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. citizen@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl transition shadow text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? (lang === 'kn' ? 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...' : 'Signing In...') : (lang === 'kn' ? 'ಸೈನ್ ಇನ್' : 'Sign In')}</span>
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative bg-white px-3 text-[10px] text-slate-400 font-bold uppercase">OR</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoCitizen}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl transition text-[11px] flex items-center justify-center gap-1.5 shadow-sm"
                  title="Instant Demo Citizen Sign In"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>1-Click Citizen Demo</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl transition text-[11px] flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Sign In</span>
                </button>
              </div>

              {/* Admin Portal Switch Option */}
              {onOpenAdminPortal && (
                <div className="pt-2 border-t border-slate-200 text-center">
                  <p className="text-[11px] text-slate-500 font-medium mb-1">Are you a Panchayat Official or Admin?</p>
                  <button
                    type="button"
                    onClick={onOpenAdminPortal}
                    className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-400 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Go to Admin Officer Portal Login</span>
                  </button>
                </div>
              )}

              <div className="text-center pt-2">
                <span className="text-slate-500">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-blue-700 hover:underline"
                >
                  Create New Account
                </button>
              </div>
            </form>
          ) : (
            /* MODE: SIGNUP */
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Full Name / ಪೂರ್ಣ ಹೆಸರು <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Kamble"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Email Address / ಇಮೇಲ್ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. suresh@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Phone Number / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Ward Location / ವಾರ್ಡ್
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Ward 1 (Temple Street)">Ward 1 - Temple Street</option>
                  <option value="Ward 2 (Kadamba Circle)">Ward 2 - Kadamba Circle</option>
                  <option value="Ward 3 (Sanjeevini Layout)">Ward 3 - Sanjeevini Layout</option>
                  <option value="Ward 4 (Suvarneshwara Lane)">Ward 4 - Suvarneshwara Lane</option>
                  <option value="Ward 5 (Fort Area)">Ward 5 - Fort Area</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Password / ಪಾಸ್‌ವರ್ಡ್ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition shadow text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating Account...' : 'Register Citizen Account'}</span>
              </button>

              <div className="text-center pt-2">
                <span className="text-slate-500">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-700 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Powered by Halashi Gram Panchayat Firebase Cloud Authentication
        </div>

      </div>
    </div>
  );
};
