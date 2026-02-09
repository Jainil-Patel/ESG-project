import React from 'react';
import { Trash2, Globe, Droplets, Flame, Scale } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../../components/UI/Card';
import VehicleSelector from '../../components/UI/VehicleSelector';
import { CAR_DATA } from '../../data/carData';
import { getEfficiencyString } from '../../logic/emissionsLogic';

const ComparePage = ({ compareIds, onSelect, distance, setDistance, compareData }) => {
  
  // Prepare data for charts by appending Fuel Type to the name
  const chartData = compareData.map(data => {
    const vehicle = CAR_DATA.find(c => c.id === data.id);
    return {
      ...data,
      // Create a label like "Nexon (EV)" or "Swift (Petrol)"
      displayName: `${data.name} (${vehicle?.Fuel_Type || 'N/A'})`,
      fuelType: vehicle?.Fuel_Type
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Fleet Comparison</h2>
          <p className="text-slate-500">Compare life-cycle carbon footprint side-by-side.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test distance</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={distance} 
              onChange={(e) => setDistance(Math.max(0, parseInt(e.target.value) || 0))} 
              className="bg-slate-100 border-none rounded-lg px-3 py-1 font-bold text-emerald-600 w-28 text-center" 
            />
            <span className="text-sm font-medium text-slate-400">km</span>
          </div>
        </div>
      </header>

      {/* Comparison Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {compareIds.map((id, idx) => {
          const vehicle = CAR_DATA.find(c => c.id === id);
          const data = compareData.find(d => d.id === id);
          return (
            <Card key={idx} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Vehicle {idx + 1}</span>
                <button onClick={() => onSelect(idx, null)} className="text-slate-300 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <VehicleSelector label="Select" selectedId={id} onSelect={(val) => onSelect(idx, val)} />
              {id && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-400 uppercase">Fuel</span>
                      <p className="font-bold text-slate-700">{vehicle?.Fuel_Type}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-400 uppercase">
                        {vehicle?.Fuel_Type === 'Electric' ? 'Est. Range' : 'Efficiency'}
                      </span>
                      <p className="font-bold text-emerald-600">
                        {vehicle?.Fuel_Type === 'Electric' 
                          ? `${((45 / vehicle.Mileage) * 100).toFixed(0)} km` 
                          : getEfficiencyString(vehicle?.Fuel_Type, vehicle?.Mileage)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3 space-y-3 text-[11px]">
                     <CompareStat icon={<Globe className="w-3 h-3"/>} label="Carbon Debt" value={`${(data?.total / 1000).toFixed(2)} Tons`} />
                     <CompareStat icon={<Droplets className="w-3 h-3"/>} label="Expenditure" value={`₹${(data?.cost / 100000).toFixed(2)} L`} />
                     <CompareStat icon={<Flame className="w-3 h-3"/>} label="Intensity" value={`${data?.intensity.toFixed(3)} kg CO2 / km`} />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carbon Weight Chart */}
          <Card className="p-6">
            <h3 className="font-bold mb-8 flex items-center gap-2">
              <Scale className="text-emerald-500 w-5 h-5" /> Carbon Weight (kg)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                  <XAxis type="number"/>
                  <YAxis 
                    dataKey="displayName" 
                    type="category" 
                    width={120} 
                    fontSize={10} 
                    fontWeight="bold"
                  />
                  <RechartsTooltip />
                  <Bar name="Manufacturing" dataKey="manufacturing" stackId="a" fill="#10b981" />
                  <Bar name="Operational" dataKey="operational" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Operational Cost Chart */}
          <Card className="p-6">
            <h3 className="font-bold mb-8 flex items-center gap-2">
              <Droplets className="text-orange-500 w-5 h-5" /> Op. Cost (INR)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis 
                    dataKey="displayName" 
                    fontSize={10} 
                    fontWeight="bold"
                  />
                  <YAxis fontSize={10}/>
                  <RechartsTooltip />
                  <Bar name="Fuel Cost" dataKey="cost" fill="#f97316" radius={[4, 4, 0, 0]}>
                    {/* Optional: Add dynamic coloring based on fuel type */}
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fuelType === 'Electric' ? '#10b981' : '#f97316'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const CompareStat = ({ icon, label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-500 font-medium flex items-center gap-1">{icon} {label}</span>
    <span className="font-bold text-slate-800">{value}</span>
  </div>
);

export default ComparePage;