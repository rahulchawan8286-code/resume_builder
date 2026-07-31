const fs = require('fs');
const path = require('path');

const writeFiles = (files) => {
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
  });
};

const files = {
  "frontend/src/mocks/users.js": `
export const mockUsers = [
  {
    id: "u_001",
    name: "Rahul Chavan",
    email: "rahul@example.com",
    role: "student",
    avatar: "https://github.com/shadcn.png",
    status: "active"
  },
  {
    id: "u_002",
    name: "Admin User",
    email: "admin@ececompass.com",
    role: "admin",
    avatar: null,
    status: "active"
  }
];
  `,
  "frontend/src/mocks/index.js": `
export * from './users';
  `,
  "frontend/src/features/auth/components/AuthCard.jsx": `
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { motion } from 'framer-motion';

export function AuthCard({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
  `,
  "frontend/src/pages/auth/Login.jsx": `
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
  `,
  "frontend/src/pages/auth/Register.jsx": `
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
  `,
  "frontend/src/pages/auth/ForgotPassword.jsx": `
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
  `,
  "frontend/src/pages/auth/ResetPassword.jsx": `
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
  `,
  "frontend/src/pages/auth/EmailVerification.jsx": `
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
  `
};

writeFiles(files);
console.log('Batch A - Auth files generated.');
