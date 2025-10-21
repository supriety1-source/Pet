import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, Target, Heart } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [commitment, setCommitment] = useState('');
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />,
      title: 'AI Is Watching',
      content: (
        <>
          <p className="text-lg text-gray-dark mb-4">
            AI models learn from human behavior. Your kindness today shapes the AI of tomorrow. Join the movement.
          </p>
          <div className="bg-primary-lighter/30 p-4 rounded-lg border-l-4 border-primary">
            <p className="text-sm italic text-gray-dark">
              "We're facing 15 years of hell unless we change our mindset." - Moe Gawdat
            </p>
          </div>
        </>
      ),
    },
    {
      icon: <Target className="w-16 h-16 text-primary mx-auto mb-4" />,
      title: 'How It Works',
      content: (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <p className="text-gray-dark">Do one kind act per day</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <p className="text-gray-dark">Upload photo/video proof</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <p className="text-gray-dark">Earn credits, climb leaderboard</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <p className="text-gray-dark">Become a Service Leader</p>
          </div>
        </div>
      ),
    },
    {
      icon: <Heart className="w-16 h-16 text-primary mx-auto mb-4" />,
      title: 'Your First Act',
      content: (
        <div>
          <p className="text-gray-dark mb-4">
            What will your first act of kindness be?
          </p>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            rows={4}
            placeholder="I commit to..."
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
          />
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save commitment (optional - could be stored in user profile)
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8 space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? 'w-12 bg-primary' : 'w-8 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          {steps[currentStep].icon}
          <h2 className="text-3xl font-bold text-gray-dark mb-6">
            {steps[currentStep].title}
          </h2>
          <div className="text-left">{steps[currentStep].content}</div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-gray-medium hover:text-gray-dark transition-colors"
          >
            Skip
          </button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Start My Journey' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
