'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import StatCard from '@/components/StatCard';
import RecordCard from '@/components/RecordCard';
import Link from 'next/link';
import { FileText, Upload, QrCode, Users, Stethoscope, ShieldCheck, Activity, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'patient') {
          const res = await api.get('/records/mine');
          setRecords(res.data.records.slice(0, 4));
        } else if (user.role === 'admin') {
          const res = await api.get('/admin/stats');
          setStats(res.data);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/records/${id}`);
      setRecords(p => p.filter(r => r.id !== id));
      toast.success('Record deleted');
    } catch { toast.error('Delete failed'); }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{greeting()}, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5 capitalize">{user.role} Dashboard · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        {user.role === 'patient' && (
          <Link href="/dashboard/upload" className="btn-primary self-start sm:self-auto">
            <Upload size={15}/> Upload Record
          </Link>
        )}
      </div>

      {/* Patient Dashboard */}
      {user.role === 'patient' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={FileText} label="Total Records" value={records.length} color="sky"/>
            <StatCard icon={Activity} label="Health Score" value="Good" color="green"/>
            <StatCard icon={Clock} label="Last Upload" value={records[0] ? new Date(records[0].createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short'}) : '—'} color="teal"/>
            <StatCard icon={ShieldCheck} label="Status" value="Verified" color="teal"/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: '/dashboard/records', icon: FileText, label: 'View All Records', desc: 'Browse your medical history', color: 'sky' },
              { href: '/dashboard/upload', icon: Upload, label: 'Upload Record', desc: 'Add new report or prescription', color: 'teal' },
              { href: '/dashboard/qr', icon: QrCode, label: 'My QR Code', desc: 'Share with doctor instantly', color: 'purple' },
            ].map(({ href, icon: Icon, label, desc, color }) => (
              <Link key={href} href={href} className="card-hover p-4 group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  color === 'sky' ? 'bg-sky-100 dark:bg-sky-950/40' :
                  color === 'teal' ? 'bg-teal-100 dark:bg-teal-950/40' :
                  'bg-purple-100 dark:bg-purple-950/40'}`}>
                  <Icon size={18} className={color === 'sky' ? 'text-sky-500' : color === 'teal' ? 'text-teal-500' : 'text-purple-500'} />
                </div>
                <p className="font-semibold text-[var(--text-primary)] text-sm">{label}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[var(--text-primary)]">Recent Records</h2>
              <Link href="/dashboard/records" className="text-xs text-sky-500 hover:text-sky-600 flex items-center gap-1">
                View all <ArrowRight size={12}/>
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1,2].map(i => <div key={i} className="card p-4 animate-pulse h-32 bg-[var(--bg-tertiary)]"/>)}
              </div>
            ) : records.length === 0 ? (
              <div className="card p-10 text-center">
                <FileText size={32} className="text-[var(--text-muted)] mx-auto mb-3"/>
                <p className="font-medium text-[var(--text-primary)] mb-1">No records yet</p>
                <p className="text-sm text-[var(--text-muted)] mb-4">Start by uploading your first medical record.</p>
                <Link href="/dashboard/upload" className="btn-primary text-sm">Upload Now</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {records.map(r => <RecordCard key={r.id} record={r} onDelete={handleDelete}/>)}
              </div>
            )}
          </div>
        </>
      )}

      {/* Doctor Dashboard */}
      {user.role === 'doctor' && (
        <div className="space-y-4">
          {!user.doctorVerified && (
            <div className="card p-4 border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-950/20">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-yellow-500"/>
                <div>
                  <p className="font-semibold text-[var(--text-primary)] text-sm">Verification Pending</p>
                  <p className="text-xs text-[var(--text-secondary)]">Your account is being reviewed by admin. You can still search patients.</p>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/dashboard/search" className="card-hover p-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center mb-4">
                <Activity size={22} className="text-sky-500"/>
              </div>
              <p className="font-semibold text-[var(--text-primary)]">Search Patient</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Find patients by phone number or scan QR</p>
            </Link>
            <Link href="/dashboard/profile" className="card-hover p-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/40 flex items-center justify-center mb-4">
                <Stethoscope size={22} className="text-teal-500"/>
              </div>
              <p className="font-semibold text-[var(--text-primary)]">My Profile</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Update your specialization and credentials</p>
            </Link>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {user.role === 'admin' && stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={Users} label="Total Patients" value={stats.totalPatients} color="sky"/>
            <StatCard icon={Stethoscope} label="Total Doctors" value={stats.totalDoctors} color="teal"/>
            <StatCard icon={FileText} label="Total Records" value={stats.totalRecords} color="purple"/>
            <StatCard icon={ShieldCheck} label="Pending Verification" value={stats.pendingDoctors} color="orange"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: '/dashboard/admin/patients', icon: Users, label: 'Manage Patients', color: 'sky' },
              { href: '/dashboard/admin/doctors', icon: Stethoscope, label: 'Manage Doctors', color: 'teal' },
              { href: '/dashboard/admin/verify', icon: ShieldCheck, label: 'Verify Doctors', color: 'orange', badge: stats.pendingDoctors },
            ].map(({ href, icon: Icon, label, color, badge }) => (
              <Link key={href} href={href} className="card-hover p-4 relative">
                {badge > 0 && <span className="absolute top-3 right-3 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{badge}</span>}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  color === 'sky' ? 'bg-sky-100 dark:bg-sky-950/40' :
                  color === 'teal' ? 'bg-teal-100 dark:bg-teal-950/40' :
                  'bg-orange-100 dark:bg-orange-950/40'}`}>
                  <Icon size={18} className={color === 'sky' ? 'text-sky-500' : color === 'teal' ? 'text-teal-500' : 'text-orange-500'} />
                </div>
                <p className="font-semibold text-[var(--text-primary)] text-sm">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
