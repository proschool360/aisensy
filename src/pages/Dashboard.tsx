import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { userAPI, messagesAPI } from '../lib/api';
import Header from '../components/Layout/Header';
import MetricsCard from '../components/Dashboard/MetricsCard';
import AnalyticsChart from '../components/Dashboard/AnalyticsChart';
import RecentMessages from '../components/Dashboard/RecentMessages';
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  MegaphoneIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { data: stats, loading: statsLoading } = useApi(() => userAPI.getStats());
  const { data: analytics, loading: analyticsLoading } = useApi(() => messagesAPI.getAnalytics());
  const { data: messages, loading: messagesLoading } = useApi(() => 
    messagesAPI.getMessages({ limit: 10 })
  );

  if (statsLoading || analyticsLoading || messagesLoading) {
    return (
      <div className="flex-1 bg-gray-50">
        <Header title="Dashboard" subtitle="Loading..." />
        <div className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-32 border border-gray-200"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl h-96 border border-gray-200"></div>
              <div className="bg-white rounded-xl h-96 border border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const deliveryRate = stats?.messageStats?.delivered && stats?.messageStats?.sent 
    ? ((stats.messageStats.delivered / stats.messageStats.sent) * 100).toFixed(1)
    : '0';

  const readRate = stats?.messageStats?.read && stats?.messageStats?.sent
    ? ((stats.messageStats.read / stats.messageStats.sent) * 100).toFixed(1)
    : '0';

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening with your WhatsApp campaigns." 
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Messages"
            value={stats?.messages?.toLocaleString() || '0'}
            change={12.5}
            changeType="increase"
            icon={ChatBubbleLeftRightIcon}
            color="blue"
          />
          <MetricsCard
            title="Active Contacts"
            value={stats?.contacts?.toLocaleString() || '0'}
            change={8.2}
            changeType="increase"
            icon={UserGroupIcon}
            color="green"
          />
          <MetricsCard
            title="Delivery Rate"
            value={`${deliveryRate}%`}
            change={2.1}
            changeType="increase"
            icon={ChartBarIcon}
            color="purple"
          />
          <MetricsCard
            title="Read Rate"
            value={`${readRate}%`}
            change={1.8}
            changeType="increase"
            icon={MegaphoneIcon}
            color="orange"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics?.dailyStats && (
            <AnalyticsChart data={analytics.dailyStats} type="line" />
          )}
          {messages?.messages && (
            <RecentMessages messages={messages.messages} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;