'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import {
  LayoutDashboard, FileText, Upload, QrCode, User,
  Users, ShieldCheck, LogOut, Stethoscope, Settings, Search, X, Menu
} from 'lucide-react';
import { useState } from 'react';

const patientNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/records', icon: FileText, label: 'My Records' },
  { href: '/dashboard/upload', icon: Upload, label: 'Upload Record' },
  { href: '/dashboard/qr', icon: QrCode, label: 'My QR Code' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

const doctorNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/search', icon: Search, label: 'Search Patient' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

const adminNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/admin/patients', icon: Users, label: 'Patients' },
  { href: '/dashboard/admin/doctors', icon: Stethoscope, label: 'Doctors' },
  { href: '/dashboard/admin/records', icon: FileText, label: 'All Records' },
  { href: '/dashboard/admin/verify', icon: ShieldCheck, label: 'Verify Doctors' },
  { href: '/dashboard/profile', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'doctor' ? doctorNav : patientNav;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 pb-4">
        <Logo size={32} />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="px-3 mb-4">
        <div className="h-px bg-[var(--border)]"/>
      </div>

      <div className="px-3 mb-3">
        <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest px-3.5 mb-1">
          {user?.role === 'admin' ? 'Administration' : user?.role === 'doctor' ? 'Doctor Panel' : 'Patient Portal'}
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={active ? 'nav-link-active' : 'nav-link'}>
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto">
        <div className="h-px bg-[var(--border)] mb-3"/>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--text-muted)] capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout}
          className="nav-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl glass shadow-sm"
      >
        <Menu size={20} className="text-[var(--text-primary)]" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 glass-strong shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--sidebar-bg)' }}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0 h-screen sticky top-0 border-r border-[var(--border)]"
        style={{ background: 'var(--sidebar-bg)' }}>
        <SidebarContent />
      </aside>
    </>
  );
}
