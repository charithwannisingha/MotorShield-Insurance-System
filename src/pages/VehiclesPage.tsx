import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Car, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Vehicle } from '../types';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { formatDate, validateVehicleReg, formatVehicleType } from '../utils/helpers';

interface FormErrors {
  registrationNumber?: string; make?: string; model?: string;
  engineNumber?: string; chassisNumber?: string; customerId?: string;
}

const emptyForm: {
  customerId: string; customerName: string; registrationNumber: string;
  make: string; model: string; year: number; color: string; engineNumber: string;
  chassisNumber: string; vehicleType: import('../types').VehicleType; engineCapacity: string;
  seatingCapacity: number; fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'; isActive: boolean;
} = {
  customerId: '', customerName: '', registrationNumber: '', make: '',
  model: '', year: new Date().getFullYear(), color: '', engineNumber: '',
  chassisNumber: '', vehicleType: 'car', engineCapacity: '',
  seatingCapacity: 5, fuelType: 'petrol', isActive: true,
};

const VEHICLE_TYPES = [
  { value: 'car', label: 'Car' }, { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'van', label: 'Van' }, { value: 'lorry', label: 'Lorry' },
  { value: 'bus', label: 'Bus' }, { value: 'three_wheeler', label: 'Three Wheeler' },
  { value: 'suv', label: 'SUV' },
];

const FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol' }, { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' }, { value: 'hybrid', label: 'Hybrid' },
];

const TYPE_ICON_BG: Record<string, string> = {
  car: 'bg-blue-100 text-blue-700', motorcycle: 'bg-orange-100 text-orange-700',
  van: 'bg-violet-100 text-violet-700', lorry: 'bg-slate-100 text-slate-700',
  bus: 'bg-green-100 text-green-700', three_wheeler: 'bg-yellow-100 text-yellow-700',
  suv: 'bg-cyan-100 text-cyan-700',
};

