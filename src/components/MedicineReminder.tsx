import React, { useState, useEffect } from 'react';
import { Pill, Plus, Trash2, Clock, Bell, Save, Edit3, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface MedicineReminder {
  id: string;
  user_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  time_slots: string[];
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

const MedicineReminder: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    frequency: 'daily',
    time_slots: [''],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('medicine_reminders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const reminderData = {
        user_id: user.id,
        medicine_name: formData.medicine_name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        time_slots: formData.time_slots.filter(time => time.trim() !== ''),
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        notes: formData.notes,
        is_active: true
      };

      if (editingId) {
        const { error } = await supabase
          .from('medicine_reminders')
          .update(reminderData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('medicine_reminders')
          .insert(reminderData);
        if (error) throw error;
      }

      // Save to health records
      await supabase.from('health_records').insert({
        user_id: user.id,
        activity_type: 'medicine_reminder',
        title: `Medicine Reminder - ${formData.medicine_name}`,
        description: `${editingId ? 'Updated' : 'Added'} reminder for ${formData.medicine_name} (${formData.dosage})`,
        metadata: reminderData
      });

      resetForm();
      fetchReminders();
      alert(`Medicine reminder ${editingId ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Failed to save reminder');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      medicine_name: '',
      dosage: '',
      frequency: 'daily',
      time_slots: [''],
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const editReminder = (reminder: MedicineReminder) => {
    setFormData({
      medicine_name: reminder.medicine_name,
      dosage: reminder.dosage,
      frequency: reminder.frequency,
      time_slots: reminder.time_slots,
      start_date: reminder.start_date,
      end_date: reminder.end_date || '',
      notes: reminder.notes || ''
    });
    setEditingId(reminder.id);
    setShowAddForm(true);
  };

  const deleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      const { error } = await supabase
        .from('medicine_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchReminders();
      alert('Reminder deleted successfully!');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Failed to delete reminder');
    }
  };

  const toggleReminder = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('medicine_reminders')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      fetchReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      time_slots: [...formData.time_slots, '']
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimeSlots = [...formData.time_slots];
    newTimeSlots[index] = value;
    setFormData({
      ...formData,
      time_slots: newTimeSlots
    });
  };

  const removeTimeSlot = (index: number) => {
    setFormData({
      ...formData,
      time_slots: formData.time_slots.filter((_, i) => i !== index)
    });
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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <Pill className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Medicine Reminders</h2>
                  <p className="text-orange-100 mt-1 text-lg">Never miss your medication</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors flex items-center font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Reminder
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-gray-700 rounded-xl p-6 mb-8 border border-gray-600">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {editingId ? 'Edit Medicine Reminder' : 'Add New Medicine Reminder'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={formData.medicine_name}
                        onChange={(e) => setFormData({...formData, medicine_name: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Paracetamol"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={formData.dosage}
                        onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Frequency
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="twice_daily">Twice Daily</option>
                        <option value="three_times">Three Times Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="as_needed">As Needed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reminder Times
                    </label>
                    <div className="space-y-3">
                      {formData.time_slots.map((time, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => updateTimeSlot(index, e.target.value)}
                            className="flex-1 p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                          />
                          {formData.time_slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(index)}
                              className="text-red-400 hover:text-red-300 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTimeSlot}
                        className="text-orange-400 hover:text-orange-300 text-sm flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Time Slot
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Additional instructions or notes..."
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
                      className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:bg-gray-500 transition-colors flex items-center"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Saving...' : (editingId ? 'Update' : 'Save')} Reminder
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reminders List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Your Medicine Reminders</h3>
              
              {reminders.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className={`bg-gray-700 rounded-xl p-6 border ${reminder.is_active ? 'border-orange-500/30' : 'border-gray-600'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`p-2 rounded-lg ${reminder.is_active ? 'bg-orange-500/20' : 'bg-gray-600'}`}>
                              <Pill className={`h-5 w-5 ${reminder.is_active ? 'text-orange-400' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white">{reminder.medicine_name}</h4>
                              <p className="text-gray-400 text-sm">{reminder.dosage} • {reminder.frequency.replace('_', ' ')}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Reminder Times:</p>
                              <div className="flex flex-wrap gap-2">
                                {reminder.time_slots.map((time, index) => (
                                  <span key={index} className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-lg text-sm flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {time}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Duration:</p>
                              <p className="text-white text-sm">
                                {new Date(reminder.start_date).toLocaleDateString()} 
                                {reminder.end_date && ` - ${new Date(reminder.end_date).toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>

                          {reminder.notes && (
                            <div className="mb-4">
                              <p className="text-gray-400 text-sm mb-1">Notes:</p>
                              <p className="text-gray-300 text-sm">{reminder.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => toggleReminder(reminder.id, reminder.is_active)}
                            className={`p-2 rounded-lg transition-colors ${
                              reminder.is_active 
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                                : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                            }`}
                            title={reminder.is_active ? 'Disable reminder' : 'Enable reminder'}
                          >
                            {reminder.is_active ? <Bell className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => editReminder(reminder)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="Edit reminder"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Delete reminder"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Pill className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No medicine reminders yet</h3>
                  <p className="text-gray-400 mb-6">Add your first medicine reminder to stay on track with your medication schedule</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center mx-auto"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add First Reminder
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

export default MedicineReminder;