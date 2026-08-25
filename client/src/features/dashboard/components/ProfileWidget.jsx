import { motion } from 'framer-motion';
import { mockUser } from '../data/mockData';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { Mail, Clock, FileText, ArrowRight } from 'lucide-react';

export default function ProfileWidget() {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser || mockUser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <h3 className="mb-4 text-sm font-bold">Profile</h3>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 pb-4 border-b border-border">
        <img
          src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=80`}
          alt="avatar"
          className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/20"
        />
        <div className="text-center">
          <p className="text-sm font-bold">{user.name}</p>
          <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium capitalize">{user.plan} Plan</span>
        </div>
      </div>

      {/* Info rows */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span>5 Resumes Created</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Last login: Just now</span>
        </div>
      </div>

      {/* Completion */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Profile Completion</span>
          <span className="font-semibold text-primary">{mockUser.profileCompletion}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${mockUser.profileCompletion}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
          />
        </div>
      </div>

      <Link to="/profile" className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-xl border border-border py-2 text-xs font-semibold hover:bg-muted transition-colors">
        Edit Profile <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}
