import React from 'react';
import { TechwayLogoIcon, CheckCircleIcon, FileTextIcon, UserPlusIcon } from './icons';

interface Props {
  onStart: () => void;
}

const FeatureCard: React.FC<{ icon: React.FC<any>, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="text-center p-6">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mx-auto">
            <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-base text-slate-500">{description}</p>
    </div>
);

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="bg-white antialiased">
      <div className="relative isolate">
        <svg className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-slate-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="1f932ae7-37de-4c0a-a8b0-166236b04802" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" className="overflow-visible fill-slate-50">
            <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" strokeWidth="0" />
          </svg>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#1f932ae7-37de-4c0a-a8b0-166236b04802)" />
        </svg>

        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                <TechwayLogoIcon className="h-8 w-auto text-indigo-600" />
                <span className="text-xl font-bold text-slate-800">Techway</span>
              </a>
            </div>
          </nav>
        </header>
        
        <main>
            <div className="relative px-6 lg:px-8">
                <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl animate-fade-in" style={{ animationDelay: '100ms' }}>
                            Modern Payroll for Nigerian Businesses
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-slate-600 animate-fade-in" style={{ animationDelay: '300ms' }}>
                            Simplify your payroll, ensure compliance with Nigerian tax laws, and empower your employees with our intuitive, powerful platform.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
                            <button
                                onClick={onStart}
                                className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all transform hover:scale-105"
                            >
                                Set Up Your Company
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">Payroll, Perfected</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to run payroll confidently</p>
                        <p className="mt-6 text-lg leading-8 text-slate-600">
                           Our platform automates complex calculations and provides the tools you need to stay compliant and efficient.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                           <FeatureCard 
                                icon={CheckCircleIcon} 
                                title="Automated Calculations"
                                description="Accurate, real-time calculations for PAYE tax, pensions, NHF, and other statutory deductions based on the latest 2026 Nigerian tax law."
                           />
                           <FeatureCard 
                                icon={FileTextIcon} 
                                title="Compliance Reports"
                                description="Generate and download statutory reports like PAYE & Pension remittance schedules, and bank payment advice in just a few clicks."
                           />
                           <FeatureCard 
                                icon={UserPlusIcon} 
                                title="Employee Self-Service"
                                description="Empower your team with a portal to view payslips, manage personal information, and request leave, reducing HR workload."
                           />
                        </div>
                    </div>
                </div>
            </div>
        </main>

         <footer className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-8">
                <p className="text-center text-xs leading-5 text-slate-500">
                &copy; 2024 Techway. All rights reserved.
                </p>
            </div>
        </footer>
      </div>
    </div>
  );
};
