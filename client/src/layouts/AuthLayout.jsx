import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden bg-sidebar-bg">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        <div className="absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <motion.div
          className="relative z-10 text-center px-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary shadow-lg">
              <span className="text-2xl font-black text-white">AI</span>
            </div>
            <span className="text-2xl font-bold text-white">ResumeAI</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Build Resumes That<br />
            <span className="gradient-text">Get You Hired</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
            AI-powered resume builder designed for students and fresh graduates to stand out.
          </p>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: '50K+', label: 'Resumes Built' },
              { value: '94%',  label: 'ATS Pass Rate' },
              { value: '3x',   label: 'More Interviews' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Auth form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <span className="text-lg font-black text-white">AI</span>
            </div>
            <span className="text-xl font-bold">ResumeAI</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
