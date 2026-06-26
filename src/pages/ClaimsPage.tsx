import React, { useState, useMemo } from 'react';
import {
  Plus, Search, Eye, Edit2, Filter, AlertTriangle,
  CheckCircle, XCircle, Clock, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Claim } from '../types';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { formatDate, formatLKR, getClaimStatusColor, formatStatus } from '../utils/helpers';

const CLAIM_TYPES = [
  { value: 'accident', label: 'Accident' },
  { value: 'theft', label: 'Theft' },
  { value: 'fire', label: 'Fire' },
  { value: 'natural_disaster', label: 'Natural Disaster' },
  { value: 'vandalism', label: 'Vandalism' },
  { value: 'other', label: 'Other' },
];

const CLAIM_STATUSES = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'settled', label: 'Settled' },
];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  submitted: <Clock size={13} className="text-blue-600" />,
  under_review: <Clock size={13} className="text-amber-600" />,
  approved: <CheckCircle size={13} className="text-emerald-600" />,
  rejected: <XCircle size={13} className="text-red-600" />,
  settled: <Shield size={13} className="text-purple-600" />,
};

interface FormErrors {
  policyId?: string; incidentDate?: string; incidentLocation?: string;
  incidentDescription?: string; estimatedDamage?: string; claimType?: string;
}

