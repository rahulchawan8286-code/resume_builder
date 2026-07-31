import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/authService';
import { useState } from 'react';
import { FormInput, SubmitButton } from '../components/AuthFormComponents';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authAPI.forgotPassword(data),
    onSuccess: () => {
      setSuccess(true);
      toast.success('Reset link sent to your email!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    },
  });

  if (success) {
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
          <h1 className="text-2xl font-extrabold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We have sent password reset instructions to your email address.
          </p>
        </div>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          No worries! Enter your email and we'll send you a password reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(mutate)} className="space-y-4" noValidate>
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />
        <SubmitButton loading={isPending}>Send Reset Link</SubmitButton>
      </form>

      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
