export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const ASSET_TYPES = [
  'LAPTOP',
  'MONITOR',
  'MOBILE',
  'SOFTWARE_LICENSE',
  'ACCESSORY',
  'MOUSE',
  'KEYBOARD',
] as const;

export const ASSET_STATUSES = [
  'AVAILABLE',
  'ASSIGNED',
  'UNDER_REPAIR',
  'RETIRED',
  'LOST',
  'MAINTENANCE',
] as const;

export const REQUEST_STATUSES = [
  'SUBMITTED',
  'MANAGER_APPROVED',
  'MANAGER_REJECTED',
  'IT_REVIEW',
  'APPROVED',
  'REJECTED',
  'ISSUED',
  'COMPLETED',
  'CANCELLED',
] as const;

export const ROLES = [
  'ADMIN',
  'ASSET_MANAGER',
  'IT_SUPPORT',
  'EMPLOYEE',
] as const;

export const STATUS_COLORS = {
  AVAILABLE: 'bg-green-100 text-green-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  UNDER_REPAIR: 'bg-yellow-100 text-yellow-800',
  RETIRED: 'bg-gray-100 text-gray-800',
  LOST: 'bg-red-100 text-red-800',
  MAINTENANCE: 'bg-purple-100 text-purple-800',
  SUBMITTED: 'bg-gray-100 text-gray-800',
  MANAGER_APPROVED: 'bg-blue-100 text-blue-800',
  MANAGER_REJECTED: 'bg-red-100 text-red-800',
  IT_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ISSUED: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE: 1,
} as const;