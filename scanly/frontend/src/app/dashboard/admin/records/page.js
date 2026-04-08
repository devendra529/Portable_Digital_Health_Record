'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import RecordCard from '@/components/RecordCard';
import { FileText, Search } from 'lucide-react';

export default function AdminRecordsPage() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/records/all').then(r => setRecords(r.data.records)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = records.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">All Records</h1>
          <p className="text-sm text-[var(--text-secondary)]">{records.length} total records in system</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="Search records..."/>
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[1,2,3,4].map(i=><div key={i} className="card p-4 h-36 animate-pulse bg-[var(--bg-tertiary)]"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center"><FileText size={32} className="text-[var(--text-muted)] mx-auto mb-2"/><p className="text-[var(--text-muted)] text-sm">No records found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(r => <RecordCard key={r.id} record={r} canDelete={false}/>)}
        </div>
      )}
    </div>
  );
}
