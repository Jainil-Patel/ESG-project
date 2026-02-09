export const FUEL_PRICES = {
  'Petrol': 101.94,
  'Diesel': 89.67,
  'CNG': 85.00,
  'Electric': 8.00 
};

export const getEfficiencyString = (fuel, mileage) => {
  if (fuel === 'Electric') return `${mileage} km/kWh`;
  if (fuel === 'CNG') return `${mileage} km/kg`;
  return `${mileage} km/l`;
};

/**
 * REFINED: Operational Emission Factors (kg CO2 per km)
 * Based on standardized emission factors for fuel combustion.
 */
export const getOperationalEmissionFactor = (fuel, cc) => {
  const factors = {
    'Petrol': cc < 1000 ? 0.111 : cc <= 1600 ? 0.141 : 0.176,
    'Diesel': cc < 1400 ? 0.128 : cc <= 2000 ? 0.160 : 0.201,
    'CNG': 0.130, // CNG is ~20-25% less than petrol, but higher than your previous 0.068
    'Electric': 0.045 // Indirect emissions from the power grid (average mix)
  };
  return factors[fuel] || 0.15;
};

/**
 * REFINED: Manufacturing Emissions (Cradle-to-Gate)
 * Uses CC as the primary proxy for material mass and Price as a luxury/tech modifier.
 */
export const getManufacturingEmissions = (price, fuel, cc) => {
  // Base by Engine CC (Mass/Material proxy)
  let base = 5000; 
  if (cc > 1200) base = 8000;
  if (cc > 2000) base = 12000;
  if (cc > 3500) base = 18000;

  // Luxury/Tech Adjustment (Price proxy)
  if (price > 3000000) base += 3000;

  // Powertrain Adjustment
  const multipliers = {
    'Electric': 1.6, // Significant battery footprint
    'Hybrid': 1.3,
    'Diesel': 1.1,
    'Petrol': 1.0
  };

  return Math.round(base * (multipliers[fuel] || 1.0));
};

export const calculateFuelCost = (fuel, mileage, distance) => {
  if (fuel === 'Electric') {
    // Assuming 'mileage' is km/kWh (Standard: ~6-7 km/kWh)
    return (distance / (mileage || 7)) * FUEL_PRICES['Electric'];
  }
  return (distance / (mileage || 15)) * FUEL_PRICES[fuel];
};

/**
 * REFINED: Impact Logic
 * Compares current vehicle against a standard 1.2L Petrol Benchmark.
 */
export const calculateImpact = (currentVehicle, distance, currentEmissions) => {
  const benchmarkRate = 0.141; // Standard Petrol Sedan
  const benchmarkTotal = benchmarkRate * distance;
  
  // Operational savings
  const savedKg = benchmarkTotal - currentEmissions;
  
  // Contextual ESG metrics
  return {
    isGreen: ['Electric', 'CNG', 'Hybrid'].includes(currentVehicle.Fuel_Type),
    savedKg: parseFloat(savedKg.toFixed(2)),
    // 1 tree absorbs ~21kg CO2/year. This helps visualize the impact.
    treesEquivalent: Math.max(0, Math.floor(savedKg / 21)), 
    // Carbon offset equivalent in Liters of Petrol
    petrolOffset: Math.max(0, Math.floor(savedKg / 2.31)) 
  };
};