import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import { 
  UserIcon, 
  KeyIcon, 
  BellIcon, 
  GlobeAltIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      timezone: 'UTC-5',
    },
    api: {
      whatsappToken: 'EAAxxxxxxxxxxxxxxx',
      whatsappPhoneId: '1234567890',
      webhookUrl: 'https://your-domain.com/webhook',
      webhookSecret: 'your-webhook-secret',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      messageDelivery: true,
      campaignUpdates: true,
      systemAlerts: true,
    },
    integrations: {
      woocommerce: {
        enabled: false,
        url: '',
        consumerKey: '',
        consumerSecret: '',
      },
      zapier: {
        enabled: false,
        webhookUrl: '',
      },
      pabbly: {
        enabled: false,
        apiKey: '',
      },
    },
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'api', name: 'API Settings', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'integrations', name: 'Integrations', icon: LinkIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
  ];

  const updateSettings = (section: string, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...updates }
    }));
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => updateSettings('profile', { name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => updateSettings('profile', { email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => updateSettings('profile', { phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            value={settings.profile.company}
            onChange={(e) => updateSettings('profile', { company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Keep your API credentials secure. Never share them publicly.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Access Token</label>
          <input
            type="password"
            value={settings.api.whatsappToken}
            onChange={(e) => updateSettings('api', { whatsappToken: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="EAAxxxxxxxxxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
          <input
            type="text"
            value={settings.api.whatsappPhoneId}
            onChange={(e) => updateSettings('api', { whatsappPhoneId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="1234567890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
          <input
            type="url"
            value={settings.api.webhookUrl}
            onChange={(e) => updateSettings('api', { webhookUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://your-domain.com/webhook"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
          <input
            type="password"
            value={settings.api.webhookSecret}
            onChange={(e) => updateSettings('api', { webhookSecret: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="your-webhook-secret"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-sm text-gray-500">
                Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => updateSettings('notifications', { [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-8">
      {/* WooCommerce */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">WooCommerce</h3>
            <p className="text-sm text-gray-500">Connect your WooCommerce store</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.integrations.woocommerce.enabled}
              onChange={(e) => updateSettings('integrations', {
                woocommerce: { ...settings.integrations.woocommerce, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {settings.integrations.woocommerce.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
              <input
                type="url"
                value={settings.integrations.woocommerce.url}
                onChange={(e) => updateSettings('integrations', {
                  woocommerce: { ...settings.integrations.woocommerce, url: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-store.com"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consumer Key</label>
                <input
                  type="text"
                  value={settings.integrations.woocommerce.consumerKey}
                  onChange={(e) => updateSettings('integrations', {
                    woocommerce: { ...settings.integrations.woocommerce, consumerKey: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ck_xxxxxxxxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consumer Secret</label>
                <input
                  type="password"
                  value={settings.integrations.woocommerce.consumerSecret}
                  onChange={(e) => updateSettings('integrations', {
                    woocommerce: { ...settings.integrations.woocommerce, consumerSecret: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="cs_xxxxxxxxxxxxxxxx"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zapier */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Zapier</h3>
            <p className="text-sm text-gray-500">Automate workflows with Zapier</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.integrations.zapier.enabled}
              onChange={(e) => updateSettings('integrations', {
                zapier: { ...settings.integrations.zapier, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {settings.integrations.zapier.enabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
            <input
              type="url"
              value={settings.integrations.zapier.webhookUrl}
              onChange={(e) => updateSettings('integrations', {
                zapier: { ...settings.integrations.zapier, webhookUrl: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://hooks.zapier.com/hooks/catch/..."
            />
          </div>
        )}
      </div>

      {/* Pabbly */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Pabbly Connect</h3>
            <p className="text-sm text-gray-500">Connect with Pabbly automation</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.integrations.pabbly.enabled}
              onChange={(e) => updateSettings('integrations', {
                pabbly: { ...settings.integrations.pabbly, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {settings.integrations.pabbly.enabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="password"
              value={settings.integrations.pabbly.apiKey}
              onChange={(e) => updateSettings('integrations', {
                pabbly: { ...settings.integrations.pabbly, apiKey: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Your Pabbly API key"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'api':
        return renderAPISettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'integrations':
        return renderIntegrationSettings();
      case 'security':
        return <div className="text-center py-8 text-gray-500">Security settings coming soon...</div>;
      case 'billing':
        return <div className="text-center py-8 text-gray-500">Billing settings coming soon...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Settings" 
        subtitle="Manage your account and application settings" 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
            </div>
            
            {renderTabContent()}
            
            <div className="flex justify-end mt-8">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;