import React, { useState } from 'react';
import { ActiveTab, RegisterEvidenceResponse } from './types/evidence';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { RegisterPage } from './components/register/RegisterPage';
import { VerifyPage } from './components/verify/VerifyPage';
import { EvidenceCertificate } from './components/certificate/EvidenceCertificate';
import { DashboardPage } from './components/dashboard/DashboardPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [currentRegistration, setCurrentRegistration] = useState<RegisterEvidenceResponse | null>(null);
  const [targetProofIdForVerification, setTargetProofIdForVerification] = useState<string>('');

  const handleRegistrationSuccess = (response: RegisterEvidenceResponse) => {
    setCurrentRegistration(response);
    setActiveTab('certificate');
  };

  const handleNavigateToVerifyWithId = (proofId: string) => {
    setTargetProofIdForVerification(proofId);
    setActiveTab('verify');
  };

  const handleViewCertificate = (registration: RegisterEvidenceResponse) => {
    setCurrentRegistration(registration);
    setActiveTab('certificate');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 bg-grid-pattern relative">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'verify') {
            // Keep existing target if set or leave as is
          }
        }} 
      />

      {/* Main Content View Container */}
      <main className="flex-1 w-full">
        {activeTab === 'landing' && (
          <LandingPage
            onNavigate={setActiveTab}
            onSelectSampleProof={handleNavigateToVerifyWithId}
          />
        )}

        {activeTab === 'register' && (
          <RegisterPage
            onRegistrationSuccess={handleRegistrationSuccess}
            onCancel={() => setActiveTab('landing')}
          />
        )}

        {activeTab === 'certificate' && currentRegistration && (
          <EvidenceCertificate
            registrationData={currentRegistration}
            onVerifyNow={handleNavigateToVerifyWithId}
            onRegisterAnother={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'verify' && (
          <VerifyPage
            initialProofId={targetProofIdForVerification}
            onNavigateToRegister={() => setActiveTab('register')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigate={setActiveTab}
            onVerifyProof={handleNavigateToVerifyWithId}
            onViewCertificate={handleViewCertificate}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
};

export default App;
