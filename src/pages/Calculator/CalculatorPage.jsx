import React from 'react';
import { 
  Car, Info, Globe, Flame, BarChart3, 
  TrendingDown, DollarSign, Gauge, Fuel, 
  Settings, IndianRupee 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import Card from '../../components/UI/Card';
import MetricCard from '../../components/Metrics/MetricCard';
import VehicleSelector from '../../components/UI/VehicleSelector';
import ImpactCard from './ImpactCard'; 
import { calculateImpact } from '../../logic/emissionsLogic';

const CalculatorPage = ({ selectedVehicle, distance, setDistance, metrics, onSelect }) => {
  
  // Early return if no vehicle is selected
  if (!selectedVehicle) return (
    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
      <Car className="w-16 h-16 mb-4 opacity-20" />
      <p>Please select a vehicle to generate the ESG report</p>
    </div>
  );

  // 1. CALCULATE ENVIRONMENTAL IMPACT
  const impact = calculateImpact(selectedVehicle, distance, metrics.operational);

  // 2. CALCULATE FINANCIAL IMPACT (Savings Logic)
  // Benchmark: Average Petrol Sedan (12 km/L at ₹104 per Liter)
  const benchmarkFuelPrice = 104; 
  const benchmarkMileage = 12;
  const benchmarkCost = (distance / benchmarkMileage) * benchmarkFuelPrice;
  
  // Current vehicle cost (from props)
  const currentFuelCost = metrics.fuelCost;
  
  // Add financial savings to the impact object for the ImpactCard
  impact.costSaved = Math.max(0, benchmarkCost - currentFuelCost);

  // Formatting variables for the UI
  const totalFuelCostFormatted = (metrics.fuelCost).toFixed(2);
  const operationalEmissions = (metrics.operationalRate * distance).toFixed(2);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); 
    const numValue = value === '' ? 0 : parseInt(value);
    setDistance(numValue);
  };

  return (
    <div className="space-y-8">
      {/* 1. HERO Impact Section (Includes the new Cost Saved metric) */}
      {impact.savedKg > 0 && <ImpactCard impact={impact} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Car className="text-emerald-500 w-5 h-5" /> Vehicle Input
            </h3>
            
            <VehicleSelector label="Vehicle" selectedId={selectedVehicle.id} onSelect={onSelect} />
            
            <div className="mt-6">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Lifetime Distance (KM)
                </label>
                <input 
                  type="text"
                  value={distance === 0 ? '' : distance}
                  onChange={handleInputChange}
                  className="w-24 text-right px-2 py-1 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Enter KM"
                />
              </div>

              <input 
                type="range" min="0" max="1000000" step="1000" 
                value={distance} 
                onChange={(e) => setDistance(parseInt(e.target.value))} 
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
              />
            </div>
          </Card>
          
          <Card className="p-6 bg-slate-900 text-slate-300 border-none">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-emerald-500/20 rounded">
                  <Info className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">Analysis Logic</span>
            </div>
            <p className="text-xs leading-relaxed">
              ESG metrics are calculated based on the lifecycle emissions and operational data for <strong>{distance.toLocaleString()} km</strong>. Financial savings are compared against a standard petrol benchmark.
            </p>
          </Card>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* VEHICLE DETAILS HEADER */}
          <Card className="p-6 bg-white border-b-4 border-emerald-500 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded inline-block mb-2">Selected Vehicle</p>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                  {selectedVehicle.Brand} <span className="text-emerald-500">{selectedVehicle.Model}</span>
                </h2>
                <div className="flex items-center gap-4 mt-2 text-slate-500">
                   <div className="flex items-center gap-1.5 text-xs font-semibold uppercase">
                      <Settings className="w-3.5 h-3.5 text-emerald-500" /> {selectedVehicle.Engine_CC} CC
                   </div>
                   <div className="w-1 h-1 bg-slate-300 rounded-full" />
                   <div className="flex items-center gap-1.5 text-xs font-semibold uppercase">
                      <Gauge className="w-3.5 h-3.5 text-emerald-500" /> {selectedVehicle.Mileage} KM/L
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[140px]">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                   <Fuel className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Fuel Type</p>
                  <p className="text-sm font-black text-slate-700 uppercase tracking-wide">{selectedVehicle.Fuel_Type}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard icon={<Globe className="text-blue-500" />} label="LIFETIME DEBT" value={`${(metrics.total / 1000).toFixed(2)} Tons`} sub="Total CO2e" />
            <MetricCard icon={<Flame className="text-red-500" />} label="INTENSITY" value={metrics.operationalRate.toFixed(3)} sub="kg CO2 / km (Ops)" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart Section */}
            <Card className="p-6">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" /> Emission Breakdown
              </h4>
              <div className="h-48">
                <ResponsiveContainer>
                  <BarChart data={[{name:'Mfg', val:metrics.mfg}, {name:'Ops', val:metrics.operational}]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip cursor={{fill: '#f8fafc'}}/>
                    <Bar dataKey="val" radius={[6,6,0,0]}>
                        <Cell fill="#10b981" />
                        <Cell fill="#3b82f6" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Cost and Emission Cards */}
            <div className="space-y-6">
              <Card className="p-6 border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Fuel Cost</p>
                    <h4 className="text-2xl font-black text-slate-800">₹{parseFloat(totalFuelCostFormatted).toLocaleString()}</h4>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-medium italic">Estimated spend for {distance.toLocaleString()} km</p>
              </Card>

              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Operational CO2</p>
                    <h4 className="text-2xl font-black text-slate-800">{parseFloat(operationalEmissions).toLocaleString()} kg</h4>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-medium italic">Excludes manufacturing debt</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;