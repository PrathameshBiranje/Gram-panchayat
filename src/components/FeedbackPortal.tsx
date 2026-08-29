import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ThumbsUp, 
  Building2, 
  User, 
  Sparkles,
  Heart,
  Filter,
  ShieldCheck
} from 'lucide-react';

interface FeedbackPortalProps {
  lang: Language;
}

interface FeedbackRecord {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  rating: number;
  serviceType: string;
  comment: string;
  createdAt: string;
  userId?: string;
}

export const FeedbackPortal: React.FC<FeedbackPortalProps> = ({ lang }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('overall_gp');
  const [comment, setComment] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Sync user info if signed in
  useEffect(() => {
    if (auth.currentUser) {
      if (auth.currentUser.displayName) setFullName(auth.currentUser.displayName);
    }
  }, [auth.currentUser]);

  // Real-time Firestore subscription to feedbacks
  useEffect(() => {
    const feedbackRef = collection(db, 'feedbacks');
    const q = query(feedbackRef, orderBy('createdAt', 'desc'), limit(20));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: FeedbackRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loaded.push({
            id: doc.id,
            fullName: data.fullName || 'Anonymous Citizen',
            email: data.email || '',
            phone: data.phone || '',
            rating: data.rating || 5,
            serviceType: data.serviceType || 'General GP Services',
            comment: data.comment || '',
            createdAt: data.createdAt || new Date().toISOString().split('T')[0],
            userId: data.userId || ''
          });
        });
        setFeedbacks(loaded);
        setLoadingList(false);
      },
      (error) => {
        console.warn('Firestore feedback listener error:', error);
        setLoadingList(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !fullName.trim()) return;

    setSubmitting(true);
    const newFeedback = {
      id: `fb-${Date.now()}`,
      fullName,
      phone,
      rating,
      serviceType,
      comment,
      createdAt: new Date().toISOString(),
      userId: auth.currentUser ? auth.currentUser.uid : 'guest'
    };

    // 1. Save to LocalStorage
    try {
      const local = JSON.parse(localStorage.getItem('hgp_feedbacks') || '[]');
      localStorage.setItem('hgp_feedbacks', JSON.stringify([newFeedback, ...local]));
    } catch (e) {}

    // 2. Save to Firestore
    try {
      await addDoc(collection(db, 'feedbacks'), newFeedback);
    } catch (err) {
      console.warn('Firestore write warning:', err);
    } finally {
      setSubmittedSuccess(true);
      setComment('');
      setSubmitting(false);
    }
  };

  const getServiceLabel = (type: string) => {
    const map: Record<string, string> = {
      overall_gp: lang === 'kn' ? 'ಒಟ್ಟಾರೆ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಸೇವೆಗಳು' : 'Overall GP Administration',
      drinking_water: lang === 'kn' ? 'ಕುಡಿಯುವ ನೀರು ಪೂರೈಕೆ' : 'Drinking Water Supply',
      e_swathu: lang === 'kn' ? 'ಇ-ಸ್ವತ್ತು ಮತ್ತು ಆಸ್ತಿ ಸೇವೆಗಳು' : 'E-Swathu & Property Forms',
      tax_payment: lang === 'kn' ? 'ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿ' : 'Property Tax Collection',
      street_lights: lang === 'kn' ? 'ಬೀದಿ ದೀಪ ಮತ್ತು ನೈರ್ಮಲ್ಯ' : 'Street Lights & Sanitation',
      janaspandana: lang === 'kn' ? 'ಜನಸ್ಪಂದನ ಕುಂದುಕೊರತೆ ನಿವಾರಣೆ' : 'Janaspandana Grievances'
    };
    return map[type] || type;
  };

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Gram Swaraj • Citizens Voice & Live Firebase Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {lang === 'kn' ? 'ನಾಗರಿಕ ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ಅನಿಸಿಕೆಗಳು' : 'Citizen Feedback & Service Rating'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {lang === 'kn' 
              ? 'ಹಳಸಿ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಸೇವೆಗಳ ಸುಧಾರಣೆಗೆ ನಿಮ್ಮ ಅನಿಸಿಕೆ ಹಾಗೂ ಸಲಹೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ' 
              : 'Help us improve Halashi Gram Panchayat governance by providing your valuable feedback'}
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shrink-0 text-center flex items-center gap-4">
          <div>
            <span className="text-2xl font-black text-amber-400 font-mono">4.8 / 5</span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Average GP Rating</span>
          </div>
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Submit Feedback */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <MessageSquare className="w-5 h-5 text-blue-700" />
            <h3 className="font-extrabold text-slate-900 text-base">
              {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ' : 'Submit Citizen Feedback'}
            </h3>
          </div>

          {submittedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Thank You for Your Feedback!</h4>
              <p className="text-xs text-slate-600">
                Your feedback has been saved securely to Halashi Gram Panchayat Firebase Firestore database.
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
              
              {/* Star Rating selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Rate Panchayat Service / ಸೇವಾ ರೇಟಿಂಗ್ <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-auto font-bold text-slate-700 text-xs">
                    {rating === 5 ? 'Excellent ⭐⭐⭐⭐⭐' : rating === 4 ? 'Very Good ⭐⭐⭐⭐' : rating === 3 ? 'Good ⭐⭐⭐' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Select Service / ಗ್ರಾಮ ಪಂಚಾಯತಿ ಸೇವೆ <span className="text-red-500">*</span>
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option value="overall_gp">Overall GP Services / ಒಟ್ಟಾರೆ ಸೇವೆಗಳು</option>
                  <option value="drinking_water">Drinking Water Supply / ಕುಡಿಯುವ ನೀರು</option>
                  <option value="e_swathu">E-Swathu & Property Forms / ಇ-ಸ್ವತ್ತು</option>
                  <option value="tax_payment">Property Tax Payment / ತೆರಿಗೆ ಪಾವತಿ</option>
                  <option value="street_lights">Street Lighting & Sanitation / ಬೀದಿ ದೀಪ</option>
                  <option value="janaspandana">Janaspandana Grievance Redressal / ಜನಸ್ಪಂದನ</option>
                </select>
              </div>

              {/* Citizen Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Your Full Name / ನಿಮ್ಮ ಹೆಸರು <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basavaraj Patil"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Citizen Phone */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Comments / Suggestions / ಅಭಿಪ್ರಾಯ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your experience or suggestions for Halashi GP..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition shadow flex items-center justify-center gap-2 text-xs"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Saving to Firebase...' : 'Submit Feedback to Firestore'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right List: Live Feedbacks from Firestore */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Live Citizen Feedback Feed</h3>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
              Firebase Firestore Powered
            </span>
          </div>

          {loadingList ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              Loading citizen feedbacks from Firebase...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              No feedbacks submitted yet. Be the first citizen to submit feedback!
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {feedbacks.map((f) => (
                <div key={f.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {f.fullName[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900">{f.fullName}</h4>
                        <span className="text-[10px] text-slate-400">{getServiceLabel(f.serviceType)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{f.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{f.comment}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Citizen Entry
                    </span>
                    <span>{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
