import React, { useState } from 'react';
import { Language, ServiceItem, ApplicationSubmission } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { PANCHAYAT_INFO } from '../data/villageData';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  X, 
  FileCheck2, 
  ShieldCheck, 
  Clock, 
  Upload, 
  CheckCircle2, 
  Printer, 
  Send,
  Building2
} from 'lucide-react';

interface ServiceApplicationModalProps {
  service: ServiceItem;
  lang: Language;
  onClose: () => void;
}

export const ServiceApplicationModal: React.FC<ServiceApplicationModalProps> = ({
  service,
  lang,
  onClose,
}) => {
  const t = UI_TRANSLATIONS[lang];

  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantAadhaar, setApplicantAadhaar] = useState('');
  const [address, setAddress] = useState('Ward 1, Main Road, Halashi');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submission, setSubmission] = useState<ApplicationSubmission | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setUploadedFiles((prev) => [...prev, fileName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const sakalaNo = `SKL-2026-HL-${randomDigits}`;
    const appNo = `HGP-2026-BSK-${randomDigits}`;

    const submissionDate = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(submissionDate.getDate() + service.processingTimeDays);

    const newSub: ApplicationSubmission = {
      applicationNo: appNo,
      sakalaNumber: sakalaNo,
      serviceId: service.id,
      serviceName: lang === 'kn' ? service.titleKn : service.titleEn,
      applicantName,
      applicantPhone,
      applicantAadhaar: applicantAadhaar ? `XXXX-XXXX-${applicantAadhaar.slice(-4)}` : 'XXXX-XXXX-8821',
      address,
      submittedAt: submissionDate.toISOString().split('T')[0],
      estimatedDeliveryDate: deliveryDate.toISOString().split('T')[0],
      status: 'Submitted',
    };

    setSubmission(newSub);

    // 1. Save to LocalStorage for instant search & persistence
    try {
      const existing = JSON.parse(localStorage.getItem('hgp_sakala_applications') || '[]');
      localStorage.setItem('hgp_sakala_applications', JSON.stringify([newSub, ...existing]));
    } catch (err) {
      console.warn('LocalStorage save warning:', err);
    }

    // 2. Save to Firebase Firestore Database
    try {
      await addDoc(collection(db, 'sakala_applications'), {
        ...newSub,
        uploadedFiles,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Firestore application save error:', err);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-indigo-950 text-white p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                Sakala Application Form • Bapuji Seva Kendra
              </span>
              <h2 className="text-lg font-bold text-white">
                {lang === 'kn' ? service.titleKn : service.titleEn}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-indigo-800 text-indigo-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submission ? (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-slate-800">
            {/* Service Summary Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Service Code: {service.code}</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {service.processingTimeDays} Days Guaranteed (Sakala)
                </span>
              </div>
              <p className="text-slate-600">{lang === 'kn' ? service.descriptionKn : service.descriptionEn}</p>
            </div>

            {/* Applicant Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-1">
                1. Applicant Personal Information / ಅರ್ಜಿದಾರರ ಮಾಹಿತಿ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name / ಪೂರ್ಣ ಹೆಸರು <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basavaraj Patil"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Aadhaar Number / ಆಧಾರ್ ಸಂಖ್ಯೆ
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="12-digit Aadhaar number"
                    value={applicantAadhaar}
                    onChange={(e) => setApplicantAadhaar(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ward & Address in Halashi / ವಿಳಾಸ
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload Simulator */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-1">
                2. Upload Required Documents / ದಾಖಲೆಗಳು
              </h3>

              <div className="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center">
                <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  Click to attach required supporting files (Aadhaar, RTC, Tax Receipt)
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">PDF, JPG, PNG up to 5MB</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="doc-upload"
                />
                <label
                  htmlFor="doc-upload"
                  className="inline-block mt-3 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer transition shadow"
                >
                  Browse Document File
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700">Attached Files:</span>
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 p-2 rounded-lg text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Sakala Application</span>
              </button>
            </div>
          </form>
        ) : (
          /* Official Sakala Receipt Slip Output */
          <div className="p-6 space-y-6 text-slate-900">
            <div id="printable-acknowledgment-slip" className="border-4 border-double border-indigo-950 p-6 rounded-2xl bg-slate-50 relative">
              <div className="text-center border-b border-slate-300 pb-4">
                <div className="w-12 h-12 bg-indigo-900 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-indigo-950 uppercase tracking-tight">
                  {PANCHAYAT_INFO.gpNameEn}
                </h3>
                <p className="text-xs font-bold text-slate-700">
                  Bapuji Seva Kendra • Sakala Citizen Guarantee Slip
                </p>
                <p className="text-[11px] text-slate-500">Khanapur Taluk, Belagavi District, Karnataka</p>
              </div>

              <div className="my-4 bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-950">Application Submitted Successfully!</h4>
                  <p className="text-xs text-emerald-800">Your request has been registered in Sakala Portal & Database.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-200 py-3">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Sakala Guarantee No</span>
                  <span className="font-mono font-extrabold text-indigo-950 text-sm">{submission.sakalaNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">BSK Ref Application ID</span>
                  <span className="font-mono font-bold text-slate-800">{submission.applicationNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Applicant Name</span>
                  <span className="font-bold text-slate-800">{submission.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Mobile / Aadhaar</span>
                  <span className="font-bold text-slate-800">{submission.applicantPhone} ({submission.applicantAadhaar})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Service Requested</span>
                  <span className="font-bold text-indigo-900">{submission.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Guaranteed Delivery Date</span>
                  <span className="font-extrabold text-amber-700">{submission.estimatedDeliveryDate}</span>
                </div>
              </div>

              <div className="mt-4 text-[10px] text-slate-500 flex justify-between items-center pt-2">
                <span>Designated Officer: PDO, Halashi Gram Panchayat</span>
                <span>Stamp: Digitally Verified</span>
              </div>
            </div>

            <div className="flex justify-between items-center no-print">
              <button
                onClick={handlePrintReceipt}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Acknowledgment Slip</span>
              </button>

              <button
                onClick={onClose}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-5 py-2 rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
