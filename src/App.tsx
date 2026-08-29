import React, { useState, useEffect } from 'react';
import { Language, ServiceItem } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { OnlineServicesGrid } from './components/OnlineServicesGrid';
import { ServiceApplicationModal } from './components/ServiceApplicationModal';
import { TaxPaymentModal } from './components/TaxPaymentModal';
import { GrievancePortal } from './components/GrievancePortal';
import { FeedbackPortal } from './components/FeedbackPortal';
import { GramSabhaAndProjects } from './components/GramSabhaAndProjects';
import { MgnregsTracker } from './components/MgnregsTracker';
import { TendersAndNotices } from './components/TendersAndNotices';
import { PanchayatDirectory } from './components/PanchayatDirectory';
import { HalashiHeritage } from './components/HalashiHeritage';
import { PdoContactModal } from './components/PdoContactModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { auth } from './lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export default function App() {
  const [lang, setLang] = useState<Language>('kn'); // Default to Kannada for local rural authenticity
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Firebase Auth user state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showTaxModal, setShowTaxModal] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Listen for Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // FontSize multiplier class generator
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getFontSizeClass()} ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Header Bar */}
      <Header
        lang={lang}
        setLang={setLang}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAi={() => setShowAiModal(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main Body Layout */}
      <main className="flex-1">
        {/* Top Hero Banner */}
        <HeroBanner
          lang={lang}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenTaxModal={() => setShowTaxModal(true)}
          onOpenGrievanceModal={() => setActiveTab('grievance')}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'home' && (
          <div className="space-y-12 pb-12">
            <OnlineServicesGrid
              lang={lang}
              onSelectService={(service) => setSelectedService(service)}
            />
            <GramSabhaAndProjects lang={lang} />
            <HalashiHeritage lang={lang} />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="pb-12">
            <OnlineServicesGrid
              lang={lang}
              onSelectService={(service) => setSelectedService(service)}
            />
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="pb-12 pt-6 max-w-7xl mx-auto px-4">
            <button
              onClick={() => setShowTaxModal(true)}
              className="bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-amber-600 transition"
            >
              Open Online Tax Payment Window
            </button>
            <div className="mt-8">
              <GramSabhaAndProjects lang={lang} />
            </div>
          </div>
        )}

        {activeTab === 'mgnregs' && (
          <div className="pb-12">
            <MgnregsTracker lang={lang} />
          </div>
        )}

        {activeTab === 'gpdp' && (
          <div className="pb-12">
            <GramSabhaAndProjects lang={lang} />
          </div>
        )}

        {activeTab === 'gramsabha' && (
          <div className="pb-12">
            <GramSabhaAndProjects lang={lang} />
          </div>
        )}

        {activeTab === 'grievance' && (
          <div className="pb-12">
            <GrievancePortal lang={lang} />
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="pb-12">
            <FeedbackPortal lang={lang} />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="pb-12">
            <AdminPortal 
              lang={lang} 
              currentUser={currentUser} 
              onOpenCitizenLogin={() => setShowAuthModal(true)}
            />
          </div>
        )}

        {activeTab === 'tenders' && (
          <div className="pb-12">
            <TendersAndNotices lang={lang} />
          </div>
        )}

        {activeTab === 'directory' && (
          <div className="pb-12">
            <PanchayatDirectory lang={lang} />
          </div>
        )}

        {activeTab === 'heritage' && (
          <div className="pb-12">
            <HalashiHeritage lang={lang} />
          </div>
        )}
      </main>

      {/* Citizen Auth Modal */}
      {showAuthModal && (
        <AuthModal
          lang={lang}
          currentUser={currentUser}
          onClose={() => setShowAuthModal(false)}
          onOpenAdminPortal={() => {
            setShowAuthModal(false);
            setActiveTab('admin');
          }}
        />
      )}

      {/* Service Application Form Modal */}
      {selectedService && (
        <ServiceApplicationModal
          service={selectedService}
          lang={lang}
          onClose={() => setSelectedService(null)}
        />
      )}

      {/* Property Tax Modal */}
      {showTaxModal && (
        <TaxPaymentModal
          lang={lang}
          onClose={() => setShowTaxModal(false)}
        />
      )}

      {/* PDO Contact Official Modal */}
      {showAiModal && (
        <PdoContactModal
          lang={lang}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Official Footer */}
      <Footer lang={lang} onNavigateTab={(tab) => setActiveTab(tab)} />
    </div>
  );
}
