import React from 'react';
import { 
  Activity, 
  Heart, 
  Camera, 
  MapPin, 
  AlertTriangle, 
  FileText,
  Pill,
  User
} from 'lucide-react';

interface FeaturesPanelProps {
  onNavigate: (tab: string) => void;
}

const FeaturesPanel: React.FC<FeaturesPanelProps> = ({ onNavigate }) => {
  const features = [
    { 
      id: 'symptoms', 
      name: 'Symptom Checker', 
      icon: Activity, 
      color: 'emerald', 
      description: 'Check symptoms and get medicine recommendations',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 'pulse', 
      name: 'Pulse Monitor', 
      icon: Heart, 
      color: 'red', 
      description: 'Monitor your heart rate in real-time',
      gradient: 'from-red-500 to-pink-500'
    },
    { 
      id: 'imaging', 
      name: 'Medical Imaging', 
      icon: Camera, 
      color: 'purple', 
      description: 'Upload and analyze X-rays and wound images',
      gradient: 'from-purple-500 to-indigo-500'
    },
    { 
      id: 'doctors', 
      name: 'Find & Book Doctors', 
      icon: MapPin, 
      color: 'blue', 
      description: 'Locate and book appointments with healthcare professionals',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'medicine-reminder', 
      name: 'Medicine Reminder', 
      icon: Pill, 
      color: 'orange', 
      description: 'Set and manage medicine reminders',
      gradient: 'from-orange-500 to-amber-500'
    },
    { 
      id: 'emergency', 
      name: 'Emergency Alert', 
      icon: AlertTriangle, 
      color: 'red', 
      description: 'Send emergency alerts to contacts',
      gradient: 'from-red-600 to-red-700'
    },
    { 
      id: 'reports', 
      name: 'Health Reports', 
      icon: FileText, 
      color: 'indigo', 
      description: 'View comprehensive health analytics',
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'profile', 
      name: 'Profile Settings', 
      icon: User, 
      color: 'gray', 
      description: 'Manage your health profile and settings',
      gradient: 'from-gray-600 to-gray-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Health Features</h1>
          <p className="text-gray-400 text-lg">
            Comprehensive health management tools at your fingertips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => onNavigate(feature.id)}
                className="group bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105"
              >
                <div className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-xl w-fit mb-4 group-hover:shadow-lg transition-shadow`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-emerald-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open Feature</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature Categories */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-300 mb-3">🩺 Health Monitoring</h3>
            <p className="text-emerald-200 text-sm">
              Track symptoms, monitor pulse, and analyze medical images with AI-powered insights.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-300 mb-3">👨‍⚕️ Healthcare Services</h3>
            <p className="text-blue-200 text-sm">
              Find nearby doctors and book appointments with multiple consultation options.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-300 mb-3">📊 Health Management</h3>
            <p className="text-purple-200 text-sm">
              Set medicine reminders, view health reports, and manage your complete health profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPanel;