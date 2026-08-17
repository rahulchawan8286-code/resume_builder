import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthCard } from '../../features/auth/components/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/apiClient';
import { API_ENDPOINTS } from '../../constants/api';
import { loginSchema } from '../../validators/authValidators';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const initAuth = useAuthStore((state) => state.initAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    if (isLoading) return; // Prevent duplicate submissions
    setIsLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
      
      // Verification via backend session
      await initAuth();
      
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" description="Enter your details to access your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="email">Email</label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot password?</Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" isLoading={isLoading} disabled={isLoading}>
          Sign in
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Don&apos;t have an account? </span>
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Sign up</Link>
      </div>
    </AuthCard>
  );
}