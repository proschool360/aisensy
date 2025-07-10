import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import { APIEndpoint } from '../types';
import { DocumentTextIcon, CodeBracketIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const APIDocumentation: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);

  const endpoints: APIEndpoint[] = [
    {
      method: 'POST',
      path: '/api/messages/send',
      description: 'Send a WhatsApp message to a contact',
      parameters: [
        { name: 'to', type: 'string', required: true, description: 'Phone number with country code', example: '+1234567890' },
        { name: 'message', type: 'string', required: true, description: 'Message content', example: 'Hello World!' },
        { name: 'type', type: 'string', required: false, description: 'Message type', example: 'text' },
      ],
      responses: [
        { status: 200, description: 'Message sent successfully', example: { id: 'msg_123', status: 'sent' } },
        { status: 400, description: 'Invalid request', example: { error: 'Invalid phone number' } },
      ],
      example: {
        request: {
          to: '+1234567890',
          message: 'Hello World!',
          type: 'text'
        },
        response: {
          id: 'msg_123',
          status: 'sent',
          timestamp: '2024-01-07T10:00:00Z'
        }
      }
    },
    {
      method: 'GET',
      path: '/api/contacts',
      description: 'Retrieve all contacts',
      parameters: [
        { name: 'page', type: 'number', required: false, description: 'Page number', example: 1 },
        { name: 'limit', type: 'number', required: false, description: 'Items per page', example: 50 },
        { name: 'search', type: 'string', required: false, description: 'Search query', example: 'john' },
      ],
      responses: [
        { status: 200, description: 'Contacts retrieved successfully', example: { contacts: [], total: 0, page: 1 } },
      ],
      example: {
        request: 'GET /api/contacts?page=1&limit=10',
        response: {
          contacts: [
            { id: '1', name: 'John Doe', phone: '+1234567890', status: 'active' }
          ],
          total: 1,
          page: 1,
          limit: 10
        }
      }
    },
    {
      method: 'POST',
      path: '/api/contacts',
      description: 'Create a new contact',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Contact name', example: 'John Doe' },
        { name: 'phone', type: 'string', required: true, description: 'Phone number', example: '+1234567890' },
        { name: 'email', type: 'string', required: false, description: 'Email address', example: 'john@example.com' },
        { name: 'tags', type: 'array', required: false, description: 'Contact tags', example: ['customer', 'vip'] },
      ],
      responses: [
        { status: 201, description: 'Contact created successfully', example: { id: '1', name: 'John Doe' } },
        { status: 400, description: 'Invalid request', example: { error: 'Phone number already exists' } },
      ],
      example: {
        request: {
          name: 'John Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          tags: ['customer']
        },
        response: {
          id: '1',
          name: 'John Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          tags: ['customer'],
          status: 'active',
          createdAt: '2024-01-07T10:00:00Z'
        }
      }
    },
    {
      method: 'POST',
      path: '/api/campaigns',
      description: 'Create a new campaign',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Campaign name', example: 'Product Launch' },
        { name: 'templateId', type: 'string', required: true, description: 'Template ID', example: 'template_123' },
        { name: 'targetSegments', type: 'array', required: true, description: 'Target segments', example: ['premium', 'vip'] },
        { name: 'scheduledAt', type: 'string', required: false, description: 'Schedule time (ISO)', example: '2024-01-08T10:00:00Z' },
      ],
      responses: [
        { status: 201, description: 'Campaign created successfully', example: { id: 'camp_123', status: 'draft' } },
        { status: 400, description: 'Invalid request', example: { error: 'Template not found' } },
      ],
      example: {
        request: {
          name: 'Product Launch',
          templateId: 'template_123',
          targetSegments: ['premium'],
          scheduledAt: '2024-01-08T10:00:00Z'
        },
        response: {
          id: 'camp_123',
          name: 'Product Launch',
          status: 'scheduled',
          createdAt: '2024-01-07T10:00:00Z'
        }
      }
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="API Documentation" 
        subtitle="Complete reference for WhatsApp Cloud API integration" 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Endpoints List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">API Endpoints</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedEndpoint === endpoint ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedEndpoint(endpoint)}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <span className="text-sm font-mono text-gray-900">{endpoint.path}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Endpoint Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedEndpoint ? (
              <>
                {/* Overview */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(selectedEndpoint.method)}`}>
                      {selectedEndpoint.method}
                    </span>
                    <span className="text-lg font-mono text-gray-900">{selectedEndpoint.path}</span>
                  </div>
                  <p className="text-gray-600">{selectedEndpoint.description}</p>
                </div>

                {/* Parameters */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Name</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Type</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Required</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <tr key={index}>
                            <td className="py-2 text-sm font-mono text-gray-900">{param.name}</td>
                            <td className="py-2 text-sm text-gray-600">{param.type}</td>
                            <td className="py-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {param.required ? 'Required' : 'Optional'}
                              </span>
                            </td>
                            <td className="py-2 text-sm text-gray-600">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Responses */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Responses</h4>
                  <div className="space-y-4">
                    {selectedEndpoint.responses.map((response, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            response.status === 200 || response.status === 201 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {response.status}
                          </span>
                          <span className="text-sm text-gray-900">{response.description}</span>
                        </div>
                        <SyntaxHighlighter
                          language="json"
                          style={tomorrow}
                          className="text-xs"
                        >
                          {JSON.stringify(response.example, null, 2)}
                        </SyntaxHighlighter>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Example</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Request</h5>
                      <SyntaxHighlighter
                        language="json"
                        style={tomorrow}
                        className="text-sm"
                      >
                        {typeof selectedEndpoint.example.request === 'string' 
                          ? selectedEndpoint.example.request
                          : JSON.stringify(selectedEndpoint.example.request, null, 2)
                        }
                      </SyntaxHighlighter>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Response</h5>
                      <SyntaxHighlighter
                        language="json"
                        style={tomorrow}
                        className="text-sm"
                      >
                        {JSON.stringify(selectedEndpoint.example.response, null, 2)}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                {/* Try It Out */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Try It Out</h4>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Send Request
                    </button>
                  </div>
                  <div className="space-y-4">
                    {selectedEndpoint.parameters.map((param, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {param.name} {param.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          placeholder={param.example?.toString() || param.description}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Endpoint</h3>
                <p className="text-gray-600">Choose an API endpoint from the list to view its documentation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;