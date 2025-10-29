
import React from 'react';
import { CalculatorIcon } from './icons';

// --- Helper Functions ---

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

// --- Sample Data ---
const sampleEmployee = {
  id: 'EMP001',
  name: 'Adekunle Adebayo',
  jobTitle: 'Senior Software Engineer',
  annualGrossSalary: 6_000_000,
  annualRent: 1_200_000,
  contributesToNHF: true,
  loanDeduction: 25_000,
  salaryComponents: {
    basic: 0.5, // 50%
    housing: 0.3, // 30%
    transport: 0.2, // 20%
  },
};

// --- Payroll Calculation Logic ---

const calculatePayroll = (employee: typeof sampleEmployee) => {
  // Annual calculations
  const annualGross = employee.annualGrossSalary;
  const annualBasic = annualGross * employee.salaryComponents.basic;
  const annualHousing = annualGross * employee.salaryComponents.housing;
  const annualTransport = annualGross * employee.salaryComponents.transport;

  const annualPension = annualGross * 0.08;
  const annualNHF = employee.contributesToNHF ? annualBasic * 0.025 : 0;
  
  const totalPreTaxDeductions = annualPension + annualNHF;

  const annualRentRelief = Math.min(employee.annualRent * 0.20, 500000);

  const annualTaxableIncome = Math.max(0, annualGross - totalPreTaxDeductions - annualRentRelief);

  // 2026 Tax Bands Calculation
  let tax = 0;
  let remainingTaxable = annualTaxableIncome;
  const taxBands = [
    { limit: 800000, rate: 0.00, amount: 0 },
    { limit: 2200000, rate: 0.15, amount: 0 },
    { limit: 5000000, rate: 0.25, amount: 0 },
    { limit: 12000000, rate: 0.35, amount: 0 },
    { limit: Infinity, rate: 0.45, amount: 0 },
  ];
  
  let previousLimit = 0;
  for (const band of taxBands) {
      if (remainingTaxable > 0) {
          const taxableInBand = Math.min(remainingTaxable, band.limit - previousLimit);
          band.amount = taxableInBand * band.rate;
          tax += band.amount;
          remainingTaxable -= taxableInBand;
          previousLimit = band.limit;
      } else {
          break;
      }
  }

  const totalAnnualPAYE = tax;
  const monthlyPAYE = totalAnnualPAYE / 12;

  // Monthly calculations
  const monthlyGross = annualGross / 12;
  const monthlyBasic = annualBasic / 12;
  const monthlyHousing = annualHousing / 12;
  const monthlyTransport = annualTransport / 12;
  const monthlyPension = annualPension / 12;
  const monthlyNHF = annualNHF / 12;
  const monthlyLoan = employee.loanDeduction;

  const totalMonthlyDeductions = monthlyPension + monthlyNHF + monthlyPAYE + monthlyLoan;
  const netTakeHomePay = monthlyGross - totalMonthlyDeductions;

  return {
    monthlyGross,
    monthlyBasic,
    monthlyHousing,
    monthlyTransport,
    monthlyPension,
    monthlyNHF,
    monthlyPAYE,
    monthlyLoan,
    totalMonthlyDeductions,
    netTakeHomePay,
    annualGross,
    totalPreTaxDeductions,
    annualRentRelief,
    annualTaxableIncome,
    taxBands,
    totalAnnualPAYE,
  };
};

const payroll = calculatePayroll(sampleEmployee);

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


export const PayrollCalculationView: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-full">
                    <CalculatorIcon className="w-6 h-6 text-indigo-600"/>
                </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-800">Payroll Calculation Details</h2>
                    <p className="text-sm text-slate-500">For {sampleEmployee.name} - {sampleEmployee.jobTitle}</p>
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
    );
};
