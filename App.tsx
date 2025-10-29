import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CompanyDetailsStep } from './components/CompanyDetailsStep';
import { StatutoryInfoStep } from './components/StatutoryInfoStep';
import { PensionSetupStep } from './components/PensionSetupStep';
import { PayScheduleStep } from './components/PayScheduleStep';
import { SalaryStructureSetup } from './components/SalaryStructureSetup';
import { EmployeeSetup } from './components/EmployeeSetup';
import { AddEmployeeForm } from './components/AddEmployeeForm';
import { EmployeeImport } from './components/EmployeeImport';
import { PayrollRunDashboard } from './components/PayrollRunDashboard';
import { PayrollRegister } from './components/PayrollRegister';
import { StepIndicator } from './components/StepIndicator';
import { ProgressBar } from './components/ProgressBar';
import { CheckCircleIcon, CheckIcon } from './components/icons';
import type { FormData, PFA, Employee, LeaveRequest, ChangeRequest } from './types';
import { EmployeePayrollDetail } from './components/EmployeePayrollDetail';
import { sampleEmployees } from './data/sampleData';
import { ComplianceReportsDashboard } from './components/ComplianceReportsDashboard';
import { EmployeeLogin } from './components/EmployeeLogin';
import { ESSLayout } from './components/ess/ESSLayout';
import { ESSDashboard } from './components/ess/ESSDashboard';
import { PayslipDetail } from './components/ess/PayslipDetail';
import { LeaveRequest as LeaveRequestPage } from './components/ess/LeaveRequest';
import { MyInfo } from './components/ess/MyInfo';
import { EmployeeListPage } from './components/EmployeeListPage';
import { LandingPage } from './components/LandingPage';


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

const initialFormData: Omit<FormData, 'pfas' | 'defaultSalaryComponents'> = {
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
  const defaultData = { 
    ...initialFormData, 
    pfas: [{ id: Date.now(), pfaName: '', employerCode: '' }],
    defaultSalaryComponents: { basic: 50, housing: 30, transport: 20 }
  };
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

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    const savedState = localStorage.getItem(key);
    return savedState ? JSON.parse(savedState) : defaultValue;
};


