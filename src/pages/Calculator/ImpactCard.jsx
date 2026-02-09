import React from 'react';
import { TreePine, Zap, Fuel, Leaf, IndianRupee, Factory } from 'lucide-react';
import Card from '../../components/UI/Card';

const ImpactCard = ({ impact }) => {
  // If no savings, we don't show the positive impact card
  if (!impact || impact.savedKg <= 0) return null;

  return (
    <Card className="p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-xl shadow-emerald-100 mb-8 relative overflow-hidden">
      {/* Background Decorative Element */}
      <Leaf className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-emerald-100" fill="currentColor" />
            </div>
            <span className="font-bold tracking-widest text-sm uppercase text-emerald-50">
              Sustainability Impact Report
            </span>
          </div>
          
            
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Carbon Avoided (Operational) */}
          <div className="space-y-1">
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Net Carbon Saved</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">
                {impact.savedKg > 1000 
                  ? (impact.savedKg / 1000).toFixed(2) 
                  : impact.savedKg.toFixed(0)}
              </span>
              <span className="text-lg font-medium opacity-80">
                {impact.savedKg > 1000 ? 'Tons' : 'kg'}
              </span>
            </div>
          </div>

          {/* Trees Offset */}
          <div className="flex items-center gap-4 md:border-l md:border-white/20 md:pl-8">
            <div className="bg-emerald-500/30 p-3 rounded-full">
              <TreePine className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black">{impact.treesEquivalent}</p>
              <p className="text-[10px] text-emerald-100 font-bold uppercase">Trees/Year</p>
            </div>
          </div>

          {/* Fuel/Energy Offset */}
          <div className="flex items-center gap-4 md:border-l md:border-white/20 md:pl-8">
            <div className="bg-emerald-500/30 p-3 rounded-full">
              <Fuel className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black">{Math.round(impact.petrolOffset)}L</p>
              <p className="text-[10px] text-emerald-100 font-bold uppercase">Fuel Equivalent</p>
            </div>
          </div>

          {/* Financial Savings */}
          <div className="flex items-center gap-4 md:border-l md:border-white/20 md:pl-8">
            <div className="bg-emerald-500/30 p-3 rounded-full">
              <IndianRupee className="w-8 h-8 text-white" />
            </div>
            <div>
              {/* Ensure costSaved is passed in the impact object */}
              <p className="text-3xl font-black">
                ₹{Math.round(impact.costSaved || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-emerald-100 font-bold uppercase">OpEx Saved</p>
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
};

export default ImpactCard;