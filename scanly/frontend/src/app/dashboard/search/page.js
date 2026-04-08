'use client';
import { useState } from 'react';
import api from '@/lib/api';
import RecordCard from '@/components/RecordCard';
import toast from 'react-hot-toast';
import { Search, Phone, User, Droplets, Calendar, FileText, AlertCircle } from 'lucide-react';

export default function SearchPatientPage() {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true); setResult(null); setNotFound(false);
    try {
      const res = await api.get(`/patients/search/phone?phone=${encodeURIComponent(phone)}`);
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
      else toast.error('Search failed');
    } finally { setLoading(false); }
  };

  const { patient, records } = result || {};

  return (
    <div className="max-w-3xl mx-auto space-y-5 page-enter">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Search Patient</h1>
        <p className="text-sm text-[var(--text-secondary)]">Find patient records by phone number</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
          <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field pl-9"
            placeholder="+91 98765 43210" type="tel"/>
        </div>
        <button type="submit" disabled={loading} className="btn-primary px-6">
          {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <><Search size={15}/> Search</>}
        </button>
      </form>

      {notFound && (
        <div className="card p-6 text-center">
          <AlertCircle size={32} className="text-[var(--text-muted)] mx-auto mb-2"/>
          <p className="font-medium text-[var(--text-primary)]">No patient found</p>
          <p className="text-sm text-[var(--text-muted)]">No patient registered with phone: {phone}</p>
        </div>
      )}

      {patient && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                {patient.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-[var(--text-primary)] text-lg">{patient.name}</h2>
                <p className="text-sm text-[var(--text-muted)]">{patient.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                { icon: Phone, label: 'Phone', value: patient.phone || '—' },
                { icon: Droplets, label: 'Blood Group', value: patient.bloodGroup || '—' },
                { icon: Calendar, label: 'Date of Birth', value: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-IN') : '—' },
                { icon: User, label: 'Gender', value: patient.gender || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[var(--bg-tertiary)] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1">
                    <Icon size={12}/><span className="text-xs">{label}</span>
                  </div>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[var(--text-primary)]">Medical Records ({records?.length || 0})</h3>
            </div>
            {records?.length === 0 ? (
              <div className="card p-8 text-center">
                <FileText size={28} className="text-[var(--text-muted)] mx-auto mb-2"/>
                <p className="text-sm text-[var(--text-muted)]">No records uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {records?.map(r => <RecordCard key={r.id} record={r} canDelete={false}/>)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
