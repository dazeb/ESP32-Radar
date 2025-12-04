import React, { useState } from 'react';
import { Device, DeviceType, ConnectionStatus } from '../types';
import { Wifi, Activity, Shield, Cpu, Lock, Terminal, Battery, Radio } from 'lucide-react';
import { analyzeDeviceSignature } from '../services/geminiService';

interface DeviceDetailsProps {
  device: Device;
  onClose: () => void;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(device.aiAnalysis || null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeDeviceSignature(device);
    setAnalysisResult(result);
    // Persist to device object in a real app state (simplified here)
    device.aiAnalysis = result; 
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case ConnectionStatus.CONNECTED: return 'text-emerald-400';
      case ConnectionStatus.DISCONNECTED: return 'text-red-400';
      case ConnectionStatus.UNSTABLE: return 'text-amber-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 border-l border-slate-700 shadow-xl overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 bg-slate-900/50">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">{device.name}</h2>
            <p className="text-sm text-slate-400 font-mono">{device.mac}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className={`mt-2 flex items-center gap-2 text-sm font-medium ${getStatusColor(device.status)}`}>
           <div className={`w-2 h-2 rounded-full ${device.status === ConnectionStatus.CONNECTED ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
           {device.status}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
         <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Wifi size={14} /> <span className="text-xs uppercase">Signal</span>
            </div>
            <div className="text-lg font-semibold text-white">{device.rssi} dBm</div>
         </div>
         <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Radio size={14} /> <span className="text-xs uppercase">Distance</span>
            </div>
            <div className="text-lg font-semibold text-white">~{device.distance.toFixed(1)}m</div>
         </div>
         <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Cpu size={14} /> <span className="text-xs uppercase">Type</span>
            </div>
            <div className="text-sm font-semibold text-white truncate">{device.type}</div>
         </div>
         <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Battery size={14} /> <span className="text-xs uppercase">Battery</span>
            </div>
            <div className="text-lg font-semibold text-white">{device.batteryLevel ? `${device.batteryLevel}%` : 'N/A'}</div>
         </div>
      </div>

      {/* Technical Details */}
      <div className="px-6 py-2">
         <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Technical Telemetry</h3>
         <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400">IP Address</span>
                <span className="text-slate-200 font-mono">{device.ipAddress || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400">Firmware</span>
                <span className="text-slate-200 font-mono">{device.firmwareVersion || 'Unknown'}</span>
            </div>
            <div className="flex flex-col gap-1 text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400 mb-1">Open Ports</span>
                <div className="flex gap-2 flex-wrap">
                    {device.openPorts?.map(port => (
                        <span key={port} className="px-2 py-0.5 bg-indigo-900/50 text-indigo-300 rounded text-xs border border-indigo-700 font-mono">
                            {port}
                        </span>
                    )) || <span className="text-slate-500 italic">None detected</span>}
                </div>
            </div>
            <div className="flex flex-col gap-1 text-sm pb-2">
                <span className="text-slate-400 mb-1">Detected Services</span>
                <div className="flex gap-2 flex-wrap">
                    {device.services?.map(service => (
                        <span key={service} className="px-2 py-0.5 bg-emerald-900/30 text-emerald-300 rounded text-xs border border-emerald-800 font-mono">
                            {service}
                        </span>
                    )) || <span className="text-slate-500 italic">None detected</span>}
                </div>
            </div>
         </div>
      </div>

      {/* AI Analysis Section */}
      <div className="flex-1 p-6 bg-slate-900/30 mt-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-indigo-400 font-bold">
                <Lock size={16} /> Gemini AI Analysis
            </h3>
            {!analysisResult && (
                <button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs rounded transition-colors flex items-center gap-2"
                >
                    {isAnalyzing ? (
                        <>
                         <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         Analyzing...
                        </>
                    ) : (
                        'Run Analysis'
                    )}
                </button>
            )}
        </div>
        
        {analysisResult ? (
            <div className="bg-slate-800 p-4 rounded border border-indigo-500/30 text-sm text-slate-300 leading-relaxed shadow-inner">
                <div className="flex gap-2 mb-2 text-indigo-300 font-mono text-xs uppercase tracking-wider">
                    <Terminal size={12} /> Analysis Log
                </div>
                {analysisResult}
            </div>
        ) : (
            <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-700 rounded">
                Click "Run Analysis" to profile this device using Google Gemini.
            </div>
        )}
      </div>
    </div>
  );
};

export default DeviceDetails;
