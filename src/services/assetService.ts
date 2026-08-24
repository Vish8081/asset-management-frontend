import api from './api';
import { Asset } from '../types';

export const assetService = {
  getAll: async (): Promise<Asset[]> => {
    const response = await api.get<Asset[]>('/assets');
    return response.data;
  },

  getAvailable: async (): Promise<Asset[]> => {
    const response = await api.get<Asset[]>('/assets/available');
    return response.data;
  },

  getUnderRepair: async (): Promise<Asset[]> => {
    const response = await api.get<Asset[]>('/assets/under-repair');
    return response.data;
  },

  getById: async (id: number): Promise<Asset> => {
    const response = await api.get<Asset>(`/assets/${id}`);
    return response.data;
  },

  create: async (asset: Partial<Asset>): Promise<Asset> => {
    const response = await api.post<Asset>('/assets', asset);
    return response.data;
  },

  update: async (id: number, asset: Partial<Asset>): Promise<Asset> => {
    const response = await api.put<Asset>(`/assets/${id}`, asset);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/assets/${id}`);
  },

  assign: async (assetId: number, userId: number): Promise<Asset> => {
    const response = await api.post<Asset>(`/assets/${assetId}/assign/${userId}`);
    return response.data;
  },

  return: async (assetId: number): Promise<Asset> => {
    const response = await api.post<Asset>(`/assets/${assetId}/return`);
    return response.data;
  },

  getWarrantyExpiringSoon: async (days: number = 30): Promise<Asset[]> => {
    const response = await api.get<Asset[]>('/assets/warranty-expiring', {
      params: { days }
    });
    return response.data;
  }
};