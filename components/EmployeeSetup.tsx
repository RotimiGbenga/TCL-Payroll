
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Employee } from '../types';
import { UserPlusIcon, FileUpIcon, SearchIcon } from './icons';

interface EmployeeSetupProps {
  employees: Employee[];
  onCompleteSetup: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
};

export const EmployeeSetup: React.FC<EmployeeSetupProps> = ({ employees, onCompleteSetup }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) {
      return employees;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(lowercasedQuery) ||
        emp.lastName.toLowerCase().includes(lowercasedQuery) ||
        emp.id.toLowerCase().includes(lowercasedQuery)
    );
  }, [employees, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">Setup Employees</h1>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Employee Roster</h2>
              <p className="text-sm text-slate-500">Add or edit your employees to get started with payroll.</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div className="relative w-full sm:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                    type="search"
                    id="employee-search"
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                 <Link
                    to="/setup/import-employees"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <FileUpIcon className="w-5 h-5" />
                    Import from CSV
                  </Link>
                  <Link
                    to="/setup/add-employee"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    Add Employee
                  </Link>
              </div>
            </div>

            {employees.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">Your employee roster is empty.</h3>
                <p className="text-sm text-slate-500 mt-1">Click "Add Employee" or "Import from CSV" to build your roster.</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">No Employees Found</h3>
                <p className="text-sm text-slate-500 mt-1">Your search for "<strong className="font-semibold text-slate-600">{searchQuery}</strong>" did not match any employees.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left font-semibold text-slate-600 p-3">Name</th>
                      <th className="text-left font-semibold text-slate-600 p-3 hidden md:table-cell">Job Title</th>
                      <th className="text-left font-semibold text-slate-600 p-3 hidden sm:table-cell">Employment Type</th>
                      <th className="text-right font-semibold text-slate-600 p-3">Annual Gross Salary</th>
                      <th className="text-right font-semibold text-slate-600 p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, index) => (
                      <tr key={emp.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-3 text-slate-800 font-medium">{emp.firstName} {emp.lastName}</td>
                        <td className="p-3 text-slate-500 hidden md:table-cell">{emp.jobTitle}</td>
                        <td className="p-3 text-slate-500 hidden sm:table-cell">{emp.employmentType}</td>
                        <td className="p-3 text-right text-slate-700 font-mono">{formatCurrency(emp.annualGrossSalary)}</td>
                        <td className="p-3 text-right">
                            <Link to={`/setup/edit-employee/${emp.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs">
                                Edit
                            </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={onCompleteSetup}
                disabled={employees.length === 0}
                className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Finish Setup & Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