export const VehiclesPage = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, users, auth } = useApp();
  const isAdmin = auth.user?.role === 'admin';
  const myId = auth.user?.id;

  const myVehicles = isAdmin ? vehicles : vehicles.filter(v => v.customerId === myId);
  const customers = users.filter(u => u.role === 'customer' && u.isActive);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return myVehicles.filter(v => {
      const matchSearch = !search ||
        v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.make.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.customerName.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || v.vehicleType === typeFilter;
      return matchSearch && matchType;
    });
  }, [myVehicles, search, typeFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (isAdmin && !form.customerId) e.customerId = 'Please select a customer.';
    if (!validateVehicleReg(form.registrationNumber)) e.registrationNumber = 'Enter a valid Sri Lankan vehicle registration number.';
    if (!form.make.trim()) e.make = 'Vehicle make is required.';
    if (!form.model.trim()) e.model = 'Vehicle model is required.';
    if (!form.engineNumber.trim()) e.engineNumber = 'Engine number is required.';
    if (!form.chassisNumber.trim()) e.chassisNumber = 'Chassis number is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setEditingVehicle(null);
    setForm({ ...emptyForm, customerId: isAdmin ? '' : myId!, customerName: isAdmin ? '' : auth.user?.name ?? '' });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({
      customerId: v.customerId, customerName: v.customerName, registrationNumber: v.registrationNumber,
      make: v.make, model: v.model, year: v.year, color: v.color, engineNumber: v.engineNumber,
      chassisNumber: v.chassisNumber, vehicleType: v.vehicleType, engineCapacity: v.engineCapacity,
      seatingCapacity: v.seatingCapacity, fuelType: v.fuelType, isActive: v.isActive,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const customer = customers.find(c => c.id === form.customerId);
    const payload = { ...form, customerName: customer?.name ?? form.customerName };
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, payload);
    } else {
      addVehicle(payload);
    }
    setSaving(false);
    setShowModal(false);
  };

  const setField = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const val = k === 'year' || k === 'seatingCapacity' ? Number(e.target.value) : e.target.value;
    setForm(prev => ({ ...prev, [k]: val }));
    if (errors[k as keyof FormErrors]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const columns = [
    {
      key: 'registrationNumber', header: 'Vehicle',
      render: (v: Vehicle) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_ICON_BG[v.vehicleType] ?? 'bg-slate-100 text-slate-600'}`}>
            <Car size={16} />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{v.registrationNumber}</p>
            <p className="text-xs text-slate-400">{v.make} {v.model} · {v.year}</p>
          </div>
        </div>
      )
    },
    ...(isAdmin ? [{ key: 'customerName', header: 'Owner', render: (v: Vehicle) => <span className="text-slate-600">{v.customerName}</span> }] : []),
    { key: 'vehicleType', header: 'Type', render: (v: Vehicle) => <Badge className="bg-slate-100 text-slate-700 border-slate-200">{formatVehicleType(v.vehicleType)}</Badge> },
    { key: 'fuelType', header: 'Fuel', render: (v: Vehicle) => <span className="capitalize text-slate-500 text-sm">{v.fuelType}</span> },
    { key: 'color', header: 'Colour', render: (v: Vehicle) => <span className="text-slate-500">{v.color}</span> },
    { key: 'createdAt', header: 'Registered', render: (v: Vehicle) => <span className="text-slate-400 text-sm">{formatDate(v.createdAt)}</span> },
    {
      key: 'isActive', header: 'Status',
      render: (v: Vehicle) => (
        <Badge className={v.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}>
          {v.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions', header: 'Actions',
      render: (v: Vehicle) => (
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="sm" icon={<Eye size={13} />} onClick={() => { setViewVehicle(v); setShowViewModal(true); }}>View</Button>
          <Button variant="ghost" size="sm" icon={<Edit2 size={13} />} onClick={() => openEdit(v)}>Edit</Button>
          {isAdmin && <Button variant="ghost" size="sm" icon={<Trash2 size={13} />} className="text-red-500 hover:bg-red-50" onClick={() => setDeleteConfirm(v.id)}>Remove</Button>}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Vehicle Management"
        subtitle={`${myVehicles.filter(v => v.isActive).length} vehicles registered`}
        action={<Button icon={<Plus size={15} />} onClick={openAdd}>Add Vehicle</Button>}
      />

      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Search by reg. no., make, model or owner…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400 flex-shrink-0" />
            <Select
              options={[{ value: 'all', label: 'All Types' }, ...VEHICLE_TYPES]}
              value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="w-40"
            />
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-700">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="p-4">
          <Table columns={columns} data={paginated} keyExtractor={v => v.id}
            page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} perPage={perPage}
          />
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editingVehicle ? 'Edit Vehicle' : 'Register Vehicle'}
        subtitle="Enter the vehicle details below." size="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editingVehicle ? 'Save Changes' : 'Register Vehicle'}</Button>
          </>
        }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isAdmin && (
            <div className="sm:col-span-2">
              <Select label="Customer / Owner" required error={errors.customerId}
                value={form.customerId}
                onChange={e => {
                  const cust = customers.find(c => c.id === e.target.value);
                  setForm(prev => ({ ...prev, customerId: e.target.value, customerName: cust?.name ?? '' }));
                  if (errors.customerId) setErrors(prev => ({ ...prev, customerId: undefined }));
                }}
                options={[{ value: '', label: 'Select customer…' }, ...customers.map(c => ({ value: c.id, label: c.name }))]}
              />
            </div>
          )}
          <Input label="Registration Number" value={form.registrationNumber} onChange={setField('registrationNumber')}
            error={errors.registrationNumber} required placeholder="e.g., WP ABC-1234 or 300-1234"
            hint="Sri Lankan number plate format" />
          <Select label="Vehicle Type" required value={form.vehicleType} onChange={setField('vehicleType')} options={VEHICLE_TYPES} />
          <Input label="Make / Brand" value={form.make} onChange={setField('make')} error={errors.make} required placeholder="e.g., Toyota" />
          <Input label="Model" value={form.model} onChange={setField('model')} error={errors.model} required placeholder="e.g., Corolla" />
          <Input label="Year of Manufacture" type="number" value={String(form.year)} onChange={setField('year')}
            min={1950} max={new Date().getFullYear() + 1} required />
          <Input label="Colour" value={form.color} onChange={setField('color')} placeholder="e.g., Silver" />
          <Input label="Engine Number" value={form.engineNumber} onChange={setField('engineNumber')} error={errors.engineNumber} required placeholder="ENG-XXXX" />
          <Input label="Chassis Number" value={form.chassisNumber} onChange={setField('chassisNumber')} error={errors.chassisNumber} required placeholder="CHS-XXXX" />
          <Input label="Engine Capacity" value={form.engineCapacity} onChange={setField('engineCapacity')} placeholder="e.g., 1800cc or Electric" />
          <Select label="Fuel Type" value={form.fuelType} onChange={setField('fuelType')} options={FUEL_TYPES} />
          <Input label="Seating Capacity" type="number" value={String(form.seatingCapacity)} onChange={setField('seatingCapacity')} min={1} max={60} />
        </div>
      </Modal>

      {/* View Modal */}
      {viewVehicle && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Vehicle Details" size="lg"
          footer={<Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${TYPE_ICON_BG[viewVehicle.vehicleType] ?? 'bg-slate-100'}`}>
                <Car size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewVehicle.registrationNumber}</h3>
                <p className="text-slate-500">{viewVehicle.make} {viewVehicle.model} · {viewVehicle.year}</p>
                <Badge className={viewVehicle.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}>
                  {viewVehicle.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Owner', value: viewVehicle.customerName },
                { label: 'Vehicle Type', value: formatVehicleType(viewVehicle.vehicleType) },
                { label: 'Fuel Type', value: viewVehicle.fuelType },
                { label: 'Engine Capacity', value: viewVehicle.engineCapacity },
                { label: 'Seating', value: `${viewVehicle.seatingCapacity} seats` },
                { label: 'Colour', value: viewVehicle.color },
                { label: 'Engine No.', value: viewVehicle.engineNumber },
                { label: 'Chassis No.', value: viewVehicle.chassisNumber },
                { label: 'Registered', value: formatDate(viewVehicle.createdAt) },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Remove Vehicle" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { deleteVehicle(deleteConfirm!); setDeleteConfirm(null); }}>Remove</Button>
          </>
        }>
        <p className="text-slate-600 text-sm">Are you sure you want to remove this vehicle from the system?</p>
      </Modal>
    </div>
  );
};
