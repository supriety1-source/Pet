import React from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: 'purple' | 'green' | 'pink';
  helper?: string;
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, accent = 'purple', helper }) => {
  const accentClasses = {
    purple: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
    green: 'bg-green-500/20 text-green-200 border-green-400/40',
    pink: 'bg-pink-500/20 text-pink-200 border-pink-400/40',
  };

  return (
    <div className={`p-5 rounded-xl border ${accentClasses[accent]} space-y-2`}> 
      <p className="text-sm uppercase tracking-wide text-gray-300">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {helper && <p className="text-xs text-gray-400">{helper}</p>}
    </div>
  );
};
