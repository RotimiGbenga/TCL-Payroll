import React from 'react';
import type { Employee, FormData as CompanyData } from '../../types';

interface Props {
  employee: Employee;
  companyData: CompanyData;
}

export const PayslipDetail: React.FC<Props> = ({ employee, companyData }) => {
  return (
    <div className="animate-fade-in bg-white p-8 rounded-lg shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800">Payslip History</h1>
      <p className="text-slate-500 mt-2">Feature coming soon. Here you will be able to view and download all your past payslips.</p>
    </div>
  );
};
