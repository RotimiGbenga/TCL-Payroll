
import React from 'react';
import type { FormData } from '../types';

interface Props {
  data: FormData;
  onDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export const PayScheduleStep: React.FC<Props> = ({ data, onDataChange, errors }) => {
  return (
    <div className="animate-fade-in">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Step 4: Pay Schedule</h3>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pay Frequency</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${data.payFrequency === 'monthly' ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-300 hover:border-slate-400'}`}>
                        <input type="radio" name="payFrequency" value="monthly" checked={data.payFrequency === 'monthly'} onChange={onDataChange} className="sr-only" />
                        <span className="text-sm font-semibold text-slate-800">Monthly</span>
                        <p className="text-xs text-slate-500 mt-1">Employees are paid once a month.</p>
                    </label>
                     <label className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${data.payFrequency === 'bi-weekly' ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-300 hover:border-slate-400'}`}>
                        <input type="radio" name="payFrequency" value="bi-weekly" checked={data.payFrequency === 'bi-weekly'} onChange={onDataChange} className="sr-only" />
                        <span className="text-sm font-semibold text-slate-800">Bi-weekly</span>
                        <p className="text-xs text-slate-500 mt-1">Employees are paid every two weeks.</p>
                    </label>
                    <label className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${data.payFrequency === 'weekly' ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-300 hover:border-slate-400'}`}>
                        <input type="radio" name="payFrequency" value="weekly" checked={data.payFrequency === 'weekly'} onChange={onDataChange} className="sr-only" />
                        <span className="text-sm font-semibold text-slate-800">Weekly</span>
                        <p className="text-xs text-slate-500 mt-1">Employees are paid every week.</p>
                    </label>
                    <label className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${data.payFrequency === 'semi-monthly' ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-300 hover:border-slate-400'}`}>
                        <input type="radio" name="payFrequency" value="semi-monthly" checked={data.payFrequency === 'semi-monthly'} onChange={onDataChange} className="sr-only" />
                        <span className="text-sm font-semibold text-slate-800">Semi-monthly</span>
                        <p className="text-xs text-slate-500 mt-1">Employees are paid twice a month.</p>
                    </label>
                </div>
                {errors.payFrequency && <p className="mt-2 text-sm text-red-600">{errors.payFrequency}</p>}
            </div>
            <div>
                <label htmlFor="payDay" className="block text-sm font-medium text-slate-700">Specific Payday</label>
                <p className="text-xs text-slate-500 mb-1">e.g., "25th of every month" or "Last Friday of the month".</p>
                <input type="text" name="payDay" id="payDay" value={data.payDay} onChange={onDataChange} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm ${errors.payDay ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`} />
                {errors.payDay && <p className="mt-1 text-sm text-red-600">{errors.payDay}</p>}
            </div>
        </div>
    </div>
  );
};