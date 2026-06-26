// ============================================================
// UTILITY HELPERS — Sri Lanka Motor Insurance System
// ============================================================

// ── Currency Formatting ───────────────────────────────────
export const formatLKR = (amount: any): string => {
  if (amount === undefined || amount === null || amount === '') return 'Rs. 0.00';
  const num = Number(amount);
  if (isNaN(num)) return 'Rs. 0.00';
  
  return `Rs. ${num.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatLKRShort = (amount: any): string => {
  if (amount === undefined || amount === null || amount === '') return 'Rs. 0';
  const num = Number(amount);
  if (isNaN(num)) return 'Rs. 0';

  if (num >= 1000000) return `Rs. ${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `Rs. ${(num / 1000).toFixed(0)}K`;
  return `Rs. ${num.toLocaleString('en-LK')}`;
};

// ── Date Formatting (DD/MM/YYYY) ──────────────────────────
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  // Date එක Invalid නම් බිඳෙන්නේ නැතුව තියෙන්න මේක දැම්මා
  if (isNaN(d.getTime())) return '—'; 
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return `${formatDate(dateStr)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const daysUntil = (dateStr: string): number => {
  if (!dateStr) return 0;
  const target = new Date(dateStr).getTime();
  if (isNaN(target)) return 0;
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};

// ── Validation ────────────────────────────────────────────
export const validateNIC = (nic: string): boolean => {
  if (!nic) return false;
  return /^(\d{9}[VvXx]|\d{12})$/.test(nic.trim());
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  return /^(\+94|0)7[0-9]{8}$/.test(phone.replace(/[\s\-]/g, ''));
};

export const validateVehicleReg = (reg: string): boolean => {
  if (!reg) return false;
  const clean = reg.trim().toUpperCase();
  if (/^\d{3}-\d{4}$/.test(clean)) return true;
  if (/^[A-Z]{2}\s[A-Z]{2,4}-\d{4}$/.test(clean)) return true;
  if (/^[A-Z]{2}[\s-]\d{4}$/.test(clean)) return true;
  if (/^[A-Z]{2}\s[A-Z]{2}-\d{4}$/.test(clean)) return true;
  return false;
};

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ── Status Helpers ────────────────────────────────────────
export const getPolicyStatusColor = (status: any) => {
  if (!status) return 'bg-amber-100 text-amber-800 border-amber-200';
  const clean = String(status).toLowerCase();
  const map: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    expired: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return map[clean] ?? 'bg-gray-100 text-gray-600';
};

export const getClaimStatusColor = (status: any) => {
  if (!status) return 'bg-blue-100 text-blue-800 border-blue-200';
  const clean = String(status).toLowerCase();
  const map: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800 border-blue-200',
    under_review: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    settled: 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return map[clean] ?? 'bg-gray-100 text-gray-600';
};

export const getPaymentStatusColor = (status: any) => {
  if (!status) return 'bg-amber-100 text-amber-800 border-amber-200';
  const clean = String(status).toLowerCase();
  const map: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
    partial: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return map[clean] ?? 'bg-gray-100 text-gray-600';
};

export const formatStatus = (status: any): string => {
  // status එකක් නැතිව ආවොත් 'Pending' කියලා වැටෙනවා, Crash වෙන්නේ නෑ
  if (!status) return 'Pending';
  return String(status).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export const formatCoverageType = (type: any): string => {
  if (!type) return 'N/A';
  const cleanType = String(type).toLowerCase();
  const map: Record<string, string> = {
    comprehensive: 'Comprehensive',
    third_party: 'Third Party',
    third_party_fire_theft: 'Third Party Fire & Theft',
  };
  return map[cleanType] ?? cleanType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export const formatVehicleType = (type: any): string => {
  if (!type) return 'Vehicle';
  const cleanType = String(type).toLowerCase();
  const map: Record<string, string> = {
    car: 'Car',
    motorcycle: 'Motorcycle',
    van: 'Van',
    lorry: 'Lorry',
    bus: 'Bus',
    three_wheeler: 'Three Wheeler',
    suv: 'SUV',
  };
  return map[cleanType] ?? cleanType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

// ── ID Generation ─────────────────────────────────────────
export const generateId = (prefix: string): string => {
  return `${prefix}${Date.now()}`;
};

// ── Pagination ────────────────────────────────────────────
export const paginate = <T>(items: T[], page: number, perPage: number): T[] => {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};