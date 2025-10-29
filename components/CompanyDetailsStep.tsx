import React, { useRef, useState, useEffect } from 'react';
import type { FormData } from '../types';
import { UploadCloudIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from './icons';

interface Props {
  data: FormData;
  onDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileSelect: (file: File | null) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export const CompanyDetailsStep: React.FC<Props> = ({ data, onDataChange, onFileSelect, errors }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (data.companyLogo && uploadStatus !== 'uploading') {
            setUploadStatus('success');
        } else if (!data.companyLogo) {
            setUploadStatus('idle');
            setUploadProgress(0);
            setUploadError(null);
        }
    }, [data.companyLogo, uploadStatus]);

    const handleLogoClick = () => {
        if (uploadStatus === 'idle' || uploadStatus === 'error') {
            fileInputRef.current?.click();
        }
    };

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
        onFileSelect(file);
        setUploadStatus('uploading');
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setUploadStatus('success');
                    return 100;
                }
                return prev + 4; // Smoother progress
            });
        }, 40); // Ticks 25 times over 1 second
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };
    
    const handleRemoveFile = () => {
        onFileSelect(null);
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
                        <p className="text-sm text-slate-600 truncate mb-2">{data.companyLogo?.name}</p>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-100 ease-linear"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{uploadProgress.toFixed(0)}%</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex items-center justify-between w-full px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                           <div className="overflow-hidden">
                                <p className="text-sm font-medium text-slate-800 truncate">{data.companyLogo?.name}</p>
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
                        <XCircleIcon className="mx-auto h-10 w-10 text-red-400"/>
                        <p className="mt-2 text-sm text-red-600 font-medium">{uploadError}</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setUploadStatus('idle'); setUploadError(null); fileInputRef.current?.click(); }}
                            className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            Try Again
                        </button>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="space-y-1 text-center">
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400"/>
                        <div className="flex text-sm text-slate-600">
                             <span className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input ref={fileInputRef} id="companyLogo" name="companyLogo" type="file" className="sr-only" onChange={handleFileInputChange} accept="image/png, image/jpeg" />
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
        <div className="animate-fade-in">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Step 1: Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">Company Name</label>
                    <input type="text" name="companyName" id="companyName" value={data.companyName} onChange={onDataChange} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm ${errors.companyName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`} required />
                    {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                </div>
                <div>
                    <label htmlFor="rcNumber" className="block text-sm font-medium text-slate-700">RC Number</label>
                    <input type="text" name="rcNumber" id="rcNumber" value={data.rcNumber} onChange={onDataChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="businessAddress" className="block text-sm font-medium text-slate-700">Business Address</label>
                    <textarea name="businessAddress" id="businessAddress" value={data.businessAddress} onChange={onDataChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700">Contact Email</label>
                    <input type="email" name="contactEmail" id="contactEmail" value={data.contactEmail} onChange={onDataChange} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm ${errors.contactEmail ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`} required />
                    {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="tel" name="phoneNumber" id="phoneNumber" value={data.phoneNumber} onChange={onDataChange} className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none sm:text-sm ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`} required />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Company Logo</label>
                    <div 
                        onClick={handleLogoClick}
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
    );
};