import React, { useState } from 'react';
import {
  Settings, Bell, Shield, Globe, Database, Users, 
  ChevronRight, Save, Info
} from 'lucide-react';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';

interface ToggleProps { label: string; description: string; value: boolean; onChange: () => void; }
const Toggle = ({ label, description, value, onChange }: ToggleProps) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

export const SettingsPage = () => {
  const { auth } = useApp();
  const isAdmin = auth.user?.role === 'admin';

  const [settings, setSettings] = useState({
    emailNotifications: true,
    policyExpiryAlerts: true,
    claimUpdates: true,
    paymentReminders: true,
    weeklyReports: false,
    darkMode: false,
    compactView: false,
    autoRenewalReminder: true,
    showCurrencySymbol: true,
    dateFormatDDMMYYYY: true,
    columboColomboTimezone: true,
    requireNICValidation: true,
    requirePhoneValidation: true,
    autoAssignClaims: false,
    claimApprovalRequired: true,
  });

  const toggle = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SECTION_ITEMS = [
    {
      title: 'Notifications', icon: <Bell size={18} className="text-blue-600" />, bg: 'bg-blue-100',
      items: [
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates for all system events' },
        { key: 'policyExpiryAlerts', label: 'Policy Expiry Alerts', desc: 'Get notified when policies are approaching expiry' },
        { key: 'claimUpdates', label: 'Claim Status Updates', desc: 'Receive updates when claim status changes' },
        { key: 'paymentReminders', label: 'Payment Reminders', desc: 'Send reminders for upcoming and overdue payments' },
        ...(isAdmin ? [{ key: 'weeklyReports', label: 'Weekly Summary Reports', desc: 'Receive automated weekly performance reports' }] : []),
      ] as { key: keyof typeof settings; label: string; desc: string }[]
    },
    {
      title: 'Display & Regional', icon: <Globe size={18} className="text-emerald-600" />, bg: 'bg-emerald-100',
      items: [
        { key: 'compactView' as keyof typeof settings, label: 'Compact Table View', desc: 'Show more records per page with reduced spacing' },
        { key: 'showCurrencySymbol' as keyof typeof settings, label: 'Show Currency Symbol', desc: 'Display "Rs." prefix on all monetary values' },
        { key: 'dateFormatDDMMYYYY' as keyof typeof settings, label: 'DD/MM/YYYY Date Format', desc: 'Use Sri Lanka standard date formatting' },
        { key: 'columboColomboTimezone' as keyof typeof settings, label: 'Asia/Colombo Timezone', desc: 'Display all timestamps in Sri Lanka timezone (UTC+5:30)' },
        { key: 'autoRenewalReminder' as keyof typeof settings, label: 'Auto Renewal Reminders', desc: 'Remind customers 30 days before policy expiry' },
      ] as { key: keyof typeof settings; label: string; desc: string }[]
    },
    ...(isAdmin ? [{
      title: 'Validation & Security', icon: <Shield size={18} className="text-purple-600" />, bg: 'bg-purple-100',
      items: [
        { key: 'requireNICValidation' as keyof typeof settings, label: 'NIC Validation', desc: 'Enforce Sri Lankan NIC format validation on registration' },
        { key: 'requirePhoneValidation' as keyof typeof settings, label: 'Phone Validation', desc: 'Enforce Sri Lankan phone number format (07X XXXXXXX)' },
      ] as { key: keyof typeof settings; label: string; desc: string }[]
    }] : []),
    ...(isAdmin ? [{
      title: 'Claims Management', icon: <Database size={18} className="text-amber-600" />, bg: 'bg-amber-100',
      items: [
        { key: 'autoAssignClaims' as keyof typeof settings, label: 'Auto-assign Claims', desc: 'Automatically assign new claims to available adjusters' },
        { key: 'claimApprovalRequired' as keyof typeof settings, label: 'Require Approval', desc: 'All claims require admin approval before settlement' },
      ] as { key: keyof typeof settings; label: string; desc: string }[]
    }] : []),
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <SectionHeader title="System Settings" subtitle="Configure your system preferences" />

      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ Settings saved successfully.
        </div>
      )}

      {SECTION_ITEMS.map((section, idx) => (
        <Card key={idx}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.bg}`}>
              {section.icon}
            </div>
            <h3 className="font-semibold text-slate-800">{section.title}</h3>
          </div>
          {section.items.map(item => (
            <Toggle
              key={item.key}
              label={item.label}
              description={item.desc}
              value={settings[item.key]}
              onChange={() => toggle(item.key)}
            />
          ))}
        </Card>
      ))}

      {/* System Info */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Info size={18} className="text-slate-600" />
          </div>
          <h3 className="font-semibold text-slate-800">System Information</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Application', value: 'MotorShield LK' },
            { label: 'Version', value: '2.5.0' },
            { label: 'Region', value: 'Sri Lanka' },
            { label: 'Currency', value: 'LKR (Rs.)' },
            { label: 'NIC Formats', value: 'Old (9+V/X) & New (12)' },
            { label: 'Phone Format', value: '07X XXXXXXX / +94' },
            { label: 'Date Format', value: 'DD/MM/YYYY' },
            { label: 'Timezone', value: 'Asia/Colombo' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
              <p className="text-sm font-semibold text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2 flex items-start gap-2">
          <Info size={12} className="mt-0.5 flex-shrink-0" />
          <span>This is a frontend demo of the MotorShield LK Motor Insurance Management System. In production, settings are persisted to the backend Laravel API.</span>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button icon={<Save size={15} />} onClick={handleSave} size="lg">Save Settings</Button>
      </div>
    </div>
  );
};
