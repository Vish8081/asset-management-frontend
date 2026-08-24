import React, { useEffect, useState } from 'react';
import { assetService } from '../../services/assetService';
import { Asset } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import AssetCard from './AssetCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { Link } from 'react-router-dom';

const AssetList: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    loadAssets();
  }, [user]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await assetService.getAll();
      
      // If employee, show only their assigned assets and available assets
      if (user?.role === 'EMPLOYEE') {
        const myAssets = data.filter(asset => 
          asset.currentOwner?.id === user.id || 
          asset.status === 'AVAILABLE'
        );
        setAssets(myAssets);
      } else {
        setAssets(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (asset.currentOwner?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (asset.currentOwner?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || asset.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorMessage message={error} onRetry={loadAssets} />;

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';
  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEmployee ? 'My Assets' : 'Assets'}
          </h1>
          <p className="text-gray-500">
            {isEmployee 
              ? 'View your assigned and available assets'
              : 'Manage all assets in the system'
            }
          </p>
        </div>
        {isAdminOrManager && (
          <Link
            to="/assets/create"
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Asset
          </Link>
        )}
      </div>

      {/* Employee Info Banner */}
      {isEmployee && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
          <UserIcon className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-blue-800">
              Showing assets assigned to you and available assets in the system.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              You have {assets.filter(a => a.currentOwner?.id === user.id && a.status === 'ASSIGNED').length} assets assigned to you.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={isEmployee ? "Search your assets..." : "Search assets..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="ALL">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="UNDER_REPAIR">Under Repair</option>
          <option value="RETIRED">Retired</option>
        </select>
        <button
          onClick={loadAssets}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Asset Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredAssets.length} of {assets.length} assets
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-2 text-gray-500">
              {isEmployee ? 'No assets assigned to you yet' : 'No assets found'}
            </p>
            {isEmployee && (
              <Link
                to="/requests/create"
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                Request an Asset
              </Link>
            )}
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onRefresh={loadAssets} />
          ))
        )}
      </div>
    </div>
  );
};

export default AssetList;