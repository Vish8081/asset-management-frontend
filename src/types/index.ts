// User Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: 'ADMIN' | 'ASSET_MANAGER' | 'IT_SUPPORT' | 'EMPLOYEE';
  employeeId: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Asset Types
export interface Asset {
  id: number;
  assetTag: string;
  name: string;
  description?: string;
  type: 'LAPTOP' | 'MONITOR' | 'MOBILE' | 'SOFTWARE_LICENSE' | 'ACCESSORY' | 'MOUSE' | 'KEYBOARD';
  status: 'AVAILABLE' | 'ASSIGNED' | 'UNDER_REPAIR' | 'RETIRED' | 'LOST' | 'MAINTENANCE';
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiryDate?: string;
  location?: string;
  currentOwner?: User;
  assignedBy?: User;
  assignedDate?: string;
  returnDate?: string;
  licenseKey?: string;
  maxUsers?: number;
  version?: string;
  encryptionEnabled: boolean;
  antivirusInstalled: boolean;
  lastAuditDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Request Types
export interface AssetRequest {
  id: number;
  employee: User;
  manager?: User;
  itSupport?: User;
  assetType: 'LAPTOP' | 'MONITOR' | 'MOBILE' | 'SOFTWARE_LICENSE' | 'ACCESSORY' | 'MOUSE' | 'KEYBOARD';
  description: string;
  justification: string;
  status: 'SUBMITTED' | 'MANAGER_APPROVED' | 'MANAGER_REJECTED' | 'IT_REVIEW' | 'APPROVED' | 'REJECTED' | 'ISSUED' | 'COMPLETED' | 'CANCELLED';
  assignedAsset?: Asset;
  submittedDate: string;
  managerApprovalDate?: string;
  itReviewDate?: string;
  approvedDate?: string;
  issuedDate?: string;
  managerComments?: string;
  itComments?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  assetsUnderRepair: number;
  pendingRequests: number;
  totalEmployees: number;
  warrantyExpiringSoon: number;
}

// Report Types
export interface AssetUtilizationReport {
  department: string;
  totalAssets: number;
  assignedAssets: number;
  utilizationRate: number;
}

export interface MonthlyIssuanceReport {
  month: string;
  issued: number;
  returned: number;
}

// Component Props
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}