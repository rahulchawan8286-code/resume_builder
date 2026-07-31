import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../../features/auth/components/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { mockUsers } from '../../mocks';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'password') {
        setAuth({ token: 'mock-jwt-token', user });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password (use password: password)');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthCard title="Welcome back" description="Enter your details to access your account">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-md">{error}</div>}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="email">Email</label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot password?</Link>
          </div>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Sign up</Link>
      </div>
    </AuthCard>
  );
}