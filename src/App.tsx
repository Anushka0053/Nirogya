import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import FeaturesPanel from './components/FeaturesPanel';
import SymptomChecker from './components/SymptomChecker';
import EmergencyAlert from './components/EmergencyAlert';
import DoctorFinder from './components/DoctorFinder';
import ImageUpload from './components/ImageUpload';
import PulseMonitor from './components/PulseMonitor';
import HealthReport from './components/HealthReport';
import UserProfile from './components/UserProfile';
import MedicineReminder from './components/MedicineReminder';
import Appointments from './components/Appointments';
import Footer from './components/Footer';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg font-medium">Loading Nirogya...</p>
          <p className="text-gray-500 text-sm mt-2">Your Health Assistant</p>
        </div>
      </div>
    );
  }

  // Show auth form if user is not logged in
  if (!user) {
    return <AuthForm />;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'features':
        return <FeaturesPanel onNavigate={setActiveTab} />;
      case 'symptoms':
        return <SymptomChecker />;
      case 'emergency':
        return <EmergencyAlert />;
      case 'doctors':
        return <DoctorFinder />;
      case 'imaging':
        return <ImageUpload />;
      case 'pulse':
        return <PulseMonitor />;
      case 'medicine-reminder':
        return <MedicineReminder />;
      case 'appointments':
        return <Appointments />;
      case 'reports':
        return <HealthReport />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        {renderActiveComponent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;