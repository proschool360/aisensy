import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import CampaignCard from '../components/Campaigns/CampaignCard';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Campaign } from '../types';

const Campaigns: React.FC = () => {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Product Launch Campaign',
      templateId: 'template1',
      targetSegments: ['Premium', 'VIP'],
      scheduledAt: new Date('2024-01-08T10:00:00'),
      status: 'scheduled',
      metrics: {
        sent: 1250,
        delivered: 1180,
        read: 945,
        failed: 70,
      },
      createdAt: new Date('2024-01-05T12:00:00'),
    },
    {
      id: '2',
      name: 'Holiday Promotion',
      templateId: 'template2',
      targetSegments: ['Regular', 'Prospects'],
      status: 'completed',
      metrics: {
        sent: 2340,
        delivered: 2198,
        read: 1876,
        failed: 142,
      },
      createdAt: new Date('2024-01-03T09:00:00'),
    },
    {
      id: '3',
      name: 'Customer Feedback Survey',
      templateId: 'template3',
      targetSegments: ['Premium'],
      status: 'active',
      metrics: {
        sent: 567,
        delivered: 534,
        read: 423,
        failed: 33,
      },
      createdAt: new Date('2024-01-06T14:00:00'),
    },
  ]);

  const handleCampaignSelect = (campaign: Campaign) => {
    console.log('Selected campaign:', campaign);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Campaigns" 
        subtitle="Create and manage your WhatsApp marketing campaigns" 
      />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Campaign
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {campaigns.length} campaigns
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onSelect={handleCampaignSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;