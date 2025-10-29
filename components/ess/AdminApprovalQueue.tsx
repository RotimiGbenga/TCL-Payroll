import React from 'react';
import type { Employee, LeaveRequest, ChangeRequest } from '../../types';

// This is a map to make field names more user-friendly.
const readableFieldNames: { [key: string]: string } = {
    contactAddress: 'Contact Address',
    email: 'Email',
    phoneNumber: 'Phone Number',
};

interface AdminApprovalQueueProps {
    leaveRequests: LeaveRequest[];
    changeRequests: ChangeRequest[];
    employees: Employee[];
    onUpdateRequestStatus: (id: number, status: 'approved' | 'rejected', type: 'leave' | 'change') => void;
}

export const AdminApprovalQueue: React.FC<AdminApprovalQueueProps> = ({ leaveRequests, changeRequests, employees, onUpdateRequestStatus }) => {
    
    // Helper to get employee name from ID
    const findEmployeeName = (id: string) => {
        const emp = employees.find(e => e.id === id);
        return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown Employee';
    };

    return (
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-300 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Approval Requests</h3>
            <div className="space-y-3">
                {changeRequests.map(req => (
                    <div key={req.id} className="p-4 bg-white rounded-md border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-800">{findEmployeeName(req.employeeId)}</p>
                            <p className="text-sm text-slate-600">
                                Request to change <span className="font-medium text-slate-700">{readableFieldNames[req.field] || req.field}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-2">
                                <span>From: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{String(req.oldValue)}</span></span>
                                <span className="text-slate-400">&rarr;</span>
                                <span>To: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{String(req.newValue)}</span></span>
                            </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 self-end sm:self-center">
                            <button
                                onClick={() => onUpdateRequestStatus(req.id, 'approved', 'change')}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                aria-label={`Approve change for ${req.field} for ${findEmployeeName(req.employeeId)}`}
                            >
                                Approve
                            </button>
                             <button
                                onClick={() => onUpdateRequestStatus(req.id, 'rejected', 'change')}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
                                aria-label={`Reject change for ${req.field} for ${findEmployeeName(req.employeeId)}`}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
                
                {leaveRequests.map(req => (
                    <div key={req.id} className="p-4 bg-white rounded-md border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-800">{findEmployeeName(req.employeeId)}</p>
                            <p className="text-sm text-slate-600 capitalize">
                                {req.leaveType} Leave Request
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Dates: <span className="font-medium text-slate-600">{req.startDate}</span> to <span className="font-medium text-slate-600">{req.endDate}</span>
                            </p>
                        </div>
                         <div className="flex gap-2 flex-shrink-0 self-end sm:self-center">
                             <button
                                onClick={() => onUpdateRequestStatus(req.id, 'approved', 'leave')}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                aria-label={`Approve leave for ${findEmployeeName(req.employeeId)}`}
                            >
                                Approve
                            </button>
                             <button
                                onClick={() => onUpdateRequestStatus(req.id, 'rejected', 'leave')}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
                                aria-label={`Reject leave for ${findEmployeeName(req.employeeId)}`}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
