import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, User, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import {
  FormInput,
  PasswordInput,
  PasswordStrength,
  OAuthButton,
  SubmitButton,
  Divider,
} from '../components/AuthFormComponents';

const schema = z.object({
  name:            z.string().min(2, 'Full name is required'),
  email:           z.string().email('Enter a valid email'),
  password:        z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
  acceptTerms:     z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const { register, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const passwordVal = watch('password', '');

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authAPI.register(data),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      login(user, accessToken);
      toast.success('Account created! Please verify your email.');
      navigate('/verify-email');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    const { confirmPassword, acceptTerms, ...payload } = data;
    mutate(payload);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Already have one?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>

      {/* OAuth */}
      <div className="grid grid-cols-2 gap-3">
        <OAuthButton
          label="Google"
          onClick={() => toast('Google OAuth coming soon', { icon: '🔜' })}
          icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          }
        />
        <OAuthButton
          label="GitHub"
          onClick={() => toast('GitHub OAuth coming soon', { icon: '🔜' })}
          icon={
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          }
        />
      </div>

      <Divider label="or create with email" />

      {/* Photo upload */}
      <div className="flex items-center gap-4">
        <label className="relative cursor-pointer">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${photoPreview ? 'border-primary' : 'border-border hover:border-primary/60'}`}>
            {photoPreview
              ? <img src={photoPreview} alt="preview" className="h-full w-full rounded-2xl object-cover" />
              : <Upload className="h-6 w-6 text-muted-foreground" />
            }
          </div>
          <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
        </label>
        <div>
          <p className="text-sm font-medium">Profile Photo</p>
          <p className="text-xs text-muted-foreground">Optional · JPG, PNG up to 2MB</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput label="Full Name" type="text" placeholder="John Doe" icon={User} error={errors.name?.message} autoComplete="name" {...register('name')} />
        <FormInput label="Email" type="email" placeholder="you@example.com" icon={Mail} error={errors.email?.message} autoComplete="email" {...register('email')} />
        <PasswordInput label="Password" placeholder="Min. 8 characters" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <PasswordStrength password={passwordVal} />
        <PasswordInput label="Confirm Password" placeholder="Repeat password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2.5 text-sm">
          <input type="checkbox" {...register('acceptTerms')} className="mt-0.5 h-4 w-4 accent-primary rounded shrink-0" />
          <span className="text-muted-foreground leading-snug">
            I agree to the{' '}
            <a href="#" className="font-semibold text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="font-semibold text-primary hover:underline">Privacy Policy</a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
        )}

        <SubmitButton loading={isPending}>Create Account</SubmitButton>
      </form>
    </motion.div>
  );
}
