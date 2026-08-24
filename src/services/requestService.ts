import api from './api';
import { AssetRequest } from '../types';

export const requestService = {
  getAll: async (): Promise<AssetRequest[]> => {
    const response = await api.get<AssetRequest[]>('/requests');
    return response.data;
  },

  getById: async (id: number): Promise<AssetRequest> => {
    const response = await api.get<AssetRequest>(`/requests/${id}`);
    return response.data;
  },

  getByEmployee: async (employeeId: number): Promise<AssetRequest[]> => {
    const response = await api.get<AssetRequest[]>(`/requests/employee/${employeeId}`);
    return response.data;
  },

  create: async (employeeId: number, request: Partial<AssetRequest>): Promise<AssetRequest> => {
    const response = await api.post<AssetRequest>(`/requests?employeeId=${employeeId}`, request);
    return response.data;
  },

  managerApprove: async (requestId: number, managerId: number, comments: string): Promise<AssetRequest> => {
    const response = await api.put<AssetRequest>(
      `/requests/${requestId}/manager-approve?managerId=${managerId}&comments=${comments}`
    );
    return response.data;
  },

  itReview: async (requestId: number, itSupportId: number, comments: string): Promise<AssetRequest> => {
    const response = await api.put<AssetRequest>(
      `/requests/${requestId}/it-review?itSupportId=${itSupportId}&comments=${comments}`
    );
    return response.data;
  },

  approve: async (requestId: number, assetId: number): Promise<AssetRequest> => {
    const response = await api.put<AssetRequest>(
      `/requests/${requestId}/approve?assetId=${assetId}`
    );
    return response.data;
  },

  issue: async (requestId: number): Promise<AssetRequest> => {
    const response = await api.put<AssetRequest>(`/requests/${requestId}/issue`);
    return response.data;
  },

  getByStatus: async (status: string): Promise<AssetRequest[]> => {
    const response = await api.get<AssetRequest[]>(`/requests/status/${status}`);
    return response.data;
  }
};