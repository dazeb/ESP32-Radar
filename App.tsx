import React from 'react';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Header */}
      <header className="shrink-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between z-30">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
             R
           </div>
           <h1 className="text-xl font-bold tracking-tight text-white">ESP32 <span className="text-indigo-400">Radar</span> Command</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-emerald-400 font-mono">SCANNER ACTIVE</span>
            </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;