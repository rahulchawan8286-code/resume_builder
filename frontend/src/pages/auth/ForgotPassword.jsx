import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../../features/auth/components/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert, AlertDescription } from '../../components/ui/Alert';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <AuthCard title="Reset password" description="Enter your email address and we will send you a reset link">
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
            <Input type="email" required placeholder="name@example.com" />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" isLoading={isLoading}>
            Send reset link
          </Button>
        </form>
      ) : (
        <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
          <AlertDescription>Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</AlertDescription>
        </Alert>
      )}
      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Back to login</Link>
      </div>
    </AuthCard>
  );
}