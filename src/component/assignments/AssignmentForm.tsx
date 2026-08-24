import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assetService } from '../../services/assetService';
import { userService } from '../../services/userService';
import { Asset, User } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import toast from 'react-hot-toast';

interface AssignmentFormProps {
  assetId?: number;
  onSuccess?: () => void;
}

interface FormData {
  assetId: string;
  userId: string;
  returnDate: string;
  notes: string;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ assetId: propAssetId, onSuccess }) => {
  const navigate = useNavigate();
  const { assetId: paramAssetId } = useParams<{ assetId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    assetId: propAssetId?.toString() || paramAssetId || '',
    userId: '',
    returnDate: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError('');
      
      // Fetch available assets and all users
      const [availableAssets, allUsers] = await Promise.all([
        assetService.getAvailable(),
        userService.getAll(),
      ]);
      
      console.log('Available Assets:', availableAssets); // Debug log
      console.log('All Users:', allUsers); // Debug log
      
      setAssets(availableAssets);
      setEmployees(allUsers.filter(emp => emp.role === 'EMPLOYEE' || emp.role === 'IT_SUPPORT'));
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const assetIdStr = formData.assetId.toString();
      const userIdStr = formData.userId.toString();
      
      if (!assetIdStr || !userIdStr) {
        toast.error('Please select both an asset and an employee');
        setLoading(false);
        return;
      }

      const assetIdNum = parseInt(assetIdStr, 10);
      const userIdNum = parseInt(userIdStr, 10);

      if (isNaN(assetIdNum) || isNaN(userIdNum)) {
        toast.error('Invalid selection');
        setLoading(false);
        return;
      }

      console.log('Assigning Asset:', { assetIdNum, userIdNum }); // Debug log
      
      await assetService.assign(assetIdNum, userIdNum);
      
      toast.success('Asset assigned successfully!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/assignments');
      }
    } catch (err: any) {
      console.error('Assignment error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to assign asset';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <LoadingSpinner size="large" />;

  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  if (!isAdminOrManager) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">You don't have permission to assign assets.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {propAssetId || paramAssetId ? 'Update Assignment' : 'New Asset Assignment'}
        </h2>
        <button
          onClick={() => navigate('/assignments')}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset to Assign *
            </label>
            <select
              name="assetId"
              value={formData.assetId}
              onChange={handleChange}
              required
              disabled={!!(propAssetId || paramAssetId)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
            >
              <option value="">Select an asset</option>
              {assets.length === 0 ? (
                <option value="" disabled>No available assets</option>
              ) : (
                assets.map((asset) => (
                  <option key={asset.id} value={asset.id.toString()}>
                    {asset.name} ({asset.assetTag}) - {asset.type}
                  </option>
                ))
              )}
            </select>
            {(propAssetId || paramAssetId) && (
              <p className="mt-1 text-sm text-gray-500">
                Asset pre-selected for this assignment
              </p>
            )}
          </div>

          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To *
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id.toString()}>
                  {emp.firstName} {emp.lastName} ({emp.email}) - {emp.department}
                </option>
              ))}
            </select>
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Return Date
            </label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave blank for no specific return date
            </p>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this assignment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
            />
          </div>
        </div>

        {/* Summary Section */}
        {formData.assetId && formData.userId && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Assignment Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Asset:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {assets.find(a => a.id === parseInt(formData.assetId))?.name || 'Not selected'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Employee:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {employees.find(e => e.id === parseInt(formData.userId))?.firstName || 'Not selected'}{' '}
                  {employees.find(e => e.id === parseInt(formData.userId))?.lastName || ''}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Department:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {employees.find(e => e.id === parseInt(formData.userId))?.department || 'N/A'}
                </span>
              </div>
              {formData.returnDate && (
                <div>
                  <span className="text-gray-500">Return Date:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(formData.returnDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/assignments')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.assetId || !formData.userId}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assigning...
              </>
            ) : (
              'Assign Asset'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;