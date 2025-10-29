
import React from 'react';
import type { PFA } from '../types';
import { PlusCircleIcon, TrashIcon } from './icons';

interface Props {
  pfas: PFA[];
  onPfasChange: (pfas: PFA[]) => void;
  errors?: { id: number; field: 'pfaName' | 'employerCode' }[];
}

export const PensionSetupStep: React.FC<Props> = ({ pfas, onPfasChange, errors = [] }) => {

  const handleAddPfa = () => {
    onPfasChange([...pfas, { id: Date.now(), pfaName: '', employerCode: '' }]);
  };

  const handleRemovePfa = (id: number) => {
    onPfasChange(pfas.filter(pfa => pfa.id !== id));
  };

  const handlePfaChange = (id: number, field: keyof Omit<PFA, 'id'>, value: string) => {
    const newPfas = pfas.map(pfa => 
      pfa.id === id ? { ...pfa, [field]: value } : pfa
    );
    onPfasChange(newPfas);
  };
  
  const hasError = (id: number, field: 'pfaName' | 'employerCode') => {
    return errors.some(err => err.id === id && err.field === field);
  };

  return (
    <div className="animate-fade-in">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Step 3: Pension Administrator Setup</h3>
        <div className="space-y-4">
            {pfas.map((pfa, index) => (
                <div key={pfa.id} className="p-4 bg-white rounded-lg border border-slate-200 animate-fade-in">
                    <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
                        <div className="flex-1 w-full">
                            <label htmlFor={`pfaName-${pfa.id}`} className="block text-sm font-medium text-slate-700">PFA Name</label>
                            <input
                                type="text"
                                id={`pfaName-${pfa.id}`}
                                value={pfa.pfaName}
                                onChange={(e) => handlePfaChange(pfa.id, 'pfaName', e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${hasError(pfa.id, 'pfaName') ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                            />
                            {hasError(pfa.id, 'pfaName') && <p className="mt-1 text-sm text-red-600">This field is required.</p>}
                        </div>
                        <div className="flex-1 w-full">
                            <label htmlFor={`employerCode-${pfa.id}`} className="block text-sm font-medium text-slate-700">Employer Code</label>
                            <input
                                type="text"
                                id={`employerCode-${pfa.id}`}
                                value={pfa.employerCode}
                                onChange={(e) => handlePfaChange(pfa.id, 'employerCode', e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${hasError(pfa.id, 'employerCode') ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                            />
                             {hasError(pfa.id, 'employerCode') && <p className="mt-1 text-sm text-red-600">This field is required.</p>}
                        </div>
                        {pfas.length > 1 && (
                            <button onClick={() => handleRemovePfa(pfa.id)} className="mt-2 md:mt-6 p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
            <button onClick={handleAddPfa} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors">
                <PlusCircleIcon className="w-5 h-5"/>
                Add another PFA
            </button>
        </div>
    </div>
  );
};
