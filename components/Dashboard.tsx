import React, { useEffect, useState } from 'react';
import { Device } from '../types';
import { generateMockDevices, simulateTelemetry } from '../services/mockDeviceService';
import RadarView from './RadarView';
import DeviceDetails from './DeviceDetails';
import { Activity, Radio, Wifi, ShieldAlert } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  
  // Initialize mock scanner
  useEffect(() => {
    const initialDevices = generateMockDevices(8);
    setDevices(initialDevices);

    const interval = setInterval(() => {
      setDevices(current => simulateTelemetry(current));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'Connected').length,
    avgSignal: Math.round(devices.reduce((acc, d) => acc + d.rssi, 0) / (devices.length || 1)),
    highRisk: devices.filter(d => (d.openPorts?.length || 0) > 2).length
  };

  return (
    <div className="flex h-full relative overflow-hidden bg-slate-900">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedDevice ? 'mr-96' : 'mr-0'} overflow-y-auto`}>
        
        {/* Top Bar Stats */}
        <div className="shrink-0 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 p-4 rounded border border-slate-700 flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full"><Radio size={24} /></div>
                <div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Devices Detected</div>
                </div>
            </div>
            <div className="bg-slate-800 p-4 rounded border border-slate-700 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full"><Wifi size={24} /></div>
                <div>
                    <div className="text-2xl font-bold text-white">{stats.online}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Online Now</div>
                </div>
            </div>
             <div className="bg-slate-800 p-4 rounded border border-slate-700 flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-full"><Activity size={24} /></div>
                <div>
                    <div className="text-2xl font-bold text-white">{stats.avgSignal} <span className="text-sm font-normal text-slate-500">dBm</span></div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Avg Signal</div>
                </div>
            </div>
             <div className="bg-slate-800 p-4 rounded border border-slate-700 flex items-center gap-4">
                <div className="p-3 bg-red-500/20 text-red-400 rounded-full"><ShieldAlert size={24} /></div>
                <div>
                    <div className="text-2xl font-bold text-white">{stats.highRisk}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Open Ports > 2</div>
                </div>
            </div>
        </div>

        {/* Radar Visualization Area */}
        <div className="shrink-0 flex items-center justify-center p-6 relative min-h-[500px]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900 to-slate-900 -z-10"></div>
            <RadarView 
                devices={devices} 
                selectedDeviceId={selectedDeviceId} 
                onSelectDevice={setSelectedDeviceId} 
            />
        </div>

        {/* Device List (Bottom Panel) */}
        <div className="shrink-0 h-48 bg-slate-800 border-t border-slate-700 overflow-y-auto hidden md:block">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-900 text-slate-200 sticky top-0">
                    <tr>
                        <th className="p-3 font-medium">Device Name</th>
                        <th className="p-3 font-medium">MAC Address</th>
                        <th className="p-3 font-medium">Type</th>
                        <th className="p-3 font-medium">Signal</th>
                        <th className="p-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {devices.map(d => (
                        <tr 
                            key={d.id} 
                            onClick={() => setSelectedDeviceId(d.id)}
                            className={`hover:bg-slate-700/50 cursor-pointer ${selectedDeviceId === d.id ? 'bg-slate-700/50' : ''}`}
                        >
                            <td className="p-3 font-medium text-white">{d.name}</td>
                            <td className="p-3 font-mono">{d.mac}</td>
                            <td className="p-3">{d.type}</td>
                            <td className="p-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1 bg-slate-700 rounded overflow-hidden">
                                        <div 
                                            className={`h-full ${d.rssi > -60 ? 'bg-emerald-500' : d.rssi > -80 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                            style={{ width: `${Math.max(0, 100 + d.rssi)}%` }}
                                        ></div>
                                    </div>
                                    {d.rssi} dBm
                                </div>
                            </td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs border ${d.status === 'Connected' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                                    {d.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Slide-out Details Panel */}
      <div 
        className={`absolute inset-y-0 right-0 w-96 bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-20 ${selectedDevice ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedDevice && (
            <DeviceDetails device={selectedDevice} onClose={() => setSelectedDeviceId(null)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;