import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { api } from '../api/client';

const steps = [
  {
    title: 'Train AI to Be Benevolent',
    body: 'AI models learn from human behavior. Your kindness today shapes the AI of tomorrow. Join the movement.',
    quote: '“We’re facing 15 years of hell unless we change our mindset.” — Moe Gawdat',
  },
  {
    title: 'How It Works',
    body: '1. Do one kind act per day\n2. Upload proof\n3. Earn credits and climb the leaderboard\n4. Become a Service Leader',
  },
  {
    title: 'Your First Act',
    body: 'What will your first act of kindness be? Make a commitment and make Moe proud.',
  },
];

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [commitment, setCommitment] = useState('');
  const navigate = useNavigate();

  const next = async () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      if (commitment) {
        await api.patch('/profile', { bio: commitment });
      }
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8 bg-slate-900/80 border border-purple-500/40 rounded-3xl p-10 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.5em] text-purple-200">Onboarding</p>
        <h1 className="text-4xl font-bold text-purple-100">{steps[step].title}</h1>
        <p className="text-lg text-gray-200 whitespace-pre-line">{steps[step].body}</p>
        {steps[step].quote && <p className="text-sm text-purple-200">{steps[step].quote}</p>}
        {step === 2 && (
          <TextArea
            label="Your Commitment"
            rows={4}
            value={commitment}
            onChange={(event) => setCommitment(event.target.value)}
            placeholder="I will show kindness today by…"
          />
        )}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Step {step + 1} of {steps.length}
          </span>
          <Button onClick={next}>{step === steps.length - 1 ? 'Start My Journey' : 'Next'}</Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
