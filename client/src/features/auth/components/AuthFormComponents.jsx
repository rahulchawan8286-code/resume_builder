import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Generic text input ────────────────────────────────────────────────────────
export const FormInput = forwardRef(function FormInput(
  { label, error, icon: Icon, className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        )}
        <input
          ref={ref}
          {...props}
          aria-invalid={!!error}
          className={cn(
            'h-11 w-full rounded-xl border bg-background text-sm placeholder:text-muted-foreground transition-all',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            Icon ? 'pl-10 pr-4' : 'px-4',
            error
              ? 'border-destructive focus:ring-destructive/40'
              : 'border-border hover:border-primary/40',
            className
          )}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

// ── Password input with show/hide toggle ──────────────────────────────────────
export const PasswordInput = forwardRef(function PasswordInput(
  { label, error, ...props },
  ref
) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          {...props}
          aria-invalid={!!error}
          className={cn(
            'h-11 w-full rounded-xl border bg-background px-4 pr-11 text-sm placeholder:text-muted-foreground transition-all',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            error
              ? 'border-destructive focus:ring-destructive/40'
              : 'border-border hover:border-primary/40'
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

// ── Password strength meter ───────────────────────────────────────────────────
function calcStrength(password) {
  let score = 0;
  if (!password) return { score: 0, label: '', color: '' };
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map = {
    0: { label: '', color: '' },
    1: { label: 'Weak',      color: 'bg-red-500' },
    2: { label: 'Fair',      color: 'bg-yellow-500' },
    3: { label: 'Good',      color: 'bg-blue-500' },
    4: { label: 'Strong',    color: 'bg-green-500' },
  };
  return { score, ...map[score] };
}

export function PasswordStrength({ password }) {
  const { score, label, color } = calcStrength(password || '');
  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-500',
              i <= score ? color : 'bg-border'
            )}
          />
        ))}
      </div>
      {label && <p className={cn('text-xs font-medium', score <= 1 ? 'text-red-500' : score === 2 ? 'text-yellow-500' : score === 3 ? 'text-blue-500' : 'text-green-500')}>{label}</p>}
    </div>
  );
}

// ── OAuth Button ──────────────────────────────────────────────────────────────
export function OAuthButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

// ── Submit button ─────────────────────────────────────────────────────────────
export function SubmitButton({ children, loading, ...props }) {
  return (
    <button
      type="submit"
      disabled={loading}
      {...props}
      className="relative h-11 w-full rounded-xl bg-primary font-semibold text-sm text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Please wait…
        </span>
      ) : children}
    </button>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label = 'or' }) {
  return (
    <div className="relative flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
