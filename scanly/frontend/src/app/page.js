'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { QrCode, Shield, Zap, Users, ArrowRight, CheckCircle2, Smartphone, Activity, Lock } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [splash, setSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem('scanly_splash');
    if (seen) setSplash(false);
  }, []);

  const handleSplashDone = () => {
    setSplash(false);
    sessionStorage.setItem('scanly_splash', '1');
    if (user) router.push('/dashboard');
  };

  if (!mounted) return null;
  if (splash) return <SplashScreen onFinish={handleSplashDone} />;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-30 border-b border-[var(--border)]" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size={32} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto page-enter">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-xs font-medium mb-6">
            <Activity size={12} className="animate-pulse" />
            Secure · Portable · Instant Access
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6">
            Your Health Records,{' '}
            <span className="gradient-text">Always With You</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl mx-auto">
            Scanly digitizes your complete medical history into a secure, portable QR-powered system. Share instantly with doctors. Access anywhere. Emergency ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/signup" className="btn-primary px-8 py-3 text-base w-full sm:w-auto">
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link href="/auth/login" className="btn-secondary px-8 py-3 text-base w-full sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20">
          {[
            { icon: QrCode, title: 'QR-Based Access', desc: 'Doctors scan your unique QR code for instant record access in emergencies.', color: 'sky' },
            { icon: Shield, title: 'Bank-Grade Security', desc: 'JWT authentication and role-based access control keep your data protected.', color: 'teal' },
            { icon: Zap, title: 'Instant Sharing', desc: 'Share records with any verified doctor in seconds. No more carrying files.', color: 'purple' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card-hover p-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                color === 'sky' ? 'bg-sky-100 dark:bg-sky-950/40' :
                color === 'teal' ? 'bg-teal-100 dark:bg-teal-950/40' :
                'bg-purple-100 dark:bg-purple-950/40'
              }`}>
                <Icon size={22} className={
                  color === 'sky' ? 'text-sky-500' :
                  color === 'teal' ? 'text-teal-500' : 'text-purple-500'
                } />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-10">Built for Everyone</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, role: 'Patient', color: 'sky', features: ['Upload reports & prescriptions', 'Generate personal QR code', 'Track medical history', 'Share with doctors instantly'] },
              { icon: Activity, role: 'Doctor', color: 'teal', features: ['Scan patient QR codes', 'Search by phone number', 'View complete medical history', 'Emergency access support'] },
              { icon: Lock, role: 'Admin', color: 'orange', features: ['Verify doctor credentials', 'Manage all users', 'System oversight', 'Data management'] },
            ].map(({ icon: Icon, role, color, features }) => (
              <div key={role} className="card p-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  color === 'sky' ? 'bg-sky-100 dark:bg-sky-950/40' :
                  color === 'teal' ? 'bg-teal-100 dark:bg-teal-950/40' :
                  'bg-orange-100 dark:bg-orange-950/40'
                }`}>
                  <Icon size={22} className={
                    color === 'sky' ? 'text-sky-500' :
                    color === 'teal' ? 'text-teal-500' : 'text-orange-500'
                  } />
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-3">{role}</h3>
                <ul className="space-y-2">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center card p-10">
          <Smartphone size={40} className="text-sky-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Ready to go paperless?</h2>
          <p className="text-[var(--text-secondary)] mb-6">Join thousands using Scanly for secure, portable health records.</p>
          <Link href="/auth/signup" className="btn-primary px-8 py-3 text-base">
            Start for Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={28} />
          <p className="text-xs text-[var(--text-muted)]">© 2026 Scanly. Secure Digital Health Records.</p>
        </div>
      </footer>
    </div>
  );
}
