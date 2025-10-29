import React, { useState } from 'react';
import type { Employee } from '../types';

interface Props {
  employees: Employee[];
  onLogin: (employeeId: string) => void;
}

export const EmployeeLogin: React.FC<Props> = ({ employees, onLogin }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployeeId) {
      onLogin(selectedEmployeeId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Employee Self-Service Portal</h1>
          <p className="text-slate-500 text-center mb-8">Select your profile to continue.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="employee-select" className="block text-sm font-medium text-slate-700 mb-1">
                Select Employee
              </label>
              <select
                id="employee-select"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                <option value="" disabled>-- Choose your name --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.id})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={!selectedEmployeeId}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};