import React, { useState } from 'react';
import { Plan } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminPlansManager: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Starter',
      description: 'Perfect for small businesses',
      price: 29,
      currency: 'USD',
      interval: 'month',
      features: ['1,000 messages/month', '100 contacts', 'Basic templates', 'Email support'],
      limits: {
        contacts: 100,
        messages: 1000,
        templates: 5,
        campaigns: 3,
      },
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Professional',
      description: 'For growing businesses',
      price: 79,
      currency: 'USD',
      interval: 'month',
      features: ['10,000 messages/month', '1,000 contacts', 'Advanced templates', 'Priority support', 'Analytics'],
      limits: {
        contacts: 1000,
        messages: 10000,
        templates: 20,
        campaigns: 10,
      },
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 199,
      currency: 'USD',
      interval: 'month',
      features: ['Unlimited messages', 'Unlimited contacts', 'Custom templates', '24/7 support', 'Advanced analytics', 'API access'],
      limits: {
        contacts: -1,
        messages: -1,
        templates: -1,
        campaigns: -1,
      },
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    interval: 'month' as 'month' | 'year',
    features: [''],
    limits: {
      contacts: 0,
      messages: 0,
      templates: 0,
      campaigns: 0,
    },
  });

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      interval: 'month',
      features: [''],
      limits: {
        contacts: 0,
        messages: 0,
        templates: 0,
        campaigns: 0,
      },
    });
    setShowCreateModal(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      features: plan.features,
      limits: plan.limits,
    });
    setShowCreateModal(true);
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      setPlans(prev => prev.map(p => 
        p.id === editingPlan.id 
          ? { ...p, ...formData }
          : p
      ));
    } else {
      const newPlan: Plan = {
        ...formData,
        id: Date.now().toString(),
        isActive: true,
        createdAt: new Date(),
      };
      setPlans(prev => [...prev, newPlan]);
    }
    setShowCreateModal(false);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Plans Management</h2>
        <button
          onClick={handleCreatePlan}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{plan.description}</p>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-500">/{plan.interval}</span>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>Contacts: {plan.limits.contacts === -1 ? 'Unlimited' : plan.limits.contacts}</div>
              <div>Messages: {plan.limits.messages === -1 ? 'Unlimited' : plan.limits.messages}</div>
              <div>Templates: {plan.limits.templates === -1 ? 'Unlimited' : plan.limits.templates}</div>
              <div>Campaigns: {plan.limits.campaigns === -1 ? 'Unlimited' : plan.limits.campaigns}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPlan ? 'Edit Plan' : 'Create Plan'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: e.target.value as 'month' | 'year' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    onClick={addFeature}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Feature description"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limits</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Contacts</label>
                    <input
                      type="number"
                      value={formData.limits.contacts}
                      onChange={(e) => setFormData({
                        ...formData,
                        limits: { ...formData.limits, contacts: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Messages</label>
                    <input
                      type="number"
                      value={formData.limits.messages}
                      onChange={(e) => setFormData({
                        ...formData,
                        limits: { ...formData.limits, messages: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Templates</label>
                    <input
                      type="number"
                      value={formData.limits.templates}
                      onChange={(e) => setFormData({
                        ...formData,
                        limits: { ...formData.limits, templates: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Campaigns</label>
                    <input
                      type="number"
                      value={formData.limits.campaigns}
                      onChange={(e) => setFormData({
                        ...formData,
                        limits: { ...formData.limits, campaigns: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingPlan ? 'Update' : 'Create'} Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlansManager;