import React from 'react';
import type { Employee, ChangeRequest } from '../../types';

interface Props {
  employee: Employee;
  onSubmit: (requests: Omit<ChangeRequest, 'status' | 'id'>[]) => void;
  existingRequests: ChangeRequest[];
}

export const MyInfo: React.FC<Props> = ({ employee, onSubmit, existingRequests }) => {
  return (
    <div className="animate-fade-in bg-white p-8 rounded-lg shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800">My Information</h1>
      <p className="text-slate-500 mt-2">Feature coming soon. Here you will be able to view your personal details and submit change requests to HR.</p>
    </div>
  );
};
