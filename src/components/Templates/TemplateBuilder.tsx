import React, { useState } from 'react';
import { Template, TemplateComponent } from '../../types';
import { PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface TemplateBuilderProps {
  template?: Template | null;
  onSave: (template: Omit<Template, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    category: template?.category || 'general',
    language: template?.language || 'en',
    type: template?.type || 'text' as const,
    status: template?.status || 'pending' as const,
  });

  const [components, setComponents] = useState<TemplateComponent[]>(
    template?.components || [
      { type: 'body', text: '' }
    ]
  );

  const [variables, setVariables] = useState<string[]>(template?.variables || []);
  const [showPreview, setShowPreview] = useState(false);

  const addComponent = (type: TemplateComponent['type']) => {
    const newComponent: TemplateComponent = { type, text: '' };
    if (type === 'buttons') {
      newComponent.buttons = [{ type: 'quick_reply', text: '' }];
    }
    setComponents([...components, newComponent]);
  };

  const updateComponent = (index: number, updates: Partial<TemplateComponent>) => {
    setComponents(prev => prev.map((comp, i) => 
      i === index ? { ...comp, ...updates } : comp
    ));
  };

  const removeComponent = (index: number) => {
    setComponents(prev => prev.filter((_, i) => i !== index));
  };

  const addVariable = () => {
    const varName = `variable_${variables.length + 1}`;
    setVariables([...variables, varName]);
  };

  const updateVariable = (index: number, value: string) => {
    setVariables(prev => prev.map((v, i) => i === index ? value : v));
  };

  const removeVariable = (index: number) => {
    setVariables(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const content = components
      .filter(c => c.text)
      .map(c => c.text)
      .join('\n');

    onSave({
      ...formData,
      content,
      components,
      variables,
    });
  };

  const renderComponentEditor = (component: TemplateComponent, index: number) => {
    return (
      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 capitalize">{component.type}</h4>
          <button
            onClick={() => removeComponent(index)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {component.type === 'header' && (
          <div className="space-y-3">
            <select
              value={component.format || 'text'}
              onChange={(e) => updateComponent(index, { format: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
            </select>
            <textarea
              value={component.text || ''}
              onChange={(e) => updateComponent(index, { text: e.target.value })}
              placeholder="Header text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        )}

        {(component.type === 'body' || component.type === 'footer') && (
          <textarea
            value={component.text || ''}
            onChange={(e) => updateComponent(index, { text: e.target.value })}
            placeholder={`${component.type} text... Use {{1}}, {{2}} for variables`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={component.type === 'body' ? 4 : 2}
          />
        )}

        {component.type === 'buttons' && (
          <div className="space-y-2">
            {component.buttons?.map((button, buttonIndex) => (
              <div key={buttonIndex} className="flex space-x-2">
                <select
                  value={button.type}
                  onChange={(e) => {
                    const newButtons = [...(component.buttons || [])];
                    newButtons[buttonIndex] = { ...button, type: e.target.value as any };
                    updateComponent(index, { buttons: newButtons });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="quick_reply">Quick Reply</option>
                  <option value="url">URL</option>
                  <option value="phone_number">Phone</option>
                </select>
                <input
                  type="text"
                  value={button.text}
                  onChange={(e) => {
                    const newButtons = [...(component.buttons || [])];
                    newButtons[buttonIndex] = { ...button, text: e.target.value };
                    updateComponent(index, { buttons: newButtons });
                  }}
                  placeholder="Button text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {button.type === 'url' && (
                  <input
                    type="url"
                    value={button.url || ''}
                    onChange={(e) => {
                      const newButtons = [...(component.buttons || [])];
                      newButtons[buttonIndex] = { ...button, url: e.target.value };
                      updateComponent(index, { buttons: newButtons });
                    }}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const newButtons = [...(component.buttons || []), { type: 'quick_reply' as const, text: '' }];
                updateComponent(index, { buttons: newButtons });
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Button
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Builder */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Details</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="marketing">Marketing</option>
                  <option value="orders">Orders</option>
                  <option value="support">Support</option>
                  <option value="onboarding">Onboarding</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="media">Media</option>
                  <option value="interactive">Interactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Variables */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Variables</h3>
              <button
                onClick={addVariable}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Variable
              </button>
            </div>
            
            <div className="space-y-2">
              {variables.map((variable, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={variable}
                    onChange={(e) => updateVariable(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Variable name"
                  />
                  <button
                    onClick={() => removeVariable(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Components */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Components</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => addComponent('header')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Header
                </button>
                <button
                  onClick={() => addComponent('footer')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Footer
                </button>
                <button
                  onClick={() => addComponent('buttons')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Buttons
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {components.map((component, index) => renderComponentEditor(component, index))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>
          
          {showPreview && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="bg-white rounded-lg p-4 max-w-sm mx-auto shadow-sm border">
                {components.map((component, index) => (
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
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Template
        </button>
      </div>
    </div>
  );
};

export default TemplateBuilder;