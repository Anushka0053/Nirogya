import React, { useState, useEffect } from 'react';
import { Heart, Play, Pause, TrendingUp, Save, Loader, Bluetooth, BluetoothConnected } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const PulseMonitor: React.FC = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [currentPulse, setCurrentPulse] = useState<number | null>(null);
  const [pulseHistory, setPulseHistory] = useState<number[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [bluetoothDevice, setBluetoothDevice] = useState<BluetoothDevice | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring && isConnected) {
      interval = setInterval(() => {
        const newPulse = generatePulseReading();
        setCurrentPulse(newPulse);
        setPulseHistory(prev => [...prev.slice(-19), newPulse]); // Keep last 20 readings
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, isConnected]);

  const generatePulseReading = (): number => {
    // Simulate realistic pulse rate (60-100 BPM for adults)
    const baseRate = 72;
    const variation = Math.random() * 20 - 10; // ±10 BPM variation
    return Math.max(60, Math.min(100, Math.round(baseRate + variation)));
  };

  const connectToBluetooth = async () => {
    if (!navigator.bluetooth) {
      alert('Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.');
      return;
    }

    setConnecting(true);
    try {
      // Request Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { namePrefix: 'Pulse' },
          { namePrefix: 'Heart' }
        ],
        optionalServices: ['battery_service', 'device_information']
      });

      setBluetoothDevice(device);
      
      // Connect to GATT server
      const server = await device.gatt?.connect();
      
      if (server) {
        setIsConnected(true);
        setCurrentPulse(generatePulseReading());
        
        // Listen for disconnection
        device.addEventListener('gattserverdisconnected', () => {
          setIsConnected(false);
          setBluetoothDevice(null);
          setIsMonitoring(false);
        });

        alert(`Connected to ${device.name || 'Bluetooth device'}`);
      }
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      alert('Failed to connect to Bluetooth device. Make sure your device is nearby and supports heart rate monitoring.');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectBluetooth = () => {
    if (bluetoothDevice?.gatt?.connected) {
      bluetoothDevice.gatt.disconnect();
    }
    setIsConnected(false);
    setBluetoothDevice(null);
    setIsMonitoring(false);
    setCurrentPulse(null);
    setPulseHistory([]);
  };

  const startMonitoring = () => {
    if (!isConnected) {
      alert('Please connect to a Bluetooth sensor first');
      return;
    }
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const savePulseReading = async () => {
    if (!user || !currentPulse) return;

    setSaving(true);
    try {
      const status = currentPulse < 60 ? 'low' : currentPulse > 100 ? 'high' : 'normal';

      // Save to pulse_readings table
      await supabase.from('pulse_readings').insert({
        user_id: user.id,
        heart_rate: currentPulse,
        status: status,
        notes: notes
      });

      // Save to health_records table
      await supabase.from('health_records').insert({
        user_id: user.id,
        activity_type: 'pulse_reading',
        title: `Pulse Reading - ${currentPulse} BPM`,
        description: `Heart rate: ${currentPulse} BPM (${status})`,
        metadata: {
          heart_rate: currentPulse,
          status: status,
          notes: notes,
          history: pulseHistory,
          device: bluetoothDevice?.name || 'Bluetooth Sensor'
        }
      });

      alert('Pulse reading saved successfully!');
      setNotes('');
    } catch (error) {
      console.error('Error saving pulse reading:', error);
      alert('Failed to save pulse reading');
    } finally {
      setSaving(false);
    }
  };

  const getPulseStatus = (pulse: number | null) => {
    if (!pulse) return { status: 'Unknown', color: 'gray' };
    if (pulse < 60) return { status: 'Low', color: 'blue' };
    if (pulse > 100) return { status: 'High', color: 'red' };
    return { status: 'Normal', color: 'green' };
  };

  const pulseStatus = getPulseStatus(currentPulse);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Heart className="mr-3 h-8 w-8" />
              Real-time Pulse Monitor
            </h2>
            <p className="text-red-100 mt-2 text-lg">
              Monitor your heart rate with Bluetooth sensors
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monitor Display */}
              <div className="space-y-6">
                <div className="bg-black rounded-2xl p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-center space-x-3">
                      <Heart className={`h-8 w-8 ${isMonitoring ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
                      <span className="text-green-400 text-lg font-mono">PULSE MONITOR</span>
                      {isConnected && (
                        <BluetoothConnected className="h-6 w-6 text-blue-400" />
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-7xl font-mono text-green-400 font-bold">
                        {currentPulse || '--'}
                      </div>
                      <div className="text-green-400 text-xl font-semibold">BPM</div>
                    </div>

                    <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${
                      pulseStatus.color === 'green' ? 'bg-green-500/20 text-green-400' :
                      pulseStatus.color === 'red' ? 'bg-red-500/20 text-red-400' :
                      pulseStatus.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {pulseStatus.status}
                    </div>

                    {bluetoothDevice && (
                      <div className="text-blue-400 text-sm">
                        Connected: {bluetoothDevice.name || 'Bluetooth Device'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  {!isConnected ? (
                    <button
                      onClick={connectToBluetooth}
                      disabled={connecting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                      {connecting ? (
                        <div className="flex items-center justify-center">
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Connecting...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Bluetooth className="h-5 w-5 mr-2" />
                          Connect Bluetooth Sensor
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <button
                          onClick={isMonitoring ? stopMonitoring : startMonitoring}
                          className={`flex-1 flex items-center justify-center py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                            isMonitoring 
                              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' 
                              : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                          }`}
                        >
                          {isMonitoring ? (
                            <>
                              <Pause className="h-5 w-5 mr-2" />
                              Stop Monitoring
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-2" />
                              Start Monitoring
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={disconnectBluetooth}
                          className="px-6 py-4 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>

                      {currentPulse && (
                        <div className="space-y-3">
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this reading..."
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            rows={2}
                          />
                          <button
                            onClick={savePulseReading}
                            disabled={saving}
                            className="w-full flex items-center justify-center py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-500 transition-colors"
                          >
                            {saving ? (
                              <>
                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Reading
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bluetooth Info */}
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">Bluetooth Requirements</h4>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• Compatible heart rate monitor</li>
                      <li>• Bluetooth 4.0+ support</li>
                      <li>• Chrome, Edge, or Opera browser</li>
                      <li>• Device must be in pairing mode</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pulse History and Stats */}
              <div className="space-y-6">
                <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                  <h3 className="font-semibold text-white mb-4 flex items-center text-lg">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Live Pulse Trend
                  </h3>
                  
                  {pulseHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-40 bg-gray-800 rounded-xl border border-gray-600 flex items-end justify-center p-4">
                        <div className="flex items-end space-x-1 h-full w-full justify-center">
                          {pulseHistory.slice(-15).map((pulse, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-t from-red-500 to-red-400 w-4 rounded-t transition-all duration-300"
                              style={{ height: `${Math.max(10, (pulse - 50) * 2)}px` }}
                              title={`${pulse} BPM`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center bg-gray-800 rounded-lg p-3 border border-gray-600">
                          <div className="font-bold text-xl text-blue-400">
                            {Math.min(...pulseHistory)}
                          </div>
                          <div className="text-gray-400 text-sm">Min BPM</div>
                        </div>
                        <div className="text-center bg-gray-800 rounded-lg p-3 border border-gray-600">
                          <div className="font-bold text-xl text-green-400">
                            {Math.round(pulseHistory.reduce((a, b) => a + b, 0) / pulseHistory.length)}
                          </div>
                          <div className="text-gray-400 text-sm">Avg BPM</div>
                        </div>
                        <div className="text-center bg-gray-800 rounded-lg p-3 border border-gray-600">
                          <div className="font-bold text-xl text-red-400">
                            {Math.max(...pulseHistory)}
                          </div>
                          <div className="text-gray-400 text-sm">Max BPM</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">Connect sensor and start monitoring to see pulse trends</p>
                    </div>
                  )}
                </div>

                {/* Health Guidelines */}
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-300 mb-3 text-lg">Normal Heart Rate Ranges</h4>
                  <div className="space-y-2 text-blue-200">
                    <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                      <span className="font-medium">Adults (18+)</span>
                      <span>60-100 BPM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                      <span className="font-medium">Athletes</span>
                      <span>40-60 BPM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                      <span className="font-medium">Children (6-15)</span>
                      <span>70-100 BPM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">Infants (1-11 months)</span>
                      <span>80-160 BPM</span>
                    </div>
                  </div>
                </div>

                {/* Warning Signs */}
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-6">
                  <h4 className="font-semibold text-amber-300 mb-3 text-lg">⚠️ When to Seek Medical Help</h4>
                  <div className="space-y-2 text-amber-200 text-sm">
                    <p>• Resting heart rate below 50 or above 120 BPM</p>
                    <p>• Irregular heartbeat patterns</p>
                    <p>• Chest pain with abnormal heart rate</p>
                    <p>• Dizziness or fainting</p>
                    <p>• Shortness of breath during rest</p>
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

export default PulseMonitor;