export const ClaimsPage = () => {
  const { claims, policies, vehicles, auth, addClaim, updateClaim } = useApp();
  const isAdmin = auth.user?.role === 'admin';
  const myId = auth.user?.id;

  const myClaims = isAdmin ? claims : claims.filter(c => String(c.customerId) === String(myId));
  const myPolicies = (isAdmin ? policies : policies.filter(p => String(p.customerId) === String(myId))).filter(p => p.status === 'active');
  const myVehicles = isAdmin ? vehicles : vehicles.filter(v => String(v.customerId) === String(myId));

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [viewClaim, setViewClaim] = useState<Claim | null>(null);
  const [reviewClaim, setReviewClaim] = useState<Claim | null>(null);

  const [form, setForm] = useState({
    policyId: '', policyNumber: '', customerId: myId ?? '', customerName: auth.user?.name ?? '',
    vehicleId: '', vehicleRegNo: '', vehicleMake: '', vehicleModel: '',
    incidentDate: '', incidentLocation: '', incidentDescription: '',
    claimType: 'accident', estimatedDamage: '', documents: [] as string[],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    status: '', approvedAmount: '', reviewNotes: '', assignedTo: auth.user?.name ?? '',
  });

  // සර්ච් එක ඇතුළෙදි ඩේටා බේස් එකෙන් මොනවා හරි අඩුවෙන් ආවොත් ක්‍රෑෂ් නොවෙන්න ?. දැම්මා
  const filtered = useMemo(() => myClaims.filter(c => {
    const matchSearch = !search ||
      c.claimNumber?.toLowerCase().includes(search.toLowerCase()) ||
      c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicleRegNo?.toLowerCase().includes(search.toLowerCase()) ||
      c.policyNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  }), [myClaims, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.policyId) e.policyId = 'Please select an active policy.';
    if (!form.incidentDate) e.incidentDate = 'Incident date is required.';
    if (!form.incidentLocation.trim()) e.incidentLocation = 'Incident location is required.';
    if (!form.incidentDescription.trim()) e.incidentDescription = 'Description is required (min. 20 characters).';
    if (!form.estimatedDamage || isNaN(Number(form.estimatedDamage))) e.estimatedDamage = 'Valid estimated damage amount required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sf = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (k === 'policyId') {
      const policy = myPolicies.find(p => String(p.id) === e.target.value);
      const vehicle = myVehicles.find(v => String(v.id) === String(policy?.vehicleId));
      setForm(prev => ({
        ...prev, policyId: e.target.value,
        policyNumber: policy?.policyNumber ?? '',
        customerId: policy?.customerId ?? prev.customerId,
        customerName: policy?.customerName ?? prev.customerName,
        vehicleId: policy?.vehicleId ?? '',
        vehicleRegNo: vehicle?.registrationNumber ?? policy?.vehicleRegNo ?? '',
        vehicleMake: vehicle?.make ?? policy?.vehicleMake ?? '',
        vehicleModel: vehicle?.model ?? policy?.vehicleModel ?? '',
      }));
    } else {
      setForm(prev => ({ ...prev, [k]: e.target.value }));
    }
    if (errors[k as keyof FormErrors]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const handleSubmitClaim = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    addClaim({
      ...form,
      status: 'submitted',
      claimType: form.claimType as Claim['claimType'],
      estimatedDamage: Number(form.estimatedDamage),
    });
    setSaving(false);
    setShowModal(false);
    setForm({
      policyId: '', policyNumber: '', customerId: myId ?? '', customerName: auth.user?.name ?? '',
      vehicleId: '', vehicleRegNo: '', vehicleMake: '', vehicleModel: '',
      incidentDate: '', incidentLocation: '', incidentDescription: '',
      claimType: 'accident', estimatedDamage: '', documents: [],
    });
  };

  const handleReview = async () => {
    if (!reviewClaim || !reviewForm.status) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const updates: Partial<Claim> = {
      status: reviewForm.status as Claim['status'],
      reviewNotes: reviewForm.reviewNotes,
      assignedTo: reviewForm.assignedTo,
    };
    if (reviewForm.approvedAmount) updates.approvedAmount = Number(reviewForm.approvedAmount);
    if (reviewForm.status === 'approved' || reviewForm.status === 'rejected') {
      updates.reviewedAt = new Date().toISOString().slice(0, 10);
    }
    if (reviewForm.status === 'settled') {
      updates.settledAt = new Date().toISOString().slice(0, 10);
    }
    updateClaim(reviewClaim.id, updates);
    setSaving(false);
    setShowReviewModal(false);
  };

  const columns = [
    {
      key: 'claimNumber', header: 'Claim',
      render: (c: Claim) => (
        <div>
          <p className="font-bold text-blue-700">{c.claimNumber}</p>
          <p className="text-xs text-slate-400">{formatDate(c.submittedAt || c.createdAt)}</p>
        </div>
      )
    },
    ...(isAdmin ? [{ key: 'customerName', header: 'Customer', render: (c: Claim) => <span className="text-slate-700 font-medium">{c.customerName}</span> }] : []),
    {
      key: 'vehicleRegNo', header: 'Vehicle',
      render: (c: Claim) => (
        <div>
          <p className="font-semibold text-slate-700">{c.vehicleRegNo}</p>
          <p className="text-xs text-slate-400">{c.vehicleMake} {c.vehicleModel}</p>
        </div>
      )
    },
    {
      key: 'claimType', header: 'Type',
      render: (c: Claim) => (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200 capitalize">
          {/* ── මෙන්න මෙතන තමයි වෙනස් කළේ: ආරක්ෂක වැටක් දැම්මා ── */}
          {c.claimType ? c.claimType.replace('_', ' ') : 'General'}
        </Badge>
      )
    },
    { key: 'estimatedDamage', header: 'Est. Damage', render: (c: Claim) => <span className="font-semibold text-slate-700">{formatLKR(c.estimatedDamage)}</span> },
    {
      key: 'approvedAmount', header: 'Approved',
      render: (c: Claim) => c.approvedAmount ? (
        <span className="font-semibold text-emerald-700">{formatLKR(c.approvedAmount)}</span>
      ) : <span className="text-slate-300">—</span>
    },
    {
      key: 'status', header: 'Status',
      render: (c: Claim) => (
        <Badge className={getClaimStatusColor(c.status)}>
          {STATUS_ICONS[c.status || 'submitted']} {formatStatus(c.status)}
        </Badge>
      )
    },
    {
      key: 'actions', header: 'Actions',
      render: (c: Claim) => (
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="sm" icon={<Eye size={13} />} onClick={() => { setViewClaim(c); setShowViewModal(true); }}>View</Button>
          {isAdmin && (c.status === 'submitted' || c.status === 'under_review') && (
            <Button variant="ghost" size="sm" icon={<Edit2 size={13} />} className="text-amber-600 hover:bg-amber-50"
              onClick={() => {
                setReviewClaim(c);
                setReviewForm({ status: c.status, approvedAmount: c.approvedAmount ? String(c.approvedAmount) : '', reviewNotes: c.reviewNotes ?? '', assignedTo: auth.user?.name ?? '' });
                setShowReviewModal(true);
              }}>
              Review
            </Button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Claims Management"
        subtitle={`${myClaims.filter(c => c.status === 'submitted' || c.status === 'under_review').length} pending review`}
        action={
          <div className="flex gap-2">
            <Button icon={<Plus size={15} />} onClick={() => setShowModal(true)}>
              {isAdmin ? 'File Claim' : 'Submit Claim'}
            </Button>
          </div>
        }
      />

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CLAIM_STATUSES.map(s => {
          const count = myClaims.filter(c => c.status === s.value).length;
          const colors: Record<string, string> = {
            submitted: 'border-blue-200 bg-blue-50',
            under_review: 'border-amber-200 bg-amber-50',
            approved: 'border-emerald-200 bg-emerald-50',
            rejected: 'border-red-200 bg-red-50',
            settled: 'border-purple-200 bg-purple-50',
          };
          const textColors: Record<string, string> = {
            submitted: 'text-blue-700',
            under_review: 'text-amber-700',
            approved: 'text-emerald-700',
            rejected: 'text-red-700',
            settled: 'text-purple-700',
          };
          return (
            <div key={s.value} className={`rounded-xl border p-3 ${colors[s.value]}`}>
              <p className={`text-2xl font-bold ${textColors[s.value]}`}>{count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by claim no., customer, vehicle or policy…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400 flex-shrink-0" />
            <Select
              options={[{ value: 'all', label: 'All Status' }, ...CLAIM_STATUSES]}
              value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="w-40" />
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-700">{filtered.length} claim{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="p-4">
          <Table columns={columns} data={paginated} keyExtractor={c => c.id}
            page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={perPage}
            onRowClick={c => { setViewClaim(c); setShowViewModal(true); }}
          />
        </div>
      </Card>

      {/* Submit Claim Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Insurance Claim"
        subtitle="Please fill in all incident details accurately." size="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button icon={<AlertTriangle size={14} />} onClick={handleSubmitClaim} loading={saving}>Submit Claim</Button>
          </>
        }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Select label="Active Policy" required error={errors.policyId} value={form.policyId} onChange={sf('policyId')}
              options={[{ value: '', label: 'Select active policy…' }, ...myPolicies.map(p => ({
                value: String(p.id), label: `${p.policyNumber} — ${p.vehicleRegNo} (${p.customerName})`
              }))]} />
          </div>

          {form.policyId && (
            <div className="sm:col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
              <p className="font-semibold text-blue-700 mb-2">Selected Vehicle</p>
              <div className="grid grid-cols-3 gap-2 text-slate-600">
                <div><span className="text-xs text-slate-400 block">Reg. No.</span>{form.vehicleRegNo}</div>
                <div><span className="text-xs text-slate-400 block">Make</span>{form.vehicleMake}</div>
                <div><span className="text-xs text-slate-400 block">Model</span>{form.vehicleModel}</div>
              </div>
            </div>
          )}

          <Select label="Claim Type" required value={form.claimType} onChange={sf('claimType')} options={CLAIM_TYPES} />
          <Input label="Incident Date" type="date" required error={errors.incidentDate} value={form.incidentDate} onChange={sf('incidentDate')} />
          <div className="sm:col-span-2">
            <Input label="Incident Location" required error={errors.incidentLocation} value={form.incidentLocation} onChange={sf('incidentLocation')}
              placeholder="e.g., Galle Road, Colombo 06 near the junction" />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Incident Description" required error={errors.incidentDescription} value={form.incidentDescription}
              onChange={sf('incidentDescription')} rows={4}
              placeholder="Please describe the incident in detail — what happened, how it happened, and any third parties involved…" />
          </div>
          <Input label="Estimated Damage Amount (LKR)" type="number" required error={errors.estimatedDamage}
            value={form.estimatedDamage} onChange={sf('estimatedDamage')} placeholder="e.g., 150000"
            hint="Your estimated repair / replacement cost" />
          <Input label="Supporting Documents" value={form.documents.join(', ')}
            onChange={e => setForm(prev => ({ ...prev, documents: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
            placeholder="e.g., police_report.pdf, photos.jpg" hint="List document filenames, comma separated" />
        </div>
      </Modal>

      {/* Review Claim Modal (Admin only) */}
      {reviewClaim && (
        <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Review Claim"
          subtitle={`Reviewing ${reviewClaim.claimNumber}`} size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
              <Button onClick={handleReview} loading={saving}>Update Status</Button>
            </>
          }>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-slate-400 block text-xs">Customer</span><span className="font-medium">{reviewClaim.customerName}</span></div>
                <div><span className="text-slate-400 block text-xs">Vehicle</span><span className="font-medium">{reviewClaim.vehicleRegNo}</span></div>
                <div><span className="text-slate-400 block text-xs">Incident Type</span><span className="font-medium capitalize">{reviewClaim.claimType ? reviewClaim.claimType.replace('_', ' ') : 'General'}</span></div>
                <div><span className="text-slate-400 block text-xs">Est. Damage</span><span className="font-bold text-blue-700">{formatLKR(reviewClaim.estimatedDamage)}</span></div>
              </div>
              <div><span className="text-slate-400 block text-xs">Description</span><p className="text-slate-600 mt-0.5">{reviewClaim.incidentDescription}</p></div>
            </div>

            <Select label="Update Status" required value={reviewForm.status}
              onChange={e => setReviewForm(prev => ({ ...prev, status: e.target.value }))} options={CLAIM_STATUSES} />
            {(reviewForm.status === 'approved' || reviewForm.status === 'settled') && (
              <Input label="Approved Amount (LKR)" type="number" value={reviewForm.approvedAmount}
                onChange={e => setReviewForm(prev => ({ ...prev, approvedAmount: e.target.value }))}
                placeholder="Net amount after deductibles" required />
            )}
            <Input label="Assigned To" value={reviewForm.assignedTo}
              onChange={e => setReviewForm(prev => ({ ...prev, assignedTo: e.target.value }))} />
            <Textarea label="Review Notes" value={reviewForm.reviewNotes} rows={3}
              onChange={e => setReviewForm(prev => ({ ...prev, reviewNotes: e.target.value }))}
              placeholder="Enter assessment notes, findings, and decision rationale…" />
          </div>
        </Modal>
      )}

      {/* View Claim Modal */}
      {viewClaim && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Claim Details" size="xl"
          footer={
            <div className="flex gap-2 w-full">
              {isAdmin && (viewClaim.status === 'submitted' || viewClaim.status === 'under_review') && (
                <Button icon={<Edit2 size={14} />} onClick={() => {
                  setShowViewModal(false);
                  setReviewClaim(viewClaim);
                  setReviewForm({ status: viewClaim.status, approvedAmount: viewClaim.approvedAmount ? String(viewClaim.approvedAmount) : '', reviewNotes: viewClaim.reviewNotes ?? '', assignedTo: auth.user?.name ?? '' });
                  setShowReviewModal(true);
                }}>Review Claim</Button>
              )}
              <Button variant="outline" className="ml-auto" onClick={() => setShowViewModal(false)}>Close</Button>
            </div>
          }>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-700">{viewClaim.claimNumber}</h3>
                <p className="text-sm text-slate-500">{viewClaim.policyNumber} · Submitted {formatDate(viewClaim.submittedAt || viewClaim.createdAt)}</p>
              </div>
              <Badge className={getClaimStatusColor(viewClaim.status)}>
                {STATUS_ICONS[viewClaim.status || 'submitted']} {formatStatus(viewClaim.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                { label: 'Customer', value: viewClaim.customerName },
                { label: 'Vehicle', value: viewClaim.vehicleRegNo },
                { label: 'Make / Model', value: `${viewClaim.vehicleMake} ${viewClaim.vehicleModel}` },
                { label: 'Claim Type', value: viewClaim.claimType ? viewClaim.claimType.replace('_', ' ') : 'General' },
                { label: 'Incident Date', value: formatDate(viewClaim.incidentDate) },
                { label: 'Incident Location', value: viewClaim.incidentLocation },
                { label: 'Estimated Damage', value: formatLKR(viewClaim.estimatedDamage) },
                { label: 'Approved Amount', value: viewClaim.approvedAmount ? formatLKR(viewClaim.approvedAmount) : '—' },
                { label: 'Settled On', value: viewClaim.settledAt ? formatDate(viewClaim.settledAt) : '—' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className="font-semibold text-slate-700 capitalize">{item.value || '—'}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Incident Description</p>
              <p className="text-sm text-slate-700">{viewClaim.incidentDescription}</p>
            </div>

            {viewClaim.reviewNotes && (
              <div className={`rounded-xl p-3 border ${viewClaim.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <p className={`text-xs font-semibold mb-1 ${viewClaim.status === 'rejected' ? 'text-red-700' : 'text-emerald-700'}`}>
                  Review Notes {viewClaim.assignedTo && `· Reviewed by ${viewClaim.assignedTo}`}
                </p>
                <p className="text-sm text-slate-700">{viewClaim.reviewNotes}</p>
              </div>
            )}

            {viewClaim.documents && viewClaim.documents.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Attached Documents</p>
                <div className="flex flex-wrap gap-2">
                  {viewClaim.documents.map((doc, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium">
                      📎 {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};