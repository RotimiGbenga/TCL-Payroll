import React from 'react';
import type { FormData } from '../types';
import { InfoIcon } from './icons';

interface Props {
  data: FormData;
  onDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StatutoryInfoStep: React.FC<Props> = ({ data, onDataChange }) => {
  return (
    <div className="animate-fade-in">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Step 2: Statutory Information</h3>
        <div className="space-y-6">
            <div>
                <div className="flex items-center space-x-2 mb-1">
                    <label htmlFor="firsTin" className="block text-sm font-medium text-slate-700">FIRS TIN</label>
                    <div className="relative group">
                        <div tabIndex={0} role="button" aria-label="More info on FIRS TIN" className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
                            <InfoIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <span id="firs-tooltip" role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 z-10 w-64 p-2 mb-2 text-xs leading-tight text-white transform bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                            A unique 10 or 14-digit number issued by the Federal Inland Revenue Service.
                            <svg className="absolute left-1/2 -translate-x-1/2 top-full" width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L0 0H16L8 8Z" fill="#1e293b"/></svg>
                        </span>
                    </div>
                </div>
                <input type="text" name="firsTin" id="firsTin" value={data.firsTin} onChange={onDataChange} aria-describedby="firs-tooltip" className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <div className="flex items-center space-x-2 mb-1">
                    <label htmlFor="nsitfEcaCode" className="block text-sm font-medium text-slate-700">NSITF ECA Code</label>
                    <div className="relative group">
                         <div tabIndex={0} role="button" aria-label="More info on NSITF ECA Code" className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
                            <InfoIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <span id="nsitf-tooltip" role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 z-10 w-64 p-2 mb-2 text-xs leading-tight text-white transform bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                            The Employer Contribution Account Code is found on your NSITF Certificate of Registration.
                            <svg className="absolute left-1/2 -translate-x-1/2 top-full" width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L0 0H16L8 8Z" fill="#1e293b"/></svg>
                        </span>
                    </div>
                </div>
                <input type="text" name="nsitfEcaCode" id="nsitfEcaCode" value={data.nsitfEcaCode} onChange={onDataChange} aria-describedby="nsitf-tooltip" className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                 <div className="flex items-center space-x-2 mb-1">
                    <label htmlFor="stateTaxId" className="block text-sm font-medium text-slate-700">State-Specific Tax ID (e.g., LIRS ID)</label>
                    <div className="relative group">
                        <div tabIndex={0} role="button" aria-label="More info on State-Specific Tax ID" className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
                            <InfoIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <span id="state-tax-tooltip" role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 z-10 w-64 p-2 mb-2 text-xs leading-tight text-white transform bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                           The Pay-As-You-Earn (PAYE) ID from your state's tax authority (e.g., LIRS for Lagos State).
                           <svg className="absolute left-1/2 -translate-x-1/2 top-full" width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L0 0H16L8 8Z" fill="#1e293b"/></svg>
                        </span>
                    </div>
                </div>
                <input type="text" name="stateTaxId" id="stateTaxId" value={data.stateTaxId} onChange={onDataChange} aria-describedby="state-tax-tooltip" className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
        </div>
    </div>
  );
};