'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ShieldCheck, Shield, Stethoscope, CheckCircle2 } from 'lucide-react';

export default function VerifyDoctorsPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors').then(r => setPending(r.data.doctors.filter(d => !d.doctorVerified))).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id) => {
    try {
      await api.patch(`/admin/verify-doctor/${id}`);
      setPending(p => p.filter(d => d.id !== id));
      toast.success('Doctor verified!');
    } catch { toast.error('Verification failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Doctor Verification</h1>
        <p className="text-sm text-[var(--text-secondary)]">{pending.length} doctors awaiting verification</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2].map(i=><div key={i} className="card p-5 h-28 animate-pulse bg-[var(--bg-tertiary)]"/>)}</div>
      ) : pending.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3"/>
          <p className="font-semibold text-[var(--text-primary)]">All caught up!</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">No pending doctor verifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map(d => (
            <div key={d.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center text-white font-bold">
                    {d.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{d.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{d.email}</p>
                  </div>
                </div>
                <span className="badge-yellow flex-shrink-0"><Shield size={10}/> Pending</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Specialization</p>
                  <p className="font-medium text-[var(--text-primary)]">{d.specialization || '—'}</p>
                </div>
                <div className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                  <p className="text-xs text-[var(--text-muted)] mb-1">License Number</p>
                  <p className="font-medium text-[var(--text-primary)] font-mono">{d.licenseNumber || '—'}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                <button onClick={() => handleVerify(d.id)} className="btn-primary flex-1">
                  <ShieldCheck size={15}/> Approve & Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
