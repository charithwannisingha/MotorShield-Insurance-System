import React, { useState, useMemo } from 'react';
import { Search, Eye, Filter, UserCheck, UserX, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { formatDate } from '../utils/helpers';

export const CustomersPage = () => {
  const { users } = useApp();
  
  // Admin නොවන, Register වුණු හැමෝම (Customers) මේකට ගන්නවා
  const customers = users.filter(u => u.role !== 'admin');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return customers.filter(u => {
      const matchSearch = !search ||
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.nic || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || '').includes(search);
        
      const isActive = u.isActive === true || Number(u.isActive) === 1 || u.isActive === '1';
      
      const matchStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);
        
      return matchSearch && matchStatus;
    });
  }, [customers, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const openView = (user: User) => {
    setViewUser(user);
    setShowViewModal(true);
  };

  const columns = [
    {
      key: 'name', header: 'Customer Info',
      render: (u: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{u.name || 'Unknown'}</p>
            <p className="text-xs text-slate-400">{u.email}</p>
          </div>
        </div>
      )
    },
    { key: 'nic', header: 'NIC', render: (u: any) => <span className="font-mono text-sm text-slate-600">{u.nic || '—'}</span> },
    { key: 'phone', header: 'Phone', render: (u: any) => <span className="text-slate-600">{u.phone || '—'}</span> },
    { key: 'createdAt', header: 'Registered Date', render: (u: any) => <span className="text-slate-500">{formatDate(u.createdAt || u.created_at)}</span> },
    {
      key: 'isActive', header: 'Status',
      render: (u: any) => {
        const isActive = u.isActive === true || Number(u.isActive) === 1 || u.isActive === '1';
        return (
          <Badge className={isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}>
            {isActive ? <UserCheck size={11} /> : <UserX size={11} />}
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      }
    },
    {
      key: 'actions', header: 'Actions',
      render: (u: any) => (
        <Button variant="ghost" size="sm" icon={<Eye size={13} />} onClick={() => openView(u)}>View Details</Button>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Registered Customers"
        subtitle="View all customers who have registered in the system via the App"
      />

      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400 flex-shrink-0" />
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-36"
            />
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">
            {filtered.length} registered customer{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="p-4">
          <Table
            columns={columns}
            data={paginated}
            keyExtractor={u => u.id}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            perPage={perPage}
          />
        </div>
      </Card>

      {/* View Modal */}
      {viewUser && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Customer Profile" size="lg"
          footer={<Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>}>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                {viewUser.name ? viewUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewUser.name}</h3>
                <p className="text-sm text-slate-500 capitalize">{viewUser.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: <Mail size={14} />, label: 'Email', value: viewUser.email },
                { icon: <Phone size={14} />, label: 'Phone', value: viewUser.phone },
                { icon: <CreditCard size={14} />, label: 'NIC', value: viewUser.nic },
                { icon: null, label: 'Date of Birth', value: viewUser.dateOfBirth ? formatDate(viewUser.dateOfBirth) : '—' },
                { icon: null, label: 'Customer ID', value: viewUser.id },
                { icon: null, label: 'Registered On', value: formatDate((viewUser as any).createdAt || (viewUser as any).created_at) },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">{item.icon}{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value || '—'}</p>
                </div>
              ))}
              <div className="sm:col-span-2 bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5"><MapPin size={14} />Address</p>
                <p className="text-sm font-semibold text-slate-700">{viewUser.address || '—'}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};