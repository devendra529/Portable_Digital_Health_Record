'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Moon, Sun, Save, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name:user?.name||'', phone:user?.phone||'', bloodGroup:user?.bloodGroup||'', gender:user?.gender||'', dateOfBirth:user?.dateOfBirth||'' });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="section-title text-2xl">Settings</h1>
        <p className="section-subtitle">Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b" style={{borderColor:'var(--border)'}}>
          <User size={18} style={{color:'var(--brand)'}}/>
          <h2 className="font-semibold" style={{color:'var(--text)'}}>Profile Information</h2>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{background:'linear-gradient(135deg,#0ea5e9,#14b8a6)'}}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-lg" style={{color:'var(--text)'}}>{user?.name}</p>
            <p className="text-sm" style={{color:'var(--text-secondary)'}}>{user?.email}</p>
            <span className="badge badge-blue text-xs mt-1 capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input-field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input className="input-field" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            </div>
          </div>

          {user?.role === 'patient' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Blood Group</label>
                <select className="input-field" value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})}>
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input type="date" className="input-field" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})}/>
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input-field" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                  <option value="">Select</option>
                  {['Male','Female','Other'].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</span> : <><Save size={15}/>Save Changes</>}
          </button>
        </form>
      </div>

      {/* Theme */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b" style={{borderColor:'var(--border)'}}>
          {theme==='dark'?<Moon size={18} style={{color:'var(--brand)'}}/>:<Sun size={18} style={{color:'var(--brand)'}}/>}
          <h2 className="font-semibold" style={{color:'var(--text)'}}>Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm" style={{color:'var(--text)'}}>Dark Mode</p>
            <p className="text-xs mt-0.5" style={{color:'var(--text-secondary)'}}>Currently {theme} mode</p>
          </div>
          <button onClick={toggleTheme} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
            style={{background:theme==='dark'?'var(--brand)':'var(--border)'}}>
            <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
              style={{transform:theme==='dark'?'translateX(24px)':'translateX(4px)'}}/>
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b" style={{borderColor:'var(--border)'}}>
          <Shield size={18} style={{color:'var(--brand)'}}/>
          <h2 className="font-semibold" style={{color:'var(--text)'}}>Account Details</h2>
        </div>
        <div className="space-y-3 text-sm">
          {[
            {label:'User ID',value:user?.id?.slice(0,20)+'...'},
            {label:'Email',value:user?.email},
            {label:'Role',value:user?.role},
            {label:'Joined',value:user?.createdAt?new Date(user.createdAt).toLocaleDateString('en-IN',{dateStyle:'long'}):'N/A'},
          ].map(({label,value})=>(
            <div key={label} className="flex items-center justify-between py-2 border-b last:border-0" style={{borderColor:'var(--border-subtle)'}}>
              <span style={{color:'var(--text-secondary)'}}>{label}</span>
              <span className="font-mono text-xs" style={{color:'var(--text)'}}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
