'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone, Stethoscope, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', bloodGroup: '', dateOfBirth: '', gender: '', specialization: '', licenseNumber: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup({ ...form, role });
      toast.success('Account created! Welcome to Scanly.');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-lg page-enter py-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><Logo size={38} showText={false} /></div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create your account</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Join Scanly for secure digital health records</p>
        </div>
        <div className="card p-6 sm:p-8">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-[var(--bg-tertiary)] rounded-xl">
            {['patient','doctor'].map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`py-2 rounded-lg text-sm font-medium transition-all capitalize ${role === r ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]'}`}>
                {r === 'patient' ? '👤 Patient' : '🩺 Doctor'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                  <input type="text" value={form.name} onChange={set('name')} className="input-field pl-9" placeholder="Dr. Ravi Kumar" required />
                </div>
              </div>
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                  <input type="tel" value={form.phone} onChange={set('phone')} className="input-field pl-9" placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                <input type="email" value={form.email} onChange={set('email')} className="input-field pl-9" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} className="input-field pl-9 pr-9" placeholder="Min. 6 characters" required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>
            {role === 'patient' && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Blood Group</label>
                  <select value={form.bloodGroup} onChange={set('bloodGroup')} className="input-field">
                    <option value="">—</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className="input-field"/>
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select value={form.gender} onChange={set('gender')} className="input-field">
                    <option value="">—</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
            )}
            {role === 'doctor' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Specialization</label>
                  <div className="relative">
                    <Stethoscope size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
                    <input type="text" value={form.specialization} onChange={set('specialization')} className="input-field pl-9" placeholder="Cardiology"/>
                  </div>
                </div>
                <div>
                  <label className="label">License No.</label>
                  <input type="text" value={form.licenseNumber} onChange={set('licenseNumber')} className="input-field" placeholder="MCI-12345"/>
                </div>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
              {loading ? 'Creating account...' : <>Create Account <ArrowRight size={16}/></>}
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-sky-500 hover:text-sky-600 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
