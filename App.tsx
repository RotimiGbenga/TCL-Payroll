
import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CompanyDetailsStep } from './components/CompanyDetailsStep';
import { StatutoryInfoStep } from './components/StatutoryInfoStep';
import { PensionSetupStep } from './components/PensionSetupStep';
import { PayScheduleStep } from './components/PayScheduleStep';
import { PayrollCalculationView } from './components/PayrollCalculationView';
import { StepIndicator } from './components/StepIndicator';
import { ProgressBar } from './components/ProgressBar';
import { CheckCircleIcon, CheckIcon } from './components/icons';
import type { FormData, PFA } from './types';

type PfaError = {
  id: number;
  field: 'pfaName' | 'employerCode';
};

type FormErrors = Partial<Record<keyof Omit<FormData, 'pfas'>, string>> & {
  pfaErrors?: PfaError[];
};

const steps = [
  { path: '/company', step: 1, title: 'Company Details' },
  { path: '/statutory', step: 2, title: 'Statutory Information' },
  { path: '/pension', step: 3, title: 'Pension Setup' },
  { path: '/schedule', step: 4, title: 'Pay Schedule' },
  { path: '/complete', step: 5, title: 'Complete' },
];

const TOTAL_STEPS = 4;

const initialFormData: Omit<FormData, 'pfas'> = {
  companyName: '',
  rcNumber: '',
  businessAddress: '',
  contactEmail: '',
  phoneNumber: '',
  companyLogo: null,
  firsTin: '',
  nsitfEcaCode: '',
  stateTaxId: '',
  payFrequency: '',
  payDay: '',
};

const getInitialData = (): FormData => {
  const savedData = localStorage.getItem('onboardingFormData');
  const defaultData = { ...initialFormData, pfas: [{ id: Date.now(), pfaName: '', employerCode: '' }]};
  if (!savedData) return defaultData;

  try {
    const parsed = JSON.parse(savedData);
    if (!Array.isArray(parsed.pfas) || parsed.pfas.length === 0) {
      parsed.pfas = [{ id: Date.now(), pfaName: '', employerCode: '' }];
    }
    return { ...defaultData, ...parsed, companyLogo: null };
  } catch (e) {
    console.error("Failed to parse saved form data", e);
    return defaultData;
  }
};


