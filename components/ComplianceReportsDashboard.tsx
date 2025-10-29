
import React from 'react';
import { Link } from 'react-router-dom';
import { FileTextIcon, DownloadCloudIcon } from './icons';

const ReportCard: React.FC<{
    title: string;
    description: string;
    link?: string;
    pdfAction?: () => void;
    csvAction?: () => void;
    isComingSoon?: boolean;
}> = ({ title, description, link, pdfAction, csvAction, isComingSoon }) => (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col">
        <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 bg-indigo-100 p-2.5 rounded-lg">
                <FileTextIcon className="w-6 h-6 text-indigo-600"/>
            </div>
            <div>
                <h3 className="text-md font-bold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            {link ? (
                 <Link to={link} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 transition-colors">
                    View Report
                </Link>
            ) : (
                <div className="flex items-center gap-3">
                     {isComingSoon && <span className="text-xs text-slate-400 font-medium italic">Coming Soon</span>}
                    <button disabled={isComingSoon} onClick={pdfAction} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <DownloadCloudIcon className="w-4 h-4"/> PDF
                    </button>
                    <button disabled={isComingSoon} onClick={csvAction} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <DownloadCloudIcon className="w-4 h-4"/> CSV
                    </button>
                </div>
            )}
        </div>
    </div>
);


export const ComplianceReportsDashboard: React.FC = () => {
    const reports = [
        {
            title: 'PAYE Tax Remittance Schedule',
            description: 'List of all employees, their TIN, taxable income, and monthly tax amount due to the State Internal Revenue Service.',
            isComingSoon: true,
        },
        {
            title: 'Pension Remittance Schedule',
            description: 'Formatted for PFA submission, listing each employee, RSA PIN, PFA, and total monthly pension contribution.',
            isComingSoon: true,
        },
        {
            title: 'NHF Remittance Schedule',
            description: 'A report for remitting National Housing Fund contributions for all applicable employees.',
            isComingSoon: true,
        },
        {
            title: 'Monthly Payroll Register',
            description: 'A detailed breakdown of earnings, deductions, and net pay for every employee in the selected period.',
            link: '/reports/payroll-register',
        },
        {
            title: 'Bank Payment Schedule',
            description: 'A "Bank Advice" report that can be uploaded to a corporate banking portal for salary payments.',
            isComingSoon: true,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800">Compliance Reports</h1>
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
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Generate & Download</h2>
                            <p className="text-sm text-slate-500">Select a report to generate for your compliance and payment needs.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reports.map(report => <ReportCard key={report.title} {...report} />)}
                             <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex items-center justify-center text-center">
                                <div>
                                    <h3 className="text-md font-bold text-slate-800">More Reports Coming Soon</h3>
                                    <p className="text-sm text-slate-500 mt-1">We're always working on adding more valuable reports to help your business.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
