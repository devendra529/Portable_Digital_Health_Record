'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-md page-enter">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Logo size={40} showText={false} /></div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Sign in to your Scanly account</p>
        </div>
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
                  className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({...p, password: e.target.value}))}
                  className="input-field pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              No account?{' '}
              <Link href="/auth/signup" className="text-sky-500 hover:text-sky-600 font-medium">Create one</Link>
            </p>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-[var(--bg-tertiary)] text-xs text-[var(--text-muted)]">
            <p className="font-medium text-[var(--text-secondary)] mb-1">Demo Accounts</p>
            <p>Admin: admin@scanly.app / admin123</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
