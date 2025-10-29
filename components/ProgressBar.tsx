
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = Math.max(0, ((currentStep - 1) / totalSteps) * 100);

  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};
