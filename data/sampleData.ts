
import type { Employee } from '../types';

// --- Sample Data ---
export const sampleEmployees: Employee[] = [
    { 
        id: 'EMP001', 
        firstName: 'Adekunle',
        lastName: 'Adebayo',
        jobTitle: 'Senior Software Engineer', 
        annualGrossSalary: 6000000, 
        annualRent: 1200000, 
        contributesToNHF: true, 
        loanDeduction: 25000, 
        salaryComponents: { basic: 0.5, housing: 0.3, transport: 0.2 },
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        contactAddress: '123 Tech Avenue, Lagos',
        email: 'adekunle.a@example.com',
        phoneNumber: '08012345678',
        department: 'Technology',
        employmentType: 'Full-time',
        dateOfHire: '2020-01-20',
        workLocation: 'Lagos Head Office',
        tin: '12345678-0001',
        pfa: 'Stanbic IBTC Pension Managers',
        rsaPin: 'PEN123456789012',
    },
    { 
        id: 'EMP002', 
        firstName: 'Chiamaka',
        lastName: 'Okoro', 
        jobTitle: 'Product Manager', 
        annualGrossSalary: 4800000, 
        annualRent: 800000, 
        contributesToNHF: true, 
        loanDeduction: 0, 
        salaryComponents: { basic: 0.5, housing: 0.3, transport: 0.2 },
        dateOfBirth: '1992-11-22',
        gender: 'Female',
        contactAddress: '456 Innovation Drive, Abuja',
        email: 'chiamaka.o@example.com',
        phoneNumber: '08087654321',
        department: 'Product',
        employmentType: 'Full-time',
        dateOfHire: '2021-03-15',
        workLocation: 'Abuja Office',
        tin: '23456789-0001',
        pfa: 'ARM Pension Managers',
        rsaPin: 'PEN234567890123',
    },
    { 
        id: 'EMP003', 
        firstName: 'Emeka',
        lastName: 'Nwosu', 
        jobTitle: 'Lead Designer', 
        annualGrossSalary: 7500000, 
        annualRent: 1500000, 
        contributesToNHF: false, 
        loanDeduction: 50000, 
        salaryComponents: { basic: 0.4, housing: 0.35, transport: 0.25 },
        dateOfBirth: '1988-08-10',
        gender: 'Male',
        contactAddress: '789 Creative Lane, Port Harcourt',
        email: 'emeka.n@example.com',
        phoneNumber: '08098765432',
        department: 'Design',
        employmentType: 'Full-time',
        dateOfHire: '2019-06-01',
        workLocation: 'Remote',
        tin: '34567890-0001',
        pfa: 'Stanbic IBTC Pension Managers',
        rsaPin: 'PEN345678901234',
    },
    { 
        id: 'EMP004', 
        firstName: 'Fatima',
        lastName: 'Aliyu', 
        jobTitle: 'HR Specialist', 
        annualGrossSalary: 3600000, 
        annualRent: 600000, 
        contributesToNHF: true, 
        // FIX: Corrected typo from loanDDeduction to loanDeduction
        loanDeduction: 10000, 
        salaryComponents: { basic: 0.6, housing: 0.2, transport: 0.2 },
        dateOfBirth: '1995-02-28',
        gender: 'Female',
        contactAddress: '101 People Street, Kano',
        email: 'fatima.a@example.com',
        phoneNumber: '08011223344',
        department: 'Human Resources',
        employmentType: 'Full-time',
        dateOfHire: '2022-08-01',
        workLocation: 'Kano Office',
        tin: '45678901-0001',
        pfa: 'Premium Pension Limited',
        rsaPin: 'PEN456789012345',
    },
];


// --- Comprehensive Payroll Calculation Logic ---
export const calculatePayroll = (employee: Employee) => {
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
  const monthlyLoan = employee.loanDeduction || 0;

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

// --- Simplified Payroll Calculation Logic for Register/Dashboard ---
export const calculateMonthlyPayroll = (employee: Employee) => {
    const { monthlyGross, totalMonthlyDeductions, netTakeHomePay } = calculatePayroll(employee);
    return { 
        monthlyGross, 
        totalDeductions: totalMonthlyDeductions, 
        netPay: netTakeHomePay 
    };
};