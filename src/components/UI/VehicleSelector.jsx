import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CAR_DATA } from '../../data/carData';

const VehicleSelector = ({ label, onSelect, selectedId }) => {
  const currentVehicle = useMemo(() => CAR_DATA.find(v => v.id === selectedId), [selectedId]);

  const [brand, setBrand] = useState(currentVehicle?.Brand || '');
  const [model, setModel] = useState(currentVehicle?.Model || '');

  const [brandSearch, setBrandSearch] = useState(currentVehicle?.Brand || '');
  const [modelSearch, setModelSearch] = useState(currentVehicle?.Model || '');
  const [variantSearch, setVariantSearch] = useState('');

  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isVariantOpen, setIsVariantOpen] = useState(false);

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef(null);

  useEffect(() => {
    if (currentVehicle) {
      setBrand(currentVehicle.Brand);
      setModel(currentVehicle.Model);
      setBrandSearch(currentVehicle.Brand);
      setModelSearch(currentVehicle.Model);
    }
  }, [currentVehicle]);

  const brands = useMemo(() => [...new Set(CAR_DATA.map(c => c.Brand))], []);

  const filteredBrands = useMemo(() => {
    return brands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));
  }, [brandSearch, brands]);

  const uniqueModels = useMemo(() => {
    const list = CAR_DATA.filter(c => c.Brand === brand);
    return [...new Map(list.map(item => [item.Model, item])).values()];
  }, [brand]);

  const filteredModels = useMemo(() => {
    return uniqueModels.filter(m => m.Model.toLowerCase().includes(modelSearch.toLowerCase()));
  }, [modelSearch, uniqueModels]);

  const variants = useMemo(() => {
    if (!model || !brand) return [];
    return CAR_DATA.filter(c => c.Brand === brand && c.Model === model);
  }, [brand, model]);

  const filteredVariants = useMemo(() => {
    return variants.filter(v => 
      `${v.Fuel_Type} ${v.Engine_CC}`
        .toLowerCase()
        .includes(variantSearch.toLowerCase())
    );
  }, [variantSearch, variants]);

  const handleKeyDown = (e, list, onPick, setOpen) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < list.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && list[focusedIndex]) {
        onPick(list[focusedIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (focusedIndex !== -1 && listRef.current) {
      const item = listRef.current.children[focusedIndex];
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  const selectBrand = (b) => {
    setBrand(b);
    setBrandSearch(b);
    setModel('');
    setModelSearch('');
    setVariantSearch('');
    setIsBrandOpen(false);
  };

  const selectModel = (m) => {
    setModel(m.Model);
    setModelSearch(m.Model);
    setVariantSearch('');
    setIsModelOpen(false);
  };

  const selectVariant = (v) => {
    onSelect(v.id);
    setVariantSearch(`${v.Fuel_Type} ${v.Engine_CC}cc`);
    setIsVariantOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* BRAND */}
      <div className="relative">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {label} Brand
        </label>
        <input
          type="text"
          placeholder="Search Brand..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
          value={brandSearch}
          onFocus={() => setIsBrandOpen(true)}
          onKeyDown={(e) => handleKeyDown(e, filteredBrands, selectBrand, setIsBrandOpen)}
          onChange={(e) => {
            setBrandSearch(e.target.value);
            setIsBrandOpen(true);
          }}
        />
        {isBrandOpen && (
          <ul ref={listRef} className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
            {filteredBrands.map((b, i) => (
              <li
                key={b}
                className={`px-4 py-2 cursor-pointer ${focusedIndex === i ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-100'}`}
                onClick={() => selectBrand(b)}
              >
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MODEL */}
      {brand && (
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Model
          </label>
          <input
            type="text"
            placeholder="Search Model..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            value={modelSearch}
            onFocus={() => setIsModelOpen(true)}
            onKeyDown={(e) => handleKeyDown(e, filteredModels, selectModel, setIsModelOpen)}
            onChange={(e) => {
              setModelSearch(e.target.value);
              setIsModelOpen(true);
            }}
          />
          {isModelOpen && (
            <ul ref={listRef} className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredModels.map((m, i) => (
                <li
                  key={m.Model}
                  className={`px-4 py-2 cursor-pointer ${focusedIndex === i ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-100'}`}
                  onClick={() => selectModel(m)}
                >
                  {m.Model}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* VARIANT */}
      {model && (
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Variant
          </label>
          <input
            type="text"
            placeholder="Fuel + Engine..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            value={variantSearch}
            onFocus={() => setIsVariantOpen(true)}
            onKeyDown={(e) => handleKeyDown(e, filteredVariants, selectVariant, setIsVariantOpen)}
            onChange={(e) => {
              setVariantSearch(e.target.value);
              setIsVariantOpen(true);
            }}
          />
          {isVariantOpen && (
            <ul ref={listRef} className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredVariants.map((v, i) => (
                <li
                  key={v.id}
                  className={`px-4 py-2 cursor-pointer flex justify-between ${focusedIndex === i ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-100'}`}
                  onClick={() => selectVariant(v)}
                >
                  <span>{v.Fuel_Type}</span>
                  <span className="text-xs text-slate-400">{v.Engine_CC}cc</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;
