import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Employee, PFA } from '../types';
import { UploadCloudIcon, CheckCircleIcon, TrashIcon, XCircleIcon } from './icons';

interface Props {
  pfas: PFA[];
  onAddEmployee?: (employee: Employee) => void;
  onUpdateEmployee?: (employee: Employee) => void;
  employees?: Employee[];
  defaultSalaryComponents?: {
    basic: number;
    housing: number;
    transport: number;
  };
}

const initialEmployeeState: Omit<Employee, 'photo'> = {
  id: '',
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: '',
  gender: '',
  contactAddress: '',
  email: '',
  phoneNumber: '',
  jobTitle: '',
  department: '',
  employmentType: '',
  dateOfHire: '',
  workLocation: '',
  annualGrossSalary: 0,
  salaryComponents: { basic: 50, housing: 30, transport: 20 },
  tin: '',
  annualRent: 0,
  pfa: '',
  rsaPin: '',
  contributesToNHF: false,
  leaveBalances: { annual: 20, sick: 10 },
};

const tabs = ['Personal Information', 'Job Information', 'Salary & Compensation', 'Statutory Details'];

export const AddEmployeeForm: React.FC<Props> = ({ pfas, onAddEmployee, onUpdateEmployee, employees = [], defaultSalaryComponents }) => {
  const { employeeId } = useParams();
  const isEditMode = !!employeeId;
  
  const [activeTab, setActiveTab] = useState(0);
  const [employeeData, setEmployeeData] = useState<Omit<Employee, 'photo'>>(() => {
    if (isEditMode) {
        const employeeToEdit = employees.find(e => e.id === employeeId);
        if (employeeToEdit) {
            const { photo, ...dataToEdit } = employeeToEdit;
            return dataToEdit;
        }
    }
    // This is for a new employee
    const initialState = { ...initialEmployeeState, id: `EMP${String(Date.now()).slice(-4)}`};
    if (defaultSalaryComponents) {
        initialState.salaryComponents = defaultSalaryComponents;
    }
    return initialState;
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setEmployeeData(prev => ({ ...prev, [name]: checked }));
    } else {
        const parsedValue = (type === 'number' && name !== 'id') ? parseFloat(value) || 0 : value;
        setEmployeeData(prev => ({ ...prev, [name]: parsedValue }));
    }
  };
  
  const handleSalaryComponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const percentage = parseFloat(value) || 0;
      setEmployeeData(prev => ({
          ...prev,
          salaryComponents: {
              ...prev.salaryComponents,
              [name]: percentage
          }
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add validation
    const finalEmployeeData = { ...employeeData, photo };

    if (isEditMode) {
        onUpdateEmployee?.(finalEmployeeData);
    } else {
        onAddEmployee?.(finalEmployeeData);
    }
  };
  
  const totalPercentage = employeeData.salaryComponents.basic + employeeData.salaryComponents.housing + employeeData.salaryComponents.transport;

  // --- File Upload Logic ---
  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) { // 2MB
        setUploadError('File is too large. Maximum size is 2MB.');
        setUploadStatus('error');
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
    }
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        setUploadError('Invalid file type. Please upload a PNG or JPG.');
        setUploadStatus('error');
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
    }
    
    setUploadError(null);
    setPhoto(file);
    setUploadStatus('uploading');
    setUploadProgress(0);

    const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setUploadStatus('success');
                return 100;
            }
            return prev + 5;
        });
    }, 50);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
    }
  };
    
  const handleRemoveFile = () => {
    setPhoto(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setUploadError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadStatus === 'idle' || uploadStatus === 'error') {
        setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (uploadStatus !== 'idle' && uploadStatus !== 'error') return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
    }
  };

  const renderUploadState = () => {
    switch (uploadStatus) {
        case 'uploading':
            return (
                <div className="w-full px-4 text-center">
                    <p className="text-sm text-slate-600 truncate mb-2">{photo?.name}</p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            );
        case 'success':
            return (
                <div className="flex items-center justify-between w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                       <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-800 truncate">{photo?.name}</p>
                            <p className="text-xs text-slate-500">Upload successful</p>
                       </div>
                    </div>
                    <button onClick={handleRemoveFile} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0 ml-2" aria-label="Remove file">
                        <TrashIcon className="w-4 h-4"/>
                    </button>
                </div>
            );
        case 'error':
             return (
                <div className="text-center">
                    <XCircleIcon className="mx-auto h-8 w-8 text-red-400"/>
                    <p className="mt-2 text-sm text-red-600 font-medium">{uploadError}</p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setUploadStatus('idle'); setUploadError(null); fileInputRef.current?.click(); }}
                        className="mt-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                        Try Again
                    </button>
                </div>
            );
        case 'idle':
        default:
            return (
                <div className="space-y-1 text-center">
                    <UploadCloudIcon className="mx-auto h-10 w-10 text-slate-400"/>
                    <div className="flex text-sm text-slate-600">
                         <span className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                            <span>Upload photo</span>
                            <input ref={fileInputRef} id="photo" name="photo" type="file" className="sr-only" onChange={handleFileInputChange} accept="image/png, image/jpeg" />
                         </span>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                </div>
            );
    }
  };
    
  const getDropzoneClassName = () => {
    let baseClasses = "mt-1 flex items-center justify-center px-6 min-h-[140px] border-2 border-dashed rounded-md transition-colors";
    if (isDragging) {
        return `${baseClasses} border-indigo-600 bg-indigo-50`;
    }
    if (uploadStatus === 'idle' || uploadStatus === 'error') {
        return `${baseClasses} border-slate-300 hover:border-indigo-500 cursor-pointer`;
    }
    if (uploadStatus === 'uploading') {
        return `${baseClasses} border-slate-300 cursor-wait bg-slate-50`;
    }
     if (uploadStatus === 'success') {
        return `${baseClasses} border-transparent p-0`;
    }
    return baseClasses;
  }


  return (
    <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Employee Details' : 'Add New Employee'}</h1>
                 <Link
                    to="/setup/employees"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    &larr; Back to Employee Roster
                </Link>
            </div>
        </header>

         <main className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg shadow-sm">
                    {/* Tabs */}
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(index)}
                                className={`${
                                    activeTab === index
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                            >
                            {tab}
                            </button>
                        ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Tab Content */}
                        <div className={activeTab === 0 ? 'block animate-fade-in' : 'hidden'}>
                            <h3 className="text-lg font-semibold text-slate-800 mb-6">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="First Name" name="firstName" value={employeeData.firstName} onChange={handleChange} required />
                                <InputField label="Last Name" name="lastName" value={employeeData.lastName} onChange={handleChange} required />
                                <InputField label="Middle Name" name="middleName" value={employeeData.middleName || ''} onChange={handleChange} />
                                <InputField label="Date of Birth" name="dateOfBirth" type="date" value={employeeData.dateOfBirth} onChange={handleChange} required />
                                <SelectField label="Gender" name="gender" value={employeeData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} required />
                                <InputField label="Contact Address" name="contactAddress" value={employeeData.contactAddress} onChange={handleChange} className="md:col-span-2" required />
                                <InputField label="Email Address" name="email" type="email" value={employeeData.email} onChange={handleChange} required />
                                <InputField label="Phone Number" name="phoneNumber" type="tel" value={employeeData.phoneNumber} onChange={handleChange} required />
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700">Passport Photo</label>
                                    <div
                                        onClick={() => uploadStatus !== 'uploading' && fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={getDropzoneClassName()}
                                    >
                                       {renderUploadState()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className={activeTab === 1 ? 'block animate-fade-in' : 'hidden'}>
                            <h3 className="text-lg font-semibold text-slate-800 mb-6">Job Information</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Employee ID" name="id" value={employeeData.id} onChange={handleChange} required disabled={isEditMode} />
                                <InputField label="Job Title" name="jobTitle" value={employeeData.jobTitle} onChange={handleChange} required />
                                <InputField label="Department" name="department" value={employeeData.department} onChange={handleChange} required />
                                <SelectField label="Employment Type" name="employmentType" value={employeeData.employmentType} onChange={handleChange} options={['Full-time', 'Contract', 'Intern']} required />
                                <InputField label="Date of Hire" name="dateOfHire" type="date" value={employeeData.dateOfHire} onChange={handleChange} required />
                                <InputField label="Work Location" name="workLocation" value={employeeData.workLocation} onChange={handleChange} required />
                             </div>
                        </div>

                        <div className={activeTab === 2 ? 'block animate-fade-in' : 'hidden'}>
                            <h3 className="text-lg font-semibold text-slate-800 mb-6">Salary & Compensation</h3>
                            <div className="space-y-6">
                                <InputField label="Annual Gross Salary (NGN)" name="annualGrossSalary" type="number" value={employeeData.annualGrossSalary} onChange={handleChange} required />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Salary Component Breakdown (%)</label>
                                    <p className="text-xs text-slate-500 mb-2">Define how the gross salary is allocated. Must add up to 100%.</p>
                                    <div className="grid grid-cols-3 gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                                         <InputField label="Basic" name="basic" type="number" value={employeeData.salaryComponents.basic} onChange={handleSalaryComponentChange} />
                                         <InputField label="Housing" name="housing" type="number" value={employeeData.salaryComponents.housing} onChange={handleSalaryComponentChange} />
                                         <InputField label="Transport" name="transport" type="number" value={employeeData.salaryComponents.transport} onChange={handleSalaryComponentChange} />
                                    </div>
                                    <p className={`mt-2 text-sm font-semibold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                                        Total: {totalPercentage}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={activeTab === 3 ? 'block animate-fade-in' : 'hidden'}>
                           <h3 className="text-lg font-semibold text-slate-800 mb-6">Statutory Details</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Tax Identification Number (TIN)" name="tin" value={employeeData.tin} onChange={handleChange} />
                                <InputField label="Annual Rent Paid (for relief)" name="annualRent" type="number" value={employeeData.annualRent} onChange={handleChange} />
                                <SelectField label="Pension Fund Administrator (PFA)" name="pfa" value={employeeData.pfa} onChange={handleChange} options={pfas.map(p => p.pfaName)} required />
                                <InputField label="RSA PIN" name="rsaPin" value={employeeData.rsaPin} onChange={handleChange} required />
                                <div className="md:col-span-2 flex items-center mt-4">
                                    <input type="checkbox" id="contributesToNHF" name="contributesToNHF" checked={employeeData.contributesToNHF} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                                    <label htmlFor="contributesToNHF" className="ml-2 block text-sm text-slate-800">Employee contributes to the National Housing Fund (NHF)</label>
                                </div>
                           </div>
                        </div>
                    </div>
                    
                    {/* Footer / Actions */}
                    <div className="flex justify-between items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                        <button 
                            type="button" 
                            onClick={() => setActiveTab(p => Math.max(0, p - 1))}
                            disabled={activeTab === 0}
                            className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {activeTab < tabs.length - 1 ? (
                             <button 
                                type="button" 
                                onClick={() => setActiveTab(p => Math.min(tabs.length - 1, p + 1))}
                                className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                type="submit"
                                className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                {isEditMode ? 'Update Employee' : 'Save Employee'}
                            </button>
                        )}
                    </div>

                </form>
            </div>
         </main>
    </div>
  );
};

// --- Reusable Form Field Components ---
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, name, ...props }) => (
    <div className={props.className}>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
        <input 
            id={name} 
            name={name}
            {...props}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" 
        />
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: string[] }> = ({ label, name, options, ...props }) => (
     <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
        <select
            id={name}
            name={name}
            {...props}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
            <option value="">Select an option</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);