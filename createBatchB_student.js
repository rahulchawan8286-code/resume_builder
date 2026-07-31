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
  "frontend/src/pages/student/Profile.jsx": `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import { mockUsers } from '../../mocks';

export default function Profile() {
  const user = mockUsers[0]; // mock current user

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <div className="flex gap-2 w-full">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Upload</Button>
              <Button variant="outline" className="w-full">Remove</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input defaultValue="Rahul" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input defaultValue="Chavan" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" defaultValue={user.email} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">University / College</label>
              <Input defaultValue="Engineering Institute of Technology" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Graduation Year</label>
              <Input type="number" defaultValue="2027" />
            </div>
            <div className="pt-4 flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/student/Settings.jsx": `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';
import { Button } from '../../components/ui/Button';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what updates you want to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Email Alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly study reports via email.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Test Reminders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified 24 hours before a scheduled test.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
  `,
  "frontend/src/pages/student/Notifications.jsx": `
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
  `,
  "frontend/src/pages/student/Bookmarks.jsx": `
import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';
import { BookmarkX } from 'lucide-react';

export default function Bookmarks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Bookmarks</h1>
        <p className="text-gray-500 dark:text-gray-400">Your saved questions, notes, and topics.</p>
      </div>

      <EmptyState 
        title="No bookmarks yet" 
        description="When you bookmark difficult questions or important notes, they will appear here for quick review." 
        icon={BookmarkX} 
      />
    </div>
  );
}
  `
};

writeFiles(files);
console.log('Batch B - Student Pages generated.');
