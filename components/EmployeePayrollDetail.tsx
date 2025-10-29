
import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { CalculatorIcon } from './icons';
import { calculatePayroll } from '../data/sampleData';
import type { Employee } from '../types';


// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

// --- Sub-components for clarity ---
const CalculationRow: React.FC<{ label: string; value: string | number; isBold?: boolean; isSubtle?: boolean; isHighlighted?: boolean; isTitle?: boolean; className?: string }> = ({ label, value, isBold, isSubtle, isHighlighted, isTitle, className = '' }) => (
    <div className={`flex justify-between items-center py-3 px-4 ${isTitle ? 'bg-slate-100 rounded-t-lg' : ''} ${className}`}>
        <p className={`text-sm ${isBold ? 'font-semibold text-slate-800' : isSubtle ? 'text-slate-500 pl-4' : 'text-slate-600'}`}>
            {label}
        </p>
        <p className={`text-sm font-medium ${isHighlighted ? 'text-green-600' : isBold ? 'text-slate-900' : 'text-slate-700'}`}>
            {typeof value === 'number' ? formatCurrency(value) : value}
        </p>
    </div>
);

interface EmployeePayrollDetailProps {
    employees: Employee[];
}

export const EmployeePayrollDetail: React.FC<EmployeePayrollDetailProps> = ({ employees }) => {
    const { employeeId } = useParams();
    const employee = employees.find(e => e.id === employeeId);

    if (!employee) {
        return <Navigate to="/dashboard" replace />;
    }
    
    const payroll = calculatePayroll(employee);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">Employee Payroll Details</h1>
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
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-100 p-2 rounded-full">
                                <CalculatorIcon className="w-6 h-6 text-indigo-600"/>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Payroll Calculation Details</h2>
                                <p className="text-sm text-slate-500">For {employee.firstName} {employee.lastName} - {employee.jobTitle}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Left Column: Earnings & Deductions */}
                            <div className="space-y-6">
                                {/* Earnings */}
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <CalculationRow label="Earnings (Monthly)" value="" isTitle isBold />
                                    <CalculationRow label="Basic Salary" value={payroll.monthlyBasic} isSubtle />
                                    <CalculationRow label="Housing Allowance" value={payroll.monthlyHousing} isSubtle />
                                    <CalculationRow label="Transport Allowance" value={payroll.monthlyTransport} isSubtle />
                                    <CalculationRow label="Total Earnings (Gross)" value={payroll.monthlyGross} isBold className="border-t border-slate-200" />
                                </div>

                                {/* Deductions */}
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <CalculationRow label="Deductions (Monthly)" value="" isTitle isBold />
                                    <p className="px-4 pt-2 text-xs font-semibold text-slate-500 uppercase">Statutory (Pre-tax)</p>
                                    <CalculationRow label="Pension (8% of Gross)" value={payroll.monthlyPension} isSubtle />
                                    <CalculationRow label="NHF (2.5% of Basic)" value={payroll.monthlyNHF} isSubtle />
                                    <p className="px-4 pt-2 text-xs font-semibold text-slate-500 uppercase">Tax</p>
                                    <CalculationRow label="PAYE (Tax)" value={payroll.monthlyPAYE} isSubtle />
                                    <p className="px-4 pt-2 text-xs font-semibold text-slate-500 uppercase">Other</p>
                                    <CalculationRow label="Loan Repayment" value={payroll.monthlyLoan} isSubtle />
                                    <CalculationRow label="Total Deductions" value={payroll.totalMonthlyDeductions} isBold className="border-t border-slate-200" />
                                </div>
                            </div>

                            {/* Right Column: Tax Breakdown */}
                            <div className="space-y-6">
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <CalculationRow label="PAYE Tax Calculation (2026 Law)" value="" isTitle isBold />
                                    <CalculationRow label="Annual Gross Income" value={payroll.annualGross} />
                                    <CalculationRow label="Less: Pre-tax Deductions" value={`(${formatCurrency(payroll.totalPreTaxDeductions)})`} />
                                    <CalculationRow label="Less: Annual Rent Relief" value={`(${formatCurrency(payroll.annualRentRelief)})`} />
                                    <CalculationRow label="Annual Taxable Income" value={payroll.annualTaxableIncome} isBold className="border-y border-slate-200 bg-slate-50" />
                                    
                                    <div className="px-4 pt-4 pb-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Tax Bands Breakdown</p>
                                        {payroll.taxBands.filter(b => b.amount > 0).map((band, i) => (
                                            <CalculationRow 
                                                key={i} 
                                                label={`Tax @ ${band.rate * 100}%`} 
                                                value={band.amount} 
                                                isSubtle 
                                                className="py-2"
                                            />
                                        ))}
                                    </div>

                                    <CalculationRow label="Total Annual PAYE" value={payroll.totalAnnualPAYE} isBold className="border-t border-slate-200" />
                                    <CalculationRow label="Monthly PAYE (Annual / 12)" value={payroll.monthlyPAYE} isBold />
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="md:col-span-2">
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 text-center">
                                    <p className="text-sm font-medium text-slate-500 uppercase">Net Take-Home Pay (Monthly)</p>
                                    <p className="text-4xl font-bold text-indigo-600 mt-2">{formatCurrency(payroll.netTakeHomePay)}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
