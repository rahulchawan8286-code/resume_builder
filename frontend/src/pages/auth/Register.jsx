import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthCard } from '../../features/auth/components/AuthCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../api/apiClient';
import { API_ENDPOINTS } from '../../constants/api';
import { registerSchema } from '../../validators/authValidators';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const initAuth = useAuthStore((state) => state.initAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    if (isLoading) return; // Prevent duplicate submissions
    setIsLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
      
      await initAuth();
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Create an account" description="Enter your information to get started">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="name">Full Name</label>
          <Input 
            id="name"
            placeholder="John Doe" 
            {...register('name')}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
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
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="password">Password</label>
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