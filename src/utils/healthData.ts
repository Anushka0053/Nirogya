// Health data mappings and utility functions
export interface Symptom {
  id: string;
  name: string;
  category: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  usage: string;
  precautions: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  address: string;
  rating: number;
  isOpen: boolean;
  phone?: string;
}

export interface HealthRecord {
  id: string;
  type: 'symptom' | 'pulse' | 'image' | 'doctor';
  data: any;
  timestamp: Date;
}

export const symptoms: Symptom[] = [
  { id: 'fever', name: 'Fever', category: 'general' },
  { id: 'cough', name: 'Cough', category: 'respiratory' },
  { id: 'chest_pain', name: 'Chest Pain', category: 'cardiac' },
  { id: 'nausea', name: 'Nausea', category: 'digestive' },
  { id: 'headache', name: 'Headache', category: 'neurological' },
  { id: 'fatigue', name: 'Fatigue', category: 'general' },
  { id: 'stomach_pain', name: 'Stomach Pain', category: 'digestive' },
  { id: 'shortness_breath', name: 'Shortness of Breath', category: 'respiratory' },
  { id: 'dizziness', name: 'Dizziness', category: 'neurological' },
  { id: 'muscle_pain', name: 'Muscle Pain', category: 'musculoskeletal' }
];

export const symptomToMedicine: Record<string, Medicine[]> = {
  fever: [
    { name: 'Paracetamol', dosage: '500mg', usage: 'Every 6-8 hours', precautions: 'Do not exceed 4g per day' },
    { name: 'Ibuprofen', dosage: '200mg', usage: 'Every 6-8 hours', precautions: 'Take with food' }
  ],
  cough: [
    { name: 'Dextromethorphan', dosage: '15mg', usage: 'Every 4 hours', precautions: 'Avoid with MAO inhibitors' },
    { name: 'Honey', dosage: '1 tsp', usage: '2-3 times daily', precautions: 'Not for children under 1 year' }
  ],
  chest_pain: [
    { name: 'Aspirin', dosage: '81mg', usage: 'Once daily', precautions: 'Consult doctor for chest pain' },
    { name: 'Nitroglycerin', dosage: 'As prescribed', usage: 'Emergency use only', precautions: 'Prescription required' }
  ],
  nausea: [
    { name: 'Ondansetron', dosage: '4mg', usage: 'Every 8 hours', precautions: 'Prescription required' },
    { name: 'Ginger', dosage: '250mg', usage: '3 times daily', precautions: 'Natural remedy' }
  ],
  headache: [
    { name: 'Acetaminophen', dosage: '325mg', usage: 'Every 4-6 hours', precautions: 'Do not exceed daily limit' },
    { name: 'Aspirin', dosage: '325mg', usage: 'Every 4 hours', precautions: 'Not for children with fever' }
  ],
  fatigue: [
    { name: 'Vitamin B12', dosage: '1000mcg', usage: 'Once daily', precautions: 'Supplement as needed' },
    { name: 'Iron', dosage: '65mg', usage: 'Once daily', precautions: 'Take with Vitamin C' }
  ],
  stomach_pain: [
    { name: 'Antacid', dosage: '10ml', usage: 'After meals', precautions: 'Do not exceed 6 doses per day' },
    { name: 'Simethicone', dosage: '40mg', usage: 'After meals', precautions: 'For gas-related pain' }
  ],
  shortness_breath: [
    { name: 'Albuterol', dosage: 'As prescribed', usage: 'Emergency inhaler', precautions: 'Seek immediate medical attention' },
    { name: 'Oxygen', dosage: 'As needed', usage: 'Medical supervision', precautions: 'Emergency use only' }
  ],
  dizziness: [
    { name: 'Meclizine', dosage: '25mg', usage: 'Every 6 hours', precautions: 'May cause drowsiness' },
    { name: 'Dramamine', dosage: '50mg', usage: 'Every 4-6 hours', precautions: 'For motion sickness' }
  ],
  muscle_pain: [
    { name: 'Ibuprofen', dosage: '400mg', usage: 'Every 6-8 hours', precautions: 'Take with food' },
    { name: 'Topical Cream', dosage: 'Apply thin layer', usage: '3-4 times daily', precautions: 'For external use only' }
  ]
};

export const doctorSpecializations = [
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

// Mock health records for demonstration
export const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    type: 'symptom',
    data: { symptoms: ['fever', 'cough'], medicines: ['Paracetamol', 'Dextromethorphan'] },
    timestamp: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: '2',
    type: 'pulse',
    data: { rate: 78, status: 'normal' },
    timestamp: new Date(Date.now() - 43200000) // 12 hours ago
  },
  {
    id: '3',
    type: 'doctor',
    data: { name: 'Dr. Sarah Johnson', specialization: 'General Physician', address: '123 Health St' },
    timestamp: new Date(Date.now() - 172800000) // 2 days ago
  }
];

export const userProfile = {
  name: 'Anushka Mishra',
  age: 28,
  location: 'Mumbai, India',
  emergencyContact: '+91 9876543210',
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Pollen'],
  currentMedications: ['Vitamin D3']
};