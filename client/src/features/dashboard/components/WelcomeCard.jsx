import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { mockUser } from '../data/mockData';
import { Sparkles, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeCard() {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser || mockUser;
  const firstName = user.name?.split(' ')[0] || 'User';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative col-span-full overflow-hidden rounded-2xl border border-border bg-card p-6 lg:p-8 shadow-sm"
    >
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-40 -bottom-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left — Greeting */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=80`}
              alt="avatar"
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/30"
            />
            {user.plan !== 'Free' && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                <Crown className="h-3 w-3 text-white" />
              </span>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()} 👋</p>
            <h1 className="text-2xl font-extrabold tracking-tight">{firstName}!</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Here's what's happening with your resumes today.
            </p>
          </div>
        </div>

        {/* Right — Stats pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Plan */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-4 py-2.5">
            <Crown className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="text-sm font-bold">{user.plan}</p>
            </div>
          </div>

          {/* AI Credits */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-4 py-2.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">AI Credits</p>
              <p className="text-sm font-bold">{mockUser.aiCredits} left</p>
            </div>
          </div>

          {/* Profile completion */}
          <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/60 px-4 py-2.5 min-w-[160px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Profile Completion</span>
              <span className="font-bold text-primary">{mockUser.profileCompletion}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${mockUser.profileCompletion}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>

          <Link
            to="/resumes/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            New Resume <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
