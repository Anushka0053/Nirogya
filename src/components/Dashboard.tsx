import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Camera, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Target,
  FileText,
  MapPin,
  Pill,
  Bell
} from 'lucide-react';
import { supabase, HealthRecord } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface DashboardStats {
  totalActivities: number;
  symptomChecks: number;
  pulseReadings: number;
  imageAnalyses: number;
  doctorVisits: number;
}

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalActivities: 0,
    symptomChecks: 0,
    pulseReadings: 0,
    imageAnalyses: 0,
    doctorVisits: 0
  });
  const [recentActivities, setRecentActivities] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch health records for stats and recent activities
      const { data: healthRecords, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const activities = healthRecords || [];
      setStats({
        totalActivities: activities.length,
        symptomChecks: activities.filter(a => a.activity_type === 'symptom_check').length,
        pulseReadings: activities.filter(a => a.activity_type === 'pulse_reading').length,
        imageAnalyses: activities.filter(a => a.activity_type === 'image_analysis').length,
        doctorVisits: activities.filter(a => a.activity_type === 'doctor_visit').length,
      });

      // Set recent activities (last 5)
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'symptom_check': return <Activity className="h-5 w-5 text-emerald-400" />;
      case 'pulse_reading': return <Heart className="h-5 w-5 text-red-400" />;
      case 'image_analysis': return <Camera className="h-5 w-5 text-purple-400" />;
      case 'doctor_visit': return <Users className="h-5 w-5 text-blue-400" />;
      case 'emergency_alert': return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      default: return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
                <p className="text-emerald-100 text-lg mb-4 md:mb-0">
                  Here's your health overview for today
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-6 w-6" />
                    <span className="font-semibold">Health Score: 85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Activities</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalActivities}</p>
                <p className="text-emerald-400 text-sm mt-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% this month
                </p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-xl">
                <Activity className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Symptom Checks</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.symptomChecks}</p>
                <p className="text-blue-400 text-sm mt-1 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  All resolved
                </p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Pulse Readings</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.pulseReadings}</p>
                <p className="text-emerald-400 text-sm mt-1 flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  Normal range
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-xl">
                <Heart className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Doctor Visits</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.doctorVisits}</p>
                <p className="text-purple-400 text-sm mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Next: Dec 15
                </p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-xl">
                <Users className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Activities</h2>
                <button 
                  onClick={() => onNavigate('reports')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium text-sm"
                >
                  View All
                </button>
              </div>

              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {activity.description || formatActivityType(activity.activity_type)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No activities yet</h3>
                  <p className="text-gray-400">Start using Nirogya to track your health activities</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Health Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate('symptoms')}
                  className="w-full flex items-center space-x-3 p-3 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-colors"
                >
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Check Symptoms</span>
                </button>
                <button 
                  onClick={() => onNavigate('pulse')}
                  className="w-full flex items-center space-x-3 p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors"
                >
                  <Heart className="h-5 w-5 text-red-400" />
                  <span className="text-red-300 font-medium">Monitor Pulse</span>
                </button>
                <button 
                  onClick={() => onNavigate('medicine-reminder')}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors"
                >
                  <Pill className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-300 font-medium">Medicine Reminder</span>
                </button>
                <button 
                  onClick={() => onNavigate('appointments')}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-colors"
                >
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">Appointments</span>
                </button>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-emerald-300">Today's Health Tip</h3>
              </div>
              <p className="text-emerald-200 text-sm leading-relaxed mb-4">
                Stay hydrated! Aim for 8 glasses of water daily to maintain optimal health and energy levels.
              </p>
              <div className="flex items-center space-x-2 text-emerald-300">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Boost your wellness</span>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-bold text-red-300">Emergency</h3>
              </div>
              <div className="space-y-2 text-sm text-red-200">
                <p><strong>Ambulance:</strong> 108</p>
                <p><strong>Police:</strong> 100</p>
                <p><strong>Fire:</strong> 101</p>
              </div>
              <button 
                onClick={() => onNavigate('emergency')}
                className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                🚨 Emergency Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;