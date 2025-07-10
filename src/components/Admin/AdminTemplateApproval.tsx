import React, { useState } from 'react';
import { Template } from '../../types';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

const AdminTemplateApproval: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Welcome Message',
      content: 'Welcome {{1}}! We\'re excited to have you join our service.',
      type: 'text',
      status: 'pending',
      variables: ['name'],
      category: 'onboarding',
      language: 'en',
      components: [
        {
          type: 'body',
          text: 'Welcome {{1}}! We\'re excited to have you join our service.',
          example: { body_text: [['John']] }
        }
      ],
      createdAt: new Date('2024-01-07T10:00:00'),
    },
    {
      id: '2',
      name: 'Order Confirmation',
      content: 'Your order #{{1}} has been confirmed and will be delivered by {{2}}.',
      type: 'text',
      status: 'pending',
      variables: ['order_id', 'delivery_date'],
      category: 'orders',
      language: 'en',
      components: [
        {
          type: 'body',
          text: 'Your order #{{1}} has been confirmed and will be delivered by {{2}}.',
          example: { body_text: [['12345', 'Jan 15, 2024']] }
        }
      ],
      createdAt: new Date('2024-01-07T11:00:00'),
    },
    {
      id: '3',
      name: 'Promotional Offer',
      content: 'Special offer! Get 20% off your next purchase. Use code: SAVE20',
      type: 'text',
      status: 'approved',
      variables: [],
      category: 'marketing',
      language: 'en',
      components: [
        {
          type: 'body',
          text: 'Special offer! Get 20% off your next purchase. Use code: SAVE20'
        }
      ],
      createdAt: new Date('2024-01-06T15:00:00'),
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleApprove = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, status: 'approved' as const } : t
    ));
  };

  const handleReject = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, status: 'rejected' as const } : t
    ));
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const getStatusColor = (status: Template['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      marketing: 'bg-purple-100 text-purple-800',
      orders: 'bg-blue-100 text-blue-800',
      support: 'bg-green-100 text-green-800',
      onboarding: 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const pendingTemplates = templates.filter(t => t.status === 'pending');
  const approvedTemplates = templates.filter(t => t.status === 'approved');
  const rejectedTemplates = templates.filter(t => t.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-800">{pendingTemplates.length}</div>
          <div className="text-sm text-yellow-600">Pending Approval</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-800">{approvedTemplates.length}</div>
          <div className="text-sm text-green-600">Approved</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-800">{rejectedTemplates.length}</div>
          <div className="text-sm text-red-600">Rejected</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Template Approval Queue</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {templates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {template.content}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{template.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Preview"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {template.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(template.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(template.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedTemplate.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedTemplate.category)}`}>
                    {selectedTemplate.category}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="bg-white rounded-lg p-4 max-w-sm mx-auto shadow-sm border">
                    {selectedTemplate.components.map((component, index) => (
                      <div key={index} className="mb-3">
                        {component.type === 'header' && component.text && (
                          <div className="font-semibold text-gray-900 mb-2">{component.text}</div>
                        )}
                        {component.type === 'body' && component.text && (
                          <div className="text-gray-800 mb-2">{component.text}</div>
                        )}
                        {component.type === 'footer' && component.text && (
                          <div className="text-xs text-gray-500 mt-2">{component.text}</div>
                        )}
                        {component.type === 'buttons' && component.buttons && (
                          <div className="space-y-1 mt-2">
                            {component.buttons.map((button, buttonIndex) => (
                              <button
                                key={buttonIndex}
                                className="w-full py-2 px-3 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50"
                              >
                                {button.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedTemplate.variables.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variables</label>
                  <div className="flex space-x-2">
                    {selectedTemplate.variables.map((variable, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {selectedTemplate.status === 'pending' && (
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    handleReject(selectedTemplate.id);
                    setShowPreview(false);
                  }}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedTemplate.id);
                    setShowPreview(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplateApproval;