import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Card, SectionHeader, StatCard } from '../components/ui/Card';
import { formatLKR, formatLKRShort, formatCoverageType } from '../utils/helpers';
import { TrendingUp, FileText, AlertTriangle, Users, Car, CreditCard } from 'lucide-react';
import { getMonthlyRevenueData } from '../data/mockData';

export const ReportsPage = () => {
  const { users, vehicles, policies, claims, payments } = useApp();

  const customers = users.filter(u => u.role === 'customer');
  const activeVehicles = vehicles.filter(v => v.isActive);
  const activePolicies = policies.filter(p => p.status === 'active');
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingRevenue = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0);

  const monthlyData = getMonthlyRevenueData();

  const coverageBreakdown = [
    { name: 'Comprehensive', value: policies.filter(p => p.coverageType === 'comprehensive').length, color: '#1d4ed8' },
    { name: 'Third Party', value: policies.filter(p => p.coverageType === 'third_party').length, color: '#0891b2' },
    { name: 'TP Fire & Theft', value: policies.filter(p => p.coverageType === 'third_party_fire_theft').length, color: '#7c3aed' },
  ];

  const claimTypeData = ['accident', 'theft', 'fire', 'natural_disaster', 'vandalism', 'other'].map(type => ({
    name: type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: claims.filter(c => c.claimType === type).length,
    amount: claims.filter(c => c.claimType === type).reduce((s, c) => s + c.estimatedDamage, 0),
  })).filter(x => x.value > 0);

  const vehicleTypeData = ['car', 'motorcycle', 'van', 'lorry', 'bus', 'three_wheeler', 'suv'].map(type => ({
    name: type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: vehicles.filter(v => v.vehicleType === type && v.isActive).length,
    color: ['#1d4ed8', '#f59e0b', '#7c3aed', '#64748b', '#10b981', '#ef4444', '#0891b2'][['car', 'motorcycle', 'van', 'lorry', 'bus', 'three_wheeler', 'suv'].indexOf(type)],
  })).filter(x => x.value > 0);

  const policyStatusData = [
    { name: 'Active', value: policies.filter(p => p.status === 'active').length, color: '#10b981' },
    { name: 'Expired', value: policies.filter(p => p.status === 'expired').length, color: '#ef4444' },
    { name: 'Pending', value: policies.filter(p => p.status === 'pending').length, color: '#f59e0b' },
    { name: 'Cancelled', value: policies.filter(p => p.status === 'cancelled').length, color: '#6b7280' },
  ].filter(x => x.value > 0);

  const claimStatusData = [
    { name: 'Submitted', value: claims.filter(c => c.status === 'submitted').length, color: '#3b82f6' },
    { name: 'Under Review', value: claims.filter(c => c.status === 'under_review').length, color: '#f59e0b' },
    { name: 'Approved', value: claims.filter(c => c.status === 'approved').length, color: '#10b981' },
    { name: 'Rejected', value: claims.filter(c => c.status === 'rejected').length, color: '#ef4444' },
    { name: 'Settled', value: claims.filter(c => c.status === 'settled').length, color: '#8b5cf6' },
  ].filter(x => x.value > 0);

  const totalClaimAmount = claims.reduce((s, c) => s + c.estimatedDamage, 0);
  const settledClaimAmount = claims.filter(c => c.status === 'settled').reduce((s, c) => s + (c.approvedAmount ?? 0), 0);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-sm">
          <p className="font-semibold text-slate-700 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: <span className="font-bold">{typeof p.value === 'number' && p.value > 1000 ? formatLKRShort(p.value) : p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Reports & Analytics" subtitle="System-wide performance overview" />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={customers.length} subValue={`${customers.filter(u => u.isActive).length} active`}
          icon={<Users size={22} className="text-blue-700" />} iconBg="bg-blue-50" />
        <StatCard title="Active Policies" value={activePolicies.length} subValue={`${policies.length} total`}
          icon={<FileText size={22} className="text-emerald-600" />} iconBg="bg-emerald-50" />
        <StatCard title="Total Revenue" value={formatLKRShort(totalRevenue)} subValue={`${formatLKRShort(pendingRevenue)} pending`}
          icon={<TrendingUp size={22} className="text-blue-700" />} iconBg="bg-blue-50" />
        <StatCard title="Total Claims" value={claims.length} subValue={`${formatLKRShort(totalClaimAmount)} est. damages`}
          icon={<AlertTriangle size={22} className="text-amber-600" />} iconBg="bg-amber-50" />
      </div>

      {/* Revenue Chart */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Premium Revenue vs Claim Payouts</h3>
            <p className="text-xs text-slate-500">Monthly comparison — 2024 (LKR)</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-blue-700 rounded-full inline-block" />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-red-500 rounded-full inline-block" />Claims</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="clmG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1d4ed8" strokeWidth={2.5} fill="url(#revG)" />
            <Area type="monotone" dataKey="claims" name="Claims" stroke="#ef4444" strokeWidth={2.5} fill="url(#clmG)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Policy Status Pie */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Policy Status</h3>
          <p className="text-xs text-slate-400 mb-3">Distribution across all policies</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={policyStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {policyStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Claim Status Pie */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Claim Status</h3>
          <p className="text-xs text-slate-400 mb-3">Distribution across all claims</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={claimStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {claimStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Vehicle Type */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Fleet by Type</h3>
          <p className="text-xs text-slate-400 mb-3">Registered vehicles breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={vehicleTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {vehicleTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Claims by Type Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Claims by Incident Type</h3>
          <p className="text-xs text-slate-400 mb-4">Number of claims per incident category</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={claimTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" name="Claims" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Coverage Type */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Coverage Type Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Policies by coverage category</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={coverageBreakdown} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />
              {coverageBreakdown.map((entry, i) => (
                <Bar key={i} dataKey="value" name="Policies" fill={entry.color} radius={[0, 6, 6, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Financial Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase">Metric</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-400 uppercase">Value (LKR)</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-400 uppercase">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { label: 'Total Premium Revenue Collected', amount: totalRevenue, count: `${payments.filter(p => p.status === 'paid').length} payments` },
                { label: 'Outstanding / Overdue Premiums', amount: pendingRevenue, count: `${payments.filter(p => p.status === 'overdue').length} overdue` },
                { label: 'Total Estimated Claim Damages', amount: totalClaimAmount, count: `${claims.length} claims` },
                { label: 'Total Settled Claim Payouts', amount: settledClaimAmount, count: `${claims.filter(c => c.status === 'settled').length} settled` },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 text-slate-700 font-medium">{row.label}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800">{formatLKR(row.amount)}</td>
                  <td className="py-3 px-3 text-right text-slate-400 text-xs">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
