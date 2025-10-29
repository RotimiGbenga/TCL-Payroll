import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Employee, LeaveRequest } from '../../types';
import { FileTextIcon, CalendarIcon, UserPlusIcon, CheckCircleIcon, FileClockIcon, XCircleIcon } from '../icons';
import { calculatePayroll } from '../../data/sampleData';

interface Props {
  employee: Employee;
  leaveRequests: LeaveRequest[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

const StatusBadge: React.FC<{ status: LeaveRequest['status'] }> = ({ status }) => {
    const baseClasses = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium';
    if (status === 'approved') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircleIcon className="w-3.5 h-3.5" /> Approved</span>;
    }
    if (status === 'rejected') {
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircleIcon className="w-3.5 h-3.5" /> Rejected</span>;
    }
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><FileClockIcon className="w-3.5 h-3.5" /> Pending</span>;
};

const DashboardCard: React.FC<{ to: string, icon: React.FC<any>, title: string, children: React.ReactNode }> = ({ to, icon: Icon, title, children }) => (
    <Link to={`/ess/${to}`} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col">
        <div className="flex items-start gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-600"/>
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{title}</h3>
            </div>
        </div>
        <div className="mt-4 text-sm text-slate-600 flex-1">
            {children}
        </div>
        <div className="mt-4 text-sm font-semibold text-indigo-600">
            View Details &rarr;
        </div>
    </Link>
);


export const ESSDashboard: React.FC<Props> = ({ employee, leaveRequests }) => {
  const latestRequest = useMemo(() => {
    if (!leaveRequests || leaveRequests.length === 0) {
      return null;
    }
    // Sort by start date descending to get the most recent one
    return [...leaveRequests].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
  }, [leaveRequests]);

  const latestPayroll = useMemo(() => calculatePayroll(employee), [employee]);

  return (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome, {employee.firstName}!</h1>
        <p className="text-slate-500 mb-8">This is your self-service portal. Here you can manage your personal information, view payslips, and request time off.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard to="payslips" icon={FileTextIcon} title="My Payslips">
                <p>Access your latest payslip and view your payment history.</p>
                <div className="mt-4 bg-slate-50 p-3 rounded-md border border-slate-200">
                    <p className="text-xs font-medium text-slate-500">Latest Net Pay</p>
                    <p className="text-xl font-bold text-indigo-600">{formatCurrency(latestPayroll.netTakeHomePay)}</p>
                </div>
            </DashboardCard>

            <DashboardCard to="leave" icon={CalendarIcon} title="Leave Management">
                <p>Check your leave balances and request time off.</p>
                <div className="mt-4 bg-slate-50 p-3 rounded-md border border-slate-200 grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-xs font-medium text-slate-500">Annual Leave</p>
                        <p className="text-xl font-bold text-slate-700">{employee.leaveBalances.annual} <span className="text-sm font-normal text-slate-500">days</span></p>
                    </div>
                     <div>
                        <p className="text-xs font-medium text-slate-500">Sick Leave</p>
                        <p className="text-xl font-bold text-slate-700">{employee.leaveBalances.sick} <span className="text-sm font-normal text-slate-500">days</span></p>
                    </div>
                </div>
                 <div className="mt-4">
                    <p className="text-xs font-medium text-slate-500">Latest Request Status</p>
                    {latestRequest ? (
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-slate-700 capitalize truncate pr-2">{latestRequest.leaveType} ({new Date(latestRequest.startDate).toLocaleDateString()})</p>
                            <StatusBadge status={latestRequest.status} />
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 mt-1 italic">No requests submitted yet.</p>
                    )}
                </div>
            </DashboardCard>

            <DashboardCard to="my-info" icon={UserPlusIcon} title="My Information">
                <p>View and request updates to your personal details.</p>
                 <div className="mt-4 bg-slate-50 p-3 rounded-md border border-slate-200">
                    <p className="text-xs font-medium text-slate-500">Email</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">{employee.email}</p>
                </div>
            </DashboardCard>
        </div>

         {/* Leave Request History Table */}
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Leave Request History</h2>
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                {leaveRequests.length > 0 ? (
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
                        {[...leaveRequests].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map(req => (
                        <tr key={req.id} className="border-b border-slate-200 last:border-b-0">
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
                <p className="text-slate-500 text-sm text-center p-6">You have not made any leave requests yet.</p>
                )}
            </div>
        </div>
    </div>
  );
};