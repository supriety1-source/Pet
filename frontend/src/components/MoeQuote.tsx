import React from 'react';

const QUOTES = [
  'AI is watching. Set the example.',
  'Your kindness today trains the AI of tomorrow.',
  'Be the humanity you want to see in machines.',
  '15 years of hell or heaven - your choice starts now.',
];

export const MoeQuote: React.FC = () => {
  const quote = React.useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], []);
  return (
    <div className="mt-10 bg-slate-900 border border-purple-500 rounded-lg p-6 shadow-lg">
      <p className="text-lg italic text-purple-200">“{quote}”</p>
      <p className="mt-3 text-sm text-gray-400">— Moe Gawdat</p>
    </div>
  );
};
