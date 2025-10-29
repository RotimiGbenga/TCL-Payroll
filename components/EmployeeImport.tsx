import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Employee } from '../types';
import { UploadCloudIcon, CheckCircleIcon, XCircleIcon, TrashIcon, FileTextIcon } from './icons';

interface Props {
    onImport: (employees: Employee[]) => void;
}

type ImportStep = 'upload' | 'map' | 'review' | 'complete';
type CsvData = { headers: string[], rows: string[][] };
type ColumnMapping = { [key in keyof Partial<Employee>]: string };
type ValidationResult = {
    validEmployees: Employee[];
    invalidRows: { rowIndex: number; rowData: { [key: string]: string }; errors: { [key: string]: string } }[];
};

const EMPLOYEE_FIELDS = [
    { key: 'id', label: 'Employee ID', required: true, aliases: ['employee id', 'empid', 'employee number'] },
    { key: 'firstName', label: 'First Name', required: true, aliases: ['first name', 'given name'] },
    { key: 'lastName', label: 'Last Name', required: true, aliases: ['last name', 'surname'] },
    { key: 'email', label: 'Email Address', required: true, aliases: ['email', 'email address'] },
    { key: 'jobTitle', label: 'Job Title', required: true, aliases: ['job title', 'position', 'role'] },
    { key: 'employmentType', label: 'Employment Type', required: true, aliases: ['employment type', 'status'] },
    { key: 'dateOfHire', label: 'Date of Hire', required: true, aliases: ['date of hire', 'hire date', 'start date'] },
    { key: 'annualGrossSalary', label: 'Annual Gross Salary', required: true, aliases: ['annual gross salary', 'gross salary', 'salary'] },
    { key: 'middleName', label: 'Middle Name', aliases: ['middle name'] },
    { key: 'dateOfBirth', label: 'Date of Birth', aliases: ['date of birth', 'dob'] },
    { key: 'gender', label: 'Gender', aliases: ['gender'] },
    { key: 'contactAddress', label: 'Contact Address', aliases: ['contact address', 'address'] },
    { key: 'phoneNumber', label: 'Phone Number', aliases: ['phone number', 'phone'] },
    { key: 'department', label: 'Department', aliases: ['department'] },
    { key: 'workLocation', label: 'Work Location', aliases: ['work location', 'location'] },
    { key: 'tin', label: 'TIN', aliases: ['tin', 'tax id'] },
    { key: 'annualRent', label: 'Annual Rent', aliases: ['annual rent', 'rent'] },
    { key: 'pfa', label: 'PFA Name', aliases: ['pfa', 'pfa name', 'pension fund administrator'] },
    { key: 'rsaPin', label: 'RSA PIN', aliases: ['rsa pin', 'pension pin'] },
    { key: 'contributesToNHF', label: 'Contributes to NHF', aliases: ['contributes to nhf', 'nhf'] },
    { key: 'salaryComponentBasic', label: 'Salary Basic %', required: true, aliases: ['salary basic %', 'basic %', 'basic'] },
    { key: 'salaryComponentHousing', label: 'Salary Housing %', required: true, aliases: ['salary housing %', 'housing %', 'housing'] },
    { key: 'salaryComponentTransport', label: 'Salary Transport %', required: true, aliases: ['salary transport %', 'transport %', 'transport'] },
];

const TEMPLATE_CSV = "id,firstName,lastName,email,jobTitle,employmentType,dateOfHire,annualGrossSalary,middleName,dateOfBirth,gender,contactAddress,phoneNumber,department,workLocation,tin,annualRent,pfa,rsaPin,contributesToNHF,salaryComponentBasic,salaryComponentHousing,salaryComponentTransport\nEMP005,Ada,Obi,ada.o@example.com,Junior Developer,Full-time,2023-10-01,3000000,,,,,,,,,,true,50,30,20\n";


