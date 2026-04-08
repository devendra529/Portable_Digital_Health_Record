'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { QrCode, RefreshCw, Download, Share2, Copy, Info } from 'lucide-react';

export default function QRPage() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState(user?.qrCode || null);
  const [qrUrl, setQrUrl] = useState(user?.qrUrl || null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/qr/generate');
      setQrCode(res.data.qrCode);
      setQrUrl(res.data.qrUrl);
      toast.success('QR code generated!');
    } catch { toast.error('Failed to generate QR'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!qrCode) generate(); }, []);

  const copyUrl = () => { navigator.clipboard.writeText(qrUrl); toast.success('Link copied!'); };

  const download = () => {
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = `scanly-qr-${user.name.replace(/\s+/g,'-')}.png`;
    a.click();
  };

  return (
    <div className="max-w-lg mx-auto space-y-5 page-enter">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">My QR Code</h1>
        <p className="text-sm text-[var(--text-secondary)]">Share this with doctors for instant record access</p>
      </div>

      <div className="card p-6 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"/>
            <p className="text-sm text-[var(--text-muted)]">Generating your QR...</p>
          </div>
        ) : qrCode ? (
          <>
            <div className="inline-block p-4 bg-white rounded-2xl shadow-sm mb-4">
              <img src={qrCode} alt="Patient QR Code" className="w-48 h-48 mx-auto"/>
            </div>
            <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 mb-4">Patient ID: {user.id?.slice(0,8)}...</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button onClick={download} className="btn-primary text-sm"><Download size={14}/> Download</button>
              <button onClick={copyUrl} className="btn-secondary text-sm"><Copy size={14}/> Copy Link</button>
              <button onClick={generate} disabled={loading} className="btn-ghost text-sm"><RefreshCw size={14}/> Regenerate</button>
            </div>
          </>
        ) : (
          <div className="py-8">
            <QrCode size={48} className="text-[var(--text-muted)] mx-auto mb-4"/>
            <button onClick={generate} className="btn-primary"><QrCode size={15}/> Generate QR Code</button>
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-sky-500 flex-shrink-0 mt-0.5"/>
          <div className="text-sm text-[var(--text-secondary)] space-y-1">
            <p className="font-medium text-[var(--text-primary)]">How it works</p>
            <p>Any doctor can scan this QR code to instantly view your complete medical records — no login required.</p>
            <p>Perfect for emergencies, new doctor visits, or sharing with specialists.</p>
          </div>
        </div>
      </div>

      {qrUrl && (
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)] mb-1.5 font-medium">Direct Link</p>
          <div className="flex items-center gap-2">
            <input readOnly value={qrUrl} className="input-field text-xs flex-1"/>
            <button onClick={copyUrl} className="btn-secondary text-sm flex-shrink-0"><Copy size={14}/></button>
          </div>
        </div>
      )}
    </div>
  );
}
