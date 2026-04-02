import React, { useState, useEffect } from 'react';
import { 
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Home,
  Zap,
  Bell,
  Shield,
  ChevronDown,
  Key
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NotificationPanel from './NotificationPanel';
import ChangePasswordModal from './ChangePasswordModal';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const handleNotificationCountChange = (count: number) => {
    setNotificationCount(count);
  };

  const closeAllDropdowns = () => {
    setShowSettings(false);
    setShowNotificationSettings(false);
    setShowSecuritySettings(false);
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
    closeAllDropdowns();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        closeAllDropdowns();
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 sm:p-2 rounded-xl">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Nirogya</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Health Assistant</p>
              </div>
            </div>
            
            {/* Center Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => onTabChange('features')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'features'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>Features</span>
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(true)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Settings Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
                </button>

                {/* Settings Dropdown Menu */}
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg border border-gray-700 py-2 z-50">
                    <button
                      onClick={() => {
                        onTabChange('profile');
                        closeAllDropdowns();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Bell className="h-4 w-4" />
                          <span>Notification Settings</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showNotificationSettings ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showNotificationSettings && (
                        <div className="bg-gray-700 mx-2 rounded-lg mt-1 mb-2">
                          <div className="p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-300">Medicine Reminders</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-8 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-300">Health Tips</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-8 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-300">Emergency Alerts</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-8 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowSecuritySettings(!showSecuritySettings)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Shield className="h-4 w-4" />
                          <span>Security & Privacy</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showSecuritySettings ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showSecuritySettings && (
                        <div className="bg-gray-700 mx-2 rounded-lg mt-1 mb-2">
                          <div className="p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-300">Data Sharing</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-8 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-300">Analytics Tracking</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-8 h-4 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                            <button 
                              onClick={handleChangePassword}
                              className="w-full text-xs text-red-400 hover:text-red-300 py-2 text-left flex items-center space-x-2"
                            >
                              <Key className="h-3 w-3" />
                              <span>Change Password</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white truncate max-w-24 lg:max-w-none">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-24 lg:max-w-none">{user?.email}</p>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 py-2 z-50">
                    <button
                      onClick={() => {
                        onTabChange('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-700 py-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onTabChange('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('features');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'features'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span>Features</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel 
          onClose={() => setShowNotifications(false)} 
          onNotificationCountChange={handleNotificationCountChange}
        />
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};

export default Navigation;