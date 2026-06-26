import React, { useState } from 'react';
import {
  User, Mail, Phone, CreditCard, MapPin, Calendar,
  Shield, Edit2, Save, X, Key, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { formatDate, validatePhone, validateEmail } from '../utils/helpers';

export const ProfilePage = () => {
  const { auth, updateUser } = useApp();
  const user = auth.user!;

  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user.name, email: user.email, phone: user.phone, address: user.address,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!validateEmail(form.email)) e.email = 'Valid email required.';
    if (!validatePhone(form.phone)) e.phone = 'Valid Sri Lankan phone number required.';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    updateUser(user.id, form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePwd = () => {
    setPwdError('');
    if (!pwdForm.current) { setPwdError('Enter your current password.'); return; }
    if (pwdForm.newPwd.length < 6) { setPwdError('New password must be at least 6 characters.'); return; }
    if (pwdForm.newPwd !== pwdForm.confirm) { setPwdError('Passwords do not match.'); return; }
    setPwdSuccess(true);
    setTimeout(() => { setPwdSuccess(false); setChangingPwd(false); setPwdForm({ current: '', newPwd: '', confirm: '' }); }, 2000);
  };

  const sf = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }));
    if (formErrors[k]) setFormErrors(prev => ({ ...prev, [k]: '' }));
  };

  const INFO_ITEMS = [
    { icon: <Mail size={15} />, label: 'Email', value: user.email },
    { icon: <Phone size={15} />, label: 'Phone', value: user.phone },
    { icon: <CreditCard size={15} />, label: 'NIC Number', value: user.nic },
    { icon: <Calendar size={15} />, label: 'Date of Birth', value: formatDate(user.dateOfBirth) },
    { icon: <Shield size={15} />, label: 'Customer ID', value: user.id },
    { icon: <Calendar size={15} />, label: 'Member Since', value: formatDate(user.createdAt) },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <SectionHeader title="My Profile" subtitle="Manage your personal information and account settings" />

      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">Profile updated successfully.</span>
        </div>
      )}

      {/* Profile Card */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-slate-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`capitalize ${user.role === 'admin' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                  <Shield size={10} /> {user.role}
                </Badge>
                <Badge className={user.isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          {!editing && (
            <Button variant="outline" icon={<Edit2 size={14} />} onClick={() => setEditing(true)}>Edit Profile</Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={form.name} onChange={sf('name')} error={formErrors.name} required />
              <Input label="Email" type="email" value={form.email} onChange={sf('email')} error={formErrors.email} required />
              <Input label="Phone" value={form.phone} onChange={sf('phone')} error={formErrors.phone} required hint="e.g., 0771234567" />
            </div>
            <Textarea label="Address" value={form.address} onChange={sf('address')} rows={2} />
            <div className="flex gap-3 pt-2">
              <Button icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" icon={<X size={14} />} onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email, phone: user.phone, address: user.address }); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INFO_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
            <div className="sm:col-span-2 flex items-start gap-3 bg-slate-50 rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <MapPin size={15} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Address</p>
                <p className="text-sm font-semibold text-slate-700">{user.address}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Change Password */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Key size={18} className="text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Password & Security</h3>
              <p className="text-xs text-slate-400">Update your account password</p>
            </div>
          </div>
          {!changingPwd && (
            <Button variant="outline" size="sm" onClick={() => setChangingPwd(true)}>Change Password</Button>
          )}
        </div>

        {changingPwd && (
          <div className="space-y-4">
            {pwdError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{pwdError}</div>
            )}
            {pwdSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                <CheckCircle size={14} /> Password updated successfully!
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Current Password" type="password" value={pwdForm.current}
                onChange={e => setPwdForm(prev => ({ ...prev, current: e.target.value }))} required />
              <Input label="New Password" type="password" value={pwdForm.newPwd}
                onChange={e => setPwdForm(prev => ({ ...prev, newPwd: e.target.value }))} required hint="Minimum 6 characters" />
              <Input label="Confirm Password" type="password" value={pwdForm.confirm}
                onChange={e => setPwdForm(prev => ({ ...prev, confirm: e.target.value }))} required />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleChangePwd}>Update Password</Button>
              <Button variant="outline" onClick={() => { setChangingPwd(false); setPwdError(''); setPwdForm({ current: '', newPwd: '', confirm: '' }); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!changingPwd && (
          <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
            <Shield size={14} className="text-slate-400" />
            <span>Last changed: Not available in demo mode</span>
          </div>
        )}
      </Card>

      {/* System Info */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Shield size={16} className="text-blue-600" /> System Information
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: 'System', value: 'MotorShield LK' },
            { label: 'Version', value: 'v2.5.0' },
            { label: 'Timezone', value: 'Asia/Colombo (UTC+5:30)' },
            { label: 'Currency', value: 'Sri Lankan Rupee (LKR)' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">{item.label}</p>
              <p className="font-semibold text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
