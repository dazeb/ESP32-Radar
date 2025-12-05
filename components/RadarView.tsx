import React, { useState } from 'react';
import { Device, ConnectionStatus } from '../types';

interface RadarViewProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
}

const RadarView: React.FC<RadarViewProps> = ({ devices, selectedDeviceId, onSelectDevice }) => {
  const [hoveredDevice, setHoveredDevice] = useState<Device | null>(null);
  const radius = 300; // SVG coordinate radius
  const center = radius;
  const maxDistanceMeters = 20; // Scale: Edge of radar is 20 meters

  // Convert polar (distance, angle) to cartesian (x, y)
  const getCoordinates = (device: Device) => {
    // Normalize distance to radar radius
    const normalizedDist = Math.min(device.distance, maxDistanceMeters) / maxDistanceMeters;
    const r = normalizedDist * (radius - 40); // Leave some padding
    const theta = (device.angle * Math.PI) / 180;
    
    return {
      x: center + r * Math.cos(theta),
      y: center + r * Math.sin(theta),
    };
  };

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case ConnectionStatus.CONNECTED: return '#10b981'; // Emerald-500
      case ConnectionStatus.UNSTABLE: return '#f59e0b'; // Amber-500
      case ConnectionStatus.DISCONNECTED: return '#ef4444'; // Red-500
      default: return '#64748b'; // Slate-500
    }
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
          const statusColor = getStatusColor(device.status);
          
          return (
            <g 
              key={device.id} 
              onClick={() => onSelectDevice(device.id)}
              onMouseEnter={() => setHoveredDevice(device)}
              onMouseLeave={() => setHoveredDevice(null)}
              className="cursor-pointer transition-all duration-300"
              style={{ transformBox: 'fill-box' }}
            >
              {/* Invisible Hit Area for easier hovering */}
              <circle cx={x} cy={y} r="30" fill="transparent" />

              {/* Status Effects */}
              {device.status === ConnectionStatus.CONNECTED && (
                 <circle cx={x} cy={y} r="20" className="animate-ping-slow origin-center" fill="none" stroke={statusColor} opacity="0.4" />
              )}
              {device.status === ConnectionStatus.UNSTABLE && (
                 <circle cx={x} cy={y} r="18" className="animate-pulse origin-center" fill="none" stroke={statusColor} strokeWidth="2" opacity="0.5" strokeDasharray="3 3" />
              )}
              
              {/* Device Icon Dot */}
              <circle 
                cx={x} 
                cy={y} 
                r={isSelected ? 14 : 10} 
                fill={statusColor} 
                stroke={isSelected ? 'white' : 'none'}
                strokeWidth={isSelected ? 3 : 0}
                className="transition-all duration-300 shadow-lg"
              />
              
              {/* Selection Ring (Outer) */}
              {isSelected && (
                <circle cx={x} cy={y} r="24" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
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
      <div className="absolute bottom-4 left-4 bg-slate-900/90 p-3 rounded-lg text-xs text-slate-300 border border-slate-700 backdrop-blur pointer-events-none shadow-lg">
          <div className="font-semibold text-slate-400 mb-2 border-b border-slate-700 pb-1">Status Legend</div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="relative w-3 h-3">
                <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-50 animate-ping"></div>
                <div className="relative w-full h-full bg-emerald-500 rounded-full"></div>
            </div>
            <span>Connected</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
              <span>Unstable</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Disconnected</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-300"></div>
              <span>You (Origin)</span>
          </div>
      </div>

      {/* Device Tooltip */}
      {hoveredDevice && (() => {
          const { x, y } = getCoordinates(hoveredDevice);
          const left = (x / (radius * 2)) * 100;
          const top = (y / (radius * 2)) * 100;
          const statusColor = getStatusColor(hoveredDevice.status);
          
          return (
             <div 
                className="absolute transform -translate-x-1/2 -translate-y-[150%] bg-slate-800/95 border border-indigo-500/50 text-slate-200 text-xs rounded-lg px-3 py-2 pointer-events-none shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md z-50 min-w-[150px]"
                style={{ left: `${left}%`, top: `${top}%` }}
             >
                <div className="font-bold text-white mb-1 border-b border-slate-700 pb-1 flex justify-between items-center">
                    {hoveredDevice.name}
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }}></span>
                </div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Signal:</span>
                    <span className={hoveredDevice.rssi > -60 ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>{hoveredDevice.rssi} dBm</span>
                </div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                    <span>Type:</span>
                    <span className="text-slate-300">{hoveredDevice.type}</span>
                </div>
                <div className="flex justify-between text-slate-400 mt-1 pt-1 border-t border-slate-700/50">
                    <span>Status:</span>
                    <span style={{ color: statusColor }}>{hoveredDevice.status}</span>
                </div>
                {/* Little triangle arrow at bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800/95"></div>
             </div>
          );
      })()}
    </div>
  );
};

export default RadarView;