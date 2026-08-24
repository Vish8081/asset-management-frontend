import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { assetService } from '../../services/assetService';
import { Asset } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ReturnAssetModal from '../common/ReturnAssetModal';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AssignmentList: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const allAssets = await assetService.getAll();
      const assignedAssets = allAssets.filter(a => a.status === 'ASSIGNED');
      setAssets(assignedAssets);
    } catch (err: any) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowReturnModal(true);
  };

  const handleReturnSuccess = async () => {
    await loadAssignments();
    setShowReturnModal(false);
    setSelectedAsset(null);
  };

  const getDepartments = () => {
    const depts = new Set<string>();
    assets.forEach(asset => {
      if (asset.currentOwner?.department) {
        depts.add(asset.currentOwner.department);
      }
    });
    return ['ALL', ...Array.from(depts)];
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.currentOwner?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (asset.currentOwner?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      filterDepartment === 'ALL' || 
      asset.currentOwner?.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  // Stats
  const totalAssignments = assets.length;
  const activeAssignments = assets.filter(a => a.currentOwner?.isActive !== false).length;
  const overdueReturns = assets.filter(a => 
    a.returnDate && new Date(a.returnDate) < new Date()
  ).length;

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorMessage message={error} onRetry={loadAssignments} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Assignments</h1>
          <p className="text-gray-500">View and manage all asset assignments</p>
        </div>
        <div className="flex space-x-3">
          {isAdminOrManager && (
            <Link
              to="/assignments/create"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Assignment
            </Link>
          )}
          <Link
            to="/assets"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Manage Assets
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalAssignments}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeAssignments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Returns</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{overdueReturns}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by asset name, tag, or employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {getDepartments().map(dept => (
            <option key={dept} value={dept}>
              {dept === 'ALL' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
        <button
          onClick={loadAssignments}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">No assignments found</p>
            {isAdminOrManager && (
              <Link
                to="/assignments/create"
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New Assignment
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => {
                  const isOverdue = asset.returnDate && new Date(asset.returnDate) < new Date();
                  const isActive = asset.currentOwner?.isActive !== false;

                  return (
                    <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-xs">
                              {asset.assetTag.split('-')[0]}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                            <p className="text-xs text-gray-500">{asset.assetTag}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {asset.currentOwner?.firstName} {asset.currentOwner?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{asset.currentOwner?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {asset.currentOwner?.department || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {asset.assignedDate ? new Date(asset.assignedDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {asset.returnDate ? new Date(asset.returnDate).toLocaleDateString() : 'N/A'}
                          {isOverdue && ' (Overdue)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/assets/${asset.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                          {isAdminOrManager && (
                            <button
                              onClick={() => handleReturnClick(asset)}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <ArrowPathIcon className="h-4 w-4 mr-1" />
                              Return
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Return Asset Modal */}
      {selectedAsset && (
        <ReturnAssetModal
          open={showReturnModal}
          assetId={selectedAsset.id}
          assetName={selectedAsset.name}
          assignedTo={`${selectedAsset.currentOwner?.firstName} ${selectedAsset.currentOwner?.lastName}`}
          onClose={() => {
            setShowReturnModal(false);
            setSelectedAsset(null);
          }}
          onSuccess={handleReturnSuccess}
        />
      )}

      {/* Summary Footer */}
      {filteredAssets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 space-y-2 md:space-y-0">
            <span>Showing {filteredAssets.length} of {assets.length} assignments</span>
            <div className="flex space-x-4">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {assets.filter(a => a.currentOwner?.isActive !== false).length} active
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                {assets.filter(a => a.currentOwner?.isActive === false).length} inactive
              </span>
              {overdueReturns > 0 && (
                <span className="flex items-center text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {overdueReturns} overdue
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;