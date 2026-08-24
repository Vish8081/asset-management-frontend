import React from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface Activity {
  id: number | string;
  type: 'ASSIGN' | 'REQUEST' | 'RETURN' | 'REPAIR';
  message: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'ASSIGN':
        return <ComputerDesktopIcon className="h-5 w-5 text-green-500" />;
      case 'REQUEST':
        return <DocumentTextIcon className="h-5 w-5 text-yellow-500" />;
      case 'RETURN':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'REPAIR':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'ASSIGN':
        return 'bg-green-50 border-green-200';
      case 'REQUEST':
        return 'bg-yellow-50 border-yellow-200';
      case 'RETURN':
        return 'bg-blue-50 border-blue-200';
      case 'REPAIR':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <ClockIcon className="h-12 w-12 text-gray-300 mx-auto" />
        <p className="mt-2 text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`flex items-start space-x-3 p-3 rounded-lg border ${getColor(activity.type)} transition-colors`}
        >
          <div className="mt-0.5 flex-shrink-0">{getIcon(activity.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">{activity.message}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;