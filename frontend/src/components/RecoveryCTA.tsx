import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecoveryCTA: React.FC = () => (
  <div className="mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 rounded-2xl p-6 shadow-xl">
    <h3 className="text-2xl font-bold text-white">Ready to transform your whole life?</h3>
    <p className="mt-2 text-white/90 max-w-xl">
      Upgrade to the Recovery Track: Five Morning Non-Negotiables. AI-verified. Life-changing. Apply to become a founding
      member and lead the movement.
    </p>
    <Link
      to="/recovery-track-info"
      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-purple-200 font-semibold"
    >
      Learn More <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);
