'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Stethoscope, Trash2, Search, Shield, ShieldCheck, ShieldX } from 'lucide-react';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors').then(r => setDoctors(r.data.doctors)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id) => {
    try {
      await api.patch(`/admin/verify-doctor/${id}`);
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, doctorVerified: true } : d));
      toast.success('Doctor verified!');
    } catch { toast.error('Verification failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this doctor?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setDoctors(p => p.filter(d => d.id !== id));
      toast.success('Doctor deleted');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Doctors</h1>
          <p className="text-sm text-[var(--text-secondary)]">{doctors.length} registered doctors · {doctors.filter(d=>!d.doctorVerified).length} pending</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="Search doctors..."/>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="card p-4 h-20 animate-pulse bg-[var(--bg-tertiary)]"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <Stethoscope size={32} className="text-[var(--text-muted)] mx-auto mb-2"/>
          <p className="text-[var(--text-muted)] text-sm">No doctors found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(d => (
            <div key={d.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {d.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[var(--text-primary)] text-sm">{d.name}</p>
                  {d.doctorVerified
                    ? <span className="badge-green"><ShieldCheck size={10}/> Verified</span>
                    : <span className="badge-yellow"><Shield size={10}/> Pending</span>
                  }
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-0.5 flex-wrap">
                  <span>{d.email}</span>
                  {d.specialization && <span className="badge-blue">{d.specialization}</span>}
                  {d.licenseNumber && <span>Lic: {d.licenseNumber}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!d.doctorVerified && (
                  <button onClick={() => handleVerify(d.id)} className="btn-primary text-xs py-1.5 px-3">
                    <ShieldCheck size={12}/> Verify
                  </button>
                )}
                <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