const App: React.FC = () => {
  const [hasStartedOnboarding, setHasStartedOnboarding] = useState(() => getInitialState('hasStartedOnboarding', false));
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => getInitialState('onboardingCompleted', false));
  const [salaryStructureCompleted, setSalaryStructureCompleted] = useState(() => getInitialState('salaryStructureCompleted', false));
  const [setupCompleted, setSetupCompleted] = useState(() => getInitialState('setupCompleted', false));
  
  // Data state
  const [employees, setEmployees] = useState<Employee[]>(() => getInitialState('employees', sampleEmployees));
  const [formData, setFormData] = useState<FormData>(getInitialData);
  
  // ESS State
  const [loggedInEmployee, setLoggedInEmployee] = useState<Employee | null>(() => getInitialState('loggedInEmployee', null));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => getInitialState('leaveRequests', []));
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(() => getInitialState('changeRequests', []));
  
  // UI State
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasSavedData, setHasSavedData] = useState(() => !!localStorage.getItem('onboardingFormData'));
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // --- Generic State Savers to localStorage ---
  const useLocalStorageSaver = <T,>(key: string, state: T) => {
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
  };
  
  useLocalStorageSaver('onboardingFormData', { ...formData, companyLogo: null });
  useLocalStorageSaver('employees', employees);
  useLocalStorageSaver('hasStartedOnboarding', hasStartedOnboarding);
  useLocalStorageSaver('onboardingCompleted', onboardingCompleted);
  useLocalStorageSaver('salaryStructureCompleted', salaryStructureCompleted);
  useLocalStorageSaver('setupCompleted', setupCompleted);
  useLocalStorageSaver('loggedInEmployee', loggedInEmployee);
  useLocalStorageSaver('leaveRequests', leaveRequests);
  useLocalStorageSaver('changeRequests', changeRequests);

  // Effect to set completion status and save current step path to localStorage
  useEffect(() => {
    if (location.pathname === '/complete' && !onboardingCompleted) {
        setOnboardingCompleted(true);
        localStorage.removeItem('onboardingLastStep');
    } else if (location.pathname !== '/complete' && !onboardingCompleted) {
       const currentStepInfo = steps.find(s => s.path === location.pathname);
       if(currentStepInfo && currentStepInfo.step <= TOTAL_STEPS) {
         localStorage.setItem('onboardingLastStep', location.pathname);
       }
    }
  }, [location.pathname, onboardingCompleted]);

  // Effect to navigate to the last saved step on initial load
  useEffect(() => {
    if (!hasStartedOnboarding || onboardingCompleted || loggedInEmployee) return;
    
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

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required.';
      if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact Email is required.';
      else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Please enter a valid email address.';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required.';
    }
    else if (step === 3) {
      const pfaErrors: PfaError[] = [];
      formData.pfas.forEach(pfa => {
        if (!pfa.pfaName.trim()) pfaErrors.push({ id: pfa.id, field: 'pfaName' });
        if (!pfa.employerCode.trim()) pfaErrors.push({ id: pfa.id, field: 'employerCode' });
      });
      if (pfaErrors.length > 0) newErrors.pfaErrors = pfaErrors;
    }
    else if (step === 4) {
      if (!formData.payFrequency) newErrors.payFrequency = 'Please select a pay frequency.';
      if (!formData.payDay.trim()) newErrors.payDay = 'Specific Payday is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStepIndex < steps.length - 1) navigate(steps[currentStepIndex + 1].path);
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStepIndex > 0) navigate(steps[currentStepIndex - 1].path);
  };
  
  const handleClearAndRestart = () => {
    localStorage.clear();
    setHasStartedOnboarding(false);
    setHasSavedData(false);
    setErrors({});
    setFormData(getInitialData());
    setEmployees(sampleEmployees);
    setOnboardingCompleted(false);
    setSalaryStructureCompleted(false);
    setSetupCompleted(false);
    setLoggedInEmployee(null);
    setLeaveRequests([]);
    setChangeRequests([]);
    navigate('/');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };
  
  const handleFileSelect = (file: File | null) => setFormData(prev => ({ ...prev, companyLogo: file }));

  const updatePfas = (pfas: PFA[]) => {
    setFormData(prev => ({...prev, pfas}));
    if (errors.pfaErrors) setErrors(prev => ({ ...prev, pfaErrors: undefined }));
  }

  const handleSaveProgress = () => {
    if (!validateStep(currentStep)) return;
    setIsSaving(true);
    if (location.pathname !== '/complete') localStorage.setItem('onboardingLastStep', location.pathname);
    setHasSavedData(true);
    setTimeout(() => {
        setIsSaving(false);
        setShowSaveConfirmation(true);
        setTimeout(() => setShowSaveConfirmation(false), 2500);
    }, 500);
  };

  const handleCompleteSalaryStructure = (components: { basic: number; housing: number; transport: number; }) => {
    setFormData(prev => ({ ...prev, defaultSalaryComponents: components }));
    setSalaryStructureCompleted(true);
    navigate('/setup/employees');
  };

  // --- Employee Management Handlers ---
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [...prev, newEmployee]);
    navigate('/setup/employees');
  };

  const handleAddEmployees = (newEmployees: Employee[]) => {
    const existingIds = new Set(employees.map(e => e.id));
    const uniqueNewEmployees = newEmployees.filter(ne => !existingIds.has(ne.id));
    setEmployees(prev => [...prev, ...uniqueNewEmployees]);
    navigate('/setup/employees');
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    navigate('/setup/employees');
  };

  const handleCompleteSetup = () => {
      setSetupCompleted(true);
      navigate('/dashboard');
  }
  
  // --- ESS Handlers ---
  const handleLogin = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setLoggedInEmployee(employee);
      navigate('/ess/dashboard');
    }
  };
  
  const handleLogout = () => {
    setLoggedInEmployee(null);
    navigate('/login');
  };
  
  const handleSubmitLeaveRequest = (request: Omit<LeaveRequest, 'status' | 'id'>) => {
    setLeaveRequests(prev => [...prev, { ...request, id: Date.now(), status: 'pending' }]);
  };
  
  const handleSubmitChangeRequest = (requests: Omit<ChangeRequest, 'status' | 'id'>[]) => {
    const newRequests = requests.map(req => ({ ...req, id: Date.now() + Math.random(), status: 'pending' as const }));
    setChangeRequests(prev => [...prev, ...newRequests]);
  };
  
  // --- Admin Approval Handlers ---
  const handleUpdateRequestStatus = (
    id: number, 
    status: 'approved' | 'rejected', 
    type: 'leave' | 'change'
  ) => {
    if (type === 'change') {
        const request = changeRequests.find(r => r.id === id);
        if (request && status === 'approved') {
            setEmployees(prevEmps => prevEmps.map(emp => 
                emp.id === request.employeeId ? { ...emp, [request.field]: request.newValue } : emp
            ));
        }
        setChangeRequests(prevReqs => prevReqs.map(r => r.id === id ? { ...r, status } : r));
    }
    // Note: leave approval doesn't change employee data directly in this version
    if (type === 'leave') {
        setLeaveRequests(prevReqs => prevReqs.map(r => r.id === id ? { ...r, status } : r));
    }
  };


  const stepTitles = steps.slice(0, TOTAL_STEPS).map(s => s.title);

  // --- Main application routing logic ---
  
  // Phase 0: Landing Page
  if (!hasStartedOnboarding && !onboardingCompleted && !loggedInEmployee) {
     return (
        <Routes>
            <Route path="/" element={<LandingPage onStart={() => {
                setHasStartedOnboarding(true);
                navigate('/company');
            }} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
     )
  }

  // Phase 4: Employee Self-Service Portal
  if (loggedInEmployee) {
    return (
      <Routes>
        <Route path="/ess/*" element={<ESSLayout employee={loggedInEmployee} onLogout={handleLogout} />}>
            <Route path="dashboard" element={<ESSDashboard employee={loggedInEmployee} leaveRequests={leaveRequests.filter(r => r.employeeId === loggedInEmployee.id)} />} />
            <Route path="payslips" element={<PayslipDetail employee={loggedInEmployee} companyData={formData} />} />
            <Route path="leave" element={<LeaveRequestPage employee={loggedInEmployee} onSubmit={handleSubmitLeaveRequest} existingRequests={leaveRequests.filter(r => r.employeeId === loggedInEmployee.id)} />} />
            <Route path="my-info" element={<MyInfo employee={loggedInEmployee} onSubmit={handleSubmitChangeRequest} existingRequests={changeRequests.filter(r => r.employeeId === loggedInEmployee.id && r.status === 'pending')} />} />
            <Route path="*" element={<Navigate to="/ess/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/ess/dashboard" replace />} />
      </Routes>
    )
  }

  // Post-Onboarding Phases
  if (onboardingCompleted) {
    if (salaryStructureCompleted) {
      if (setupCompleted) {
        // Phase 3: Admin Payroll Dashboard and Reports
        return (
          <Routes>
            <Route path="/dashboard" element={<PayrollRunDashboard employees={employees} changeRequests={changeRequests} leaveRequests={leaveRequests} onUpdateRequestStatus={handleUpdateRequestStatus} onRestart={handleClearAndRestart} />} />
            <Route path="/reports" element={<ComplianceReportsDashboard />} />
            <Route path="/reports/payroll-register" element={<PayrollRegister employees={employees} />} />
            <Route path="/employee-detail/:employeeId" element={<EmployeePayrollDetail employees={employees} />} />
            <Route path="/employees" element={<EmployeeListPage employees={employees} />} />
            <Route path="/login" element={<EmployeeLogin employees={employees} onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        );
      } else {
        // Phase 2: Employee Setup
         return (
          <Routes>
            <Route path="/setup/employees" element={<EmployeeSetup employees={employees} onCompleteSetup={handleCompleteSetup} />} />
            <Route path="/setup/add-employee" element={<AddEmployeeForm onAddEmployee={handleAddEmployee} pfas={formData.pfas} defaultSalaryComponents={formData.defaultSalaryComponents} />} />
            <Route path="/setup/edit-employee/:employeeId" element={<AddEmployeeForm onUpdateEmployee={handleUpdateEmployee} pfas={formData.pfas} employees={employees} />} />
            <Route path="/setup/import-employees" element={<EmployeeImport onImport={handleAddEmployees} />} />
            <Route path="*" element={<Navigate to="/setup/employees" replace />} />
          </Routes>
         )
      }
    } else {
       // Phase 1.5: Salary Structure Setup
      return (
        <Routes>
            <Route path="/setup/salary-structure" element={<SalaryStructureSetup initialComponents={formData.defaultSalaryComponents} onComplete={handleCompleteSalaryStructure} />} />
            <Route path="*" element={<Navigate to="/setup/salary-structure" replace />} />
        </Routes>
      )
    }
  }

  // Phase 1: Onboarding Wizard
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
        {hasSavedData && currentStep <= TOTAL_STEPS && (
            <button
                onClick={handleClearAndRestart}
                className="absolute top-4 right-4 text-xs text-slate-500 hover:text-red-600 underline z-10 transition-colors"
            >
                Clear progress and restart
            </button>
        )}
        
        {currentStep <= TOTAL_STEPS && (
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
            <Route path="/complete" element={
              <div className="text-center p-8 animate-fade-in">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Onboarding Complete!</h2>
                <p className="text-slate-600 mb-8">Your company profile has been successfully created. Next, set up your default salary structure.</p>
                <div className="flex justify-center items-center gap-4">
                     <button
                        onClick={() => navigate('/setup/salary-structure')}
                        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
                    >
                        Define Salary Structure
                    </button>
                </div>
              </div>
            } />
            <Route path="*" element={<Navigate to={steps[0].path} replace />} />
          </Routes>
        </div>
        
        {currentStep <= TOTAL_STEPS && (
          <div className="flex justify-between items-center p-6 bg-white border-t border-slate-200">
            <div>
              <button onClick={handlePrev} disabled={currentStep === 1} className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Back
              </button>
            </div>
            <div className="relative">
                <button onClick={handleSaveProgress} disabled={isSaving} className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50 transition-colors">
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
              <button onClick={handleNext} className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
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