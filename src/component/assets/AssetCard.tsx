import React, { useState } from 'react';
import { Asset } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { assetService } from '../../services/assetService';
import {
  ComputerDesktopIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import ConfirmDialog from '../common/ConfirmDialog';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface AssetCardProps {
  asset: Asset;
  onRefresh: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onRefresh }) => {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusColors = {
    AVAILABLE: 'bg-green-100 text-green-800',
    ASSIGNED: 'bg-blue-100 text-blue-800',
    UNDER_REPAIR: 'bg-yellow-100 text-yellow-800',
    RETIRED: 'bg-gray-100 text-gray-800',
    LOST: 'bg-red-100 text-red-800',
    MAINTENANCE: 'bg-purple-100 text-purple-800',
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getAssetIcon = () => {
    return <ComputerDesktopIcon className="h-12 w-12 text-primary-500" />;
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await assetService.delete(asset.id);
      toast.success('Asset deleted successfully');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete asset');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleReturn = async () => {
    try {
      setLoading(true);
      await assetService.return(asset.id);
      toast.success('Asset returned successfully');
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to return asset');
    } finally {
      setLoading(false);
      setShowReturnDialog(false);
    }
  };

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              {getAssetIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{asset.name}</h3>
              <p className="text-xs text-gray-500">{asset.assetTag}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
            {asset.status.replace('_', ' ')}
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Type:</span> {asset.type}
          </p>
          {asset.model && (
            <p className="text-gray-600">
              <span className="font-medium">Model:</span> {asset.model}
            </p>
          )}
          {asset.manufacturer && (
            <p className="text-gray-600">
              <span className="font-medium">Manufacturer:</span> {asset.manufacturer}
            </p>
          )}
          {asset.currentOwner && (
            <p className="text-gray-600">
              <span className="font-medium">Assigned to:</span>{' '}
              {asset.currentOwner.firstName} {asset.currentOwner.lastName}
            </p>
          )}
          {asset.warrantyExpiryDate && (
            <p className="text-gray-600">
              <span className="font-medium">Warranty:</span>{' '}
              {new Date(asset.warrantyExpiryDate).toLocaleDateString()}
            </p>
          )}
          <p className="text-gray-600">
            <span className="font-medium">Encryption:</span>{' '}
            {asset.encryptionEnabled ? '✅ Enabled' : '❌ Disabled'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
          <Link
            to={`/assets/${asset.id}/edit`}
            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Link>
          
          {isAdminOrManager && asset.status === 'ASSIGNED' && (
            <button
              onClick={() => setShowReturnDialog(true)}
              disabled={loading}
              className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Return
            </button>
          )}
          
          {isAdminOrManager && asset.status === 'AVAILABLE' && (
            <Link
              to={`/assignments/create?assetId=${asset.id}`}
              className="flex items-center px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Assign
            </Link>
          )}
          
          {isAdminOrManager && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Asset"
        message={`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Delete"
        type="danger"
      />

      <ConfirmDialog
        open={showReturnDialog}
        title="Return Asset"
        message={`Are you sure you want to return "${asset.name}" from ${asset.currentOwner?.firstName} ${asset.currentOwner?.lastName}?`}
        onConfirm={handleReturn}
        onCancel={() => setShowReturnDialog(false)}
        confirmText="Return"
        type="warning"
      />
    </>
  );
};

export default AssetCard;