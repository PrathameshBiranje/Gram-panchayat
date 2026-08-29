import React, { useState } from 'react';
import { Language, TaxProperty } from '../types';
import { TAX_PROPERTIES_SAMPLE, PANCHAYAT_INFO } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  X, 
  Search, 
  CreditCard, 
  CheckCircle2, 
  Building2, 
  Printer, 
  ShieldCheck, 
  QrCode,
  Sparkles,
  Receipt
} from 'lucide-react';

interface TaxPaymentModalProps {
  lang: Language;
  onClose: () => void;
}

export const TaxPaymentModal: React.FC<TaxPaymentModalProps> = ({
  lang,
  onClose,
}) => {
  const t = UI_TRANSLATIONS[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<TaxProperty | null>(TAX_PROPERTIES_SAMPLE[0]);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentReceiptNo, setPaymentReceiptNo] = useState('');
  const [paymentMode, setPaymentMode] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const filteredProperties = TAX_PROPERTIES_SAMPLE.filter(
    (p) =>
      p.assessmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerNameKn.includes(searchTerm) ||
      p.doorNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayTax = () => {
    if (!selectedProperty) return;
    const rcNo = `HGP-RC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setPaymentReceiptNo(rcNo);
    setPaymentDone(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10 shadow">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 text-amber-400 font-bold shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-950 block">
                e-Swathu & Panchatantra 2.0 Tax Gateway
              </span>
              <h2 className="text-lg font-black text-slate-950">
                {t.taxSectionTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-amber-800/20 text-slate-950 font-bold transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!paymentDone ? (
          <div className="p-6 space-y-6 text-slate-800">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Search Assessment No / Property Owner Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={t.searchAssessmentPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Matching Properties List */}
              <div className="mt-2 flex flex-wrap gap-2">
                {filteredProperties.map((prop) => (
                  <button
                    key={prop.assessmentNo}
                    onClick={() => setSelectedProperty(prop)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                      selectedProperty?.assessmentNo === prop.assessmentNo
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {prop.assessmentNo} - {prop.ownerName.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {selectedProperty && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                
                {/* Property Identity Card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-200 gap-2">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Assessment No: {selectedProperty.assessmentNo}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {lang === 'kn' ? selectedProperty.ownerNameKn : selectedProperty.ownerName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedProperty.doorNo} • {selectedProperty.wardNo}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        selectedProperty.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {selectedProperty.paymentStatus === 'Paid' ? t.paidBadge : t.unpaidBadge}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Financial Year: 2025-26</p>
                  </div>
                </div>

                {/* Itemized Tax Breakdown Table */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-extrabold text-slate-900 border-b pb-1 text-xs">
                    Tax Component Breakdown (Panchatantra Schedule)
                  </h4>
                  
                  <div className="flex justify-between text-slate-600">
                    <span>{t.houseTax} ({selectedProperty.builtAreaSqFt} sq.ft)</span>
                    <span className="font-semibold text-slate-900">₹ {selectedProperty.houseTaxRs}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>{t.waterCess}</span>
                    <span className="font-semibold text-slate-900">₹ {selectedProperty.waterTaxRs}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>{t.libraryCess} (6%)</span>
                    <span className="font-semibold text-slate-900">₹ {selectedProperty.libraryCessRs}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>{t.healthCess} (5%)</span>
                    <span className="font-semibold text-slate-900">₹ {selectedProperty.healthCessRs}</span>
                  </div>

                  <div className="flex justify-between font-black text-sm text-amber-900 pt-2 border-t border-slate-200">
                    <span>{t.totalDue}</span>
                    <span>₹ {selectedProperty.totalDueRs}</span>
                  </div>
                </div>

                {/* Payment Option Selector */}
                {selectedProperty.paymentStatus === 'Unpaid' && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold text-slate-800 block">Select Digital Payment Mode:</span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentMode('upi')}
                        className={`p-2.5 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 ${
                          paymentMode === 'upi'
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <QrCode className="w-4 h-4" /> UPI / BHIM
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMode('card')}
                        className={`p-2.5 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 ${
                          paymentMode === 'card'
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" /> Debit/Credit Card
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMode('netbanking')}
                        className={`p-2.5 rounded-xl border font-bold transition flex items-center justify-center gap-1.5 ${
                          paymentMode === 'netbanking'
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Building2 className="w-4 h-4" /> NetBanking
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handlePayTax}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{t.payTaxBtn} (₹ {selectedProperty.totalDueRs})</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Official Printed e-Receipt */
          <div className="p-6 space-y-6 text-slate-900">
            <div className="border-4 border-double border-amber-700 p-6 rounded-2xl bg-amber-50/40 relative space-y-4">
              
              <div className="text-center border-b border-amber-200 pb-3">
                <div className="w-12 h-12 bg-amber-600 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-1 font-black">
                  HGP
                </div>
                <h3 className="text-base font-black text-amber-950 uppercase tracking-tight">
                  {PANCHAYAT_INFO.gpNameEn}
                </h3>
                <p className="text-xs font-bold text-slate-800">
                  Panchatantra 2.0 Official Property Tax e-Receipt (2025-26)
                </p>
                <p className="text-[10px] text-slate-600">Khanapur Taluk, Belagavi District, Govt of Karnataka</p>
              </div>

              <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 p-3 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm">Payment Received Successfully!</h4>
                  <p className="text-xs">Transaction reference: {paymentReceiptNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-amber-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Assessment No</span>
                  <span className="font-mono font-bold text-amber-900">{selectedProperty?.assessmentNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Receipt No</span>
                  <span className="font-mono font-bold text-slate-800">{paymentReceiptNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Property Owner</span>
                  <span className="font-bold text-slate-900">{selectedProperty?.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Door & Ward No</span>
                  <span className="font-bold text-slate-800">{selectedProperty?.doorNo} ({selectedProperty?.wardNo})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Amount Paid</span>
                  <span className="font-black text-emerald-800 text-sm">₹ {selectedProperty?.totalDueRs}.00</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Payment Mode</span>
                  <span className="font-bold text-slate-800 uppercase">{paymentMode} (Online Gateway)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 border-t border-amber-200">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-8 h-8 text-slate-700" />
                  <span>Verified via e-Swathu Portal</span>
                </div>
                <div className="text-right">
                  <span className="font-bold block text-slate-800">Secretary / PDO Seal</span>
                  <span>Halashi Gram Panchayat</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrint}
                className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-2 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>{t.receiptDownload}</span>
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
