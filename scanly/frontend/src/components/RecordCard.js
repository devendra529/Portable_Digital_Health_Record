'use client';
import { FileText, Image, Download, Trash2, Calendar, Tag, Eye } from 'lucide-react';
import { format } from 'date-fns';

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

const categoryColors = {
  'General': 'badge-gray',
  'Lab Report': 'badge-blue',
  'Prescription': 'badge-teal',
  'Radiology': 'badge-yellow',
  'Surgery': 'badge-red',
  'Vaccination': 'badge-green',
};

export default function RecordCard({ record, onDelete, canDelete = true }) {
  const isPDF = record.mimetype === 'application/pdf' || record.originalName?.endsWith('.pdf');
  const fileUrl = `${API}${record.path}`;

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="card-hover p-4 group">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPDF ? 'bg-red-100 dark:bg-red-950/40' : 'bg-sky-100 dark:bg-sky-950/40'}`}>
          {isPDF
            ? <FileText size={18} className="text-red-500 dark:text-red-400" />
            : <Image size={18} className="text-sky-500 dark:text-sky-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{record.title}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{record.originalName}</p>
            </div>
            <span className={categoryColors[record.category] || 'badge-gray'}>
              {record.category}
            </span>
          </div>
          {record.description && (
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2">{record.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2.5 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {record.createdAt ? new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
            </span>
            <span>{formatBytes(record.size || 0)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer"
          className="btn-ghost flex-1 text-xs py-1.5 justify-center">
          <Eye size={14} /> View
        </a>
        <a href={fileUrl} download={record.originalName}
          className="btn-ghost flex-1 text-xs py-1.5 justify-center">
          <Download size={14} /> Download
        </a>
        {canDelete && onDelete && (
          <button onClick={() => onDelete(record.id)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
