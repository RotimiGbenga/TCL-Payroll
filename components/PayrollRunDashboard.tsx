import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SpinnerIcon, CheckCircleIcon, CircleIcon, CheckIcon } from './icons';
import { calculateMonthlyPayroll } from '../data/sampleData';
import type { Employee, LeaveRequest, ChangeRequest } from '../types';
import { AdminApprovalQueue } from './ess/AdminApprovalQueue';

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

// --- Initial Data ---
const initialChecklist = [
    { id: 1, text: 'Confirm New Hires', completed: false },
    { id: 2, text: 'Update Salary Changes', completed: false },
    { id: 3, text: 'Input Bonuses/Commissions', completed: false },
    { id: 4, text: 'Verify Absences', completed: false },
];

interface PayrollRunDashboardProps {
    employees: Employee[];
    onRestart: () => void;
    leaveRequests: LeaveRequest[];
    changeRequests: ChangeRequest[];
    onUpdateRequestStatus: (id: number, status: 'approved' | 'rejected', type: 'leave' | 'change') => void;
}

export const PayrollRunDashboard: React.FC<PayrollRunDashboardProps> = ({ employees, onRestart, leaveRequests, changeRequests, onUpdateRequestStatus }) => {
    const [payrollStatus, setPayrollStatus] = useState<'Not Started' | 'Processing' | 'Completed'>('Not Started');
    const [checklist, setChecklist] = useState(initialChecklist);

    const payrollData = useMemo(() => employees.map(emp => ({
        ...emp,
        ...calculateMonthlyPayroll(emp)
    })), [employees]);

    const totals = useMemo(() => payrollData.reduce((acc, curr) => ({
        gross: acc.gross + curr.monthlyGross,
        deductions: acc.deductions + curr.totalDeductions,
        net: acc.net + curr.netPay,
    }), { gross: 0, deductions: 0, net: 0 }), [payrollData]);

    const handleRunPayroll = () => {
        setPayrollStatus('Processing');
        setTimeout(() => {
            setPayrollStatus('Completed');
        }, 2500); // Simulate processing time
    };
    
    const handleToggleChecklistItem = (id: number) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    const allTasksCompleted = useMemo(() => checklist.every(item => item.completed), [checklist]);

    useEffect(() => {
        // Reset payroll status if checklist changes after completion
        if (payrollStatus === 'Completed') {
            setPayrollStatus('Not Started');
        }
    }, [checklist, payrollStatus]);

    const getButtonContent = () => {
        switch (payrollStatus) {
            case 'Processing':
                return (
                    <>
                        <SpinnerIcon className="w-5 h-5 animate-spin"/>
                        Processing...
                    </>
                );
            case 'Completed':
                return (
                    <>
                        <CheckCircleIcon className="w-5 h-5"/>
                        Payroll Completed
                    </>
                );
            case 'Not Started':
            default:
                return 'Run Payroll';
        }
    };
    
    const pendingLeaveRequests = useMemo(() => leaveRequests.filter(r => r.status === 'pending'), [leaveRequests]);
    const pendingChangeRequests = useMemo(() => changeRequests.filter(r => r.status === 'pending'), [changeRequests]);


    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                     <div className="flex items-center space-x-6">
                         <Link
                            to="/employees"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            View All Employees
                        </Link>
                         <Link
                            to="/reports"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            View Reports
                        </Link>
                         <Link
                            to="/reports/payroll-register"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Payroll Register
                        </Link>
                         <Link
                            to="/login"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Employee Login
                        </Link>
                        <button
                            onClick={onRestart}
                            className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
                        >
                            Reset All Data
                        </button>
                    </div>
                </div>
            </header>

            <main className="py-8">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-fade-in space-y-8">
                        {/* Header */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">October 2026 Payroll</h2>
                            <p className="text-sm text-slate-500">Review details below and run payroll for the current period.</p>
                        </div>
                        
                        {/* Approval Queue */}
                        {(pendingLeaveRequests.length > 0 || pendingChangeRequests.length > 0) && (
                            <AdminApprovalQueue 
                                leaveRequests={pendingLeaveRequests}
                                changeRequests={pendingChangeRequests}
                                employees={employees}
                                onUpdateRequestStatus={onUpdateRequestStatus}
                            />
                        )}


                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <Link to="/employees" className="block bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                                <p className="text-sm font-medium text-slate-500">Total Employees</p>
                                <p className="text-2xl font-bold text-slate-800">{employees.length}</p>
                            </Link>
                             <Link to="/reports/payroll-register" className="block bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                                <p className="text-sm font-medium text-slate-500">Gross Payroll Amount</p>
                                <p className="text-2xl font-bold text-slate-800">{formatCurrency(totals.gross)}</p>
                            </Link>
                            <Link to="/reports/payroll-register" className="block bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                                <p className="text-sm font-medium text-slate-500">Total Deductions</p>
                                <p className="text-2xl font-bold text-slate-800">{formatCurrency(totals.deductions)}</p>
                            </Link>
                            <Link to="/reports/payroll-register" className="block bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                                <p className="text-sm font-medium text-slate-500">Net Pay</p>
                                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totals.net)}</p>
                            </Link>
                        </div>

                        {/* Checklist and Run Payroll Button */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Pre-payroll Checklist</h3>
                                <div className="space-y-3">
                                    {checklist.map(item => (
                                        <div key={item.id} onClick={() => handleToggleChecklistItem(item.id)} className="flex items-center cursor-pointer group">
                                            {item.completed ? (
                                                <CheckCircleIcon className="w-6 h-6 text-green-500"/>
                                            ) : (
                                                <CircleIcon className="w-6 h-6 text-slate-300 group-hover:text-slate-400"/>
                                            )}
                                            <span className={`ml-3 text-sm ${item.completed ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}`}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                 <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to Go?</h3>
                                 <p className="text-sm text-slate-500 mb-4">
                                     {allTasksCompleted ? "All checks are complete. You can now run the payroll." : "Complete all checklist items to proceed."}
                                 </p>
                                <button 
                                    onClick={handleRunPayroll} 
                                    disabled={!allTasksCompleted || payrollStatus !== 'Not Started'}
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white rounded-lg shadow-md transition-all duration-300
                                        ${payrollStatus === 'Completed' ? 'bg-green-600' : 'bg-indigo-600'}
                                        ${!allTasksCompleted || payrollStatus !== 'Not Started' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                >
                                   {getButtonContent()}
                                </button>
                                 {payrollStatus === 'Completed' && <p className="text-xs text-green-700 mt-2">Payroll for October 2026 has been successfully processed.</p>}
                            </div>
                        </div>


                        {/* Employee List */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-slate-800">Payroll Details</h3>
                                <Link to="/employees" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                    View Full Employee List &rarr;
                                </Link>
                            </div>
                             <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="text-left font-semibold text-slate-600 p-3">Employee Name</th>
                                                <th className="text-right font-semibold text-slate-600 p-3">Gross Salary</th>
                                                <th className="text-right font-semibold text-slate-600 p-3">Total Deductions</th>
                                                <th className="text-right font-semibold text-slate-600 p-3">Net Pay</th>
                                                <th className="text-center font-semibold text-slate-600 p-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payrollData.map((emp, index) => (
                                                <tr key={emp.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                    <td className="p-3 text-slate-800 font-medium">{emp.firstName} {emp.lastName}</td>
                                                    <td className="p-3 text-right text-slate-700 font-mono">{formatCurrency(emp.monthlyGross)}</td>
                                                    <td className="p-3 text-right text-slate-700 font-mono">{formatCurrency(emp.totalDeductions)}</td>
                                                    <td className="p-3 text-right text-slate-800 font-semibold font-mono">{formatCurrency(emp.netPay)}</td>
                                                    <td className="p-3 text-center">
                                                        <Link to={`/employee-detail/${emp.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs">
                                                            View Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-100 border-t-2 border-slate-200">
                                            <tr>
                                                <td className="p-3 text-left font-bold text-slate-700">Totals</td>
                                                <td className="p-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(totals.gross)}</td>
                                                <td className="p-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(totals.deductions)}</td>
                                                <td className="p-3 text-right font-bold text-slate-800 font-mono">{formatCurrency(totals.net)}</td>
                                                <td className="p-3"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};