import React, { useState } from 'react';
// Fix for error on line 2: Rename type to avoid conflict with component name.
import type { Employee, LeaveRequest as LeaveRequestType } from '../../types';
import { CheckCircleIcon, FileClockIcon, XCircleIcon } from '../icons';

interface Props {
  employee: Employee;
  // Fix for error on line 44: The onSubmit prop should expect `employeeId` to match the implementation in `App.tsx`.
  onSubmit: (request: Omit<LeaveRequestType, 'status' | 'id'>) => void;
  existingRequests: LeaveRequestType[];
}

const StatusBadge: React.FC<{ status: LeaveRequestType['status'] }> = ({ status }) => {
    const baseClasses = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium';
    if (status === 'approved') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircleIcon className="w-3.5 h-3.5" /> Approved</span>;
    }
    if (status === 'rejected') {
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircleIcon className="w-3.5 h-3.5" /> Rejected</span>;
    }
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><FileClockIcon className="w-3.5 h-3.5" /> Pending</span>;
};

// Fix for error on line 22: Caused by name conflict, resolved by renaming imported type.
export const LeaveRequest: React.FC<Props> = ({ employee, onSubmit, existingRequests }) => {
  const [leaveType, setLeaveType] = useState<'annual' | 'sick'>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startDate || !endDate || !reason) {
      setError('All fields are required.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    // The call to onSubmit now matches the corrected prop type.
    onSubmit({
      employeeId: employee.id,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    
    // Reset form
    setLeaveType('annual');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Leave Management</h1>
        <p className="text-slate-500 mt-1">Request time off and view your balances.</p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Annual Leave Balance</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{employee.leaveBalances.annual} <span className="text-lg font-medium text-slate-500">days</span></p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Sick Leave Balance</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{employee.leaveBalances.sick} <span className="text-lg font-medium text-slate-500">days</span></p>
        </div>
      </div>

      {/* Request Form */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">New Leave Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="leaveType" className="block text-sm font-medium text-slate-700">Leave Type</label>
              <select id="leaveType" value={leaveType} onChange={e => setLeaveType(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">Start Date</label>
              <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">End Date</label>
              <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason</label>
            <textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div className="flex items-center justify-between">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Submit Request
            </button>
          </div>
        </form>
      </div>

      {/* Request History */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Request History</h2>
        {existingRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 font-semibold text-slate-600">Type</th>
                  <th className="p-3 font-semibold text-slate-600">Start Date</th>
                  <th className="p-3 font-semibold text-slate-600">End Date</th>
                  <th className="p-3 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {existingRequests.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map(req => (
                  <tr key={req.id} className="border-b border-slate-200">
                    <td className="p-3 capitalize font-medium text-slate-800">{req.leaveType}</td>
                    <td className="p-3 text-slate-600">{req.startDate}</td>
                    <td className="p-3 text-slate-600">{req.endDate}</td>
                    <td className="p-3"><StatusBadge status={req.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">You have not made any leave requests yet.</p>
        )}
      </div>
    </div>
  );
};
