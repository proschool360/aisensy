import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  FolderIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  Cog8ToothIcon,
  CodeBracketIcon,
  RectangleGroupIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const userNavigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Contacts', href: '/contacts', icon: UsersIcon },
    { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Campaigns', href: '/campaigns', icon: MegaphoneIcon },
    { name: 'Templates', href: '/templates', icon: DocumentTextIcon },
    { name: 'Flow Builder', href: '/flows', icon: RectangleGroupIcon },
    { name: 'Retargeting', href: '/retargeting', icon: MegaphoneIcon },
    { name: 'API Docs', href: '/api-docs', icon: CodeBracketIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: Cog8ToothIcon },
  ];

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const navigation = isAdmin ? [...userNavigation, ...adminNavigation] : userNavigation;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 border-r border-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-white">WhatsApp Hub</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
              {user?.firstName?.charAt(0).toUpperCase() || 'U'}
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;