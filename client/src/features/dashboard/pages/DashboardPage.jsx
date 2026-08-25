import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Components — each is already optimized with React.memo where needed
import WelcomeCard         from '../components/WelcomeCard';
import StatsGrid           from '../components/StatsGrid';
import { ActivityChart, AtsScoreChart } from '../components/Charts';
import RecentActivity      from '../components/RecentActivity';
import QuickActions        from '../components/QuickActions';
import ProfileWidget       from '../components/ProfileWidget';
import ResumeGrid          from '../components/ResumeGrid';
import NotificationsPanel  from '../components/NotificationsPanel';

// Page-level fade-in container
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function DashboardPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Welcome ───────────────────────────────────────────────── */}
      <WelcomeCard />

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <StatsGrid />

      {/* ── Charts Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ActivityChart />
        <AtsScoreChart />
      </div>

      {/* ── Resumes grid (full width) ─────────────────────────────── */}
      <ResumeGrid />

      {/* ── Bottom Row: Activity | Quick Actions | Profile | Notifs ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2 xl:col-span-1">
          <RecentActivity />
        </div>
        <QuickActions />
        <ProfileWidget />
        <NotificationsPanel />
      </div>
    </motion.div>
  );
}
