export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  planId?: string;
  isActive: boolean;
  permissions: string[];
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  segments: string[];
  attributes: Record<string, any>;
  lastMessageAt?: Date;
  status: 'active' | 'inactive' | 'blocked';
  source: 'manual' | 'import' | 'api' | 'woocommerce' | 'zapier';
  customFields: Record<string, any>;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  contactCount: number;
  createdAt: Date;
}

export interface Attribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  options?: string[];
  required: boolean;
  defaultValue?: any;
  createdAt: Date;
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'template';
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  mediaUrl?: string;
  templateId?: string;
}

export interface Campaign {
  id: string;
  name: string;
  templateId: string;
  targetSegments: string[];
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  metrics: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
  };
  createdAt: Date;
  flowId?: string;
  triggers: CampaignTrigger[];
}

export interface CampaignTrigger {
  id: string;
  type: 'time' | 'event' | 'condition';
  config: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  type: 'text' | 'media' | 'interactive';
  status: 'pending' | 'approved' | 'rejected';
  variables: string[];
  createdAt: Date;
  category: string;
  language: string;
  components: TemplateComponent[];
}

export interface TemplateComponent {
  type: 'header' | 'body' | 'footer' | 'buttons';
  format?: 'text' | 'image' | 'video' | 'document';
  text?: string;
  example?: any;
  buttons?: TemplateButton[];
}

export interface TemplateButton {
  type: 'quick_reply' | 'url' | 'phone_number';
  text: string;
  url?: string;
  phone_number?: string;
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  isActive: boolean;
  createdAt: Date;
  triggers: FlowTrigger[];
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'webhook';
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, any>;
}

export interface FlowTrigger {
  type: 'keyword' | 'time' | 'event' | 'webhook';
  config: Record<string, any>;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    contacts: number;
    messages: number;
    templates: number;
    campaigns: number;
  };
  isActive: boolean;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'woocommerce' | 'zapier' | 'webhook' | 'api';
  config: Record<string, any>;
  isActive: boolean;
  lastSync?: Date;
  createdAt: Date;
}

export interface Analytics {
  totalMessages: number;
  deliveryRate: number;
  readRate: number;
  responseRate: number;
  activeContacts: number;
  messageHistory: Array<{
    date: string;
    sent: number;
    delivered: number;
    read: number;
  }>;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  example: any;
}

export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: any;
}

export interface APIResponse {
  status: number;
  description: string;
  example: any;
}