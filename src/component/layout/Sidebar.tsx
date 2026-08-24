import React from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard', roles: ['ADMIN', 'ASSET_MANAGER', 'IT_SUPPORT', 'EMPLOYEE'] },
    { path: '/assets', icon: ComputerDesktopIcon, label: 'Assets', roles: ['ADMIN', 'ASSET_MANAGER', 'IT_SUPPORT'] },
    { path: '/requests', icon: ClipboardDocumentListIcon, label: 'Requests', roles: ['ADMIN', 'ASSET_MANAGER', 'IT_SUPPORT', 'EMPLOYEE'] },
    { path: '/assignments', icon: UserGroupIcon, label: 'Assignments', roles: ['ADMIN', 'ASSET_MANAGER', 'IT_SUPPORT'] },
    { path: '/reports', icon: ChartBarIcon, label: 'Reports', roles: ['ADMIN', 'ASSET_MANAGER'] },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings', roles: ['ADMIN'] },
    { path: '/assignments/create', icon: UserPlusIcon, label: 'New Assignment', roles: ['ADMIN', 'ASSET_MANAGER'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Asset Management</p>
            <p className="text-xs text-gray-500">v1.0.0</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 px-2">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-1 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className={`h-5 w-5 mr-3 ${
              window.location.pathname === item.path ? 'text-primary-600' : 'text-gray-400'
            }`} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-xs font-medium text-gray-900">System Status</p>
            <p className="text-xs text-gray-500">All systems operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;