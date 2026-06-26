// ============================================================
// MOTOR INSURANCE MANAGEMENT SYSTEM — TYPE DEFINITIONS
// Sri Lanka Context | Currency: LKR | Timezone: Asia/Colombo
// ============================================================

export type UserRole = 'admin' | 'customer';
export type PolicyStatus = 'active' | 'expired' | 'pending' | 'cancelled';
export type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'settled';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';
export type VehicleType = 'car' | 'motorcycle' | 'van' | 'lorry' | 'bus' | 'three_wheeler' | 'suv';
export type CoverageType = 'third_party' | 'comprehensive' | 'third_party_fire_theft';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nic: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  createdAt: string;
  isActive: boolean;
  avatar?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  customerName: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  engineNumber: string;
  chassisNumber: string;
  vehicleType: VehicleType;
  engineCapacity: string;
  seatingCapacity: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  createdAt: string;
  isActive: boolean;
}

export interface Policy {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleRegNo: string;
  vehicleMake: string;
  vehicleModel: string;
  coverageType: CoverageType;
  status: PolicyStatus;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  sumInsured: number;
  excess: number;
  agentName: string;
  createdAt: string;
  renewedAt?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  status: PaymentStatus;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque';
  referenceNumber?: string;
  receivedBy: string;
  notes?: string;
  createdAt: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleRegNo: string;
  vehicleMake: string;
  vehicleModel: string;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  claimType: 'accident' | 'theft' | 'fire' | 'natural_disaster' | 'vandalism' | 'other';
  estimatedDamage: number;
  approvedAmount?: number;
  status: ClaimStatus;
  submittedAt: string;
  reviewedAt?: string;
  settledAt?: string;
  assignedTo?: string;
  reviewNotes?: string;
  documents: string[];
}

export interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  totalPolicies: number;
  activePolicies: number;
  expiredPolicies: number;
  pendingClaims: number;
  totalClaims: number;
  monthlyRevenue: number;
  totalRevenue: number;
  pendingPayments: number;
  recentClaims: Claim[];
  recentPolicies: Policy[];
  policyStatusBreakdown: { name: string; value: number; color: string }[];
  claimStatusBreakdown: { name: string; value: number; color: string }[];
  monthlyRevenueData: { month: string; revenue: number; claims: number }[];
  coverageBreakdown: { name: string; value: number; color: string }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}
