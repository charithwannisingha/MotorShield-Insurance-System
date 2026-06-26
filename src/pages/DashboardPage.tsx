import {
  Users, Car, FileText, AlertTriangle, CreditCard,
  TrendingUp, CheckCircle, Clock, XCircle, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard, Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  formatLKR, formatLKRShort, formatDate, formatStatus,
  getPolicyStatusColor, getClaimStatusColor, formatCoverageType
} from '../utils/helpers';
import { getMonthlyRevenueData } from '../data/mockData';

const COVERAGE_COLORS = ['#1d4ed8', '#0891b2', '#7c3aed'];

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const { users, vehicles, policies, claims, payments, auth } = useApp();
  const isAdmin = auth.user?.role === 'admin';
  const myId = auth.user?.id;

  const myPolicies = isAdmin ? policies : policies.filter(p => String(p.customerId) === String(myId));
  const myClaims = isAdmin ? claims : claims.filter(c => String(c.customerId) === String(myId));
  const myPayments = isAdmin ? payments : payments.filter(p => String(p.customerId) === String(myId));
  const myVehicles = isAdmin ? vehicles : vehicles.filter(v => String(v.customerId) === String(myId));

  const activePolicies = myPolicies.filter(p => p.status === 'active').length;
  const expiredPolicies = myPolicies.filter(p => p.status === 'expired').length;
  const pendingClaims = myClaims.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  
  // මුදල් එකතු කරද්දී Number() දාලා ආරක්ෂිතව එකතු කරනවා
  const totalRevenue = myPayments.filter(p => p.status === 'paid').reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const overduePayments = myPayments.filter(p => p.status === 'overdue').length;

  const monthlyData = getMonthlyRevenueData();

  // Policy status breakdown
  const policyBreakdown = [
    { name: 'Active', value: myPolicies.filter(p => p.status === 'active').length, color: '#10b981' },
    { name: 'Expired', value: myPolicies.filter(p => p.status === 'expired').length, color: '#ef4444' },
    { name: 'Pending', value: myPolicies.filter(p => p.status === 'pending').length, color: '#f59e0b' },
    { name: 'Cancelled', value: myPolicies.filter(p => p.status === 'cancelled').length, color: '#6b7280' },
  ].filter(x => x.value > 0);

  // Coverage type breakdown
  const coverageBreakdown = [
    { name: 'Comprehensive', value: myPolicies.filter(p => p.coverageType === 'comprehensive').length, color: COVERAGE_COLORS[0] },
    { name: 'Third Party', value: myPolicies.filter(p => p.coverageType === 'third_party').length, color: COVERAGE_COLORS[1] },
    { name: 'TP Fire & Theft', value: myPolicies.filter(p => p.coverageType === 'third_party_fire_theft').length, color: COVERAGE_COLORS[2] },
  ].filter(x => x.value > 0);

  // ── මෙන්න මෙතන තමයි වැරැද්ද හැදුවේ: submittedAt හෝ createdAt නැති වුණොත් හිස් තීරුවක් (|| '') දෙනවා ──
  const recentClaims = [...myClaims].sort((a, b) => {
    const dateB = b.submittedAt || b.createdAt || '';
    const dateA = a.submittedAt || a.createdAt || '';
    return dateB.localeCompare(dateA);
  }).slice(0, 5);

  const recentPolicies = [...myPolicies].sort((a, b) => {
    const dateB = b.createdAt || b.startDate || '';
    const dateA = a.createdAt || a.startDate || '';
    return dateB.localeCompare(dateA);
  }).slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-sm">
          <p className="font-semibold text-slate-700 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-slate-600">{p.name}: <span className="font-semibold">{formatLKRShort(p.value)}</span></p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 rounded-2xl px-6 py-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {auth.user?.name ? auth.user.name.split(' ')[0] : 'User'}! 👋
            </h1>
            <p className="text-blue-200 text-sm mt-0.5">
              {isAdmin
                ? 'Here\'s your system overview for today.'
                : 'Here\'s an overview of your insurance portfolio.'}
            </p>
          </div>
          <div className="hidden md:block text-right text-blue-200 text-sm">
            <p className="font-semibold text-white">{new Date().toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Asia/Colombo' })}</p>
            <p>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Colombo' })}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin && (
          <StatCard
            title="Total Customers"
            value={10}
            subValue={`8 active`}
            icon={<Users size={22} className="text-blue-600" />}
            iconBg="bg-blue-50"
            trend={{ value: '+2 this month', positive: true }}
          />
        )}
        <StatCard
          title={isAdmin ? 'Total Vehicles' : 'My Vehicles'}
          value={myVehicles.filter(v => v.isActive).length}
          icon={<Car size={22} className="text-violet-600" />}
          iconBg="bg-violet-50"
        />
        <StatCard
          title={isAdmin ? 'Total Policies' : 'My Policies'}
          value={myPolicies.length}
          subValue={`${activePolicies} active · ${expiredPolicies} expired`}
          icon={<FileText size={22} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Pending Claims"
          value={pendingClaims}
          subValue={`${myClaims.length} total claims`}
          icon={<AlertTriangle size={22} className="text-amber-600" />}
          iconBg="bg-amber-50"
          trend={pendingClaims > 0 ? { value: 'Needs attention', positive: false } : undefined}
        />
        {isAdmin && (
          <StatCard
            title="Total Revenue (LKR)"
            value={formatLKRShort(totalRevenue)}
            subValue={`${myPayments.filter(p => p.status === 'paid').length} payments received`}
            icon={<TrendingUp size={22} className="text-blue-600" />}
            iconBg="bg-blue-50"
          />
        )}
        {isAdmin && (
          <StatCard
            title="Overdue Payments"
            value={overduePayments}
            subValue="Requires follow-up"
            icon={<CreditCard size={22} className="text-red-500" />}
            iconBg="bg-red-50"
            trend={overduePayments > 0 ? { value: 'Action required', positive: false } : undefined}
          />
        )}
        {!isAdmin && (
          <StatCard
            title="Total Premium Paid"
            value={formatLKRShort(totalRevenue)}
            subValue="All time payments"
            icon={<CreditCard size={22} className="text-blue-600" />}
            iconBg="bg-blue-50"
          />
        )}
      </div>

      {/* Charts Row */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-slate-800">Monthly Revenue vs Claims</h3>
                <p className="text-xs text-slate-500">2024 Financial Year (LKR)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="clmGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1d4ed8" strokeWidth={2} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="claims" name="Claims" stroke="#ef4444" strokeWidth={2} fill="url(#clmGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Policy Status */}
          <Card>
            <h3 className="font-semibold text-slate-800 mb-1">Policy Status</h3>
            <p className="text-xs text-slate-500 mb-4">Distribution by status</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={policyBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {policyBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coverage Breakdown */}
        <Card>
          <h3 className="font-semibold text-slate-800 mb-1">Coverage Types</h3>
          <p className="text-xs text-slate-500 mb-4">Policy distribution</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={coverageBreakdown} layout="vertical" margin={{ left: 0, right: 10 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} width={90} axisLine={false} tickLine={false} />
              <Tooltip />
              {coverageBreakdown.map((entry, i) => (
                <Bar key={i} dataKey="value" fill={entry.color} radius={[0, 4, 4, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Claims */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Recent Claims</h3>
            <button onClick={() => onNavigate('claims')} className="text-xs text-blue-600 hover:underline font-medium">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recentClaims.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No claims yet.</p>
            ) : recentClaims.map(claim => (
              <div key={claim.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    claim.status === 'settled' ? 'bg-purple-100' :
                    claim.status === 'approved' ? 'bg-emerald-100' :
                    claim.status === 'rejected' ? 'bg-red-100' :
                    claim.status === 'under_review' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {claim.status === 'settled' ? <CheckCircle size={14} className="text-purple-600" /> :
                     claim.status === 'approved' ? <CheckCircle size={14} className="text-emerald-600" /> :
                     claim.status === 'rejected' ? <XCircle size={14} className="text-red-600" /> :
                     <Clock size={14} className="text-amber-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{claim.claimNumber || 'CLM-PENDING'}</p>
                    <p className="text-xs text-slate-400">{claim.vehicleMake || 'Vehicle'} {claim.vehicleModel || ''} · {formatDate(claim.submittedAt || claim.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">{formatLKR(claim.estimatedDamage)}</p>
                  <Badge className={getClaimStatusColor(claim.status)}>
                    {formatStatus(claim.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Policies */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Recent Policies</h3>
          <button onClick={() => onNavigate('policies')} className="text-xs text-blue-600 hover:underline font-medium">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Policy No.</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Coverage</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Premium</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Expiry</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentPolicies.map(policy => (
                <tr key={policy.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-blue-700">{policy.policyNumber || 'POL-PENDING'}</td>
                  <td className="py-3 px-3 text-slate-600">{policy.customerName || 'N/A'}</td>
                  <td className="py-3 px-3 text-slate-600">{policy.vehicleRegNo || 'N/A'}</td>
                  <td className="py-3 px-3 text-slate-500">{formatCoverageType(policy.coverageType)}</td>
                  <td className="py-3 px-3 font-medium text-slate-700">{formatLKR(policy.premiumAmount)}</td>
                  <td className="py-3 px-3 text-slate-500">{formatDate(policy.endDate)}</td>
                  <td className="py-3 px-3">
                    <Badge className={getPolicyStatusColor(policy.status)}>{formatStatus(policy.status)}</Badge>
                  </td>
                  <td className="py-3 px-3">
                    {policy.status === 'expired' && (
                      <button onClick={() => onNavigate('policies')} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <RefreshCw size={12} /> Renew
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};