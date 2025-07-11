import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface QuotaBadgeProps {
  used: number;
  limit: number;
  resource: string;
  className?: string;
}

const QuotaBadge: React.FC<QuotaBadgeProps> = ({ used, limit, resource, className = '' }) => {
  if (limit === -1) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ${className}`}>
        Unlimited
      </span>
    );
  }

  const percentage = (used / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;

  const getColor = () => {
    if (isOverLimit) return 'bg-red-100 text-red-800';
    if (isNearLimit) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()} ${className}`}>
      {isNearLimit && <ExclamationTriangleIcon className="h-3 w-3 mr-1" />}
      {used}/{limit} {resource}
    </span>
  );
};

export default QuotaBadge;