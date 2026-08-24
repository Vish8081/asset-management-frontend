import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { assetService } from '../../services/assetService';
import { AssetRequest, Asset } from '../../types';
import { useAuth } from '../../context/AuthContext';
import RequestStatusBadge from './RequestStatusBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<AssetRequest | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestData, assetsData] = await Promise.all([
        requestService.getById(Number(id)),
        assetService.getAvailable(),
      ]);
      setRequest(requestData);
      setAssets(assetsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleManagerApprove = async () => {
    if (!request || !user) return;
    try {
      setProcessing(true);
      await requestService.managerApprove(request.id, user.id, 'Approved by manager');
      toast.success('Request approved by manager');
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setProcessing(false);
    }
  };

  const handleITReview = async () => {
    if (!request || !user) return;
    try {
      setProcessing(true);
      await requestService.itReview(request.id, user.id, 'IT review completed');
      toast.success('IT review completed');
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to review');
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (!request || !selectedAssetId) return;
    try {
      setProcessing(true);
      await requestService.approve(request.id, selectedAssetId);
      toast.success('Request approved and asset assigned');
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setProcessing(false);
    }
  };

  const handleIssue = async () => {
    if (!request) return;
    try {
      setProcessing(true);
      await requestService.issue(request.id);
      toast.success('Asset issued successfully');
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to issue asset');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;
  if (!request) return <div className="text-center py-12">Request not found</div>;

  const canApproveAsManager = 
    user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' && request.status === 'SUBMITTED';
  
  const canDoITReview = 
    (user?.role === 'ADMIN' || user?.role === 'IT_SUPPORT') && request.status === 'MANAGER_APPROVED';
  
  const canApproveRequest = 
    (user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER' || user?.role === 'IT_SUPPORT') && 
    request.status === 'IT_REVIEW';
  
  const canIssueAsset = 
    (user?.role === 'ADMIN' || user?.role === 'IT_SUPPORT') && request.status === 'APPROVED';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Request #{request.id}</h1>
        <button
          onClick={() => navigate('/requests')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Requests
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Employee</h3>
            <p className="mt-1 text-sm text-gray-900">
              {request.employee.firstName} {request.employee.lastName}
            </p>
            <p className="text-sm text-gray-500">{request.employee.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-1">
              <RequestStatusBadge status={request.status} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Asset Type</h3>
            <p className="mt-1 text-sm text-gray-900">{request.assetType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(request.submittedDate).toLocaleString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-sm text-gray-900">{request.description}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Justification</h3>
            <p className="mt-1 text-sm text-gray-900">{request.justification}</p>
          </div>
          {request.managerComments && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Manager Comments</h3>
              <p className="mt-1 text-sm text-gray-900">{request.managerComments}</p>
            </div>
          )}
          {request.itComments && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">IT Comments</h3>
              <p className="mt-1 text-sm text-gray-900">{request.itComments}</p>
            </div>
          )}
          {request.assignedAsset && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Assigned Asset</h3>
              <p className="mt-1 text-sm text-gray-900">
                {request.assignedAsset.name} ({request.assignedAsset.assetTag})
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-3">
          {canApproveAsManager && (
            <button
              onClick={handleManagerApprove}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Approve as Manager'}
            </button>
          )}

          {canDoITReview && (
            <button
              onClick={handleITReview}
              disabled={processing}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Complete IT Review'}
            </button>
          )}

          {canApproveRequest && (
            <div className="flex items-center space-x-3">
              <select
                value={selectedAssetId || ''}
                onChange={(e) => setSelectedAssetId(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.assetTag})
                  </option>
                ))}
              </select>
              <button
                onClick={handleApprove}
                disabled={processing || !selectedAssetId}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Approve & Assign'}
              </button>
            </div>
          )}

          {canIssueAsset && (
            <button
              onClick={handleIssue}
              disabled={processing}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Issue Asset'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;