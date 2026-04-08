'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import toast from 'react-hot-toast';
import { QrCode, RefreshCw, Download, Share2, Copy, CheckCircle2, Smartphone } from 'lucide-react';

export default function QRCodePage() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState(user?.qrCode || null);
  const [qrUrl, setQrUrl] = useState(user?.qrUrl || null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/qr/generate');
      setQrCode(res.data.qrCode);
      setQrUrl(res.data.qrUrl);
      toast.success('QR Code generated!');
    } catch { toast.error('Failed to generate QR code'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!qrCode) generate(); }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard');
  };

  const downloadQR = () => {
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = `scanly-qr-${user?.name?.replace(/\s/g, '-')}.png`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>My QR Code</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Share this QR code for instant access to your health records in emergencies</p>
      </div>

      <div className="card" style={{ padding: '36px', textAlign: 'center', marginBottom: '20px' }}>
        {loading ? (
          <div style={{ padding: '60px 0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)', margin: '0 auto 16px', animation: 'pulse 1.5s infinite' }} />
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Generating QR code...</p>
          </div>
        ) : qrCode ? (
          <div>
            {/* QR code with frame */}
            <div style={{ display: 'inline-block', padding: '20px', background: 'white', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', marginBottom: '20px', position: 'relative' }}>
              <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
              {/* Corner logo */}
              <div style={{ position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)', width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.4)' }}>
                <svg width="20" height="20" viewBox="0 0 80 80" fill="none">
                  <rect x="8" y="28" width="8" height="24" rx="4" fill="white"/>
                  <rect x="20" y="18" width="6" height="44" rx="3" fill="white"/>
                  <rect x="30" y="30" width="6" height="20" rx="3" fill="white"/>
                  <rect x="40" y="14" width="8" height="52" rx="4" fill="white"/>
                  <rect x="52" y="22" width="6" height="36" rx="3" fill="white"/>
                </svg>
              </div>
            </div>
            <div style={{ marginTop: '28px', marginBottom: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>{user?.bloodGroup ? `Blood: ${user.bloodGroup}` : 'Scanly Patient ID'}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <button onClick={generate} disabled={loading} className="btn-secondary" style={{ padding: '12px' }}>
          <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Regenerate
        </button>
        {qrCode && (
          <>
            <button onClick={downloadQR} className="btn-secondary" style={{ padding: '12px' }}>
              <Download size={15} /> Download PNG
            </button>
            <button onClick={copyLink} className="btn-secondary" style={{ padding: '12px' }}>
              {copied ? <CheckCircle2 size={15} color="#22c55e" /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </>
        )}
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { icon: Smartphone, title: 'Emergency Access', desc: 'Doctors scan this QR to instantly view your health history — no login required.' },
          { icon: Share2, title: 'Share Easily', desc: 'Download and print, or share the link via WhatsApp, email, or message.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card" style={{ padding: '18px' }}>
            <Icon size={20} color="#0ea5e9" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '5px' }}>{title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
