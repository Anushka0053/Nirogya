import React, { useState } from 'react';
import { Camera, Upload, Loader, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface AnalysisResult {
  condition: string;
  confidence: number;
  recommendation: string;
  severity: 'low' | 'moderate' | 'high';
}

const ImageUpload: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [imageType, setImageType] = useState<'xray' | 'wound'>('xray');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const imageTypes = [
    { id: 'xray', name: 'X-Ray', icon: '🦴', description: 'Chest X-rays, bone fractures, lung conditions' },
    { id: 'wound', name: 'Wound/Injury', icon: '🩹', description: 'Cuts, burns, skin injuries, infections' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setAnalysisResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError('');
    try {
      // Create FormData for Replicate API
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Simulate Replicate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Mock results based on image type
      const xrayResults: AnalysisResult[] = [
        {
          condition: 'Normal Chest X-Ray',
          confidence: 0.92,
          recommendation: 'No abnormalities detected. Lungs appear clear with normal heart size.',
          severity: 'low'
        },
        {
          condition: 'Possible Pneumonia',
          confidence: 0.78,
          recommendation: 'Consult pulmonologist immediately. Antibiotic treatment may be required.',
          severity: 'high'
        },
        {
          condition: 'Bone Fracture Detected',
          confidence: 0.85,
          recommendation: 'Immediate orthopedic consultation required. Immobilize the area.',
          severity: 'high'
        }
      ];

      const woundResults: AnalysisResult[] = [
        {
          condition: 'Minor Skin Abrasion',
          confidence: 0.87,
          recommendation: 'Clean wound with antiseptic. Apply topical antibiotic and bandage.',
          severity: 'low'
        },
        {
          condition: 'Infected Wound',
          confidence: 0.82,
          recommendation: 'Seek medical attention. May require antibiotic treatment.',
          severity: 'moderate'
        },
        {
          condition: 'Deep Laceration',
          confidence: 0.90,
          recommendation: 'Immediate medical attention required. May need stitches.',
          severity: 'high'
        }
      ];

      // Return result based on image type
      const results = imageType === 'xray' ? xrayResults : woundResults;
      const result = results[Math.floor(Math.random() * results.length)];

      setAnalysisResult(result);
    } catch (error) {
      setError('Failed to analyze image. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveAnalysis = async () => {
    if (!user || !analysisResult || !selectedFile) return;

    setSaving(true);
    try {
      // In a real app, you would upload the image to storage first
      const imageUrl = `placeholder_${Date.now()}.jpg`;

      // Save to medical_images table
      await supabase.from('medical_images').insert({
        user_id: user.id,
        image_url: imageUrl,
        image_type: imageType,
        analysis_result: analysisResult,
        confidence_score: analysisResult.confidence,
        recommended_action: analysisResult.recommendation
      });

      // Save to health_records table
      await supabase.from('health_records').insert({
        user_id: user.id,
        activity_type: 'image_analysis',
        title: `Medical Image Analysis - ${analysisResult.condition}`,
        description: `${imageTypes.find(t => t.id === imageType)?.name} analysis: ${analysisResult.condition}`,
        metadata: {
          image_type: imageType,
          condition: analysisResult.condition,
          confidence: analysisResult.confidence,
          severity: analysisResult.severity,
          notes: notes
        }
      });

      alert('Analysis saved successfully!');
      setNotes('');
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert('Failed to save analysis');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview('');
    setAnalysisResult(null);
    setError('');
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Camera className="mr-3 h-8 w-8" />
              AI Medical Image Analysis
            </h2>
            <p className="text-purple-100 mt-2 text-lg">
              Upload X-rays or wound photos for AI-powered medical analysis
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              {/* Image Type Selection */}
              {!selectedFile && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Select Image Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {imageTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          imageType === type.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="imageType"
                          value={type.id}
                          checked={imageType === type.id}
                          onChange={(e) => setImageType(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <span className="text-4xl mb-3 block">{type.icon}</span>
                          <h4 className="text-lg font-semibold text-white mb-2">{type.name}</h4>
                          <p className="text-gray-400 text-sm">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Section */}
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center hover:border-gray-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-16 w-16 text-gray-500 mx-auto mb-6" />
                    <p className="text-2xl font-semibold text-white mb-3">
                      Upload Medical Image
                    </p>
                    <p className="text-gray-400 mb-6">
                      Supported formats: JPG, PNG, GIF (Max 10MB)
                    </p>
                    <div className="mt-6">
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold text-lg">
                        Choose File
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="relative bg-gray-700 rounded-2xl p-6 border border-gray-600">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Image Preview</h3>
                      <button
                        onClick={resetForm}
                        className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={preview}
                        alt="Medical scan preview"
                        className="max-w-full max-h-96 rounded-xl shadow-md"
                      />
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <h4 className="font-semibold text-white mb-3">File Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-300">File Name:</span>
                        <p className="text-gray-400 mt-1">{selectedFile.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">File Size:</span>
                        <p className="text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Image Type:</span>
                        <p className="text-gray-400 mt-1">{imageTypes.find(t => t.id === imageType)?.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Analyze Button */}
                  {!analysisResult && (
                    <div className="text-center">
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 transition-all transform hover:scale-105 disabled:transform-none"
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center">
                            <Loader className="animate-spin h-6 w-6 mr-3" />
                            Analyzing with AI...
                          </div>
                        ) : (
                          '🔍 Analyze Image with AI'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-red-400 mt-0.5 mr-4 flex-shrink-0" />
                    <p className="text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Analysis Results */}
              {analysisResult && (
                <div className="space-y-6">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-emerald-400 mt-0.5 mr-4 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-bold text-emerald-300 text-xl mb-4">Analysis Complete</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <span className="font-semibold text-emerald-300">Condition:</span>
                              <p className="text-emerald-200 text-lg font-medium">{analysisResult.condition}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-emerald-300">Confidence Level:</span>
                              <div className="flex items-center mt-1">
                                <div className="flex-1 bg-gray-600 rounded-full h-3 mr-3">
                                  <div 
                                    className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${analysisResult.confidence * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-emerald-200 font-medium">
                                  {(analysisResult.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="font-semibold text-emerald-300">Severity:</span>
                              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                                analysisResult.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                                analysisResult.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="font-semibold text-emerald-300">Recommendation:</span>
                            <p className="text-emerald-200 mt-1 leading-relaxed">{analysisResult.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional observations or symptoms..."
                      className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={saveAnalysis}
                      disabled={saving}
                      className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-500 transition-colors flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Analysis
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Upload Another Image
                    </button>
                  </div>

                  {/* Doctor Recommendations */}
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-300 mb-4 text-lg">Recommended Specialists</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-700 rounded-lg p-4 border border-blue-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-blue-200">Dr. Rajesh Kumar</p>
                            <p className="text-blue-300 text-sm">{imageType === 'xray' ? 'Radiologist' : 'Dermatologist'}</p>
                            <p className="text-blue-400 text-xs">⭐ 4.8 rating</p>
                          </div>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium bg-blue-500/20 px-3 py-1 rounded-lg">
                            Book Appointment
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4 border border-blue-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-blue-200">Dr. Priya Sharma</p>
                            <p className="text-blue-300 text-sm">General Physician</p>
                            <p className="text-blue-400 text-xs">⭐ 4.6 rating</p>
                          </div>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium bg-blue-500/20 px-3 py-1 rounded-lg">
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-amber-400 mt-0.5 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-amber-300 font-semibold text-lg">⚠️ Medical Disclaimer</p>
                    <p className="text-amber-200 mt-2 leading-relaxed">
                      This AI analysis is for informational purposes only and should not replace professional medical diagnosis. 
                      Always consult with qualified healthcare professionals for accurate medical assessment and treatment decisions. 
                      In case of emergency, seek immediate medical attention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;