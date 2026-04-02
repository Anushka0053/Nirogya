import React, { useState } from 'react';
import { CheckCircle, Pill, AlertCircle, Save, Loader } from 'lucide-react';
import { symptoms, symptomToMedicine, Medicine } from '../utils/healthData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const SymptomChecker: React.FC = () => {
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Medicine[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    const allRecommendations: Medicine[] = [];
    selectedSymptoms.forEach(symptomId => {
      const medicines = symptomToMedicine[symptomId] || [];
      medicines.forEach(medicine => {
        if (!allRecommendations.find(m => m.name === medicine.name)) {
          allRecommendations.push(medicine);
        }
      });
    });

    setRecommendations(allRecommendations);
    setShowResults(true);

    // Save to database
    if (user) {
      try {
        // Save to symptom_checks table
        await supabase.from('symptom_checks').insert({
          user_id: user.id,
          symptoms: selectedSymptoms,
          recommended_medicines: allRecommendations,
          severity_level: selectedSymptoms.length > 3 ? 'moderate' : 'mild',
          notes: notes
        });

        // Save to health_records table
        await supabase.from('health_records').insert({
          user_id: user.id,
          activity_type: 'symptom_check',
          title: `Symptom Check - ${selectedSymptoms.length} symptoms`,
          description: `Checked symptoms: ${selectedSymptoms.join(', ')}`,
          metadata: {
            symptoms: selectedSymptoms,
            medicines: allRecommendations,
            notes: notes
          }
        });
      } catch (error) {
        console.error('Error saving symptom check:', error);
      }
    }
  };

  const saveResults = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update the existing record with notes
      const { error } = await supabase
        .from('symptom_checks')
        .update({ notes })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      alert('Results saved successfully!');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setRecommendations([]);
    setShowResults(false);
    setNotes('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Pill className="mr-3 h-8 w-8" />
            AI Symptom Checker
          </h2>
          <p className="text-blue-100 mt-2 text-lg">
            Select your symptoms to get personalized medicine recommendations
          </p>
        </div>

        <div className="p-8">
          {!showResults ? (
            <div className="space-y-8">
              {/* Symptom Selection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Select Your Symptoms ({selectedSymptoms.length} selected)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {symptoms.map((symptom) => (
                    <label
                      key={symptom.id}
                      className={`group flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedSymptoms.includes(symptom.id)
                          ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom.id)}
                        onChange={() => handleSymptomToggle(symptom.id)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                        selectedSymptoms.includes(symptom.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}>
                        {selectedSymptoms.includes(symptom.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{symptom.name}</span>
                        <span className="text-sm text-gray-500 block capitalize">
                          {symptom.category}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe any additional symptoms or concerns..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Check Button */}
              <div className="text-center">
                <button
                  onClick={checkSymptoms}
                  disabled={selectedSymptoms.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Analyze Symptoms ({selectedSymptoms.length})
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Medicine Recommendations
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={saveResults}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {saving ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Results'}</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    New Check
                  </button>
                </div>
              </div>

              {/* Selected Symptoms Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Selected Symptoms:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map(symptomId => {
                    const symptom = symptoms.find(s => s.id === symptomId);
                    return (
                      <span key={symptomId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {symptom?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Medicine Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((medicine, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 text-xl mb-4">{medicine.name}</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 w-20 flex-shrink-0">Dosage:</span>
                        <span className="text-gray-600">{medicine.dosage}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 w-20 flex-shrink-0">Usage:</span>
                        <span className="text-gray-600">{medicine.usage}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 w-20 flex-shrink-0">Caution:</span>
                        <span className="text-gray-600">{medicine.precautions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 font-semibold text-lg">Important Medical Disclaimer</p>
                    <p className="text-amber-700 mt-2 leading-relaxed">
                      These recommendations are for informational purposes only and should not replace professional medical advice. 
                      Always consult with qualified healthcare professionals before taking any medication or making health decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;