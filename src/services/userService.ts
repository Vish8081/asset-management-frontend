// src/services/userService.ts
import api from './api';
import { User } from '../types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  getByDepartment: async (department: string): Promise<User[]> => {
    const response = await api.get<User[]>(`/users/department/${department}`);
    return response.data;
  },

  getByRole: async (role: string): Promise<User[]> => {
    const response = await api.get<User[]>(`/users/role/${role}`);
    return response.data;
  },

  update: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getEmployees: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users/employees');
    return response.data;
  },
};