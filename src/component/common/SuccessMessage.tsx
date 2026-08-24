import React from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onClose }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-green-800">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-green-500 hover:text-green-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;