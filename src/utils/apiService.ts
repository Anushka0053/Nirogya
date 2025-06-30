// API service functions for external integrations
import { realDoctors, getFilteredDoctors, DoctorProfile } from './doctorData';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface PlacesAPIResponse {
  results: Array<{
    name: string;
    vicinity: string;
    rating?: number;
    opening_hours?: {
      open_now: boolean;
    };
    place_id: string;
  }>;
}

export class APIService {
  static async getCurrentLocation(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      // Enhanced geolocation with better error handling
      if (!navigator.geolocation) {
        reject(new Error('GEOLOCATION_NOT_SUPPORTED'));
        return;
      }

      // Check for secure context (HTTPS or localhost)
      const isSecure = window.isSecureContext || 
                      location.hostname === 'localhost' || 
                      location.hostname === '127.0.0.1' ||
                      location.protocol === 'https:';

      if (!isSecure) {
        reject(new Error('INSECURE_CONTEXT'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 20000, // 20 seconds
        maximumAge: 60000 // 1 minute cache
      };

      // First, check if permission is already granted
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
          if (permission.state === 'denied') {
            reject(new Error('PERMISSION_DENIED'));
            return;
          }
          
          // Proceed with location request
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              reject(error);
            },
            options
          );
        }).catch(() => {
          // Fallback if permissions API is not available
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              reject(error);
            },
            options
          );
        });
      } else {
        // Fallback for browsers without permissions API
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          },
          options
        );
      }
    });
  }

  static async findNearbyDoctors(location: LocationCoords, specialization: string): Promise<DoctorProfile[]> {
    try {
      // Use real doctor data with filtering
      return getFilteredDoctors(specialization, location);
    } catch (error) {
      console.error('Error finding doctors:', error);
      // Return all doctors as fallback
      return realDoctors;
    }
  }

  static async analyzeMedicalImage(file: File, imageType: 'xray' | 'wound'): Promise<any> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For now, return mock data as Replicate integration requires specific model setup
      return this.getMockImageAnalysis(imageType);
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  private static getMockImageAnalysis(imageType: 'xray' | 'wound'): any {
    if (imageType === 'xray') {
      const xrayResults = [
        {
          condition: 'Normal Chest X-Ray',
          confidence: 0.92,
          recommendation: 'No abnormalities detected. Lungs appear clear with normal heart size. Continue regular health checkups.',
          severity: 'low'
        },
        {
          condition: 'Possible Pneumonia',
          confidence: 0.78,
          recommendation: 'Consult pulmonologist immediately. Antibiotic treatment may be required. Monitor symptoms closely.',
          severity: 'high'
        },
        {
          condition: 'Bone Fracture Detected',
          confidence: 0.85,
          recommendation: 'Immediate orthopedic consultation required. Immobilize the area and avoid movement.',
          severity: 'high'
        },
        {
          condition: 'Mild Lung Inflammation',
          confidence: 0.73,
          recommendation: 'Monitor symptoms and consult doctor if condition worsens. Rest and hydration recommended.',
          severity: 'moderate'
        }
      ];
      return xrayResults[Math.floor(Math.random() * xrayResults.length)];
    } else {
      const woundResults = [
        {
          condition: 'Minor Skin Abrasion',
          confidence: 0.87,
          recommendation: 'Clean wound with antiseptic. Apply topical antibiotic and bandage. Monitor for signs of infection.',
          severity: 'low'
        },
        {
          condition: 'Infected Wound',
          confidence: 0.82,
          recommendation: 'Seek medical attention immediately. May require antibiotic treatment and professional wound care.',
          severity: 'high'
        },
        {
          condition: 'Deep Laceration',
          confidence: 0.90,
          recommendation: 'Immediate medical attention required. May need stitches. Apply pressure to control bleeding.',
          severity: 'high'
        },
        {
          condition: 'Superficial Cut',
          confidence: 0.88,
          recommendation: 'Clean thoroughly and apply antiseptic. Cover with sterile bandage. Should heal within a few days.',
          severity: 'low'
        },
        {
          condition: 'Burn Injury',
          confidence: 0.79,
          recommendation: 'Cool with running water. Apply burn gel and loose bandage. Seek medical care for severe burns.',
          severity: 'moderate'
        }
      ];
      return woundResults[Math.floor(Math.random() * woundResults.length)];
    }
  }

  static generatePulseReading(): number {
    // Simulate realistic pulse rate (60-100 BPM for adults)
    const baseRate = 72;
    const variation = Math.random() * 20 - 10; // ±10 BPM variation
    return Math.max(60, Math.min(100, Math.round(baseRate + variation)));
  }

  static async sendEmergencyAlert(location?: LocationCoords): Promise<boolean> {
    try {
      // Simulate emergency alert API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would send SMS/email to emergency contacts
      console.log('Emergency alert sent to:', '+91 108 Emergency Services');
      if (location) {
        console.log('Location shared:', location);
      }
      return true;
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      return false;
    }
  }
}