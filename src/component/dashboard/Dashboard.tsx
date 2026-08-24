import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { assetService } from '../../services/assetService';
import { requestService } from '../../services/requestService';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import {
  ComputerDesktopIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';

// Define types for state
interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  underRepair: number;
  pendingRequests: number;
  totalRequests: number;
  myAssets: number;
  myReturned: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface Activity {
  id: number | string;
  type: 'ASSIGN' | 'REQUEST' | 'RETURN' | 'REPAIR';
  message: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    underRepair: 0,
    pendingRequests: 0,
    totalRequests: 0,
    myAssets: 0,
    myReturned: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [assetData, setAssetData] = useState<ChartData[]>([]);
  const [requestData, setRequestData] = useState<ChartData[]>([]);
  const [myAssets, setMyAssets] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all data
      const [allAssets, allRequests] = await Promise.all([
        assetService.getAll(),
        requestService.getAll(),
      ]);

      // For Employee view
      let filteredAssets = allAssets;
      let filteredRequests = allRequests;

      if (user?.role === 'EMPLOYEE') {
        // Filter assets assigned to this employee
        filteredAssets = allAssets.filter(a => 
          a.currentOwner?.id === user.id
        );
        
        // Filter requests made by this employee
        filteredRequests = allRequests.filter(r => 
          r.employee.id === user.id
        );
      }

      // Stats calculations
      const totalAssets = user?.role === 'EMPLOYEE' 
        ? filteredAssets.length 
        : allAssets.length;
      
      const availableAssets = user?.role === 'EMPLOYEE'
        ? filteredAssets.filter(a => a.status === 'AVAILABLE').length
        : allAssets.filter(a => a.status === 'AVAILABLE').length;
      
      const assignedAssets = user?.role === 'EMPLOYEE'
        ? filteredAssets.filter(a => a.status === 'ASSIGNED').length
        : allAssets.filter(a => a.status === 'ASSIGNED').length;
      
      const underRepair = user?.role === 'EMPLOYEE'
        ? filteredAssets.filter(a => a.status === 'UNDER_REPAIR').length
        : allAssets.filter(a => a.status === 'UNDER_REPAIR').length;

      // Employee specific stats
      const myAssetsCount = user?.role === 'EMPLOYEE'
        ? allAssets.filter(a => a.currentOwner?.id === user.id).length
        : 0;

      // Count returned assets (assets with return date set and no current owner)
      const myReturnedCount = user?.role === 'EMPLOYEE'
        ? allAssets.filter(a => 
            a.returnDate && 
            a.currentOwner === null
          ).length
        : 0;

      const pendingRequests = user?.role === 'EMPLOYEE'
        ? filteredRequests.filter(r => 
            r.status === 'SUBMITTED' || 
            r.status === 'MANAGER_APPROVED' || 
            r.status === 'IT_REVIEW'
          ).length
        : allRequests.filter(r => 
            r.status === 'SUBMITTED' || 
            r.status === 'MANAGER_APPROVED' || 
            r.status === 'IT_REVIEW'
          ).length;

      const totalRequests = user?.role === 'EMPLOYEE'
        ? filteredRequests.length
        : allRequests.length;

      setStats({
        totalAssets,
        availableAssets,
        assignedAssets,
        underRepair,
        pendingRequests,
        totalRequests,
        myAssets: myAssetsCount,
        myReturned: myReturnedCount,
      });

      // Asset status distribution for charts
      const statusData: ChartData[] = user?.role === 'EMPLOYEE'
        ? [
            { name: 'My Assets', value: myAssetsCount },
            { name: 'Returned', value: myReturnedCount },
          ]
        : [
            { name: 'Available', value: availableAssets },
            { name: 'Assigned', value: assignedAssets },
            { name: 'Under Repair', value: underRepair },
          ];
      setAssetData(statusData);

      // Request status distribution
      const requestStatusCount = filteredRequests.reduce((acc: Record<string, number>, req: any) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      }, {});

      const requestStatusData: ChartData[] = Object.entries(requestStatusCount).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value: value as number,
      }));
      setRequestData(requestStatusData);

      // My assets list (for employee)
      if (user?.role === 'EMPLOYEE') {
        const assignedAssetsList = filteredAssets.filter(a => a.status === 'ASSIGNED');
        setMyAssets(assignedAssetsList);
      }

      // Recent activities
      let recent: Activity[] = filteredRequests
        .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
        .slice(0, 5)
        .map(req => ({
          id: req.id,
          type: req.status === 'ISSUED' ? 'ASSIGN' : 'REQUEST',
          message: `Request for ${req.assetType} - ${req.status.replace('_', ' ')}`,
          time: new Date(req.submittedDate).toLocaleString(),
        }));

      // Add asset assignments to recent activities for employee
      if (user?.role === 'EMPLOYEE') {
        const assignedAssetsList = filteredAssets.filter(a => a.status === 'ASSIGNED' && a.currentOwner?.id === user.id);
        assignedAssetsList.forEach(asset => {
          if (asset.assignedDate) {
            recent.push({
              id: `asset-${asset.id}`, // Changed to string
              type: 'ASSIGN',
              message: `Asset "${asset.name}" assigned to you`,
              time: new Date(asset.assignedDate).toLocaleString(),
            });
          }
        });
        recent.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        recent = recent.slice(0, 5);
      }

      setRecentActivities(recent);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            {isEmployee 
              ? `Welcome back, ${user?.firstName}! Here's a summary of your assets and requests.`
              : `Welcome back, ${user?.firstName}! Here's what's happening with your assets.`
            }
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isEmployee ? (
          // Employee Stats
          <>
            <StatsCard
              title="My Assets"
              value={stats.myAssets}
              icon={ComputerDesktopIcon}
              color="primary"
            />
            <StatsCard
              title="Returned"
              value={stats.myReturned}
              icon={CheckCircleIcon}
              color="success"
            />
            <StatsCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={ClockIcon}
              color="warning"
            />
            <StatsCard
              title="Total Requests"
              value={stats.totalRequests}
              icon={DocumentTextIcon}
              color="primary" // Changed from "info" to "primary"
            />
          </>
        ) : (
          // Admin/Manager Stats
          <>
            <StatsCard
              title="Total Assets"
              value={stats.totalAssets}
              icon={ComputerDesktopIcon}
              color="primary"
            />
            <StatsCard
              title="Available"
              value={stats.availableAssets}
              icon={CheckCircleIcon}
              color="success"
            />
            <StatsCard
              title="Under Repair"
              value={stats.underRepair}
              icon={ExclamationTriangleIcon}
              color="warning"
            />
            <StatsCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={ClockIcon}
              color="danger"
            />
          </>
        )}
      </div>

      {/* My Assets List (Employee Only) */}
      {isEmployee && myAssets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">My Assigned Assets</h3>
            <Link
              to="/assets"
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {myAssets.slice(0, 3).map((asset: any) => (
              <div key={asset.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <ComputerDesktopIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{asset.name}</p>
                    <p className="text-sm text-gray-500">{asset.assetTag} • {asset.type}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {asset.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isEmployee ? 'My Asset Status' : 'Asset Status Distribution'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isEmployee ? 'My Request Status' : 'Request Status Distribution'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isEmployee ? 'My Recent Activity' : 'Recent Activity'}
        </h3>
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;