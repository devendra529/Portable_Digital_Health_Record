'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import RecordCard from '@/components/RecordCard';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FileText, Upload, Search, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'General', 'Lab Report', 'Prescription', 'Radiology', 'Surgery', 'Vaccination'];

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/records/mine').then(r => setRecords(r.data.records)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await api.delete(`/records/${id}`);
      setRecords(p => p.filter(r => r.id !== id));
      toast.success('Record deleted');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = records.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || r.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">My Records</h1>
          <p className="text-sm text-[var(--text-secondary)]">{records.length} total records</p>
        </div>
        <Link href="/dashboard/upload" className="btn-primary self-start"><Upload size={15}/> Upload New</Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search records..."/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${category === c ? 'bg-sky-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="card p-4 animate-pulse h-36 bg-[var(--bg-tertiary)]"/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText size={36} className="text-[var(--text-muted)] mx-auto mb-3"/>
          <p className="font-medium text-[var(--text-primary)]">{search || category !== 'All' ? 'No matching records' : 'No records yet'}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1 mb-4">
            {search || category !== 'All' ? 'Try adjusting your search or filter' : 'Upload your first medical record to get started'}
          </p>
          {!search && category === 'All' && <Link href="/dashboard/upload" className="btn-primary text-sm">Upload Record</Link>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(r => <RecordCard key={r.id} record={r} onDelete={handleDelete}/>)}
        </div>
      )}
    </div>
  );
}
