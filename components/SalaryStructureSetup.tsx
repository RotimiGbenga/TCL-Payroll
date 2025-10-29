import React, { useState, useMemo, useEffect } from 'react';

interface SalaryComponents {
  basic: number;
  housing: number;
  transport: number;
}

interface Props {
  initialComponents: SalaryComponents;
  onComplete: (components: SalaryComponents) => void;
}

const ComponentInput: React.FC<{ label: string; name: keyof SalaryComponents; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="relative mt-1">
            <input
                type="number"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-3 pr-12 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                min="0"
                max="100"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">%</span>
            </div>
        </div>
    </div>
);

export const SalaryStructureSetup: React.FC<Props> = ({ initialComponents, onComplete }) => {
  const [components, setComponents] = useState<SalaryComponents>(initialComponents);

  useEffect(() => {
      setComponents(initialComponents);
  }, [initialComponents]);

  const totalPercentage = useMemo(() => {
    return (components.basic || 0) + (components.housing || 0) + (components.transport || 0);
  }, [components]);

  const isValid = totalPercentage === 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setComponents(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onComplete(components);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg shadow-sm animate-fade-in">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Define Default Salary Structure</h1>
            <p className="text-slate-500 text-center mb-8">Set the company-wide default breakdown for salary components. This will be pre-filled for new employees.</p>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ComponentInput label="Basic" name="basic" value={components.basic} onChange={handleChange} />
                    <ComponentInput label="Housing" name="housing" value={components.housing} onChange={handleChange} />
                    <ComponentInput label="Transport" name="transport" value={components.transport} onChange={handleChange} />
                </div>

                <div className={`p-4 rounded-lg text-center transition-colors ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                    <p className="text-sm font-medium">Total Allocation</p>
                    <p className={`text-3xl font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {totalPercentage}%
                    </p>
                    {!isValid && <p className="text-xs text-red-700 mt-1">The total must be exactly 100%.</p>}
                </div>
            </div>
          </div>
          
          <div className="flex justify-end p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg">
            <button
              type="submit"
              disabled={!isValid}
              className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save & Continue to Employee Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
