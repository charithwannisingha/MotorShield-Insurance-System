// ============================================================
// APP CONTEXT — Global State Management (Connected to Database)
// ============================================================

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  User, Vehicle, Policy, Payment, Claim, Notification, AuthState
} from '../types';
import api from '../utils/api';

interface AppContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  users: User[];
  vehicles: Vehicle[];
  policies: Policy[];
  payments: Payment[];
  claims: Claim[];
  notifications: Notification[];

  addUser: (user: any) => Promise<void>;
  addCustomer: (customer: any) => Promise<void>;
  updateUser: (id: string, updates: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  addVehicle: (vehicle: any) => Promise<void>;
  updateVehicle: (id: string, updates: any) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;

  addPolicy: (policy: any) => Promise<void>;
  updatePolicy: (id: string, updates: any) => Promise<void>;
  renewPolicy: (id: string) => Promise<void>;

  addPayment: (payment: any) => Promise<void>;
  updatePayment: (id: string, updates: any) => Promise<void>;
  
  addClaim: (claim: any) => Promise<void>;
  updateClaim: (id: string, updates: any) => Promise<void>;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      isAuthenticated: !!token
    };
  });

  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Database එකෙන් දත්ත ඇදලා ගැනීම (Fetch Data) ──
  const fetchAllData = async () => {
    try {
      // Users data is now being fetched here
      const [usersRes, vehRes, polRes, claimRes, payRes, notifRes] = await Promise.all([
        api.get('/users').catch((err) => { console.error('Users fetch error', err); return { data: [] }; }),
        api.get('/vehicles'),
        api.get('/policies'),
        api.get('/claims'),
        api.get('/payments'),
        api.get('/notifications').catch(() => ({ data: [] }))
      ]);
      
      setUsers(usersRes.data || []);
      setVehicles(vehRes.data || []);
      setPolicies(polRes.data || []);
      setClaims(claimRes.data || []);
      setPayments(payRes.data || []);
      setNotifications(notifRes.data || []);
    } catch (error) {
      console.error("Error fetching data from database", error);
    }
  };

  // ── Auth / Login ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAllData(); 

      api.get('/user').then(response => {
        localStorage.setItem('user', JSON.stringify(response.data));
        setAuth({ user: response.data, isAuthenticated: true });
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ user: null, isAuthenticated: false });
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuth({ user, isAuthenticated: true });
      
      await fetchAllData(); 
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ user: null, isAuthenticated: false });
    
    setUsers([]);
    setVehicles([]);
    setPolicies([]);
    setPayments([]);
    setClaims([]);
    setNotifications([]);
  }, []);

  // ── Users / Customers ──
  const addUser = useCallback(async (userData: any) => {
    try {
      const response = await api.post('/users', userData);
      setUsers(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add user", error);
      alert("Error adding customer to database!");
    }
  }, []);

  const addCustomer = addUser;

  const updateUser = useCallback(async (id: string, updates: any) => {
    try {
      const response = await api.put(`/users/${id}`, updates);
      setUsers(prev => prev.map(u => u.id === id ? response.data : u));
    } catch (error) {
      console.error("Failed to update user", error);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: false } : u));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  }, []);

  // ── Vehicles ──
  const addVehicle = useCallback(async (vehicle: any) => {
    try {
      const response = await api.post('/vehicles', vehicle);
      setVehicles(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add vehicle", error);
      alert("Error adding vehicle to database!");
    }
  }, []);

  const updateVehicle = useCallback(async (id: string, updates: any) => {
    try {
      const response = await api.put(`/vehicles/${id}`, updates);
      setVehicles(prev => prev.map(v => v.id === id ? response.data : v));
    } catch (error) {
      console.error("Failed to update vehicle", error);
    }
  }, []);

  const deleteVehicle = useCallback(async (id: string) => {
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, isActive: false } : v));
    } catch (error) {
      console.error("Failed to delete vehicle", error);
    }
  }, []);

  // ── Policies ──
  const addPolicy = useCallback(async (policy: any) => {
    try {
      const response = await api.post('/policies', policy);
      setPolicies(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add policy", error);
      alert("Error adding policy to database!");
    }
  }, []);

  const updatePolicy = useCallback(async (id: string, updates: any) => {
    try {
      const response = await api.put(`/policies/${id}`, updates);
      setPolicies(prev => prev.map(p => p.id === id ? response.data : p));
    } catch (error) {
      console.error("Failed to update policy", error);
    }
  }, []);

  const renewPolicy = useCallback(async (id: string) => {
    try {
      const policy = policies.find(p => p.id === id);
      if (!policy) return;

      const newEnd = new Date(policy.endDate);
      newEnd.setFullYear(newEnd.getFullYear() + 1);
      
      const updates = {
        status: 'active',
        startDate: policy.endDate,
        endDate: newEnd.toISOString().slice(0, 10),
        renewedAt: new Date().toISOString().slice(0, 10),
      };

      const response = await api.put(`/policies/${id}`, updates);
      setPolicies(prev => prev.map(p => p.id === id ? response.data : p));
    } catch (error) {
      console.error("Failed to renew policy", error);
    }
  }, [policies]);

  // ── Payments ──
  const addPayment = useCallback(async (payment: any) => {
    try {
      const response = await api.post('/payments', payment);
      setPayments(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add payment", error);
    }
  }, []);

  const updatePayment = useCallback(async (id: string, updates: any) => {
    try {
      const response = await api.put(`/payments/${id}`, updates);
      setPayments(prev => prev.map(p => p.id === id ? response.data : p));
    } catch (error) {
      console.error("Failed to update payment", error);
    }
  }, []);

  // ── Claims ──
  const addClaim = useCallback(async (claim: any) => {
    try {
      const response = await api.post('/claims', claim);
      setClaims(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add claim", error);
      alert("Error adding claim to database!");
    }
  }, []);

  const updateClaim = useCallback(async (id: string, updates: any) => {
    try {
      const response = await api.put(`/claims/${id}`, updates);
      setClaims(prev => prev.map(c => c.id === id ? response.data : c));
    } catch (error) {
      console.error("Failed to update claim", error);
    }
  }, []);

  // ── Notifications ──
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <AppContext.Provider value={{
      auth, login, logout,
      users, addUser, addCustomer, updateUser, deleteUser,
      vehicles, addVehicle, updateVehicle, deleteVehicle,
      policies, addPolicy, updatePolicy, renewPolicy,
      payments, addPayment, updatePayment,
      claims, addClaim, updateClaim,
      notifications, markNotificationRead, markAllNotificationsRead,
      sidebarOpen, setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};