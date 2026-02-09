import React, { useState, useMemo } from 'react';
import Navbar from './components/Layout/Navbar';
import CalculatorPage from './pages/Calculator/CalculatorPage';
import ComparePage from './pages/Compare/ComparePage';
import { CAR_DATA } from './data/carData';
import { 
  getManufacturingEmissions, 
  getOperationalEmissionFactor, 
  calculateFuelCost 
} from './logic/emissionsLogic';

export default function App() {
  

  const [view, setView] = useState('report');
  const [selectedId, setSelectedId] = useState(6);
  const [distance, setDistance] = useState(100000);
  const [compareIds, setCompareIds] = useState([6, 8, 1]);

  const handleCalculatorSelect = (id) => {
    setSelectedId(id);
    setCompareIds(prev => [id, prev[1], prev[2]]);
  };

  const handleCompareSelect = (idx, id) => {
    const next = [...compareIds];
    next[idx] = id;
    setCompareIds(next);
    if (idx === 0) setSelectedId(id);
  };

  const selectedVehicle = useMemo(() => CAR_DATA.find(v => v.id === selectedId), [selectedId]);

  const reportMetrics = useMemo(() => {
    if (!selectedVehicle) return null;
    const mfg = getManufacturingEmissions(selectedVehicle.Price, selectedVehicle.Fuel_Type);
    const operationalRate = getOperationalEmissionFactor(selectedVehicle.Fuel_Type, selectedVehicle.Engine_CC);
    const operational = operationalRate * distance;
    const fuelCost = calculateFuelCost(selectedVehicle.Fuel_Type, selectedVehicle.Mileage, distance);
    return { mfg, operational, total: mfg + operational, fuelCost, operationalRate };
  }, [selectedVehicle, distance]);

  const compareData = useMemo(() => {
    return compareIds.map(id => {
      const v = CAR_DATA.find(car => car.id === id);
      if (!v) return null;
      const mfg = getManufacturingEmissions(v.Price, v.Fuel_Type);
      const intensity = getOperationalEmissionFactor(v.Fuel_Type, v.Engine_CC);
      return {
        id: v.id, name: `${v.Brand} ${v.Model}`,
        manufacturing: Math.round(mfg),
        operational: Math.round(intensity * distance),
        total: Math.round(mfg + (intensity * distance)),
        cost: Math.round(calculateFuelCost(v.Fuel_Type, v.Mileage, distance)),
        intensity: intensity
      };
    }).filter(Boolean);
  }, [compareIds, distance]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar currentView={view} setView={setView} />
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        {view === 'report' ? (
          <CalculatorPage 
            selectedVehicle={selectedVehicle} 
            distance={distance} 
            setDistance={setDistance} 
            metrics={reportMetrics} 
            onSelect={handleCalculatorSelect} 
          />
        ) : (
          <ComparePage 
            compareIds={compareIds} 
            onSelect={handleCompareSelect} 
            distance={distance} 
            setDistance={setDistance} 
            compareData={compareData} 
          />
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-200 opacity-60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-bold text-sm mb-2 uppercase tracking-widest text-slate-400">ESG Disclosure</h5>
            <p className="text-xs leading-relaxed">Scope 1, 2, and 3 carbon assessment dashboard based on WRI 2015 India Road Transport parameters.</p>
          </div>
          <div className="text-[10px]">
            <h5 className="font-bold text-sm mb-2 uppercase tracking-widest text-slate-400">Emission Logic (kg/km)</h5>
            <ul className="space-y-1">
              <li>Petrol &lt; 1L: 0.111 | 1-1.6L: 0.141</li>
              <li>Diesel &lt; 1.4L: 0.128 | 1.4-2L: 0.160</li>
            </ul>
          </div>
          <div className="text-[10px]">
            <h5 className="font-bold text-sm mb-2 uppercase tracking-widest text-slate-400">Fuel Benchmark</h5>
            <ul className="space-y-1">
              <li>CNG: ₹85.0 | EV: ₹8.0/unit</li>
              <li>Petrol: ₹101.9 | Diesel: ₹89.6</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}