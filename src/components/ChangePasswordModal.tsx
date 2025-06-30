import React, { useState } from 'react';
import { X, Eye, EyeOff, Key, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/\d/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      const validationErrors = validatePassword(passwordData.newPassword);
      if (validationErrors.length > 0) {
        throw new Error(`Password must contain: ${validationErrors.join(', ')}`);
      }

      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setSuccess(true);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const passwordErrors = validatePassword(passwordData.newPassword);
  const isPasswordValid = passwordErrors.length === 0 && passwordData.newPassword.length > 0;
  const doPasswordsMatch = passwordData.newPassword === passwordData.confirmPassword && passwordData.confirmPassword.length > 0;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700 text-center">
          <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">Password Changed!</h3>
          <p className="text-gray-300 mb-4">Your password has been updated successfully.</p>
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-emerald-300 text-sm">
              You can now use your new password to sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <Key className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Change Password</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Requirements */}
            {passwordData.newPassword && (
              <div className="mt-2 space-y-1">
                {passwordErrors.map((error, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-red-400">{error}</span>
                  </div>
                ))}
                {isPasswordValid && (
                  <div className="flex items-center space-x-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Password meets all requirements</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {passwordData.confirmPassword && (
              <div className="mt-2">
                {doPasswordsMatch ? (
                  <div className="flex items-center space-x-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Passwords match</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-red-400">Passwords do not match</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Password Requirements Info */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium text-sm mb-2">Password Requirements:</h4>
            <ul className="text-blue-200 text-xs space-y-1">
              <li>• At least 8 characters long</li>
              <li>• One uppercase letter (A-Z)</li>
              <li>• One lowercase letter (a-z)</li>
              <li>• One number (0-9)</li>
              <li>• One special character (!@#$%^&*)</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isPasswordValid || !doPasswordsMatch}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Changing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;