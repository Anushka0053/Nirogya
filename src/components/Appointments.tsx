import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, User, MapPin, Phone, Edit3, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string;
  specialization: string;
  hospital_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  doctor_phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    doctor_name: '',
    specialization: '',
    hospital_name: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    doctor_phone: '',
    address: '',
    notes: ''
  });

  const specializations = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
    'Psychiatrist',
    'Ophthalmologist',
    'ENT Specialist',
    'Gastroenterologist'
  ];

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const appointmentData = {
        user_id: user.id,
        doctor_name: formData.doctor_name,
        specialization: formData.specialization,
        hospital_name: formData.hospital_name,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        reason: formData.reason,
        doctor_phone: formData.doctor_phone,
        address: formData.address,
        notes: formData.notes,
        status: 'scheduled' as const
      };

      if (editingId) {
        const { error } = await supabase
          .from('appointments')
          .update(appointmentData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('appointments')
          .insert(appointmentData);
        if (error) throw error;
      }

      // Save to health records
      await supabase.from('health_records').insert({
        user_id: user.id,
        activity_type: 'doctor_visit',
        title: `Appointment - Dr. ${formData.doctor_name}`,
        description: `${editingId ? 'Updated' : 'Scheduled'} appointment with Dr. ${formData.doctor_name} (${formData.specialization})`,
        metadata: appointmentData
      });

      resetForm();
      fetchAppointments();
      alert(`Appointment ${editingId ? 'updated' : 'scheduled'} successfully!`);
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Failed to save appointment');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      doctor_name: '',
      specialization: '',
      hospital_name: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      doctor_phone: '',
      address: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const editAppointment = (appointment: Appointment) => {
    setFormData({
      doctor_name: appointment.doctor_name,
      specialization: appointment.specialization,
      hospital_name: appointment.hospital_name,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      reason: appointment.reason,
      doctor_phone: appointment.doctor_phone || '',
      address: appointment.address || '',
      notes: appointment.notes || ''
    });
    setEditingId(appointment.id);
    setShowAddForm(true);
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAppointments();
      alert('Appointment deleted successfully!');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const updateStatus = async (id: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="bg-gray-700 h-64 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Doctor Appointments</h2>
                  <p className="text-violet-100 mt-1 text-lg">Manage your healthcare schedule</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors flex items-center font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Book Appointment
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-gray-700 rounded-xl p-6 mb-8 border border-gray-600">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {editingId ? 'Edit Appointment' : 'Book New Appointment'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Doctor Name
                      </label>
                      <input
                        type="text"
                        value={formData.doctor_name}
                        onChange={(e) => setFormData({...formData, doctor_name: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Dr. John Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Specialization
                      </label>
                      <select
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select specialization</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hospital/Clinic Name
                      </label>
                      <input
                        type="text"
                        value={formData.hospital_name}
                        onChange={(e) => setFormData({...formData, hospital_name: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="City Hospital"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.doctor_phone}
                        onChange={(e) => setFormData({...formData, doctor_phone: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        value={formData.appointment_date}
                        onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Appointment Time
                      </label>
                      <input
                        type="time"
                        value={formData.appointment_time}
                        onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="Hospital address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Describe your symptoms or reason for the appointment..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      rows={2}
                      placeholder="Any additional information..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-500 rounded-xl text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:bg-gray-500 transition-colors flex items-center"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Saving...' : (editingId ? 'Update' : 'Book')} Appointment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Appointments List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Your Appointments</h3>
              
              {appointments.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-violet-500/20 p-3 rounded-xl">
                            <User className="h-6 w-6 text-violet-400" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-white">Dr. {appointment.doctor_name}</h4>
                            <p className="text-violet-400 font-medium">{appointment.specialization}</p>
                            <p className="text-gray-400">{appointment.hospital_name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Calendar className="h-4 w-4 text-violet-400" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Clock className="h-4 w-4 text-violet-400" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                        
                        {appointment.doctor_phone && (
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Phone className="h-4 w-4 text-violet-400" />
                            <span>{appointment.doctor_phone}</span>
                          </div>
                        )}
                        
                        {appointment.address && (
                          <div className="flex items-center space-x-2 text-gray-300 md:col-span-2 lg:col-span-3">
                            <MapPin className="h-4 w-4 text-violet-400" />
                            <span>{appointment.address}</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Reason for visit:</p>
                        <p className="text-white">{appointment.reason}</p>
                      </div>

                      {appointment.notes && (
                        <div className="mb-4">
                          <p className="text-gray-400 text-sm mb-1">Notes:</p>
                          <p className="text-gray-300 text-sm">{appointment.notes}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => updateStatus(appointment.id, 'completed')}
                              className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm"
                            >
                              Mark Completed
                            </button>
                            <button
                              onClick={() => updateStatus(appointment.id, 'cancelled')}
                              className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => editAppointment(appointment)}
                          className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors text-sm flex items-center"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors text-sm flex items-center"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No appointments scheduled</h3>
                  <p className="text-gray-400 mb-6">Book your first appointment to get started with your healthcare journey</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 transition-colors flex items-center mx-auto"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Book First Appointment
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

export default Appointments;