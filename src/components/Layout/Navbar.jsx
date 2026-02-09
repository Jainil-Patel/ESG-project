import React from 'react';
import { Leaf } from 'lucide-react';

const Navbar = ({ currentView, setView }) => (
  <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Leaf className="text-white w-5 h-5" />
        </div>
        <h1 className="font-bold text-xl text-slate-800 tracking-tight">
          EcoDrive <span className="text-emerald-500 font-medium">ESG</span>
        </h1>
      </div>
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button 
          onClick={() => setView('report')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'report' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Calculator
        </button>
        <button 
          onClick={() => setView('compare')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'compare' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Compare
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;