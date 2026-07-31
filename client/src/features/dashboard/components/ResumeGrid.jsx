import { motion } from 'framer-motion';
import { mockResumes } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FileText, MoreHorizontal, ExternalLink, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const STATUS_STYLES = {
  published: 'bg-green-500/10 text-green-600 dark:text-green-400',
  draft:     'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  archived:  'bg-muted text-muted-foreground',
};

function ResumeCard({ resume, index }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
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
            <p className="text-xs text-muted-foreground">{resume.template} · Updated {resume.lastUpdated}</p>
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
              <Link to={`/resumes/${resume.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted transition-colors">
                <ExternalLink className="h-3.5 w-3.5" /> Open Editor
              </Link>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-muted transition-colors">
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', STATUS_STYLES[resume.status])}>
          {resume.status}
        </span>
        {resume.atsScore && (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${resume.atsScore}%` }}
              />
            </div>
            <span className="text-xs font-medium text-primary">{resume.atsScore}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ResumeGrid() {
  return (
    <div className="col-span-full rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">My Resumes</h3>
        <Link to="/resumes/new" className="text-xs font-medium text-primary hover:underline">+ New Resume</Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mockResumes.map((r, i) => (
          <ResumeCard key={r.id} resume={r} index={i} />
        ))}
      </div>
    </div>
  );
}
