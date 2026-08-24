import React from 'react';

interface RequestStatusBadgeProps {
  status: string;
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    SUBMITTED: { color: 'bg-gray-100 text-gray-800', label: 'Submitted' },
    MANAGER_APPROVED: { color: 'bg-blue-100 text-blue-800', label: 'Manager Approved' },
    MANAGER_REJECTED: { color: 'bg-red-100 text-red-800', label: 'Manager Rejected' },
    IT_REVIEW: { color: 'bg-yellow-100 text-yellow-800', label: 'IT Review' },
    APPROVED: { color: 'bg-green-100 text-green-800', label: 'Approved' },
    REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    ISSUED: { color: 'bg-purple-100 text-purple-800', label: 'Issued' },
    COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
    CANCELLED: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
  };

  const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
};

export default RequestStatusBadge;