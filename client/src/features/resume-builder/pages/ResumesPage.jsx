import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, MoreHorizontal, ExternalLink, Copy, Trash2,
  Loader2, RefreshCw, AlertCircle, Download, Eye
} from 'lucide-react';
import { resumeAPI, pdfAPI } from '@/services/apiServices';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  published: 'bg-green-500/10 text-green-600 dark:text-green-400',
  draft:     'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  archived:  'bg-muted text-muted-foreground',
};

function ResumeCard({ resume, index, onDelete, onDuplicate, onExport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold">{resume.title}</h4>
            <p className="text-xs text-muted-foreground">
              {resume.design?.theme || 'modern'} · Updated {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 3-dot menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 min-w-[160px] rounded-xl border border-border bg-card shadow-xl p-1">
              <button
                onClick={() => { navigate(`/resumes/${resume._id}`); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open Editor
              </button>
              <button
                onClick={() => { onExport(resume._id); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Export PDF
              </button>
              <button
                onClick={() => { onDuplicate(resume._id); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted transition-colors"
              >
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </button>
              <button
                onClick={() => { onDelete(resume._id); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', STATUS_STYLES[resume.status] || STATUS_STYLES.draft)}>
          {resume.status || 'draft'}
        </span>
        {resume.atsScore > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${resume.atsScore}%` }} />
            </div>
            <span className="text-xs font-medium text-primary">{resume.atsScore}</span>
          </div>
        )}
      </div>

      {/* Quick open on card click */}
      <Link
        to={`/resumes/${resume._id}`}
        className="absolute inset-0 rounded-2xl"
        aria-label={`Open ${resume.title}`}
        onClick={(e) => {
          // Don't navigate if clicking the menu area
          if (menuOpen) e.preventDefault();
        }}
      />
    </motion.div>
  );
}

export default function ResumesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeAPI.getAll().then((r) => r.data.data.resumes),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => resumeAPI.delete(id),
    onSuccess: () => {
      toast.success('Resume deleted');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
    onError: () => toast.error('Failed to delete resume'),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id) => resumeAPI.duplicate(id),
    onSuccess: () => {
      toast.success('Resume duplicated');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
    onError: () => toast.error('Failed to duplicate resume'),
  });

  const handleExport = async (id) => {
    try {
      const res = await pdfAPI.generate({ resumeId: id });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('PDF generation failed');
    }
  };

  const resumes = data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My Resumes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link
          to="/resumes/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> New Resume
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Failed to load resumes</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && resumes.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border">
          <FileText className="h-12 w-12 text-muted-foreground/40" />
          <div className="text-center">
            <p className="font-semibold">No resumes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first resume to get started</p>
          </div>
          <Link
            to="/resumes/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Resume
          </Link>
        </div>
      )}

      {/* Resume Grid */}
      {!isLoading && !isError && resumes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {resumes.map((resume, i) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                index={i}
                onDelete={(id) => deleteMutation.mutate(id)}
                onDuplicate={(id) => duplicateMutation.mutate(id)}
                onExport={handleExport}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
