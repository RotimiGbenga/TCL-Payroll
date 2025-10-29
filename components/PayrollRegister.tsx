
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileTextIcon } from './icons';
import { calculateMonthlyPayroll } from '../data/sampleData';
import type { Employee } from '../types';


// --- Helper Functions ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

interface PayrollRegisterProps {
    employees: Employee[];
}

export const PayrollRegister: React.FC<PayrollRegisterProps> = ({ employees }) => {

    const payrollData = useMemo(() => employees.map(emp => ({
        ...emp,
        ...calculateMonthlyPayroll(emp)
    })), [employees]);

    const totals = useMemo(() => payrollData.reduce((acc, curr) => ({
        gross: acc.gross + curr.monthlyGross,
        deductions: acc.deductions + curr.totalDeductions,
        net: acc.net + curr.netPay,
    }), { gross: 0, deductions: 0, net: 0 }), [payrollData]);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">Reports</h1>
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
                    <div className="animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Monthly Payroll Register</h2>
                                <p className="text-sm text-slate-500">For pay period: October 1 - October 31, 2026</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 transition-colors">
                                    <FileTextIcon className="w-4 h-4"/> Download PDF
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 transition-colors">
                                    <FileTextIcon className="w-4 h-4"/> Download CSV
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left font-semibold text-slate-600 p-3">Employee Name</th>
                                            <th className="text-left font-semibold text-slate-600 p-3">Employee ID</th>
                                            <th className="text-right font-semibold text-slate-600 p-3">Gross Salary</th>
                                            <th className="text-right font-semibold text-slate-600 p-3">Total Deductions</th>
                                            <th className="text-right font-semibold text-slate-600 p-3">Net Pay</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payrollData.map((emp, index) => (
                                            <tr key={emp.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="p-3 text-slate-800 font-medium">{emp.firstName} {emp.lastName}</td>
                                                <td className="p-3 text-slate-500">{emp.id}</td>
                                                <td className="p-3 text-right text-slate-700 font-mono">{formatCurrency(emp.monthlyGross)}</td>
                                                <td className="p-3 text-right text-slate-700 font-mono">{formatCurrency(emp.totalDeductions)}</td>
                                                <td className="p-3 text-right text-slate-800 font-semibold font-mono">{formatCurrency(emp.netPay)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-100 border-t-2 border-slate-200">
                                        <tr>
                                            <td colSpan={2} className="p-3 text-right font-bold text-slate-700">Totals</td>
                                            <td className="p-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(totals.gross)}</td>
                                            <td className="p-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(totals.deductions)}</td>
                                            <td className="p-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(totals.net)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};
