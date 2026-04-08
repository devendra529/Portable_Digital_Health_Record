'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RecordCard from '@/components/RecordCard';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { User, Droplets, Phone, Calendar, Activity, AlertCircle, Shield } from 'lucide-react';

export default function PatientViewPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${apiUrl}/qr/scan/${id}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); })
      .catch(() => setError('Failed to load patient data'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-primary)]">
      <AlertCircle size={48} className="text-red-400 mb-4"/>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Patient Not Found</h2>
      <p className="text-[var(--text-muted)] text-sm">{error}</p>
    </div>
  );

  const { patient, records, scanTime } = data;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-30 border-b border-[var(--border)]" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size={28}/>
          <div className="flex items-center gap-2">
            <span className="badge-green text-xs"><Activity size={10} className="animate-pulse"/> Live Record</span>
            <ThemeToggle/>
          </div>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5 page-enter">
        <div className="card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
              {patient.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">{patient.name}</h1>
                <span className="badge-blue">Patient</span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">Scanned {new Date(scanTime).toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Phone, label: 'Phone', value: patient.phone || 'N/A' },
              { icon: Droplets, label: 'Blood Group', value: patient.bloodGroup || 'N/A' },
              { icon: Calendar, label: 'Date of Birth', value: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-IN') : 'N/A' },
              { icon: User, label: 'Gender', value: patient.gender || 'N/A' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
                  <Icon size={11}/><span className="text-xs">{label}</span>
                </div>
                <p className="font-semibold text-[var(--text-primary)] text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-3 flex items-center gap-3">
          <Shield size={16} className="text-green-500"/>
          <p className="text-xs text-[var(--text-secondary)]">This record is accessed via QR scan. Read-only and secure.</p>
        </div>
        <div>
          <h2 className="font-semibold text-[var(--text-primary)] mb-3">Medical Records ({records?.length || 0})</h2>
          {!records?.length ? (
            <div className="card p-8 text-center"><p className="text-[var(--text-muted)] text-sm">No records uploaded</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {records.map(r => <RecordCard key={r.id} record={r} canDelete={false}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
