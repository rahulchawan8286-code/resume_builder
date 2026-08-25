import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, ArrowLeft } from 'lucide-react';

export function SessionExpiredPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Session Expired</h1>
          <p className="text-sm text-muted-foreground">
            For your security, your session has timed out. Please sign in again to continue.
          </p>
        </div>
        <Link
          to="/login"
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          Sign In
        </Link>
      </motion.div>
    </div>
  );
}

export function AccessDeniedPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You do not have permission to view this page. If you believe this is an error, please contact admin support.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to="/dashboard"
            className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-all"
          >
            Sign In with another account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
