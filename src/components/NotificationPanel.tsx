import React, { useState, useEffect } from 'react';
import { X, Bell, Pill, Calendar, Activity, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Notification {
  id: string;
  type: 'medicine_reminder' | 'appointment' | 'health_alert' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationPanelProps {
  onClose: () => void;
  onNotificationCountChange: (count: number) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose, onNotificationCountChange }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    // Update notification count whenever notifications change
    const unreadCount = notifications.filter(n => !n.read).length;
    onNotificationCountChange(unreadCount);
  }, [notifications, onNotificationCountChange]);

  const fetchNotifications = async () => {
    try {
      // Fetch medicine reminders for today
      const today = new Date().toISOString().split('T')[0];
      const { data: reminders } = await supabase
        .from('medicine_reminders')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .lte('start_date', today)
        .or(`end_date.is.null,end_date.gte.${today}`);

      // Fetch upcoming appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'scheduled')
        .gte('appointment_date', today)
        .order('appointment_date', { ascending: true })
        .limit(5);

      // Create notifications array
      const notificationsList: Notification[] = [];

      // Add medicine reminders
      reminders?.forEach(reminder => {
        reminder.time_slots.forEach(time => {
          notificationsList.push({
            id: `medicine-${reminder.id}-${time}`,
            type: 'medicine_reminder',
            title: 'Medicine Reminder',
            message: `Time to take ${reminder.medicine_name} (${reminder.dosage})`,
            time: time,
            read: false,
            priority: 'high'
          });
        });
      });

      // Add appointment reminders
      appointments?.forEach(appointment => {
        const appointmentDate = new Date(appointment.appointment_date);
        const today = new Date();
        const diffTime = appointmentDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) {
          notificationsList.push({
            id: `appointment-${appointment.id}`,
            type: 'appointment',
            title: 'Upcoming Appointment',
            message: `Appointment with Dr. ${appointment.doctor_name} on ${appointmentDate.toLocaleDateString()}`,
            time: appointment.appointment_time,
            read: false,
            priority: diffDays <= 1 ? 'high' : 'medium'
          });
        }
      });

      // Add some system notifications
      notificationsList.push({
        id: 'health-tip',
        type: 'system',
        title: 'Daily Health Tip',
        message: 'Remember to drink at least 8 glasses of water today!',
        time: '09:00',
        read: false,
        priority: 'low'
      });

      setNotifications(notificationsList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medicine_reminder': return <Pill className="h-5 w-5 text-orange-400" />;
      case 'appointment': return <Calendar className="h-5 w-5 text-blue-400" />;
      case 'health_alert': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default: return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-4">
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 w-full max-w-md h-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-full">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-700 h-16 rounded-lg"></div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-gray-700 rounded-lg p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-gray-700' : 'bg-gray-700/50'
                  } hover:bg-gray-600 transition-colors cursor-pointer`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{notification.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
              <p className="text-gray-400">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={markAllAsRead}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;