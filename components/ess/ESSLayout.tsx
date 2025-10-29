import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import type { Employee } from '../../types';
import { FileTextIcon, CalendarIcon, UserPlusIcon, LogOutIcon, CheckCircleIcon } from '../icons';

interface Props {
  employee: Employee;
  onLogout: () => void;
}

const navLinks = [
  { to: 'dashboard', icon: CheckCircleIcon, label: 'Dashboard' },
  { to: 'payslips', icon: FileTextIcon, label: 'Payslips' },
  { to: 'leave', icon: CalendarIcon, label: 'Leave' },
  { to: 'my-info', icon: UserPlusIcon, label: 'My Info' },
];

export const ESSLayout: React.FC<Props> = ({ employee, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <h1 className="text-xl font-bold text-indigo-600">PaySaaS NG</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
            <button onClick={onLogout} className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <LogOutIcon className="w-5 h-5" />
              Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex-shrink-0 flex items-center justify-end px-6">
            <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{employee.firstName} {employee.lastName}</p>
                <p className="text-xs text-slate-500">{employee.jobTitle}</p>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};
