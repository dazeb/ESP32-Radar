import React from 'react';
import { Device, ConnectionStatus } from '../types';
import { Wifi, Disc, Zap, AlertTriangle, Eye, Video, Database, Monitor } from 'lucide-react';

interface RadarViewProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
}

const RadarView: React.FC<RadarViewProps> = ({ devices, selectedDeviceId, onSelectDevice }) => {
  const radius = 300; // SVG coordinate radius
  const center = radius;
  const maxDistanceMeters = 20; // Scale: Edge of radar is 20 meters

  // Convert polar (distance, angle) to cartesian (x, y)
  const getCoordinates = (device: Device) => {
    // Normalize distance to radar radius
    // rssi -30 (close) to -90 (far).
    // Let's use the simulated meters for better visual scale
    const normalizedDist = Math.min(device.distance, maxDistanceMeters) / maxDistanceMeters;
    const r = normalizedDist * (radius - 40); // Leave some padding
    const theta = (device.angle * Math.PI) / 180;
    
    return {
      x: center + r * Math.cos(theta),
      y: center + r * Math.sin(theta),
    };
  };

  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto">
      {/* Radar Container */}
      <svg 
        viewBox={`0 0 ${radius * 2} ${radius * 2}`} 
        className="w-full h-full bg-slate-900 rounded-full border-4 border-slate-700 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
      >
        {/* Grid Circles */}
        <circle cx={center} cy={center} r={radius * 0.25} fill="none" stroke="#1e293b" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius * 0.5} fill="none" stroke="#1e293b" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius * 0.75} fill="none" stroke="#1e293b" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius * 0.95} fill="none" stroke="#334155" strokeWidth="2" />
        
        {/* Grid Lines */}
        <line x1={center} y1="0" x2={center} y2={radius * 2} stroke="#1e293b" strokeWidth="1" />
        <line x1="0" y1={center} x2={radius * 2} y2={center} stroke="#1e293b" strokeWidth="1" />

        {/* Scanning Animation */}
        <g className="origin-center animate-scan">
            <path d={`M ${center} ${center} L ${center} 0 A ${radius} ${radius} 0 0 1 ${center + radius} ${center} Z`} fill="url(#scanGradient)" opacity="0.3" />
        </g>

        {/* User Center */}
        <g>
            <circle cx={center} cy={center} r="8" fill="#3b82f6" className="animate-pulse" />
            <circle cx={center} cy={center} r="20" fill="#3b82f6" fillOpacity="0.2" />
        </g>

        {/* Devices */}
        {devices.map((device) => {
          const { x, y } = getCoordinates(device);
          const isSelected = selectedDeviceId === device.id;
          const isOnline = device.status === ConnectionStatus.CONNECTED;
          
          return (
            <g 
              key={device.id} 
              onClick={() => onSelectDevice(device.id)}
              className="cursor-pointer transition-all duration-300"
              style={{ transformBox: 'fill-box' }}
            >
              {/* Ping Ring */}
              {isOnline && (
                 <circle cx={x} cy={y} r="20" className="animate-ping-slow origin-center" fill="none" stroke={isSelected ? '#f59e0b' : '#10b981'} opacity="0.4" />
              )}
              
              {/* Device Icon Background */}
              <circle 
                cx={x} 
                cy={y} 
                r={isSelected ? 14 : 10} 
                fill={isSelected ? '#f59e0b' : (isOnline ? '#10b981' : '#ef4444')} 
                className="transition-all duration-300"
              />
              
              {/* Selection Ring */}
              {isSelected && (
                <circle cx={x} cy={y} r="18" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
              )}
            </g>
          );
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 p-2 rounded text-xs text-slate-400 border border-slate-700 backdrop-blur">
          <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Connected</div>
          <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Disconnected</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> You (Origin)</div>
      </div>
    </div>
  );
};

export default RadarView;
