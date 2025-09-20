import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Nirogya</h3>
                <p className="text-gray-400 text-sm">Your Personal Health Assistant</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Nirogya is an AI-powered health assistant that helps you monitor your health, 
              check symptoms, find doctors, and manage your medical records - all in one place.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Symptom Checker</li>
              <li>Pulse Monitor</li>
              <li>Medical Imaging</li>
              <li>Doctor Finder</li>
              <li>Medicine Reminders</li>
              <li>Appointment Booking</li>
              <li>Health Reports</li>
              <li>Emergency Alerts</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <a 
                href="mailto:support@nirogya.health" 
                className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>support@nirogya.health</span>
              </a>
              <a 
                href="https://github.com/nirogya-health" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://twitter.com/nirogya_health" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Nirogya Health Assistant. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a>
            </div>
          </div>
        </div>

        {/* Built with Bolt */}
{/*         <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
            <span className="text-gray-400 text-sm">Built with</span>
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors text-sm"
            >
              ⚡ Bolt
            </a>
          </div>
        </div> */}

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-amber-300 text-xs leading-relaxed">
            <strong>Medical Disclaimer:</strong> Nirogya is designed for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding medical conditions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
