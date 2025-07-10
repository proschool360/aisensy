import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import TemplateBuilder from '../components/Templates/TemplateBuilder';
import TemplateList from '../components/Templates/TemplateList';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Template } from '../types';

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Welcome Message',
      content: 'Welcome to our service! We\'re excited to have you.',
      type: 'text',
      status: 'approved',
      variables: ['name'],
      category: 'onboarding',
      language: 'en',
      components: [
        {
          type: 'body',
          text: 'Welcome {{1}}! We\'re excited to have you.',
          example: { body_text: [['John']] }
        }
      ],
      createdAt: new Date('2024-01-05T12:00:00'),
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
      createdAt: new Date('2024-01-06T14:00:00'),
    },
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowBuilder(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowBuilder(true);
  };

  const handleSaveTemplate = (template: Omit<Template, 'id' | 'createdAt'>) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...template, id: editingTemplate.id, createdAt: editingTemplate.createdAt }
          : t
      ));
    } else {
      const newTemplate: Template = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setShowBuilder(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  if (showBuilder) {
    return (
      <div className="flex-1 bg-gray-50">
        <Header 
          title={editingTemplate ? 'Edit Template' : 'Create Template'} 
          subtitle="Build WhatsApp message templates with rich content" 
        />
        <TemplateBuilder
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => setShowBuilder(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Templates" 
        subtitle="Manage your WhatsApp message templates" 
      />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleCreateTemplate}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Template
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {templates.length} templates
            </span>
          </div>
        </div>
        
        <TemplateList
          templates={templates}
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
        />
      </div>
    </div>
  );
};

export default Templates;