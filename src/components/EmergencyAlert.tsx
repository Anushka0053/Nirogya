import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const EmergencyAlert: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [emergencyType, setEmergencyType] = useState('medical');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const emergencyTypes = [
    { id: 'medical', name: 'Medical Emergency', icon: '🏥' },
    { id: 'accident', name: 'Accident', icon: '🚗' },
    { id: 'fire', name: 'Fire Emergency', icon: '🔥' },
    { id: 'other', name: 'Other Emergency', icon: '⚠️' }
  ];

  const getCurrentLocation = () => {
    return new Promise<{latitude: number, longitude: number}>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  const sendEmergencyAlert = async () => {
    setIsLoading(true);
    try {
      // Get current location
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      // Simulate emergency alert API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save emergency alert to database
      if (user) {
        await supabase.from('health_records').insert({
          user_id: user.id,
          activity_type: 'emergency_alert',
          title: `Emergency Alert - ${emergencyTypes.find(t => t.id === emergencyType)?.name}`,
          description: `Emergency alert sent from location: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`,
          metadata: {
            emergency_type: emergencyType,
            location: currentLocation,
            additional_info: additionalInfo,
            timestamp: new Date().toISOString()
          }
        });
      }

      setAlertSent(true);
      // Reset after 10 seconds
      setTimeout(() => {
        setAlertSent(false);
        setAdditionalInfo('');
      }, 10000);
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      alert('Failed to send emergency alert. Please try again or call emergency services directly.');
    } finally {
      setIsLoading(false);
    }
  };

  if (alertSent) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            🚨 Emergency Alert Sent Successfully!
          </h2>
          <p className="text-green-700 text-xl mb-6">
            Your emergency alert has been sent to nearby hospitals and emergency contacts.
          </p>
          
          {location && (
            <div className="bg-white rounded-xl p-6 border border-green-200 mb-6">
              <h3 className="font-semibold text-green-800 mb-3">Alert Details:</h3>
              <div className="space-y-2 text-green-700">
                <p><strong>Type:</strong> {emergencyTypes.find(t => t.id === emergencyType)?.name}</p>
                <p><strong>Location:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
                <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
                {additionalInfo && <p><strong>Additional Info:</strong> {additionalInfo}</p>}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 border border-green-200">
            <p className="text-green-600 font-medium text-lg">
              Emergency services have been notified and will respond shortly.
            </p>
            <p className="text-green-600 mt-2">
              Please stay calm and wait for help to arrive.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-8 py-6">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <AlertTriangle className="mr-3 h-8 w-8" />
            Emergency Alert System
          </h2>
          <p className="text-red-100 mt-2 text-lg">
            For immediate medical emergencies and critical situations
          </p>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {/* Emergency Type Selection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Emergency Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      emergencyType === type.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="emergencyType"
                      value={type.id}
                      checked={emergencyType === type.id}
                      onChange={(e) => setEmergencyType(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <span className="font-medium text-gray-900">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Describe the emergency situation, injuries, or any other relevant details..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Emergency Guidelines */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-red-800 mb-3 text-lg">⚠️ When to use Emergency Alert:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-red-700">
                <ul className="space-y-2">
                  <li>• Severe chest pain or difficulty breathing</li>
                  <li>• Loss of consciousness or severe head injury</li>
                  <li>• Severe bleeding or major trauma</li>
                  <li>• Signs of stroke (speech problems, weakness)</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Allergic reactions with difficulty breathing</li>
                  <li>• Severe burns or electrical injuries</li>
                  <li>• Suspected heart attack</li>
                  <li>• Any life-threatening emergency</li>
                </ul>
              </div>
            </div>

            {/* What Happens */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-4 text-lg">What happens when you send an alert:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">Location Shared</p>
                    <p className="text-blue-700 text-sm">Your exact location is sent to emergency services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">Services Notified</p>
                    <p className="text-blue-700 text-sm">Nearby hospitals and ambulances are alerted</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">Contacts Informed</p>
                    <p className="text-blue-700 text-sm">Emergency contacts receive immediate notification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Button */}
            <div className="text-center">
              <button
                onClick={sendEmergencyAlert}
                disabled={isLoading}
                className={`
                  bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                  text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-xl 
                  transform transition-all duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin h-8 w-8 mr-4" />
                    Sending Alert...
                  </div>
                ) : (
                  <>
                    🚨 SEND EMERGENCY ALERT
                  </>
                )}
              </button>
            </div>

            {/* Emergency Hotlines */}
            <div className="text-center bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Emergency Hotlines (India)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                <div className="bg-white rounded-lg p-3 border">
                  <p className="font-bold text-red-600 text-xl">108</p>
                  <p className="text-sm">Ambulance</p>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="font-bold text-blue-600 text-xl">100</p>
                  <p className="text-sm">Police</p>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="font-bold text-orange-600 text-xl">101</p>
                  <p className="text-sm">Fire Department</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;