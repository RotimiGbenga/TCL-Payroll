
export interface PFA {
  id: number;
  pfaName: string;
  employerCode: string;
}

export interface FormData {
  companyName: string;
  rcNumber: string;
  businessAddress: string;

  contactEmail: string;
  phoneNumber: string;
  companyLogo: File | null;
  firsTin: string;
  nsitfEcaCode: string;
  stateTaxId: string;
  pfas: PFA[];
  payFrequency: 'monthly' | 'bi-weekly' | '';
  payDay: string;
}

export interface Employee {
  // Personal Info
  id: string; // Employee ID
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  contactAddress: string;
  email: string;
  phoneNumber: string;
  photo?: File | null; // For upload, not stored in localStorage

  // Job Info
  jobTitle: string;
  department: string;
  employmentType: 'Full-time' | 'Contract' | 'Intern' | '';
  dateOfHire: string;
  workLocation: string;

  // Salary & Compensation
  annualGrossSalary: number;
  salaryComponents: {
    basic: number; // percentage
    housing: number; // percentage
    transport: number; // percentage
  };

  // Statutory Details
  tin: string;
  annualRent: number;
  pfa: string; // PFA Name
  rsaPin: string;
  contributesToNHF: boolean;

  // Other
  loanDeduction?: number; // Optional loan
}
