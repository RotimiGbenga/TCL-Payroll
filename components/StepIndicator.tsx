
import React from 'react';
import { CheckIcon, EditIcon } from './icons';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  titles: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, titles }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <li key={step} className={`relative ${step !== totalSteps ? 'flex-1' : ''}`}>
            {step < currentStep ? (
              // Completed Step
              <div className="group flex items-center w-full">
                <span className="flex items-center px-6 py-2 text-sm font-medium">
                  <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-full">
                    <CheckIcon className="w-6 h-6 text-white" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-slate-900 hidden md:block">{titles[step - 1]}</span>
                </span>
                {step !== totalSteps && <div className="absolute top-1/2 left-full w-full h-0.5 bg-indigo-600 -translate-y-1/2" aria-hidden="true" />}
              </div>
            ) : step === currentStep ? (
              // Current Step
              <div className="flex items-center px-6 py-2 text-sm font-medium" aria-current="step">
                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 border-2 border-indigo-600 rounded-full">
                  <span className="text-indigo-600">{step}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-indigo-600 hidden md:block">{titles[step - 1]}</span>
                {step !== totalSteps && <div className="absolute top-1/2 left-full w-full h-0.5 bg-slate-200 -translate-y-1/2" aria-hidden="true" />}
              </div>
            ) : (
              // Upcoming Step
              <div className="group flex items-center w-full">
                <span className="flex items-center px-6 py-2 text-sm font-medium">
                  <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 border-2 border-slate-300 rounded-full">
                    <span className="text-slate-500">{step}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-slate-500 hidden md:block">{titles[step - 1]}</span>
                </span>
                {step !== totalSteps && <div className="absolute top-1/2 left-full w-full h-0.5 bg-slate-200 -translate-y-1/2" aria-hidden="true" />}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
