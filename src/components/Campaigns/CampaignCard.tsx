import React from 'react';
import { Campaign } from '../../types';
import { CalendarIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface CampaignCardProps {
  campaign: Campaign;
  onSelect: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onSelect }) => {
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const deliveryRate = campaign.metrics.sent > 0 
    ? ((campaign.metrics.delivered / campaign.metrics.sent) * 100).toFixed(1)
    : '0';

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
      onClick={() => onSelect(campaign)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center text-sm text-gray-500">
              <UsersIcon className="h-4 w-4 mr-1" />
              {campaign.targetSegments.length} segment{campaign.targetSegments.length !== 1 ? 's' : ''}
            </div>
            {campaign.scheduledAt && (
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(campaign.scheduledAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
          {campaign.status}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{campaign.metrics.sent}</div>
          <div className="text-xs text-gray-500">Sent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{campaign.metrics.delivered}</div>
          <div className="text-xs text-gray-500">Delivered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{campaign.metrics.read}</div>
          <div className="text-xs text-gray-500">Read</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{campaign.metrics.failed}</div>
          <div className="text-xs text-gray-500">Failed</div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <ChartBarIcon className="h-4 w-4 mr-1" />
          Delivery Rate: {deliveryRate}%
        </div>
        <div className="text-xs text-gray-500">
          Created {new Date(campaign.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;