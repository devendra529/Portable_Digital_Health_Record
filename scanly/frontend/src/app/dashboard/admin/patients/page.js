'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Users, Trash2, Search, Droplets, Phone, Calendar } from 'lucide-react';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data.patients)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this patient and all their records?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setPatients(p => p.filter(u => u.id !== id));
      toast.success('Patient deleted');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Patients</h1>
          <p className="text-sm text-[var(--text-secondary)]">{patients.length} registered patients</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="Search patients..."/>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="card p-4 h-20 animate-pulse bg-[var(--bg-tertiary)]"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <Users size={32} className="text-[var(--text-muted)] mx-auto mb-2"/>
          <p className="text-[var(--text-muted)] text-sm">No patients found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {p.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--text-primary)] text-sm">{p.name}</p>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-0.5 flex-wrap">
                  <span>{p.email}</span>
                  {p.phone && <span className="flex items-center gap-1"><Phone size={10}/>{p.phone}</span>}
                  {p.bloodGroup && <span className="flex items-center gap-1"><Droplets size={10}/>{p.bloodGroup}</span>}
                  {p.gender && <span>{p.gender}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-[var(--text-muted)]">
                  {new Date(p.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                </span>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
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
