import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../../features/auth/components/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <AuthCard title="Create an account" description="Enter your information to get started">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Full Name</label>
          <Input required placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
          <Input type="email" required placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Password</label>
          <Input type="password" required placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" isLoading={isLoading}>
          Create account
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Sign in</Link>
      </div>
    </AuthCard>
  );
}