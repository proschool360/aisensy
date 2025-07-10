import React, { useState } from 'react';
import { Node } from 'react-flow-renderer';

interface FlowNodeEditorProps {
  node: Node;
  onUpdate: (data: any) => void;
}

const FlowNodeEditor: React.FC<FlowNodeEditorProps> = ({ node, onUpdate }) => {
  const [nodeData, setNodeData] = useState(node.data);

  const handleUpdate = (updates: any) => {
    const newData = { ...nodeData, ...updates };
    setNodeData(newData);
    onUpdate(newData);
  };

  const renderEditor = () => {
    const nodeType = nodeData.nodeType || 'default';

    switch (nodeType) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
              <select
                value={nodeData.triggerType || 'keyword'}
                onChange={(e) => handleUpdate({ triggerType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="keyword">Keyword</option>
                <option value="time">Time-based</option>
                <option value="event">Event</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            
            {nodeData.triggerType === 'keyword' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  value={nodeData.keywords || ''}
                  onChange={(e) => handleUpdate({ keywords: e.target.value })}
                  placeholder="hello, hi, start"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {nodeData.triggerType === 'time' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input
                  type="datetime-local"
                  value={nodeData.schedule || ''}
                  onChange={(e) => handleUpdate({ schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition Type</label>
              <select
                value={nodeData.conditionType || 'text_contains'}
                onChange={(e) => handleUpdate({ conditionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="text_contains">Text Contains</option>
                <option value="text_equals">Text Equals</option>
                <option value="user_attribute">User Attribute</option>
                <option value="tag_has">Has Tag</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                type="text"
                value={nodeData.conditionValue || ''}
                onChange={(e) => handleUpdate({ conditionValue: e.target.value })}
                placeholder="Condition value"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
              <select
                value={nodeData.actionType || 'send_message'}
                onChange={(e) => handleUpdate({ actionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="send_message">Send Message</option>
                <option value="add_tag">Add Tag</option>
                <option value="remove_tag">Remove Tag</option>
                <option value="update_attribute">Update Attribute</option>
                <option value="send_template">Send Template</option>
              </select>
            </div>
            
            {nodeData.actionType === 'send_message' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={nodeData.message || ''}
                  onChange={(e) => handleUpdate({ message: e.target.value })}
                  placeholder="Enter your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            )}
            
            {(nodeData.actionType === 'add_tag' || nodeData.actionType === 'remove_tag') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <input
                  type="text"
                  value={nodeData.tag || ''}
                  onChange={(e) => handleUpdate({ tag: e.target.value })}
                  placeholder="Tag name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delay Duration</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={nodeData.delayValue || 1}
                  onChange={(e) => handleUpdate({ delayValue: parseInt(e.target.value) })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <select
                  value={nodeData.delayUnit || 'minutes'}
                  onChange={(e) => handleUpdate({ delayUnit: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
              <input
                type="url"
                value={nodeData.webhookUrl || ''}
                onChange={(e) => handleUpdate({ webhookUrl: e.target.value })}
                placeholder="https://your-webhook-url.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select
                value={nodeData.webhookMethod || 'POST'}
                onChange={(e) => handleUpdate({ webhookMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headers (JSON)</label>
              <textarea
                value={nodeData.webhookHeaders || '{}'}
                onChange={(e) => handleUpdate({ webhookHeaders: e.target.value })}
                placeholder='{"Content-Type": "application/json"}'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={nodeData.label || ''}
              onChange={(e) => handleUpdate({ label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">
          {nodeData.label || 'Node'} Settings
        </h4>
      </div>
      {renderEditor()}
    </div>
  );
};

export default FlowNodeEditor;