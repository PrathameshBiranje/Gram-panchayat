import React, { useState } from 'react';
import { Language, HeritageSite, ShgProduct } from '../types';
import { HERITAGE_SITES, SHG_PRODUCTS } from '../data/villageData';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  Landmark, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  PhoneCall, 
  Sparkles, 
  CheckCircle2, 
  Award,
  Globe
} from 'lucide-react';

interface HalashiHeritageProps {
  lang: Language;
}

export const HalashiHeritage: React.FC<HalashiHeritageProps> = ({ lang }) => {
  const t = UI_TRANSLATIONS[lang];

  const [selectedProduct, setSelectedProduct] = useState<ShgProduct | null>(null);

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      
      {/* Title Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-amber-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-800 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
          <Landmark className="w-4 h-4 text-amber-400" />
          <span>Kadamba Kingdom Heritage Capital • 5th Century CE</span>
        </div>
        <h2 className="text-3xl font-black text-amber-200 tracking-tight">
          {t.heritageTitle}
        </h2>
        <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-3xl">
          Halashi (ancient Palasika) was the glorious second capital of the Kadamba Dynasty of Karnataka. Explore our ancient stone temples, Halmidi-contemporary Kannada inscriptions, and support local Sanjeevini women self-help group artisans.
        </p>
      </div>

      {/* Historical Monuments Showcase */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-700" />
          Ancient Kadamba Temple Monuments & Archaeological Sites
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HERITAGE_SITES.map((site) => (
            <div
              key={site.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={site.imageUrl}
                    alt={site.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur">
                    {site.period}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                    {lang === 'kn' ? site.nameKn : site.nameEn}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'kn' ? site.significanceKn : site.significanceEn}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{lang === 'kn' ? site.deityOrStructureKn : site.deityOrStructureEn}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{lang === 'kn' ? site.locationKn : site.locationEn}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {site.timings}
                </span>
                <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Open for Pilgrims
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sanjeevini NRLM Women SHG Market */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-indigo-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Sanjeevini KSRLPS Rural Livelihoods</span>
            </div>
            <h3 className="text-2xl font-black text-white">Halashi Stree Shakti Village Product Market</h3>
            <p className="text-xs text-slate-300 mt-1">Buy authentic organic food, handicrafts & forest produce directly from local women self-help groups.</p>
          </div>

          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-400/30">
            100% Direct Fair Price to Women Farmers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHG_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-slate-900 rounded-2xl border border-indigo-800/80 p-5 space-y-4 flex flex-col justify-between hover:border-amber-400 transition"
            >
              <div className="space-y-3">
                <div className="h-44 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative">
                  <img
                    src={prod.imageUrl}
                    alt={prod.nameEn}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    {lang === 'kn' ? prod.categoryKn : prod.categoryEn}
                  </span>
                  <span className="font-mono text-base font-black text-amber-400">
                    ₹ {prod.priceRs}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-white">
                  {lang === 'kn' ? prod.nameKn : prod.nameEn}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'kn' ? prod.descriptionKn : prod.descriptionEn}
                </p>

                <p className="text-[11px] text-amber-300 font-bold">
                  By: {lang === 'kn' ? prod.shgGroupKn : prod.shgGroupEn}
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(prod)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact SHG Artisan ({prod.contactPhone})</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-base font-black text-indigo-950 border-b pb-2">
              Direct Order Inquiries • {selectedProduct.nameEn}
            </h4>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-amber-950">
                <span>Group: {selectedProduct.shgGroupEn}</span>
                <span>Price: ₹ {selectedProduct.priceRs}</span>
              </div>
              <p className="text-slate-700">{selectedProduct.descriptionEn}</p>
            </div>

            <div className="bg-slate-100 p-4 rounded-xl text-xs space-y-2">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Call / WhatsApp Direct Contact:</span>
              <a
                href={`tel:${selectedProduct.contactPhone}`}
                className="text-lg font-black text-indigo-900 hover:underline block"
              >
                +91 {selectedProduct.contactPhone}
              </a>
              <p className="text-[10px] text-slate-500">Delivery available across Khanapur and Belagavi Taluks.</p>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full bg-slate-900 text-white font-bold text-xs py-2 rounded-xl"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
