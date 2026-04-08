'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data.users || [])).catch(() => toast.error('Failed to load users')).finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete ${name}? This will also delete all their records.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const filtered = users.filter(u => filter === 'all' || u.role === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease' }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>All Users</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{users.length} total accounts</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {['all', 'patient', 'doctor', 'admin'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none',
            background: filter === f ? '#0ea5e9' : 'var(--surface-3)',
            color: filter === f ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease', textTransform: 'capitalize',
          }}>{f === 'all' ? `All (${users.length})` : `${f.charAt(0).toUpperCase()}${f.slice(1)}s (${users.filter(u => u.role === f).length})`}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="shimmer" style={{ height: 72, borderRadius: 12 }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(u => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: u.role === 'patient' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : u.role === 'doctor' ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16,
              }}>{u.name?.[0]?.toUpperCase()}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                  <span className={`badge badge-${u.role === 'patient' ? 'blue' : u.role === 'doctor' ? 'teal' : 'gray'}`}>{u.role}</span>
                  {u.role === 'doctor' && <span className={`badge badge-${u.doctorVerified ? 'green' : 'yellow'}`}>{u.doctorVerified ? '✓ Verified' : 'Pending'}</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{u.email} {u.phone && `· ${u.phone}`}</div>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, display: 'none' }} className="md:block">
                {new Date(u.createdAt).toLocaleDateString()}
              </div>

              <button onClick={() => deleteUser(u.id, u.name)} className="btn" style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', flexShrink: 0, fontSize: 12 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
