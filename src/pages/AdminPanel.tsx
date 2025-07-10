import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import AdminPlansManager from '../components/Admin/AdminPlansManager';
import AdminUsersManager from '../components/Admin/AdminUsersManager';
import AdminTemplateApproval from '../components/Admin/AdminTemplateApproval';
import { 
  UsersIcon, 
  CreditCardIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'plans', name: 'Plans', icon: CreditCardIcon },
    { id: 'templates', name: 'Templates', icon: DocumentTextIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUsersManager />;
      case 'plans':
        return <AdminPlansManager />;
      case 'templates':
        return <AdminTemplateApproval />;
      case 'analytics':
        return <div className="text-center py-8 text-gray-500">Analytics coming soon...</div>;
      case 'settings':
        return <div className="text-center py-8 text-gray-500">Settings coming soon...</div>;
      case 'security':
        return <div className="text-center py-8 text-gray-500">Security coming soon...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Admin Panel" 
        subtitle="Manage users, plans, and system settings" 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Content */}
          <div className="lg:col-span-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;