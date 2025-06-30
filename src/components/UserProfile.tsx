import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Droplets, AlertTriangle, Pill, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { supabase, UserProfile as UserProfileType } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newCondition, setNewCondition] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if it doesn't exist
        const newProfile = {
          id: user?.id,
          full_name: user?.user_metadata?.full_name || '',
          age: null,
          gender: null,
          blood_group: null,
          location: null,
          phone: null,
          emergency_contact_name: null,
          emergency_contact_phone: null,
          medical_conditions: [],
          allergies: [],
          current_medications: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim() && profile) {
      setProfile({
        ...profile,
        allergies: [...(profile.allergies || []), newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        allergies: profile.allergies?.filter((_, i) => i !== index) || []
      });
    }
  };

  const addMedication = () => {
    if (newMedication.trim() && profile) {
      setProfile({
        ...profile,
        current_medications: [...(profile.current_medications || []), newMedication.trim()]
      });
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        current_medications: profile.current_medications?.filter((_, i) => i !== index) || []
      });
    }
  };

  const addCondition = () => {
    if (newCondition.trim() && profile) {
      setProfile({
        ...profile,
        medical_conditions: [...(profile.medical_conditions || []), newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        medical_conditions: profile.medical_conditions?.filter((_, i) => i !== index) || []
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="bg-gray-700 h-64 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-gray-400">Unable to load profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">User Profile</h2>
                  <p className="text-teal-100 mt-1 text-lg">Manage your health information</p>
                </div>
              </div>
              <button
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors flex items-center font-semibold"
              >
                {isEditing ? (
                  <>
                    <X className="h-5 w-5 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="h-5 w-5 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-white mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white p-3 bg-gray-600 rounded-xl border border-gray-500">{profile.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profile.age || ''}
                        onChange={(e) => setProfile({...profile, age: e.target.value ? parseInt(e.target.value) : null})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-white p-3 bg-gray-600 rounded-xl border border-gray-500">{profile.age ? `${profile.age} years` : 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                    {isEditing ? (
                      <select
                        value={profile.gender || ''}
                        onChange={(e) => setProfile({...profile, gender: e.target.value as 'male' | 'female' | 'other' | null})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-white p-3 bg-gray-600 rounded-xl border border-gray-500 capitalize">{profile.gender || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Blood Group</label>
                    {isEditing ? (
                      <select
                        value={profile.blood_group || ''}
                        onChange={(e) => setProfile({...profile, blood_group: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <p className="text-white p-3 bg-gray-600 rounded-xl border border-gray-500 flex items-center">
                        <Droplets className="h-4 w-4 mr-2 text-red-400" />
                        {profile.blood_group || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location || ''}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="City, State"
                      />
                    ) : (
                      <p className="text-white p-3 bg-gray-600 rounded-xl border border-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {profile.location || 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                    ) : (
                      <p className="text-white p-3 bg-gray-600 rounded-xl border border-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {profile.phone || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-300 mb-6 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Emergency Contact
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-red-300 mb-2">Contact Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.emergency_contact_name || ''}
                        onChange={(e) => setProfile({...profile, emergency_contact_name: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-red-500/30 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Emergency contact name"
                      />
                    ) : (
                      <p className="text-red-200 p-3 bg-gray-600 rounded-xl border border-red-500/30">{profile.emergency_contact_name || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-300 mb-2">Contact Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.emergency_contact_phone || ''}
                        onChange={(e) => setProfile({...profile, emergency_contact_phone: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-red-500/30 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                    ) : (
                      <p className="text-red-200 p-3 bg-gray-600 rounded-xl border border-red-500/30">{profile.emergency_contact_phone || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-300 mb-6 flex items-center">
                  <Pill className="h-5 w-5 mr-2" />
                  Medical Information
                </h3>

                {/* Medical Conditions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-blue-300 mb-2">Medical Conditions</label>
                  <div className="space-y-2">
                    {profile.medical_conditions?.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-600 p-3 rounded-lg border border-blue-500/30">
                        <span className="text-blue-200">{condition}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeCondition(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          className="flex-1 p-3 bg-gray-600 border border-blue-500/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add medical condition"
                        />
                        <button
                          onClick={addCondition}
                          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Allergies */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-blue-300 mb-2">Allergies</label>
                  <div className="space-y-2">
                    {profile.allergies?.map((allergy, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-600 p-3 rounded-lg border border-blue-500/30">
                        <span className="text-blue-200">{allergy}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeAllergy(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          className="flex-1 p-3 bg-gray-600 border border-blue-500/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add allergy"
                        />
                        <button
                          onClick={addAllergy}
                          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Current Medications</label>
                  <div className="space-y-2">
                    {profile.current_medications?.map((medication, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-600 p-3 rounded-lg border border-blue-500/30">
                        <span className="text-blue-200">{medication}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeMedication(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMedication}
                          onChange={(e) => setNewMedication(e.target.value)}
                          className="flex-1 p-3 bg-gray-600 border border-blue-500/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add medication"
                        />
                        <button
                          onClick={addMedication}
                          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-500 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:bg-gray-500 transition-colors flex items-center"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;