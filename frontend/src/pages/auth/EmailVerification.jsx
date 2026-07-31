import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthCard } from '../../features/auth/components/AuthCard';
import { Spinner } from '../../components/ui/Spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function EmailVerification() {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    // Simulate API verification
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  }, [token]);

  return (
    <AuthCard title="Email Verification">
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        {status === 'loading' && (
          <>
            <Spinner size={48} className="text-indigo-600" />
            <p className="text-gray-500 dark:text-gray-400">Verifying your email address...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-emerald-500" />
            <p className="text-gray-900 dark:text-white font-medium">Your email has been successfully verified!</p>
            <Button asChild className="w-full mt-4"><Link to="/login">Continue to Login</Link></Button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-500" />
            <p className="text-gray-900 dark:text-white font-medium">Verification link is invalid or has expired.</p>
            <Button variant="outline" asChild className="w-full mt-4"><Link to="/login">Return to Login</Link></Button>
          </>
        )}
      </div>
    </AuthCard>
  );
}