'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/AuthContext';
import { Sun, Moon, Menu, X, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const roleColor = { patient: 'badge-blue', doctor: 'badge-teal', admin: 'badge-purple' };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(var(--surface-rgb, 255,255,255), 0.85)',
    }} className="bg-white/80 dark:bg-[#0f1117]/80">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 80 80" fill="none">
              <rect x="8" y="28" width="6" height="24" rx="3" fill="white" opacity="0.9"/>
              <rect x="18" y="22" width="4" height="36" rx="2" fill="white"/>
              <rect x="26" y="32" width="4" height="16" rx="2" fill="white" opacity="0.8"/>
              <rect x="34" y="20" width="6" height="40" rx="3" fill="white"/>
              <rect x="44" y="26" width="4" height="28" rx="2" fill="white" opacity="0.9"/>
              <rect x="52" y="30" width="4" height="20" rx="2" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Scanly
          </span>
        </Link>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: '10px', width: '38px', height: '38px' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <>
              {/* Profile dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px 6px 6px', borderRadius: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s' }}
                  className="hover:border-[var(--accent)]"
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700' }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {profileOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: '8px',
                    width: '220px', background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '14px', padding: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                    zIndex: 200, animation: 'slideDown 0.2s ease-out'
                  }}>
                    <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
                      <span className={`badge ${roleColor[user.role] || 'badge-blue'}`} style={{ marginTop: '6px', textTransform: 'capitalize' }}>{user.role}</span>
                    </div>
                    <Link href="/dashboard/profile" className="sidebar-item" style={{ fontSize: '13px' }} onClick={() => setProfileOpen(false)}>
                      <User size={15}/> Profile Settings
                    </Link>
                    <button onClick={logout} className="sidebar-item" style={{ width: '100%', border: 'none', background: 'none', fontSize: '13px', color: 'var(--danger)' }}>
                      <LogOut size={15}/> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/auth/login" className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>Sign In</Link>
              <Link href="/auth/signup" className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
      {profileOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setProfileOpen(false)} />}
    </header>
  );
}
