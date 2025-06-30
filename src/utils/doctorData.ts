export interface DoctorProfile {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  rating: number;
  reviewCount: number;
  hospital: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  consultationFee: {
    inPerson: number;
    call: number;
    video: number;
  };
  availability: {
    days: string[];
    timeSlots: string[];
  };
  languages: string[];
  services: string[];
  about: string;
  education: string[];
  awards: string[];
  isAvailable: boolean;
  nextAvailableSlot: string;
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const realDoctors: DoctorProfile[] = [
  {
    id: 'dr-rajesh-kumar-001',
    name: 'Dr. Rajesh Kumar',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: 15,
    rating: 4.8,
    reviewCount: 342,
    hospital: 'Apollo Hospital',
    address: '123 Health Street, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '+91 9876543210',
    email: 'dr.rajesh@apollo.com',
    consultationFee: {
      inPerson: 800,
      call: 500,
      video: 600
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    },
    languages: ['English', 'Hindi', 'Marathi'],
    services: ['General Consultation', 'Health Checkup', 'Diabetes Management', 'Hypertension Care'],
    about: 'Dr. Rajesh Kumar is a highly experienced General Physician with over 15 years of practice. He specializes in preventive medicine and chronic disease management.',
    education: ['MBBS - King Edward Memorial Hospital, Mumbai', 'MD Internal Medicine - AIIMS, Delhi'],
    awards: ['Best Doctor Award 2023', 'Excellence in Patient Care 2022'],
    isAvailable: true,
    nextAvailableSlot: 'Today 2:00 PM',
    image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    coordinates: {
      latitude: 19.0596,
      longitude: 72.8295
    }
  },
  {
    id: 'dr-priya-sharma-002',
    name: 'Dr. Priya Sharma',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology), DM (Cardiology)',
    experience: 12,
    rating: 4.9,
    reviewCount: 256,
    hospital: 'Fortis Hospital',
    address: '456 Cardiac Care Center, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    phone: '+91 9876543211',
    email: 'dr.priya@fortis.com',
    consultationFee: {
      inPerson: 1200,
      call: 800,
      video: 1000
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
      timeSlots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
    },
    languages: ['English', 'Hindi', 'Gujarati'],
    services: ['Heart Disease Treatment', 'ECG', 'Echocardiography', 'Cardiac Rehabilitation'],
    about: 'Dr. Priya Sharma is a renowned cardiologist specializing in interventional cardiology and heart disease prevention.',
    education: ['MBBS - Grant Medical College, Mumbai', 'MD Cardiology - AIIMS, Delhi', 'DM Cardiology - PGIMER, Chandigarh'],
    awards: ['Cardiology Excellence Award 2023', 'Young Cardiologist Award 2021'],
    isAvailable: true,
    nextAvailableSlot: 'Tomorrow 10:00 AM',
    image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    coordinates: {
      latitude: 19.1136,
      longitude: 72.8697
    }
  },
  {
    id: 'dr-amit-patel-003',
    name: 'Dr. Amit Patel',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 10,
    rating: 4.7,
    reviewCount: 189,
    hospital: 'Lilavati Hospital',
    address: '789 Skin Care Clinic, Juhu',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400049',
    phone: '+91 9876543212',
    email: 'dr.amit@lilavati.com',
    consultationFee: {
      inPerson: 1000,
      call: 600,
      video: 750
    },
    availability: {
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    },
    languages: ['English', 'Hindi', 'Gujarati'],
    services: ['Acne Treatment', 'Skin Cancer Screening', 'Cosmetic Dermatology', 'Hair Loss Treatment'],
    about: 'Dr. Amit Patel is a skilled dermatologist with expertise in both medical and cosmetic dermatology.',
    education: ['MBBS - B.J. Medical College, Ahmedabad', 'MD Dermatology - AIIMS, Delhi'],
    awards: ['Best Dermatologist Award 2022', 'Skin Care Excellence 2023'],
    isAvailable: false,
    nextAvailableSlot: 'Tomorrow 2:00 PM',
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    coordinates: {
      latitude: 19.1075,
      longitude: 72.8263
    }
  },
  {
    id: 'dr-sneha-gupta-004',
    name: 'Dr. Sneha Gupta',
    specialization: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 8,
    rating: 4.9,
    reviewCount: 298,
    hospital: 'Kokilaben Hospital',
    address: '321 Children Care Center, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    phone: '+91 9876543213',
    email: 'dr.sneha@kokilaben.com',
    consultationFee: {
      inPerson: 900,
      call: 550,
      video: 700
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
    },
    languages: ['English', 'Hindi', 'Bengali'],
    services: ['Child Health Checkup', 'Vaccination', 'Growth Monitoring', 'Newborn Care'],
    about: 'Dr. Sneha Gupta is a compassionate pediatrician dedicated to providing comprehensive healthcare for children.',
    education: ['MBBS - Medical College, Kolkata', 'MD Pediatrics - AIIMS, Delhi'],
    awards: ['Best Pediatrician Award 2023', 'Child Care Excellence 2022'],
    isAvailable: true,
    nextAvailableSlot: 'Today 4:00 PM',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    coordinates: {
      latitude: 19.1368,
      longitude: 72.8261
    }
  },
  {
    id: 'dr-vikram-singh-005',
    name: 'Dr. Vikram Singh',
    specialization: 'Orthopedic',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 18,
    rating: 4.8,
    reviewCount: 412,
    hospital: 'Hinduja Hospital',
    address: '654 Bone & Joint Center, Mahim',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400016',
    phone: '+91 9876543214',
    email: 'dr.vikram@hinduja.com',
    consultationFee: {
      inPerson: 1500,
      call: 900,
      video: 1200
    },
    availability: {
      days: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00']
    },
    languages: ['English', 'Hindi', 'Punjabi'],
    services: ['Joint Replacement', 'Sports Injury', 'Fracture Treatment', 'Arthritis Care'],
    about: 'Dr. Vikram Singh is a senior orthopedic surgeon with extensive experience in joint replacement and sports medicine.',
    education: ['MBBS - AIIMS, Delhi', 'MS Orthopedics - PGIMER, Chandigarh'],
    awards: ['Orthopedic Excellence Award 2023', 'Best Surgeon Award 2022'],
    isAvailable: true,
    nextAvailableSlot: 'Tomorrow 11:00 AM',
    image: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    coordinates: {
      latitude: 19.0330,
      longitude: 72.8397
    }
  },
  {
    id: 'dr-kavya-nair-006',
    name: 'Dr. Kavya Nair',
    specialization: 'Neurologist',
    qualification: 'MBBS, MD (Neurology), DM (Neurology)',
    experience: 14,
    rating: 4.9,
    reviewCount: 167,
    hospital: 'Breach Candy Hospital',
    address: '987 Neuro Care Center, Breach Candy',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400026',
    phone: '+91 9876543215',
    email: 'dr.kavya@breachcandy.com',
    consultationFee: {
      inPerson: 1800,
      call: 1200,
      video: 1500
    },
    availability: {
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00']
    },
    languages: ['English', 'Hindi', 'Malayalam'],
    services: ['Stroke Treatment', 'Epilepsy Care', 'Migraine Treatment', 'Neurological Disorders'],
    about: 'Dr. Kavya Nair is a distinguished neurologist specializing in stroke care and neurological disorders.',
    education: ['MBBS - Medical College, Trivandrum', 'MD Neurology - NIMHANS, Bangalore', 'DM Neurology - AIIMS, Delhi'],
    awards: ['Neurology Excellence Award 2023', 'Best Neurologist Award 2022'],
    isAvailable: false,
    nextAvailableSlot: 'Day after tomorrow 9:00 AM',
    image: 'https://images.pexels.com/photos/5327653/pexels-photo-5327653.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    coordinates: {
      latitude: 18.9667,
      longitude: 72.8081
    }
  },
  {
    id: 'dr-rohit-mehta-007',
    name: 'Dr. Rohit Mehta',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS (ENT)',
    experience: 11,
    rating: 4.6,
    reviewCount: 234,
    hospital: 'Jaslok Hospital',
    address: '147 ENT Care Center, Pedder Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400026',
    phone: '+91 9876543216',
    email: 'dr.rohit@jaslok.com',
    consultationFee: {
      inPerson: 1100,
      call: 700,
      video: 900
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    },
    languages: ['English', 'Hindi', 'Gujarati'],
    services: ['Hearing Loss Treatment', 'Sinus Surgery', 'Throat Disorders', 'Voice Problems'],
    about: 'Dr. Rohit Mehta is an experienced ENT specialist with expertise in advanced surgical procedures.',
    education: ['MBBS - Grant Medical College, Mumbai', 'MS ENT - KEM Hospital, Mumbai'],
    awards: ['ENT Excellence Award 2022', 'Surgical Innovation Award 2023'],
    isAvailable: true,
    nextAvailableSlot: 'Today 5:00 PM',
    image: 'https://images.pexels.com/photos/5327540/pexels-photo-5327540.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    coordinates: {
      latitude: 18.9667,
      longitude: 72.8081
    }
  },
  {
    id: 'dr-anita-desai-008',
    name: 'Dr. Anita Desai',
    specialization: 'Gynecologist',
    qualification: 'MBBS, MD (Obstetrics & Gynecology)',
    experience: 16,
    rating: 4.8,
    reviewCount: 387,
    hospital: 'Wockhardt Hospital',
    address: '258 Women Care Center, Bandra East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    phone: '+91 9876543217',
    email: 'dr.anita@wockhardt.com',
    consultationFee: {
      inPerson: 1300,
      call: 800,
      video: 1000
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
      timeSlots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
    },
    languages: ['English', 'Hindi', 'Marathi'],
    services: ['Pregnancy Care', 'Gynecological Surgery', 'Fertility Treatment', 'Menopause Management'],
    about: 'Dr. Anita Desai is a senior gynecologist with extensive experience in women\'s healthcare and fertility treatments.',
    education: ['MBBS - Seth G.S. Medical College, Mumbai', 'MD Obstetrics & Gynecology - KEM Hospital, Mumbai'],
    awards: ['Women\'s Health Excellence Award 2023', 'Best Gynecologist Award 2022'],
    isAvailable: true,
    nextAvailableSlot: 'Tomorrow 3:00 PM',
    image: 'https://images.pexels.com/photos/5327532/pexels-photo-5327532.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    coordinates: {
      latitude: 19.0544,
      longitude: 72.8406
    }
  }
];

export const getFilteredDoctors = (specialization?: string, location?: { latitude: number; longitude: number }) => {
  let filtered = realDoctors;
  
  if (specialization) {
    filtered = filtered.filter(doctor => 
      doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
  }
  
  if (location) {
    // Sort by distance (simple calculation for demo)
    filtered = filtered.sort((a, b) => {
      const distanceA = Math.sqrt(
        Math.pow(a.coordinates.latitude - location.latitude, 2) + 
        Math.pow(a.coordinates.longitude - location.longitude, 2)
      );
      const distanceB = Math.sqrt(
        Math.pow(b.coordinates.latitude - location.latitude, 2) + 
        Math.pow(b.coordinates.longitude - location.longitude, 2)
      );
      return distanceA - distanceB;
    });
  }
  
  return filtered;
};

export const getDoctorById = (id: string): DoctorProfile | undefined => {
  return realDoctors.find(doctor => doctor.id === id);
};

export const getAvailableDoctors = () => {
  return realDoctors.filter(doctor => doctor.isAvailable);
};

export const getDoctorsBySpecialization = (specialization: string) => {
  return realDoctors.filter(doctor => 
    doctor.specialization.toLowerCase() === specialization.toLowerCase()
  );
};