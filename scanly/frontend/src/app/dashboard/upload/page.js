'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, FileText, Image, X, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['General', 'Lab Report', 'Prescription', 'Radiology', 'Surgery', 'Vaccination'];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'General' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      if (!form.title) setForm(p => ({ ...p, title: f.name.replace(/\.[^/.]+$/, '') }));
    }
  }, [form.title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [], 'application/pdf': [] }, maxFiles: 1, maxSize: 20 * 1024 * 1024
  });

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      await api.post('/records/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      toast.success('Record uploaded successfully!');
      setTimeout(() => router.push('/dashboard/records'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (b) => b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / (1024 * 1024)).toFixed(1) + ' MB';

  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center page-enter">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mb-4">
        <CheckCircle2 size={32} className="text-green-500"/>
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Upload Successful!</h2>
      <p className="text-[var(--text-secondary)] text-sm">Redirecting to your records...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Upload Medical Record</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Supports PDF, JPG, PNG up to 20MB</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}>
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${file.type === 'application/pdf' ? 'bg-red-100 dark:bg-red-950/40' : 'bg-sky-100 dark:bg-sky-950/40'}`}>
                {file.type === 'application/pdf' ? <FileText size={22} className="text-red-500"/> : <Image size={22} className="text-sky-500"/>}
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--text-primary)] text-sm">{file.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatSize(file.size)}</p>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                className="ml-2 p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                <X size={16}/>
              </button>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-3">
                <Upload size={22} className="text-[var(--text-muted)]"/>
              </div>
              <p className="font-medium text-[var(--text-primary)] text-sm mb-1">
                {isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">PDF, JPG, PNG · Max 20MB</p>
            </div>
          )}
        </div>

        <div>
          <label className="label">Record Title *</label>
          <input type="text" value={form.title} onChange={set('title')} className="input-field" placeholder="e.g. Blood Test Report — March 2024" required/>
        </div>
        <div>
          <label className="label">Category</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => setForm(p => ({...p, category: c}))}
                className={`py-2 px-3 rounded-xl text-xs font-medium text-center transition-all ${form.category === c ? 'bg-sky-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Notes (Optional)</label>
          <textarea value={form.description} onChange={set('description')} className="input-field resize-none" rows={3} placeholder="Add any notes, doctor name, hospital..."/>
        </div>
        <button type="submit" disabled={loading || !file} className="btn-primary w-full py-3">
          {loading ? 'Uploading...' : <><Upload size={16}/> Upload Record</>}
        </button>
      </form>
    </div>
  );
}
