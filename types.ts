
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
