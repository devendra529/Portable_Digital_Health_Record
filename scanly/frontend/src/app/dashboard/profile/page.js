'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Phone, Droplets, Calendar, Shield, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    bloodGroup: user?.bloodGroup || '', dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '', specialization: user?.specialization || ''
  });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">My Profile</h1>

      {/* Avatar */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{user?.name}</p>
          <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-blue capitalize">{user?.role}</span>
            {user?.role === 'doctor' && (
              user?.doctorVerified
                ? <span className="badge-green"><Shield size={10}/> Verified</span>
                : <span className="badge-yellow">Pending Verification</span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card p-5 space-y-4">
        <h2 className="font-semibold text-[var(--text-primary)]">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative"><User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
            <input value={form.name} onChange={set('name')} className="input-field pl-9" placeholder="Your name"/></div>
          </div>
          <div>
            <label className="label">Phone</label>
            <div className="relative"><Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
            <input value={form.phone} onChange={set('phone')} className="input-field pl-9" placeholder="+91..."/></div>
          </div>
          <div>
            <label className="label">Email</label>
            <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed"/>
          </div>
          {user?.role === 'patient' && <>
            <div>
              <label className="label">Blood Group</label>
              <div className="relative"><Droplets size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
              <select value={form.bloodGroup} onChange={set('bloodGroup')} className="input-field pl-9">
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g}>{g}</option>)}
              </select></div>
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <div className="relative"><Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
              <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className="input-field pl-9"/></div>
            </div>
            <div>
              <label className="label">Gender</label>
              <select value={form.gender} onChange={set('gender')} className="input-field">
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </>}
          {user?.role === 'doctor' && (
            <div>
              <label className="label">Specialization</label>
              <input value={form.specialization} onChange={set('specialization')} className="input-field" placeholder="Cardiology, Neurology..."/>
            </div>
          )}
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          <Save size={15}/>{loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="card p-5 space-y-2">
        <h2 className="font-semibold text-[var(--text-primary)]">Account Details</h2>
        <div className="text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Member since</span>
            <span className="text-[var(--text-secondary)]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">User ID</span>
            <span className="text-[var(--text-secondary)] font-mono text-xs">{user?.id?.slice(0,16)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
