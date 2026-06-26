import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Eye, RefreshCw, Filter, FileText, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Policy } from '../types';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import {
  formatDate, formatLKR, getPolicyStatusColor, formatStatus,
  formatCoverageType
} from '../utils/helpers';

interface FormErrors {
  customerId?: string; vehicleId?: string; coverageType?: string;
  startDate?: string; endDate?: string; premiumAmount?: string; sumInsured?: string;
}

const COVERAGE_OPTIONS = [
  { value: '', label: 'Select coverage type…' },
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'third_party', label: 'Third Party' },
  { value: 'third_party_fire_theft', label: 'Third Party, Fire & Theft' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
];

const emptyForm = {
  customerId: '', customerName: '', vehicleId: '', vehicleRegNo: '',
  vehicleMake: '', vehicleModel: '', coverageType: '',
  status: 'pending', startDate: '', endDate: '', // Customer යවද්දි pending වෙනවා
  premiumAmount: '', sumInsured: '', excess: '', agentName: '', notes: '',
};

export const PoliciesPage = () => {
  const { policies, vehicles, users, auth, addPolicy, updatePolicy, renewPolicy } = useApp();
  const isAdmin = auth.user?.role === 'admin';
  const myId = auth.user?.id;

  const myPolicies = isAdmin ? policies : policies.filter(p => String(p.customerId) === String(myId));
  const customers = users.filter(u => u.role === 'customer' && u.isActive);
  const allVehicles = vehicles.filter(v => v.isActive);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [coverageFilter, setCoverageFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [viewPolicy, setViewPolicy] = useState<Policy | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [renewConfirm, setRenewConfirm] = useState<Policy | null>(null);

  const filtered = useMemo(() => myPolicies.filter(p => {
    const matchSearch = !search ||
      p.policyNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.vehicleRegNo?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchCoverage = coverageFilter === 'all' || p.coverageType === coverageFilter;
    return matchSearch && matchStatus && matchCoverage;
  }), [myPolicies, search, statusFilter, coverageFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const customerVehicles = useMemo(() => {
    if (!form.customerId) return [];
    return allVehicles.filter(v => String(v.customerId) === String(form.customerId));
  }, [form.customerId, allVehicles]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (isAdmin && !form.customerId) e.customerId = 'Customer is required.';
    if (!form.vehicleId) e.vehicleId = 'Vehicle is required.';
    if (!form.coverageType) e.coverageType = 'Coverage type is required.';
    
    // මේ දේවල් අනිවාර්ය කරන්නේ Admin ට විතරයි! Customer ට මේවා අදාළ නෑ.
    if (isAdmin) {
      if (!form.startDate) e.startDate = 'Start date is required.';
      if (!form.endDate) e.endDate = 'End date is required.';
      if (!form.premiumAmount || isNaN(Number(form.premiumAmount))) e.premiumAmount = 'Valid premium amount required.';
      if (!form.sumInsured || isNaN(Number(form.sumInsured))) e.sumInsured = 'Valid sum insured required.';
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setEditingPolicy(null);
    setForm({
      ...emptyForm,
      customerId: isAdmin ? '' : String(myId),
      customerName: isAdmin ? '' : auth.user?.name ?? '',
      agentName: isAdmin ? (auth.user?.name ?? '') : '', // Customer කරද්දි ඒජන්ට් කෙනෙක් නෑ
      status: isAdmin ? 'active' : 'pending', // Admin හැදුවොත් Active, Customer හැදුවොත් Pending
      policyNumber: `POL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` 
    });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (p: Policy) => {
    setEditingPolicy(p);
    setForm({
      customerId: String(p.customerId), customerName: p.customerName,
      vehicleId: String(p.vehicleId), vehicleRegNo: p.vehicleRegNo,
      vehicleMake: p.vehicleMake, vehicleModel: p.vehicleModel,
      coverageType: p.coverageType, status: p.status,
      startDate: p.startDate || '', endDate: p.endDate || '',
      premiumAmount: String(p.premiumAmount || ''), sumInsured: String(p.sumInsured || ''),
      excess: String(p.excess || ''), agentName: p.agentName || '', notes: p.notes ?? '',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    
    const vId = Number(form.vehicleId);
    const cId = Number(form.customerId);

    const vehicle = allVehicles.find(v => v.id === vId);
    const customer = customers.find(c => c.id === cId);
    
    const payload = {
      ...form,
      customerId: cId,
      vehicleId: vId,
      customerName: customer?.name ?? form.customerName,
      vehicleRegNo: vehicle?.registrationNumber ?? form.vehicleRegNo,
      vehicleMake: vehicle?.make ?? form.vehicleMake,
      vehicleModel: vehicle?.model ?? form.vehicleModel,
      
      // Customer යවද්දි මේවා 0 හරි හිස් හරි වෙනවා
      premiumAmount: isAdmin ? Number(form.premiumAmount) : 0,
      sumInsured: isAdmin ? Number(form.sumInsured) : 0,
      excess: isAdmin ? (Number(form.excess) || 0) : 0,
      coverageType: form.coverageType as Policy['coverageType'],
      status: isAdmin ? (form.status as Policy['status']) : 'pending',
    };
    
    if (editingPolicy) updatePolicy(editingPolicy.id, payload);
    else addPolicy(payload);
    
    setSaving(false);
    setShowModal(false);
  };

  const sf = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (k === 'customerId') {
      const cust = customers.find(c => String(c.id) === e.target.value);
      setForm(prev => ({ ...prev, customerId: e.target.value, customerName: cust?.name ?? '', vehicleId: '', vehicleRegNo: '', vehicleMake: '', vehicleModel: '' }));
    } else if (k === 'vehicleId') {
      const v = allVehicles.find(v => String(v.id) === e.target.value);
      setForm(prev => ({ ...prev, vehicleId: e.target.value, vehicleRegNo: v?.registrationNumber ?? '', vehicleMake: v?.make ?? '', vehicleModel: v?.model ?? '' }));
    } else {
      setForm(prev => ({ ...prev, [k]: e.target.value }));
    }
    if (errors[k as keyof FormErrors]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const coverageColor: Record<string, string> = {
    comprehensive: 'bg-blue-100 text-blue-800 border-blue-200',
    third_party: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    third_party_fire_theft: 'bg-violet-100 text-violet-800 border-violet-200',
  };

  const columns = [
    {
      key: 'policyNumber', header: 'Policy',
      render: (p: Policy) => (
        <div>
          <p className="font-bold text-blue-700">{p.policyNumber}</p>
          <p className="text-xs text-slate-400">{formatDate(p.createdAt)}</p>
        </div>
      )
    },
    ...(isAdmin ? [{
      key: 'customerName', header: 'Customer',
      render: (p: Policy) => <span className="text-slate-700 font-medium">{p.customerName}</span>
    }] : []),
    {
      key: 'vehicleRegNo', header: 'Vehicle',
      render: (p: Policy) => (
        <div>
          <p className="font-semibold text-slate-700">{p.vehicleRegNo}</p>
          <p className="text-xs text-slate-400">{p.vehicleMake} {p.vehicleModel}</p>
        </div>
      )
    },
    {
      key: 'coverageType', header: 'Coverage',
      render: (p: Policy) => (
        <Badge className={coverageColor[p.coverageType] ?? 'bg-gray-100 text-gray-600 border-gray-200'}>
          {formatCoverageType(p.coverageType)}
        </Badge>
      )
    },
    { 
      key: 'premiumAmount', header: 'Premium (LKR)', 
      render: (p: Policy) => <span className="font-semibold text-slate-700">{p.premiumAmount > 0 ? formatLKR(p.premiumAmount) : 'Pending'}</span> 
    },
    {
      key: 'endDate', header: 'Expiry',
      render: (p: Policy) => {
        if (!p.endDate) return <span className="text-slate-400 text-sm">Not set</span>;
        const days = Math.ceil((new Date(p.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return (
          <div>
            <p className="text-slate-600">{formatDate(p.endDate)}</p>
            {p.status === 'active' && days <= 30 && days > 0 && (
              <p className="text-xs text-amber-600 font-medium">Expires in {days} days</p>
            )}
          </div>
        );
      }
    },
    {
      key: 'status', header: 'Status',
      render: (p: Policy) => <Badge className={getPolicyStatusColor(p.status)}>{formatStatus(p.status)}</Badge>
    },
    {
      key: 'actions', header: 'Actions',
      render: (p: Policy) => (
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="sm" icon={<Eye size={13} />} onClick={() => { setViewPolicy(p); setShowViewModal(true); }}>View</Button>
          {isAdmin && <Button variant="ghost" size="sm" icon={<Edit2 size={13} />} onClick={() => openEdit(p)}>Edit</Button>}
          {(p.status === 'expired') && (
            <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />} className="text-emerald-600 hover:bg-emerald-50" onClick={() => setRenewConfirm(p)}>
              Renew
            </Button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Insurance Policies"
        subtitle={`${myPolicies.filter(p => p.status === 'active').length} active · ${myPolicies.filter(p => p.status === 'pending').length} pending`}
        action={<Button icon={<Plus size={15} />} onClick={openAdd}>{isAdmin ? 'New Policy' : 'Apply for Policy'}</Button>}
      />

      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="flex-1 relative min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search policies…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400 flex-shrink-0" />
            <Select
              options={[{ value: 'all', label: 'All Status' }, ...STATUS_OPTIONS]}
              value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="w-36" />
          </div>
          <Select
            options={[{ value: 'all', label: 'All Coverage' }, ...COVERAGE_OPTIONS.filter(o => o.value)]}
            value={coverageFilter} onChange={e => { setCoverageFilter(e.target.value); setPage(1); }} className="w-44" />
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-700">{filtered.length} polic{filtered.length !== 1 ? 'ies' : 'y'} found</p>
        </div>
        <div className="p-4">
          <Table columns={columns} data={paginated} keyExtractor={p => p.id}
            page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={perPage}
            onRowClick={p => { setViewPolicy(p); setShowViewModal(true); }}
          />
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editingPolicy ? 'Edit Policy' : (isAdmin ? 'Create New Policy' : 'Apply for Insurance')}
        subtitle={isAdmin ? "Fill in all required policy details." : "Select your vehicle and preferred coverage type."} 
        size={isAdmin ? "2xl" : "lg"}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingPolicy ? 'Save Changes' : (isAdmin ? 'Create Policy' : 'Submit Application')}
            </Button>
          </>
        }>
        <div className={`grid grid-cols-1 ${isAdmin ? 'sm:grid-cols-2' : ''} gap-4`}>
          
          {/* Customer ට පේන කොටස (වාහනය සහ Coverage එක) */}
          {isAdmin && (
            <Select label="Customer" required error={errors.customerId} value={form.customerId} onChange={sf('customerId')}
              options={[{ value: '', label: 'Select customer…' }, ...customers.map(c => ({ value: String(c.id), label: c.name }))]} />
          )}
          
          <Select label="Vehicle" required error={errors.vehicleId} value={form.vehicleId} onChange={sf('vehicleId')}
            options={[
              { value: '', label: isAdmin ? (form.customerId ? 'Select vehicle…' : 'Select customer first…') : 'Select your vehicle…' },
              ...(isAdmin ? customerVehicles : allVehicles.filter(v => String(v.customerId) === String(myId))).map(v => ({
                value: String(v.id), label: `${v.registrationNumber} — ${v.make} ${v.model}`
              }))
            ]}
            disabled={isAdmin && !form.customerId}
          />

          <Select label="Coverage Type" required error={errors.coverageType} value={form.coverageType} onChange={sf('coverageType')} options={COVERAGE_OPTIONS} />
          
          {/* Admin ට විතරක් පේන කොටස (මිල ගණන්, දින, Status) */}
          {isAdmin && (
            <>
              <Select label="Policy Status" value={form.status} onChange={sf('status')} options={STATUS_OPTIONS} />
              <Input label="Start Date" type="date" required error={errors.startDate} value={form.startDate} onChange={sf('startDate')} />
              <Input label="End Date" type="date" required error={errors.endDate} value={form.endDate} onChange={sf('endDate')} />
              <Input label="Annual Premium (LKR)" type="number" required error={errors.premiumAmount}
                value={form.premiumAmount} onChange={sf('premiumAmount')} placeholder="e.g., 85000"
                hint="Amount in Sri Lankan Rupees" />
              <Input label="Sum Insured (LKR)" type="number" required error={errors.sumInsured}
                value={form.sumInsured} onChange={sf('sumInsured')} placeholder="e.g., 5000000" />
              <Input label="Excess Amount (LKR)" type="number" value={form.excess} onChange={sf('excess')} placeholder="e.g., 25000" />
              <Input label="Issuing Agent" value={form.agentName} onChange={sf('agentName')} placeholder="Agent / officer name" />
              <div className="sm:col-span-2">
                <Textarea label="Notes / Remarks" value={form.notes} onChange={sf('notes')} rows={2} placeholder="Any special conditions or remarks…" />
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* View Modal */}
      {viewPolicy && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Policy Details" size="xl"
          footer={
            <div className="flex gap-2 w-full">
              {viewPolicy.status === 'expired' && (
                <Button variant="success" icon={<RefreshCw size={14} />} onClick={() => { setShowViewModal(false); setRenewConfirm(viewPolicy); }}>
                  Renew Policy
                </Button>
              )}
              {isAdmin && <Button variant="outline" icon={<Edit2 size={14} />} onClick={() => { setShowViewModal(false); openEdit(viewPolicy); }}>Edit</Button>}
              <Button variant="outline" className="ml-auto" onClick={() => setShowViewModal(false)}>Close</Button>
            </div>
          }>
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText size={22} className="text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-700">{viewPolicy.policyNumber}</h3>
                  <p className="text-sm text-slate-500">Issued by {viewPolicy.agentName || 'System'}</p>
                </div>
              </div>
              <Badge className={getPolicyStatusColor(viewPolicy.status)}>{formatStatus(viewPolicy.status)}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Customer', value: viewPolicy.customerName, icon: <FileText size={12} /> },
                { label: 'Vehicle', value: viewPolicy.vehicleRegNo, icon: <FileText size={12} /> },
                { label: 'Make / Model', value: `${viewPolicy.vehicleMake} ${viewPolicy.vehicleModel}`, icon: null },
                { label: 'Coverage', value: formatCoverageType(viewPolicy.coverageType), icon: <FileText size={12} /> },
                { label: 'Start Date', value: viewPolicy.startDate ? formatDate(viewPolicy.startDate) : 'Pending', icon: <Calendar size={12} /> },
                { label: 'End Date', value: viewPolicy.endDate ? formatDate(viewPolicy.endDate) : 'Pending', icon: <Calendar size={12} /> },
                { label: 'Annual Premium', value: viewPolicy.premiumAmount > 0 ? formatLKR(viewPolicy.premiumAmount) : 'Pending', icon: <DollarSign size={12} /> },
                { label: 'Sum Insured', value: viewPolicy.sumInsured > 0 ? formatLKR(viewPolicy.sumInsured) : 'Pending', icon: <DollarSign size={12} /> },
                { label: 'Excess', value: viewPolicy.excess > 0 ? formatLKR(viewPolicy.excess) : 'Pending', icon: <DollarSign size={12} /> },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">{item.icon}{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value || 'N/A'}</p>
                </div>
              ))}
            </div>

            {viewPolicy.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-700 mb-1">Notes / Remarks</p>
                <p className="text-sm text-amber-800">{viewPolicy.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Renew Confirm */}
      {renewConfirm && (
        <Modal isOpen={!!renewConfirm} onClose={() => setRenewConfirm(null)} title="Renew Policy" size="sm"
          footer={
            <>
              <Button variant="outline" onClick={() => setRenewConfirm(null)}>Cancel</Button>
              <Button variant="success" icon={<RefreshCw size={14} />} onClick={() => { renewPolicy(renewConfirm.id); setRenewConfirm(null); }}>
                Confirm Renewal
              </Button>
            </>
          }>
          <div className="space-y-3">
            <p className="text-slate-600 text-sm">
              Renewing policy <strong>{renewConfirm.policyNumber}</strong> for <strong>{renewConfirm.customerName}</strong>.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Vehicle:</span><span className="font-medium">{renewConfirm.vehicleRegNo}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Coverage:</span><span className="font-medium">{formatCoverageType(renewConfirm.coverageType)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">New Expiry:</span><span className="font-medium text-emerald-600">{renewConfirm.endDate ? formatDate(new Date(new Date(renewConfirm.endDate).setFullYear(new Date(renewConfirm.endDate).getFullYear() + 1)).toISOString().slice(0,10)) : ''}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Premium:</span><span className="font-bold text-blue-700">{formatLKR(renewConfirm.premiumAmount)}</span></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};