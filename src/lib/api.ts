import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  getMe: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  changePassword: (data: any) => api.put('/user/password', data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getStats: () => api.get('/user/stats'),
};

// WhatsApp API
export const whatsappAPI = {
  connect: (data: any) => api.post('/whatsapp/connect', data),
  getAccounts: () => api.get('/whatsapp/accounts'),
  sendMessage: (data: any) => api.post('/whatsapp/send-message', data),
};

// Contacts API
export const contactsAPI = {
  getContacts: (params?: any) => api.get('/contacts', { params }),
  createContact: (data: any) => api.post('/contacts', data),
  updateContact: (id: string, data: any) => api.put(`/contacts/${id}`, data),
  deleteContact: (id: string) => api.delete(`/contacts/${id}`),
  getContact: (id: string) => api.get(`/contacts/${id}`),
  bulkImport: (contacts: any[]) => api.post('/contacts/bulk-import', { contacts }),
};

// Templates API
export const templatesAPI = {
  getTemplates: (params?: any) => api.get('/templates', { params }),
  createTemplate: (data: any) => api.post('/templates', data),
  updateTemplate: (id: string, data: any) => api.put(`/templates/${id}`, data),
  deleteTemplate: (id: string) => api.delete(`/templates/${id}`),
  getTemplate: (id: string) => api.get(`/templates/${id}`),
  updateStatus: (id: string, data: any) => api.put(`/templates/${id}/status`, data),
};

// Campaigns API
export const campaignsAPI = {
  getCampaigns: (params?: any) => api.get('/campaigns', { params }),
  createCampaign: (data: any) => api.post('/campaigns', data),
  updateCampaign: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id: string) => api.delete(`/campaigns/${id}`),
  getCampaign: (id: string) => api.get(`/campaigns/${id}`),
  startCampaign: (id: string) => api.post(`/campaigns/${id}/start`),
  pauseCampaign: (id: string) => api.post(`/campaigns/${id}/pause`),
};

// Flows API
export const flowsAPI = {
  getFlows: (params?: any) => api.get('/flows', { params }),
  createFlow: (data: any) => api.post('/flows', data),
  updateFlow: (id: string, data: any) => api.put(`/flows/${id}`, data),
  deleteFlow: (id: string) => api.delete(`/flows/${id}`),
  getFlow: (id: string) => api.get(`/flows/${id}`),
  toggleFlow: (id: string) => api.post(`/flows/${id}/toggle`),
  executeFlow: (id: string, data: any) => api.post(`/flows/${id}/execute`, data),
};

// Messages API
export const messagesAPI = {
  getMessages: (params?: any) => api.get('/messages', { params }),
  getMessage: (id: string) => api.get(`/messages/${id}`),
  getConversation: (contactId: string, params?: any) => 
    api.get(`/messages/conversation/${contactId}`, { params }),
  getAnalytics: (params?: any) => api.get('/messages/analytics/overview', { params }),
};

// Tickets API
export const ticketsAPI = {
  getTickets: (params?: any) => api.get('/tickets', { params }),
  createTicket: (data: any) => api.post('/tickets', data),
  updateTicket: (id: string, data: any) => api.put(`/tickets/${id}`, data),
  deleteTicket: (id: string) => api.delete(`/tickets/${id}`),
  getTicket: (id: string) => api.get(`/tickets/${id}`),
  addMessage: (id: string, content: string) => 
    api.post(`/tickets/${id}/messages`, { content }),
};

// API Keys API
export const apiKeysAPI = {
  getApiKeys: (params?: any) => api.get('/api-keys', { params }),
  createApiKey: (data: any) => api.post('/api-keys', data),
  updateApiKey: (id: string, data: any) => api.put(`/api-keys/${id}`, data),
  deleteApiKey: (id: string) => api.delete(`/api-keys/${id}`),
  regenerateApiKey: (id: string) => api.post(`/api-keys/${id}/regenerate`),
};

// Payments API
export const paymentsAPI = {
  getPayments: (params?: any) => api.get('/payments', { params }),
  getPayment: (id: string) => api.get(`/payments/${id}`),
  createStripeIntent: (data: any) => api.post('/payments/stripe/create-intent', data),
  createRazorpayOrder: (data: any) => api.post('/payments/razorpay/create-order', data),
};

// Webhooks API
export const webhooksAPI = {
  getWebhooks: (params?: any) => api.get('/webhooks', { params }),
  createWebhook: (data: any) => api.post('/webhooks', data),
  updateWebhook: (id: string, data: any) => api.put(`/webhooks/${id}`, data),
  deleteWebhook: (id: string) => api.delete(`/webhooks/${id}`),
  testWebhook: (id: string) => api.post(`/webhooks/${id}/test`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getTemplates: (params?: any) => api.get('/admin/templates', { params }),
  getAnalytics: (params?: any) => api.get('/admin/analytics', { params }),
};

export default api;