const App: React.FC = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>(getInitialData);
  const [hasSavedData, setHasSavedData] = useState(() => !!localStorage.getItem('onboardingFormData'));
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Effect to save form data to localStorage
  useEffect(() => {
    // We don't save the File object, user will need to re-upload.
    const dataToSave = { ...formData, companyLogo: null };
    localStorage.setItem('onboardingFormData', JSON.stringify(dataToSave));
    setHasSavedData(true);
  }, [formData]);

  // Effect to save the current step path to localStorage
  useEffect(() => {
    if (location.pathname !== '/complete' && location.pathname !== '/payroll-calculation') {
      localStorage.setItem('onboardingLastStep', location.pathname);
    }
  }, [location.pathname]);

  // Effect to navigate to the last saved step on initial load
  useEffect(() => {
    const savedStep = localStorage.getItem('onboardingLastStep');
    if (savedStep && savedStep !== location.pathname) {
      navigate(savedStep, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStepInfo = useMemo(() => 
    steps.find(s => s.path === location.pathname) || { path: location.pathname, step: 5 }, 
    [location.pathname]
  );
  const currentStep = currentStepInfo.step;
  const currentStepIndex = steps.findIndex(s => s.path === location.pathname);
  
  const isWizardStep = location.pathname !== '/payroll-calculation';


  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    // --- Step 1: Company Details Validation ---
    if (step === 1) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company Name is required.';
      }
      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = 'Contact Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address.';
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone Number is required.';
      }
    }
    // --- Step 3: Pension Setup Validation ---
    else if (step === 3) {
      const pfaErrors: PfaError[] = [];
      formData.pfas.forEach(pfa => {
        if (!pfa.pfaName.trim()) {
          pfaErrors.push({ id: pfa.id, field: 'pfaName' });
        }
        if (!pfa.employerCode.trim()) {
          pfaErrors.push({ id: pfa.id, field: 'employerCode' });
        }
      });
      if (pfaErrors.length > 0) {
        newErrors.pfaErrors = pfaErrors;
      }
    }
    // --- Step 4: Pay Schedule Validation ---
    else if (step === 4) {
      if (!formData.payFrequency) {
        newErrors.payFrequency = 'Please select a pay frequency.';
      }
      if (!formData.payDay.trim()) {
        newErrors.payDay = 'Specific Payday is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStepIndex < steps.length - 1) {
        navigate(steps[currentStepIndex + 1].path);
      }
    }
  };

  const handlePrev = () => {
    setErrors({}); // Clear errors when going back
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1].path);
    }
  };
  
  const handleClearAndRestart = () => {
    localStorage.removeItem('onboardingFormData');
    localStorage.removeItem('onboardingLastStep');
    setHasSavedData(false);
    setErrors({});
    setFormData({
      ...initialFormData,
      pfas: [{ id: Date.now(), pfaName: '', employerCode: '' }],
    });
    navigate(steps[0].path);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited
    if (errors[name as keyof FormData]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };
  
  const handleFileSelect = (file: File | null) => {
    setFormData(prev => ({ ...prev, companyLogo: file }));
  };

  const updatePfas = (pfas: PFA[]) => {
    setFormData(prev => ({...prev, pfas}));
     // Clear PFA errors when the user starts typing
    if (errors.pfaErrors) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.pfaErrors;
        return newErrors;
      });
    }
  }

  const handleSaveProgress = () => {
    // Run validation before saving
    if (!validateStep(currentStep)) return;

    setIsSaving(true);
    // We don't save the File object, user will need to re-upload.
    const dataToSave = { ...formData, companyLogo: null };
    localStorage.setItem('onboardingFormData', JSON.stringify(dataToSave));
    if (location.pathname !== '/complete') {
        localStorage.setItem('onboardingLastStep', location.pathname);
    }
    setHasSavedData(true);

    setTimeout(() => {
        setIsSaving(false);
        setShowSaveConfirmation(true);
        setTimeout(() => {
            setShowSaveConfirmation(false);
        }, 2500); // Show message for 2.5 seconds
    }, 500); // Simulate a short save duration
  };

  const stepTitles = steps.slice(0, TOTAL_STEPS).map(s => s.title);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
        {hasSavedData && currentStep <= TOTAL_STEPS && isWizardStep && (
            <button
                onClick={handleClearAndRestart}
                className="absolute top-4 right-4 text-xs text-slate-500 hover:text-red-600 underline z-10 transition-colors"
            >
                Clear progress and restart
            </button>
        )}

        {isWizardStep && (
             <div className="p-8">
                <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">Company Onboarding</h1>
                <p className="text-slate-500 text-center mb-8">Set up your company profile to get started with payroll.</p>
                
                <div className="px-4 md:px-10">
                    <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} titles={stepTitles} />
                    <div className="my-6">
                        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
                    </div>
                </div>
            </div>
        )}
       

        <div className="bg-slate-50 px-8 py-10">
          <Routes>
            <Route path="/" element={<Navigate to={steps[0].path} replace />} />
            <Route path="/company" element={<CompanyDetailsStep data={formData} onDataChange={handleChange} onFileSelect={handleFileSelect} errors={errors} />} />
            <Route path="/statutory" element={<StatutoryInfoStep data={formData} onDataChange={handleChange} />} />
            <Route path="/pension" element={<PensionSetupStep pfas={formData.pfas} onPfasChange={updatePfas} errors={errors.pfaErrors}/>} />
            <Route path="/schedule" element={<PayScheduleStep data={formData} onDataChange={handleChange} errors={errors} />} />
            <Route path="/payroll-calculation" element={<PayrollCalculationView />} />
            <Route path="/complete" element={
              <div className="text-center p-8 animate-fade-in">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Onboarding Complete!</h2>
                <p className="text-slate-600 mb-8">Your company profile has been successfully created.</p>
                <div className="flex justify-center items-center gap-4">
                     <button
                        onClick={handleClearAndRestart}
                        className="bg-slate-200 text-slate-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-300"
                    >
                        Start New Onboarding
                    </button>
                    <button
                        onClick={() => navigate('/payroll-calculation')}
                        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
                    >
                        View Sample Payroll Calculation
                    </button>
                </div>
              </div>
            } />
          </Routes>
        </div>
        
        {currentStep <= TOTAL_STEPS && isWizardStep && (
          <div className="flex justify-between items-center p-6 bg-white border-t border-slate-200">
            <div>
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
            </div>
            
            <div className="relative">
                <button
                    onClick={handleSaveProgress}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50 transition-colors"
                >
                    {isSaving ? 'Saving...' : 'Save Progress'}
                </button>
                 {showSaveConfirmation && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-md shadow-lg animate-fade-in whitespace-nowrap flex items-center gap-1.5">
                        <CheckIcon className="w-3.5 h-3.5" />
                        Progress Saved!
                    </div>
                )}
            </div>

            <div>
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {currentStep === TOTAL_STEPS ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
