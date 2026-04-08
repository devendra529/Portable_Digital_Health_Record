'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, FileText, Upload, QrCode, Search, Users, Shield, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const patientLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/dashboard/records', icon: FileText, label: 'Records' },
    { href: '/dashboard/upload', icon: Upload, label: 'Upload' },
    { href: '/dashboard/qrcode', icon: QrCode, label: 'QR Code' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const doctorLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/dashboard/search', icon: Search, label: 'Search' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const adminLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/dashboard/admin/patients', icon: Users, label: 'Patients' },
    { href: '/dashboard/admin/doctors', icon: Shield, label: 'Doctors' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '8px 0 calc(8px + env(safe-area-inset-bottom, 0px))',
    }} className="lg:hidden">
      {links.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
        return (
          <Link key={href} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', padding: '4px 12px', borderRadius: '10px', transition: 'all 0.15s' }}>
            <Icon size={20} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '500', color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
