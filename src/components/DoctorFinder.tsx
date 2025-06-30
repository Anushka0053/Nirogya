import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Phone, Navigation, Calendar, User, Loader, CheckCircle, Video, MessageCircle, UserCheck, AlertTriangle, RefreshCw, Award, GraduationCap, Languages, DollarSign, MapPinIcon, Mail, Stethoscope } from 'lucide-react';
import { APIService, LocationCoords } from '../utils/apiService';
import { doctorSpecializations } from '../utils/healthData';
import { realDoctors, getFilteredDoctors, DoctorProfile } from '../utils/doctorData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const DoctorFinder: React.FC = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<'in-person' | 'call' | 'video'>('in-person');
  const [bookingData, setBookingData] = useState({
    appointment_date: '',
    appointment_time: '',
    reason: '',
    notes: ''
  });

  const appointmentTypes = [
    {
      id: 'in-person' as const,
      name: 'In-Person Visit',
      icon: UserCheck,
      description: 'Visit the doctor at their clinic for physical examination',
      color: 'from-blue-600 to-indigo-600',
      features: ['Physical examination', 'Lab tests available', 'Full consultation']
    },
    {
      id: 'call' as const,
      name: 'Phone Call',
      icon: Phone,
      description: 'Voice consultation over phone call',
      color: 'from-green-600 to-emerald-600',
      features: ['Voice consultation', 'Quick follow-ups', 'Prescription renewal']
    },
    {
      id: 'video' as const,
      name: 'Video Chat',
      icon: Video,
      description: 'Video consultation with screen sharing',
      color: 'from-purple-600 to-violet-600',
      features: ['Video consultation', 'Screen sharing', 'Digital prescriptions']
    }
  ];

  // Load default doctors on component mount
  useEffect(() => {
    setDoctors(realDoctors);
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError('');
    setError('');
    
    try {
      const coords = await APIService.getCurrentLocation();
      setLocation(coords);
      setLocationError('');
      
      // Filter doctors by location when location is obtained
      if (selectedSpecialization) {
        const filtered = getFilteredDoctors(selectedSpecialization, coords);
        setDoctors(filtered);
      } else {
        const filtered = getFilteredDoctors(undefined, coords);
        setDoctors(filtered);
      }
      
    } catch (error: any) {
      console.error('Location error:', error);
      
      let errorMessage = '';
      let troubleshootingSteps: string[] = [];
      
      if (error.message === 'GEOLOCATION_NOT_SUPPORTED') {
        errorMessage = 'Your browser doesn\'t support location services.';
        troubleshootingSteps = [
          'Try using Chrome, Firefox, Safari, or Edge',
          'Update your browser to the latest version',
          'Enable JavaScript in your browser settings'
        ];
      } else if (error.message === 'INSECURE_CONTEXT') {
        errorMessage = 'Location services require a secure connection (HTTPS).';
        troubleshootingSteps = [
          'Access the site via HTTPS',
          'Contact your administrator for SSL setup',
          'Use localhost for development'
        ];
      } else if (error.message === 'PERMISSION_DENIED' || error.code === 1) {
        errorMessage = 'Location access was denied.';
        troubleshootingSteps = [
          'Click the location icon 🔒 in your address bar',
          'Select "Allow" for location access',
          'Refresh the page and try again',
          'Check browser settings → Privacy → Location Services',
          'Ensure location services are enabled on your device'
        ];
      } else if (error.code === 2) {
        errorMessage = 'Location information is unavailable.';
        troubleshootingSteps = [
          'Enable GPS on your device',
          'Check your internet connection',
          'Move to an area with better signal',
          'Try again in a few moments'
        ];
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out.';
        troubleshootingSteps = [
          'Check your internet connection',
          'Ensure GPS is enabled',
          'Try again with a stable connection',
          'Move closer to a window if indoors'
        ];
      } else {
        errorMessage = 'Unable to get your location.';
        troubleshootingSteps = [
          'Refresh the page and try again',
          'Check browser permissions',
          'Ensure location services are enabled',
          'Try a different browser'
        ];
      }
      
      setLocationError(errorMessage);
      setError(`${errorMessage}\n\nTroubleshooting steps:\n${troubleshootingSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`);
    } finally {
      setLocationLoading(false);
    }
  };

  const searchDoctors = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      let filtered = getFilteredDoctors(selectedSpecialization, location || undefined);
      setDoctors(filtered);
    } catch (error) {
      setError('Failed to find doctors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openGoogleMaps = (doctor: DoctorProfile) => {
    const query = encodeURIComponent(`${doctor.hospital} ${doctor.address} ${doctor.city}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const viewDoctorProfile = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor);
    setShowDoctorProfile(true);
  };

  const bookAppointment = (doctor: DoctorProfile) => {
    setBookingDoctor(doctor);
    setShowBookingForm(true);
    setBookingSuccess(false);
    setSelectedAppointmentType('in-person');
    setBookingData({
      appointment_date: '',
      appointment_time: '',
      reason: '',
      notes: ''
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bookingDoctor) return;

    try {
      const selectedType = appointmentTypes.find(t => t.id === selectedAppointmentType);
      
      const appointmentData = {
        user_id: user.id,
        doctor_name: bookingDoctor.name,
        specialization: bookingDoctor.specialization,
        hospital_name: bookingDoctor.hospital,
        appointment_date: bookingData.appointment_date,
        appointment_time: bookingData.appointment_time,
        reason: bookingData.reason,
        doctor_phone: bookingDoctor.phone,
        address: selectedAppointmentType === 'in-person' ? `${bookingDoctor.address}, ${bookingDoctor.city}` : `${selectedType?.name} Consultation`,
        status: 'scheduled' as const,
        notes: `${bookingData.notes ? bookingData.notes + ' | ' : ''}Appointment Type: ${selectedType?.name} | Fee: ₹${bookingDoctor.consultationFee[selectedAppointmentType]}`
      };

      const { error } = await supabase
        .from('appointments')
        .insert(appointmentData);

      if (error) throw error;

      // Save to health records
      await supabase.from('health_records').insert({
        user_id: user.id,
        activity_type: 'doctor_visit',
        title: `${selectedType?.name} Appointment - ${bookingDoctor.name}`,
        description: `Scheduled ${selectedAppointmentType} appointment with ${bookingDoctor.name} (${bookingDoctor.specialization})`,
        metadata: { ...appointmentData, appointment_type: selectedAppointmentType, doctor_profile: bookingDoctor }
      });

      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingForm(false);
        setBookingDoctor(null);
        setBookingData({ appointment_date: '', appointment_time: '', reason: '', notes: '' });
        setBookingSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  };

  const resetForm = () => {
    setSelectedSpecialization('');
    setError('');
    setLocationError('');
    setDoctors(realDoctors); // Reset to show all doctors
  };

  const getDistance = (doctor: DoctorProfile) => {
    if (!location) return null;
    const distance = Math.sqrt(
      Math.pow(doctor.coordinates.latitude - location.latitude, 2) + 
      Math.pow(doctor.coordinates.longitude - location.longitude, 2)
    ) * 111; // Rough conversion to km
    return distance.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 sm:px-8 py-4 sm:py-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
              <Stethoscope className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
              Find & Book Doctors
            </h2>
            <p className="text-teal-100 mt-1 sm:mt-2 text-base sm:text-lg">
              Connect with verified healthcare professionals instantly
            </p>
          </div>

          <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
            {/* Search Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Location Section */}
                <div className="bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-600">
                  <h3 className="font-semibold text-white mb-4 flex items-center text-lg">
                    <Navigation className="h-5 w-5 mr-2" />
                    Your Location
                  </h3>
                  {location ? (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-emerald-400 font-medium block">Location detected successfully</span>
                          <p className="text-xs sm:text-sm text-gray-400 break-all">
                            Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={() => {
                            const url = `https://www.google.com/maps/@${location.latitude},${location.longitude},15z`;
                            window.open(url, '_blank');
                          }}
                          className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View on Map
                        </button>
                        <button
                          onClick={getCurrentLocation}
                          disabled={locationLoading}
                          className="flex-1 sm:flex-none bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${locationLoading ? 'animate-spin' : ''}`} />
                          Refresh Location
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <button
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 transition-all font-semibold flex items-center mx-auto"
                      >
                        {locationLoading ? (
                          <>
                            <Loader className="h-5 w-5 mr-2 animate-spin" />
                            Getting Location...
                          </>
                        ) : (
                          <>
                            <Navigation className="h-5 w-5 mr-2" />
                            Get My Location
                          </>
                        )}
                      </button>
                      <p className="text-gray-400 text-sm">
                        Enable location for distance-based sorting
                      </p>
                    </div>
                  )}
                </div>

                {/* Specialization Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Filter by Specialization (Optional)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="flex-1 p-3 sm:p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base sm:text-lg"
                    >
                      <option value="">All Specializations</option>
                      {doctorSpecializations.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    <button
                      onClick={searchDoctors}
                      disabled={isLoading}
                      className="sm:flex-none bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 sm:py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 transition-all flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Filtering...
                        </>
                      ) : (
                        <>
                          <MapPin className="h-5 w-5 mr-2" />
                          Filter Doctors
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {doctors.length > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-sm">
                      Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} 
                      {selectedSpecialization && ` for ${selectedSpecialization}`}
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-xl p-4 sm:p-6">
                <h4 className="font-semibold text-teal-300 mb-4">Available Now</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-teal-200 text-sm">Total Doctors</span>
                    <span className="text-teal-100 font-bold text-lg">{realDoctors.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-200 text-sm">Available Today</span>
                    <span className="text-emerald-300 font-bold text-lg">{realDoctors.filter(d => d.isAvailable).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-200 text-sm">Specializations</span>
                    <span className="text-teal-100 font-bold text-lg">{new Set(realDoctors.map(d => d.specialization)).size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Error Display */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-red-300 font-medium mb-2">Location Access Issue</p>
                    <div className="text-red-200 text-sm whitespace-pre-line">{error}</div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        {locationLoading ? (
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Try Again
                      </button>
                      <button
                        onClick={() => {
                          setError('');
                          setLocationError('');
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Results */}
            <div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="bg-gray-700 border border-gray-600 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all hover:border-teal-500/50">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                      {/* Doctor Image and Basic Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-teal-500/30"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                            <div>
                              <h4 className="font-semibold text-white text-lg sm:text-xl break-words">{doctor.name}</h4>
                              <p className="text-teal-400 font-medium">{doctor.specialization}</p>
                              <p className="text-gray-400 text-sm">{doctor.qualification}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                doctor.isAvailable 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                <Clock className="h-3 w-3 mr-1" />
                                {doctor.isAvailable ? 'Available' : 'Busy'}
                              </div>
                              {location && (
                                <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                                  {getDistance(doctor)} km
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-center text-gray-300 text-sm">
                              <Star className="h-4 w-4 text-yellow-400 mr-1 flex-shrink-0" />
                              <span>{doctor.rating}/5 ({doctor.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center text-gray-300 text-sm">
                              <Award className="h-4 w-4 text-purple-400 mr-1 flex-shrink-0" />
                              <span>{doctor.experience} years exp.</span>
                            </div>
                            <div className="flex items-center text-gray-300 text-sm">
                              <MapPinIcon className="h-4 w-4 text-teal-400 mr-1 flex-shrink-0" />
                              <span className="truncate">{doctor.hospital}</span>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-400 text-sm mb-4">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="break-words">{doctor.address}, {doctor.city}</span>
                          </div>

                          {/* Consultation Fees */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-2 text-center">
                              <UserCheck className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                              <p className="text-xs text-blue-300">In-Person</p>
                              <p className="text-sm font-semibold text-blue-200">₹{doctor.consultationFee.inPerson}</p>
                            </div>
                            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 text-center">
                              <Phone className="h-4 w-4 text-green-400 mx-auto mb-1" />
                              <p className="text-xs text-green-300">Call</p>
                              <p className="text-sm font-semibold text-green-200">₹{doctor.consultationFee.call}</p>
                            </div>
                            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-2 text-center">
                              <Video className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                              <p className="text-xs text-purple-300">Video</p>
                              <p className="text-sm font-semibold text-purple-200">₹{doctor.consultationFee.video}</p>
                            </div>
                          </div>

                          {/* Next Available */}
                          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 mb-4">
                            <p className="text-emerald-300 text-sm font-medium">Next Available: {doctor.nextAvailableSlot}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 lg:w-48">
                        <button 
                          onClick={() => viewDoctorProfile(doctor)}
                          className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </button>
                        <button 
                          onClick={() => window.open(`tel:${doctor.phone}`, '_self')}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </button>
                        <button 
                          onClick={() => openGoogleMaps(doctor)}
                          className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Directions
                        </button>
                        <button 
                          onClick={() => bookAppointment(doctor)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium flex items-center justify-center"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {doctors.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Stethoscope className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No doctors found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search criteria or location</p>
                  <button
                    onClick={() => {
                      setSelectedSpecialization('');
                      setDoctors(realDoctors);
                    }}
                    className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    Show All Doctors
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Doctor Profile Modal */}
        {showDoctorProfile && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-4xl border border-gray-700 max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold text-white">Doctor Profile</h3>
                <button
                  onClick={() => setShowDoctorProfile(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="text-center">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="w-32 h-32 rounded-xl object-cover mx-auto mb-4 border-2 border-teal-500/30"
                    />
                    <h4 className="text-xl font-semibold text-white">{selectedDoctor.name}</h4>
                    <p className="text-teal-400 font-medium">{selectedDoctor.specialization}</p>
                    <p className="text-gray-400 text-sm">{selectedDoctor.qualification}</p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Experience</span>
                      <span className="text-white font-medium">{selectedDoctor.experience} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-white font-medium">{selectedDoctor.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Reviews</span>
                      <span className="text-white font-medium">{selectedDoctor.reviewCount}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="h-4 w-4 mr-2 text-teal-400" />
                      <span>{selectedDoctor.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Mail className="h-4 w-4 mr-2 text-teal-400" />
                      <span>{selectedDoctor.email}</span>
                    </div>
                    <div className="flex items-start text-gray-300 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-teal-400 mt-0.5" />
                      <span>{selectedDoctor.address}, {selectedDoctor.city}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* About */}
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">About</h5>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedDoctor.about}</p>
                  </div>

                  {/* Services */}
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3">Services</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedDoctor.services.map((service, index) => (
                        <div key={index} className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm">
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education
                    </h5>
                    <div className="space-y-2">
                      {selectedDoctor.education.map((edu, index) => (
                        <div key={index} className="text-gray-300 text-sm">• {edu}</div>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Languages className="h-5 w-5 mr-2" />
                      Languages
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.languages.map((lang, index) => (
                        <span key={index} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Awards */}
                  {selectedDoctor.awards.length > 0 && (
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Awards & Recognition
                      </h5>
                      <div className="space-y-2">
                        {selectedDoctor.awards.map((award, index) => (
                          <div key={index} className="text-gray-300 text-sm">🏆 {award}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consultation Fees */}
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Consultation Fees
                    </h5>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                        <UserCheck className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-blue-300 text-sm mb-1">In-Person</p>
                        <p className="text-blue-200 font-semibold text-lg">₹{selectedDoctor.consultationFee.inPerson}</p>
                      </div>
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                        <Phone className="h-6 w-6 text-green-400 mx-auto mb-2" />
                        <p className="text-green-300 text-sm mb-1">Phone Call</p>
                        <p className="text-green-200 font-semibold text-lg">₹{selectedDoctor.consultationFee.call}</p>
                      </div>
                      <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
                        <Video className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                        <p className="text-purple-300 text-sm mb-1">Video Call</p>
                        <p className="text-purple-200 font-semibold text-lg">₹{selectedDoctor.consultationFee.video}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowDoctorProfile(false);
                        bookAppointment(selectedDoctor);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold flex items-center justify-center"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Appointment
                    </button>
                    <button
                      onClick={() => window.open(`tel:${selectedDoctor.phone}`, '_self')}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Booking Modal - Fully Responsive */}
        {showBookingForm && bookingDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-4xl border border-gray-700 max-h-[95vh] overflow-y-auto">
              {bookingSuccess ? (
                <div className="text-center py-4 sm:py-8">
                  <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                    Appointment Booked Successfully! 🎉
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm sm:text-base">
                    Your {appointmentTypes.find(t => t.id === selectedAppointmentType)?.name.toLowerCase()} appointment with {bookingDoctor.name} has been scheduled.
                  </p>
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
                    <p className="text-emerald-300 text-sm">
                      You will receive a confirmation notification shortly. Check your appointments section for details.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                        Book Appointment with {bookingDoctor.name}
                      </h3>
                      <p className="text-gray-400">{bookingDoctor.specialization} • {bookingDoctor.hospital}</p>
                    </div>
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-6">
                    {/* Appointment Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3 sm:mb-4">
                        Choose Appointment Type
                      </label>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                        {appointmentTypes.map((type) => {
                          const Icon = type.icon;
                          const fee = bookingDoctor.consultationFee[type.id];
                          return (
                            <label
                              key={type.id}
                              className={`flex flex-col p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                                selectedAppointmentType === type.id
                                  ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                                  : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="appointmentType"
                                value={type.id}
                                checked={selectedAppointmentType === type.id}
                                onChange={(e) => setSelectedAppointmentType(e.target.value as any)}
                                className="sr-only"
                              />
                              <div className="text-center">
                                <div className={`bg-gradient-to-r ${type.color} p-3 sm:p-4 rounded-xl w-fit mx-auto mb-3 sm:mb-4`}>
                                  <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                </div>
                                <h4 className="text-white font-semibold mb-2 text-base sm:text-lg">{type.name}</h4>
                                <p className="text-gray-400 text-xs sm:text-sm mb-2">{type.description}</p>
                                <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                                  ₹{fee}
                                </div>
                                <div className="space-y-1">
                                  {type.features.map((feature, index) => (
                                    <div key={index} className="text-xs text-gray-500 flex items-center justify-center">
                                      <CheckCircle className="h-3 w-3 mr-1 text-emerald-400 flex-shrink-0" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Appointment Date
                        </label>
                        <input
                          type="date"
                          value={bookingData.appointment_date}
                          onChange={(e) => setBookingData({...bookingData, appointment_date: e.target.value})}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Preferred Time
                        </label>
                        <select
                          value={bookingData.appointment_time}
                          onChange={(e) => setBookingData({...bookingData, appointment_time: e.target.value})}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select time</option>
                          {bookingDoctor.availability.timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Reason for Visit
                      </label>
                      <textarea
                        value={bookingData.reason}
                        onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Describe your symptoms or reason for the appointment..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={2}
                        placeholder="Any additional information or special requests..."
                      />
                    </div>

                    {/* Appointment Summary */}
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 sm:p-6">
                      <h4 className="font-semibold text-purple-300 mb-3 text-base sm:text-lg">Appointment Summary</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-purple-200">
                        <div className="space-y-1">
                          <p><strong>Doctor:</strong> {bookingDoctor.name}</p>
                          <p><strong>Specialization:</strong> {bookingDoctor.specialization}</p>
                          <p><strong>Type:</strong> {appointmentTypes.find(t => t.id === selectedAppointmentType)?.name}</p>
                          <p><strong>Fee:</strong> ₹{bookingDoctor.consultationFee[selectedAppointmentType]}</p>
                        </div>
                        <div className="space-y-1">
                          {selectedAppointmentType === 'in-person' && (
                            <p><strong>Location:</strong> <span className="break-words">{bookingDoctor.hospital}</span></p>
                          )}
                          {selectedAppointmentType === 'call' && (
                            <p><strong>Phone:</strong> {bookingDoctor.phone}</p>
                          )}
                          {selectedAppointmentType === 'video' && (
                            <p><strong>Platform:</strong> Video consultation link will be provided</p>
                          )}
                          <p><strong>Hospital:</strong> {bookingDoctor.hospital}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBookingForm(false);
                          setBookingDoctor(null);
                        }}
                        className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold"
                      >
                        Confirm Booking (₹{bookingDoctor.consultationFee[selectedAppointmentType]})
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorFinder;