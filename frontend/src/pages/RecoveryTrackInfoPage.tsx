import React from 'react';
import { Button } from '../components/Button';

const RecoveryTrackInfoPage: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <header className="space-y-3">
      <p className="text-sm uppercase tracking-[0.4em] text-purple-200">Recovery Track</p>
      <h1 className="text-4xl font-bold text-white">Upgrade to the Recovery Track</h1>
      <p className="text-lg text-gray-300">
        Five Morning Non-Negotiables. AI-verified. Life-changing. When you’re ready to transform your whole life, this is the
        path.
      </p>
    </header>

    <section className="grid md:grid-cols-3 gap-6">
      {[
        {
          title: 'Morning Rituals',
          description: 'Start every day with intentional practices that rewire your mindset for service.',
        },
        { title: 'AI Accountability', description: 'Upload proof and let AI hold you to the standard you set.' },
        {
          title: 'Community Support',
          description: 'Join high-performing humans who refuse the 15 years of hell. Support each other daily.',
        },
      ].map((feature) => (
        <div key={feature.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3">
          <h3 className="text-xl font-semibold text-purple-200">{feature.title}</h3>
          <p className="text-gray-300 text-sm">{feature.description}</p>
        </div>
      ))}
    </section>

    <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-white">Pricing</h2>
      <ul className="space-y-2 text-gray-300">
        <li>• $47-97/month for ongoing accountability</li>
        <li>• Apply for Founding Member: $497-997 lifetime access</li>
        <li>• Scholarships available — no one committed to kindness gets left behind</li>
      </ul>
      <Button
        onClick={() => {
          window.location.href = 'mailto:joey@supriety.com?subject=Recovery%20Track%20Application';
        }}
        className="w-full md:w-auto"
      >
        Apply Now
      </Button>
    </section>
  </div>
);

export default RecoveryTrackInfoPage;