export const EmployeeImport: React.FC<Props> = ({ onImport }) => {
    const [step, setStep] = useState<ImportStep>('upload');
    const [csvData, setCsvData] = useState<CsvData | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [mapping, setMapping] = useState<ColumnMapping>({});
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const parseCsv = (text: string) => {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
        return { headers, rows };
    };

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile.type !== 'text/csv') {
            setUploadError('Invalid file type. Please upload a CSV file.');
            return;
        }
        setUploadError(null);
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setCsvData(parseCsv(text));
        };
        reader.readAsText(selectedFile);
    };

    const handleProceedToMapping = () => {
        if (!csvData) return;
    
        const initialMapping: ColumnMapping = {};
        const normalizedCsvHeaders = csvData.headers.map(h => h.toLowerCase().replace(/[\s_]/g, ''));
        const usedCsvIndices = new Set<number>();
    
        // For each application field, find the best matching column from the user's CSV.
        EMPLOYEE_FIELDS.forEach(field => {
            // Combine the field's key and its aliases into one list for matching.
            const aliases = [field.key, ...(field.aliases || [])].map(a => a.toLowerCase().replace(/[\s_]/g, ''));
    
            for (const alias of aliases) {
                // Find a CSV header that matches the alias and has not been used yet.
                const matchedIndex = normalizedCsvHeaders.findIndex((header, i) => header === alias && !usedCsvIndices.has(i));
    
                if (matchedIndex > -1) {
                    // If a match is found, create the mapping.
                    initialMapping[field.key as keyof Employee] = csvData.headers[matchedIndex];
                    // Mark this header index as used so it can't be mapped to another field.
                    usedCsvIndices.add(matchedIndex);
                    // Break to move to the next application field, ensuring one-to-one mapping.
                    break;
                }
            }
        });
    
        setMapping(initialMapping);
        setStep('map');
    };

    const handleMappingChange = (fieldKey: string, csvHeader: string) => {
        setMapping(prev => ({ ...prev, [fieldKey]: csvHeader }));
    };

    const validateData = () => {
        if (!csvData) return;

        const result: ValidationResult = { validEmployees: [], invalidRows: [] };
        const employeeFieldsMap = new Map(EMPLOYEE_FIELDS.map(f => [f.key, f]));

        csvData.rows.forEach((row, rowIndex) => {
            const rowObject: { [key: string]: string } = {};
            csvData.headers.forEach((header, i) => {
                rowObject[header] = row[i];
            });

            const errors: { [key: string]: string } = {};
            let employee: Partial<Employee> = {};

            // Build employee object and validate
            for (const fieldKey of Object.keys(mapping)) {
                const csvHeader = mapping[fieldKey as keyof Employee];
                if (!csvHeader) continue;
                
                const value = rowObject[csvHeader];
                const fieldDef = employeeFieldsMap.get(fieldKey);

                if (fieldDef?.required && !value) {
                    errors[fieldKey] = `${fieldDef.label} is required.`;
                }

                if (value) {
                    if (fieldKey === 'email' && !/\S+@\S+\.\S+/.test(value)) {
                        errors[fieldKey] = 'Invalid email format.';
                    } else if (['annualGrossSalary', 'annualRent'].includes(fieldKey) && isNaN(Number(value))) {
                        errors[fieldKey] = 'Must be a number.';
                    } else if (fieldKey === 'contributesToNHF' && !['true', 'false', 'yes', 'no', '1', '0'].includes(value.toLowerCase())) {
                        errors[fieldKey] = 'Must be true/false.';
                    }
                }
            }
            
            if (Object.keys(errors).length > 0) {
                result.invalidRows.push({ rowIndex: rowIndex + 2, rowData: rowObject, errors });
            } else {
                // Construct valid employee object
                const newEmployee: any = { salaryComponents: {} };
                for (const fieldKey of Object.keys(mapping)) {
                     const csvHeader = mapping[fieldKey as keyof Employee];
                     if (!csvHeader) continue;
                     const value = rowObject[csvHeader];

                     if (fieldKey.startsWith('salaryComponent')) {
                        const component = fieldKey.replace('salaryComponent', '').toLowerCase();
                        newEmployee.salaryComponents[component] = parseFloat(value) || 0;
                     } else if (fieldKey === 'contributesToNHF') {
                        newEmployee[fieldKey] = ['true', 'yes', '1'].includes(value.toLowerCase());
                     } else if (['annualGrossSalary', 'annualRent'].includes(fieldKey)) {
                        newEmployee[fieldKey] = parseFloat(value) || 0;
                     } else {
                        newEmployee[fieldKey] = value;
                     }
                }
                result.validEmployees.push(newEmployee as Employee);
            }
        });

        setValidationResult(result);
        setStep('review');
    };

    const handleImport = () => {
        if (validationResult) {
            onImport(validationResult.validEmployees);
            setStep('complete');
        }
    };
    
    const downloadTemplate = () => {
        const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "employee_import_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const renderContent = () => {
        switch (step) {
            case 'upload': return (
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Step 1: Upload CSV File</h3>
                    <p className="text-sm text-slate-500 mb-4">Select a CSV file with your employee data to begin the import process.</p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm">
                        <p className="font-medium text-slate-700">Instructions:</p>
                        <ul className="list-disc list-inside text-slate-600 mt-1 space-y-1">
                            <li>The first row of your CSV must be the header row.</li>
                            <li>Required columns: Employee ID, First Name, Last Name, Email, Job Title, Employment Type, Date of Hire, Annual Gross Salary, and Salary Component percentages.</li>
                            <li><button onClick={downloadTemplate} className="text-indigo-600 font-medium hover:underline">Download a template file</button> to see the required format.</li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <input type="file" ref={fileInputRef} onChange={e => e.target.files && handleFileSelect(e.target.files[0])} accept=".csv" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                            <UploadCloudIcon className="w-5 h-5"/>
                            {file ? `Change File: ${file.name}` : 'Choose CSV File'}
                        </button>
                        {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
                    </div>

                    {csvData && (
                        <div className="mt-6">
                             <h4 className="font-semibold text-slate-700 mb-2">File Preview</h4>
                             <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-60">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-100 sticky top-0"><tr className="text-left">{csvData.headers.map(h => <th key={h} className="p-2 font-medium">{h}</th>)}</tr></thead>
                                    <tbody>{csvData.rows.slice(0, 5).map((row, i) => <tr key={i} className="border-t border-slate-200">{row.map((cell, j) => <td key={j} className="p-2 truncate">{cell}</td>)}</tr>)}</tbody>
                                </table>
                             </div>
                        </div>
                    )}
                </div>
            );
            case 'map': return (
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Step 2: Map Columns</h3>
                    <p className="text-sm text-slate-500 mb-4">Match the columns from your CSV file to the corresponding fields in the application. We've tried to guess for you.</p>
                     <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-2 bg-slate-100 font-medium text-sm text-slate-700"><div className="p-3">Application Field</div><div className="p-3">Your CSV Column</div></div>
                        <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                            {EMPLOYEE_FIELDS.map(field => (
                                <div key={field.key} className="grid grid-cols-2 items-center p-3">
                                    <label htmlFor={field.key} className="text-sm font-medium text-slate-800">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
                                    <select id={field.key} value={mapping[field.key as keyof Employee] || ''} onChange={e => handleMappingChange(field.key, e.target.value)} className="w-full pl-3 pr-10 py-2 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                                        <option value="">-- Do not import --</option>
                                        {csvData?.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            );
            case 'review': return (
                 <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Step 3: Review & Validate</h3>
                    <p className="text-sm text-slate-500 mb-4">We've checked your data. Review the summary below before importing.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                            <p className="text-3xl font-bold text-green-700">{validationResult?.validEmployees.length}</p>
                            <p className="text-sm font-medium text-green-800">Employees Ready for Import</p>
                        </div>
                         <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                            <p className="text-3xl font-bold text-red-700">{validationResult?.invalidRows.length}</p>
                            <p className="text-sm font-medium text-red-800">Rows with Errors</p>
                        </div>
                    </div>
                    
                    {validationResult && validationResult.invalidRows.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-slate-700 mb-2">Rows to Fix</h4>
                            <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-80">
                                <table className="w-full text-xs">
                                     <thead className="bg-slate-100 sticky top-0"><tr className="text-left"><th className="p-2 font-medium">Row</th><th className="p-2 font-medium">Field with Error</th><th className="p-2 font-medium">Error Message</th></tr></thead>
                                     <tbody>
                                        {validationResult.invalidRows.map(({ rowIndex, errors }) => (
                                            Object.entries(errors).map(([fieldKey, message], i) => (
                                                 <tr key={`${rowIndex}-${i}`} className="border-t border-slate-200 bg-red-50/50">
                                                    {i === 0 && <td rowSpan={Object.keys(errors).length} className="p-2 align-top font-medium">{rowIndex}</td>}
                                                    <td className="p-2 font-medium text-slate-700">{EMPLOYEE_FIELDS.find(f => f.key === fieldKey)?.label || fieldKey}</td>
                                                    <td className="p-2 text-red-700">{message}</td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Please fix these issues in your CSV file and start the import process again to include these employees.</p>
                        </div>
                    )}
                </div>
            );
            case 'complete': return (
                <div className="text-center p-8">
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Import Complete!</h2>
                    <p className="text-slate-600 mb-8"><span className="font-semibold">{validationResult?.validEmployees.length}</span> employees were successfully imported.</p>
                    <Link to="/setup/employees" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300">
                        Go to Employee Roster
                    </Link>
                </div>
            );
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">Import Employees from CSV</h1>
                    <Link to="/setup/employees" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                        &larr; Back to Roster
                    </Link>
                </div>
            </header>

             <main className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="p-6 animate-fade-in">
                            {renderContent()}
                        </div>

                         {step !== 'complete' && (
                            <div className="flex justify-between items-center p-6 bg-slate-50 border-t border-slate-200 rounded-b-lg">
                                <button
                                    onClick={() => setStep(step === 'map' ? 'upload' : 'map')}
                                    disabled={step === 'upload'}
                                    className="px-6 py-2 text-sm font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Back
                                </button>
                                {step === 'upload' && <button onClick={handleProceedToMapping} disabled={!csvData} className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">Next: Map Columns</button>}
                                {step === 'map' && <button onClick={validateData} className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700">Next: Review Data</button>}
                                {step === 'review' && <button onClick={handleImport} disabled={!validationResult || validationResult.validEmployees.length === 0} className="px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">Import {validationResult?.validEmployees.length || 0} Employees</button>}
                            </div>
                         )}
                    </div>
                </div>
             </main>
        </div>
    );
};