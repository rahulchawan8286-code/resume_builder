import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/authService';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [status, setStatus] = useState(token ? 'verifying' : 'pending');

  const verifyMutation = useMutation({
    mutationFn: (data) => authAPI.verifyEmail(data),
    onSuccess: (res) => {
      setStatus('success');
      updateUser({ emailVerified: true });
      toast.success('Email verified successfully!');
    },
    onError: (err) => {
      setStatus('failed');
      toast.error(err.response?.data?.message || 'Verification failed.');
    },
  });

  const resendMutation = useMutation({
    mutationFn: (data) => authAPI.resendVerification(data),
    onSuccess: () => {
      toast.success('Verification email sent!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to resend email.');
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    }
  }, [token]);

  const handleResend = () => {
    if (user?.email) {
      resendMutation.mutate({ email: user.email });
    } else {
      toast.error('Email address not found. Please log in again.');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="text-center space-y-4 py-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <h1 className="text-xl font-bold">Verifying your email</h1>
        <p className="text-sm text-muted-foreground">Please wait while we confirm your email address…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Email Verified!</h1>
          <p className="text-sm text-muted-foreground">
            Thank you for verifying your email. Your account is now fully active.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          Go to Dashboard
        </Link>
      </motion.div>
    );
  }

  if (status === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Verification Failed</h1>
          <p className="text-sm text-muted-foreground">
            The verification link is invalid or has expired. Please request a new verification email.
          </p>
        </div>
        <button
          onClick={handleResend}
          disabled={resendMutation.isPending}
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Resend Verification Email
        </button>
      </motion.div>
    );
  }

  // Pending verification view
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a verification link to your email address. Please click the link to confirm your account.
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleResend}
          disabled={resendMutation.isPending}
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
        >
          {resendMutation.isPending ? 'Sending...' : 'Resend Verification Email'}
        </button>
        <Link to="/login" className="block text-sm text-muted-foreground hover:underline">
          Return to Login
        </Link>
      </div>
    </motion.div>
  );
}
