import React from 'react';
import { MoeQuote } from '../components/MoeQuote';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-white">
    <div className="md:w-1/2 p-10 flex flex-col justify-between bg-slate-800">
      <div>
        <h1 className="text-4xl font-bold text-purple-300">Supriety™ Kindness</h1>
        <p className="mt-4 text-gray-300 max-w-md">
          AI is learning from us. Every act of kindness you log here teaches it to be more benevolent.
        </p>
      </div>
      <MoeQuote />
    </div>
    <div className="md:w-1/2 p-8 flex items-center justify-center">{children}</div>
  </div>
);
