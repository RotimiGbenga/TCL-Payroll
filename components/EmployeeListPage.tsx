import React from 'react';
import { Link } from 'react-router-dom';
import type { Employee } from '../types';

interface EmployeeListPageProps {
    employees: Employee[];
}

export const EmployeeListPage: React.FC<EmployeeListPageProps> = ({ employees }) => {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">All Employees</h1>
                    <Link
                        to="/dashboard"
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </header>
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left font-semibold text-slate-600 p-3">Name</th>
                                        <th className="text-left font-semibold text-slate-600 p-3">Employee ID</th>
                                        <th className="text-left font-semibold text-slate-600 p-3">Job Title</th>
                                        <th className="text-left font-semibold text-slate-600 p-3">Department</th>
                                        <th className="text-left font-semibold text-slate-600 p-3">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((emp, index) => (
                                        <tr key={emp.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                            <td className="p-3 text-slate-800 font-medium">{emp.firstName} {emp.lastName}</td>
                                            <td className="p-3 text-slate-500">{emp.id}</td>
                                            <td className="p-3 text-slate-500">{emp.jobTitle}</td>
                                            <td className="p-3 text-slate-500">{emp.department}</td>
                                            <td className="p-3 text-slate-500 hover:text-indigo-600"><a href={`mailto:${emp.email}`}>{emp.email}</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
