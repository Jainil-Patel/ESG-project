import React from 'react';
import Card from '../UI/Card';

const MetricCard = ({ icon, label, value, sub }) => (
  <Card className="p-6 bg-white">
    <div className="flex justify-between items-start mb-2">
      {icon}
      <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded uppercase">
        {label}
      </span>
    </div>
    <div className="text-2xl font-black text-slate-800">{value}</div>
    <p className="text-xs text-slate-400 mt-1">{sub}</p>
  </Card>
);

export default MetricCard;