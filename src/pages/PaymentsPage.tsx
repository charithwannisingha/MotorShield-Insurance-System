import React, { useState, useMemo } from 'react';
import { Plus, Search, CheckCircle, Filter, CreditCard, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Payment } from '../types';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { formatDate, formatLKR, getPaymentStatusColor, formatStatus } from '../utils/helpers';

interface FormErrors {
  policyId?: string; amount?: string; dueDate?: string; paymentMethod?: string;
  cardNumber?: string; expiry?: string; cvv?: string;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Credit / Debit Card' },
];

const emptyForm = {
  policyId: '', policyNumber: '', customerId: '', customerName: '',
  amount: '', dueDate: '', paymentDate: '', status: 'paid',
  paymentMethod: 'cash', referenceNumber: '', receivedBy: '', notes: '',
  cardNumber: '', expiry: '', cvv: ''
};

export const PaymentsPage = () => {
  const { payments, policies, addPayment, updatePayment, auth } = useApp();
  const isAdmin = auth.user?.role === 'admin';
  const myId = auth.user?.id;

  // ID සංසන්දනය String කරලා ආරක්ෂිතව ලිස්ට් එක හදනවා
  const myPayments = isAdmin ? payments : payments.filter(p => String(p.customerId) === String(myId));
  const myPolicies = isAdmin ? policies : policies.filter(p => String(p.customerId) === String(myId));

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);
  
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // Settle payment quick action (Admin)
  const [settlePayment, setSettlePayment] = useState<Payment | null>(null);
  const [settleForm, setSettleForm] = useState({ paymentDate: '', paymentMethod: 'cash', referenceNumber: '', notes: '' });

  const filtered = useMemo(() => myPayments.filter(p => {
    const matchSearch = !search ||
      p.paymentNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.policyNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  }), [myPayments, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const totalPaid = myPayments.filter(p => p.status === 'paid').reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const totalPending = myPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.policyId) e.policyId = 'Policy is required.';
    if (!form.amount || isNaN(Number(form.amount))) e.amount = 'Valid amount is required.';
    
    if (isAdmin) {
      if (!form.dueDate) e.dueDate = 'Due date is required.';
    } else {
      // Customer කෙනෙක් ගෙවද්දී කාඩ් විස්තර අනිවාර්ය කරනවා
      if (!form.cardNumber || form.cardNumber.length < 16) e.cardNumber = 'Valid 16-digit card number required.';
      if (!form.expiry) e.expiry = 'Expiry required (MM/YY).';
      if (!form.cvv || form.cvv.length < 3) e.cvv = '3-digit CVV required.';
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAddModal = () => {
    setForm({
      ...emptyForm,
      customerId: isAdmin ? '' : String(myId),
      customerName: isAdmin ? '' : auth.user?.name ?? '',
      paymentMethod: isAdmin ? 'cash' : 'card',
      receivedBy: isAdmin ? (auth.user?.name ?? '') : 'Online Gateway',
      paymentDate: isAdmin ? '' : new Date().toISOString().slice(0, 10)
    });
    setErrors({});
    setShowModal(true);
  };

  const sf = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (k === 'policyId') {
      const policy = myPolicies.find(p => String(p.id) === e.target.value);
      setForm(prev => ({
        ...prev, policyId: e.target.value,
        policyNumber: policy?.policyNumber ?? '',
        customerId: policy ? String(policy.customerId) : '',
        customerName: policy?.customerName ?? '',
        amount: policy ? String(policy.premiumAmount) : prev.amount,
      }));
    } else {
      setForm(prev => ({ ...prev, [k]: e.target.value }));
    }
    if (errors[k as keyof FormErrors]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, isAdmin ? 600 : 1200)); // Customer ට real look එකක් දෙන්න ටිකක් වෙලා යනවා

    const selectedPolicy = policies.find(p => String(p.id) === String(form.policyId));

    const payload = {
      ...form,
      policyId: Number(form.policyId),
      amount: Number(form.amount),
      customerId: selectedPolicy ? Number(selectedPolicy.customerId) : Number(form.customerId),
      status: isAdmin ? form.status : 'paid',
      paymentMethod: isAdmin ? form.paymentMethod : 'card',
      paymentDate: isAdmin ? (form.paymentDate || new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10),
      dueDate: isAdmin ? form.dueDate : (selectedPolicy?.endDate || new Date().toISOString().slice(0, 10)),
      paymentNumber: 'PAY-' + Math.floor(100000 + Math.random() * 900000)
    };

    await addPayment(payload);
    setSaving(false);
    setShowModal(false);
    setForm(emptyForm);
  };

  const handleSettle = async () => {
    if (!settlePayment) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updatePayment(settlePayment.id, {
      status: 'paid',
      paymentDate: settleForm.paymentDate || new Date().toISOString().slice(0, 10),
      paymentMethod: settleForm.paymentMethod as Payment['paymentMethod'],
      referenceNumber: settleForm.referenceNumber,
      notes: settleForm.notes,
      receivedBy: auth.user?.name ?? 'Admin',
    });
    setSaving(false);
    setSettlePayment(null);
  };

  const statusBadge: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
    partial: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const columns = [
    {
      key: 'paymentNumber', header: 'Receipt No.',
      render: (p: Payment) => <span className="font-mono font-semibold text-blue-700">{p.paymentNumber}</span>
    },
    {
      key: 'policyNumber', header: 'Policy',
      render: (p: Payment) => <span className="font-medium text-slate-700">{p.policyNumber}</span>
    },
    ...(isAdmin ? [{ key: 'customerName', header: 'Customer', render: (p: Payment) => <span className="text-slate-600">{p.customerName}</span> }] : []),
    { key: 'amount', header: 'Amount (LKR)', render: (p: Payment) => <span className="font-bold text-slate-800">{formatLKR(p.amount)}</span> },
    { key: 'dueDate', header: 'Due Date', render: (p: Payment) => <span className="text-slate-500">{formatDate(p.dueDate)}</span> },
    { key: 'paymentDate', header: 'Paid On', render: (p: Payment) => <span className="text-slate-500">{p.paymentDate ? formatDate(p.paymentDate) : '—'}</span> },
    {
      key: 'paymentMethod', header: 'Method',
      render: (p: Payment) => <span className="capitalize text-slate-500 text-xs">{(p.paymentMethod || 'card').replace('_', ' ')}</span>
    },
    {
      key: 'status', header: 'Status',
      render: (p: Payment) => <Badge className={statusBadge[p.status] ?? ''}>{formatStatus(p.status)}</Badge>
    },
    {
      key: 'actions', header: 'Actions',
      render: (p: Payment) => (
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="sm" icon={<Eye size={13} />} onClick={() => { setViewPayment(p); setShowViewModal(true); }}>View</Button>
          {isAdmin && (p.status === 'pending' || p.status === 'overdue') && (
            <Button variant="ghost" size="sm" icon={<CheckCircle size={13} />}
              className="text-emerald-600 hover:bg-emerald-50"
              onClick={() => { setSettlePayment(p); setSettleForm({ paymentDate: new Date().toISOString().slice(0, 10), paymentMethod: 'cash', referenceNumber: '', notes: '' }); }}>
              Settle
            </Button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader
        title={isAdmin ? "Payment Management" : "My Premium Payments"}
        subtitle={isAdmin ? "Track and manage all premium payments" : "View histories and pay your policy premiums securely"}
        action={<Button icon={isAdmin ? <Plus size={15} /> : <CreditCard size={15} />} onClick={openAddModal}>{isAdmin ? 'Record Payment' : 'Pay Premium (Demo)'}</Button>}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: isAdmin ? 'Total Collected' : 'Total Premium Paid', value: formatLKR(totalPaid), sub: `${myPayments.filter(p => p.status === 'paid').length} payments`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending / Overdue', value: formatLKR(totalPending), sub: `${myPayments.filter(p => p.status === 'pending' || p.status === 'overdue').length} payments`, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: isAdmin ? 'Total Payments' : 'My Total Transactions', value: myPayments.length, sub: 'All time records', color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map((s, i) => (
          <Card key={i} padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                <CreditCard size={18} className={s.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by receipt no., policy or method…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400 flex-shrink-0" />
            <Select
              options={[
                { value: 'all', label: 'All Status' }, { value: 'paid', label: 'Paid' },
                { value: 'pending', label: 'Pending' }, { value: 'overdue', label: 'Overdue' },
              ]}
              value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="w-36" />
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-700">{filtered.length} payment record{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="p-4">
          <Table columns={columns} data={paginated} keyExtractor={p => p.id}
            page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={perPage} />
        </div>
      </Card>

      {/* Add / Online Payment Gateway Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} 
        title={isAdmin ? "Record New Payment" : "Secure Payment Gateway (Demo)"}
        subtitle={isAdmin ? "Enter the payment details manually below." : "Enter your test card details to process premium payment."} 
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant={isAdmin ? "primary" : "success"} onClick={handleSave} loading={saving}>
              {isAdmin ? 'Record Payment' : 'Confirm & Pay Premium'}
            </Button>
          </>
        }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Select label={isAdmin ? "Policy" : "Select Your Policy to Pay"} required error={errors.policyId} value={form.policyId} onChange={sf('policyId')}
              options={[{ value: '', label: 'Select policy…' }, ...myPolicies.map(p => ({
                value: String(p.id), label: `${p.policyNumber} — ${p.customerName} (${p.vehicleRegNo}) [Premium: ${formatLKR(p.premiumAmount)}]`
              }))]} />
          </div>

          {form.amount && !isAdmin && (
            <div className="sm:col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <span className="text-xs text-emerald-600 block font-semibold">Total Payable Amount</span>
              <span className="text-2xl font-bold text-emerald-700">{formatLKR(form.amount)}</span>
            </div>
          )}

          <Input label="Amount (LKR)" type="number" required error={errors.amount} value={form.amount} onChange={sf('amount')} placeholder="85000" disabled={!isAdmin && form.policyId !== ''} />
          
          {isAdmin ? (
            <>
              <Input label="Due Date" type="date" required error={errors.dueDate} value={form.dueDate} onChange={sf('dueDate')} />
              <Input label="Payment Date" type="date" value={form.paymentDate} onChange={sf('paymentDate')} />
              <Select label="Payment Status" value={form.status} onChange={sf('status')}
                options={[
                  { value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' },
                  { value: 'overdue', label: 'Overdue' }, { value: 'partial', label: 'Partial' },
                ]} />
              <Select label="Payment Method" value={form.paymentMethod} onChange={sf('paymentMethod')} options={PAYMENT_METHODS} />
              <Input label="Reference Number" value={form.referenceNumber} onChange={sf('referenceNumber')} placeholder="e.g., BT-2024-001 or CHQ-12345" />
              <Input label="Received By" value={form.receivedBy} onChange={sf('receivedBy')} />
              <div className="sm:col-span-2">
                <Textarea label="Notes" value={form.notes} onChange={sf('notes')} rows={2} placeholder="Any additional remarks…" />
              </div>
            </>
          ) : (
            // Customerට විතරක් පෙනෙන Secure Credit Card Form එක (Demo Block)
            <div className="sm:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 mt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">🔒 Credit / Debit Card Details (Test Demo)</p>
              <Input label="Card Number" type="text" maxLength={16} placeholder="4242 4242 4242 4242" error={errors.cardNumber} value={form.cardNumber}
                onChange={e => setForm(prev => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '') }))} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Expiry Date" type="text" placeholder="MM/YY" maxLength={5} error={errors.expiry} value={form.expiry}
                  onChange={e => setForm(prev => ({ ...prev, expiry: e.target.value }))} />
                <Input label="CVV" type="password" placeholder="123" maxLength={3} error={errors.cvv} value={form.cvv}
                  onChange={e => setForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))} />
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Settle Modal (Admin only) */}
      {settlePayment && (
        <Modal isOpen={!!settlePayment} onClose={() => setSettlePayment(null)} title="Settle Payment"
          subtitle={`Recording payment for ${settlePayment.policyNumber}`} size="md"
          footer={
            <>
              <Button variant="outline" onClick={() => setSettlePayment(null)}>Cancel</Button>
              <Button variant="success" icon={<CheckCircle size={14} />} onClick={handleSettle} loading={saving}>Mark as Paid</Button>
            </>
          }>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">Customer:</span><span className="font-medium">{settlePayment.customerName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Amount Due:</span><span className="font-bold text-blue-700">{formatLKR(settlePayment.amount)}</span></div>
            </div>
            <Input label="Payment Date" type="date" value={settleForm.paymentDate}
              onChange={e => setSettleForm(prev => ({ ...prev, paymentDate: e.target.value }))} required />
            <Select label="Payment Method" value={settleForm.paymentMethod}
              onChange={e => setSettleForm(prev => ({ ...prev, paymentMethod: e.target.value }))} options={PAYMENT_METHODS.filter(m => m.value !== 'card')} />
            <Input label="Reference Number" value={settleForm.referenceNumber}
              onChange={e => setSettleForm(prev => ({ ...prev, referenceNumber: e.target.value }))} placeholder="Optional" />
            <Textarea label="Notes" value={settleForm.notes} rows={2}
              onChange={e => setSettleForm(prev => ({ ...prev, notes: e.target.value }))} />
          </div>
        </Modal>
      )}

      {/* View Payment / Receipt Modal */}
      {viewPayment && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Payment Receipt" size="md"
          footer={<Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-blue-700 font-mono">{viewPayment.paymentNumber}</p>
                <p className="text-sm text-slate-500">{viewPayment.policyNumber}</p>
              </div>
              <Badge className={getPaymentStatusColor(viewPayment.status)}>{formatStatus(viewPayment.status)}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Customer', value: viewPayment.customerName },
                { label: 'Amount', value: formatLKR(viewPayment.amount) },
                { label: 'Due Date', value: formatDate(viewPayment.dueDate) },
                { label: 'Paid On', value: viewPayment.paymentDate ? formatDate(viewPayment.paymentDate) : '—' },
                { label: 'Method', value: (viewPayment.paymentMethod || 'card').replace('_', ' ') },
                { label: 'Reference', value: viewPayment.referenceNumber || '—' },
                { label: 'Received By', value: viewPayment.receivedBy || 'Online Gateway' },
                { label: 'Recorded On', value: formatDate(viewPayment.createdAt) },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            {viewPayment.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">Notes</p>
                <p className="text-sm text-blue-800">{viewPayment.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};