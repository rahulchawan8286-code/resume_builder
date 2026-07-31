import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../../features/auth/components/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <AuthCard title="Set new password" description="Please enter your new password below.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">New Password</label>
          <Input type="password" required placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Confirm Password</label>
          <Input type="password" required placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" isLoading={isLoading}>
          Reset Password
        </Button>
      </form>
    </AuthCard>
  );
}