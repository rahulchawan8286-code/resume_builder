import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Bell, BellOff, CheckCircle } from 'lucide-react';
import { mockNotifications } from '../../mocks';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  
  if (notifications.length === 0) {
    return <EmptyState title="No notifications" description="You're all caught up!" icon={BellOff} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">Stay updated with your progress and tests.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>Mark all as read</Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, index) => (
          <motion.div key={notif.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className={cn("transition-colors", !notif.isRead && "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900")}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={cn("p-2 rounded-full", 
                  notif.type === 'success' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" : 
                  notif.type === 'warning' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" : 
                  "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30"
                )}>
                  {notif.type === 'success' ? <CheckCircle size={20} /> : <Bell size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{notif.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(notif.date).toLocaleString()}</p>
                </div>
                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}