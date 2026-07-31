const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/features/dashboard';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
  "HeroSection.jsx": `
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

export const HeroSection = memo(() => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Rahul!</h1>
        <p className="text-indigo-100 text-lg mb-6">Your placement probability has reached 91%. You are on track for September 2026!</p>
        <div className="flex gap-4">
          <Button className="bg-white text-indigo-600 hover:bg-gray-50">View Study Plan</Button>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 dark:text-white dark:border-white/30">Take Mock Interview</Button>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
    </div>
  );
});
HeroSection.displayName = 'HeroSection';
  `,
  "ReadinessScoreCard.jsx": `
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';

export const ReadinessScoreCard = memo(({ score = 82 }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="flex flex-col items-center justify-center py-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Overall Readiness</h2>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200 dark:text-gray-700" />
          <motion.circle
            cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-indigo-600"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{score}%</span>
          <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider mt-1">Excellent</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">Target: 90%</p>
        <p className="text-xs text-gray-400">Expected: 15 Sep 2026</p>
      </div>
    </Card>
  );
});
ReadinessScoreCard.displayName = 'ReadinessScoreCard';
  `,
  "StatisticsCards.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Trophy, Brain, Target, BookOpen } from 'lucide-react';

export const StatisticsCards = memo(() => {
  const stats = [
    { title: 'XP Points', value: '4,250', icon: Target, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Daily Streak', value: '14 Days', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'Tests Done', value: '28', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Rank', value: '#42', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
          <div className={\`p-3 rounded-2xl \${stat.bg}\`}>
             <stat.icon className={\`\${stat.color}\`} size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
});
StatisticsCards.displayName = 'StatisticsCards';
  `,
  "WeeklyProgressChart.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Mon', score: 65, hours: 2 },
  { name: 'Tue', score: 70, hours: 3 },
  { name: 'Wed', score: 68, hours: 2.5 },
  { name: 'Thu', score: 85, hours: 4 },
  { name: 'Fri', score: 82, hours: 3 },
  { name: 'Sat', score: 90, hours: 5 },
  { name: 'Sun', score: 95, hours: 6 },
];

export const WeeklyProgressChart = memo(() => {
  return (
    <Card className="h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-500" />
          Weekly Analytics
        </h2>
        <select className="bg-gray-50 dark:bg-gray-800 border-none text-sm rounded-lg py-1 px-3 text-gray-600 dark:text-gray-300">
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: 'white' }}
              cursor={{stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3'}}
            />
            <Line type="monotone" name="Score" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            <Line type="monotone" name="Study Hours" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});
WeeklyProgressChart.displayName = 'WeeklyProgressChart';
  `,
  "CompanyReadinessCard.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Building2 } from 'lucide-react';

export const CompanyReadinessCard = memo(() => {
  const companies = [
    { name: 'Intel', score: 76, insight: 'Needs Embedded Systems improvement.', color: 'text-blue-500', bar: 'bg-blue-500' },
    { name: 'Qualcomm', score: 85, insight: 'Strong in Digital Electronics.', color: 'text-red-500', bar: 'bg-red-500' },
    { name: 'TCS', score: 92, insight: 'Aptitude is excellent. Ready.', color: 'text-indigo-500', bar: 'bg-indigo-500' },
  ];
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Building2 size={20} className="text-indigo-500" /> Company Readiness
      </h2>
      <div className="space-y-5">
        {companies.map((c) => (
          <div key={c.name}>
            <div className="flex justify-between items-end mb-1">
              <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
              <span className={\`font-bold \${c.color}\`}>{c.score}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
              <div className={\`h-2 rounded-full \${c.bar}\`} style={{ width: \`\${c.score}%\` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{c.insight}</p>
          </div>
        ))}
      </div>
    </Card>
  );
});
CompanyReadinessCard.displayName = 'CompanyReadinessCard';
  `,
  "AIRecommendationCard.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Brain, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AIRecommendationCard = memo(() => {
  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">AI Recommendations</h2>
          <Brain className="text-indigo-500" size={24} />
        </div>
        <ul className="space-y-3 mb-6">
          <li className="flex gap-2 text-sm text-indigo-800/90 dark:text-indigo-200/90">
             <span className="text-indigo-500">•</span> Improve Communication Systems (Current: 58%)
          </li>
          <li className="flex gap-2 text-sm text-indigo-800/90 dark:text-indigo-200/90">
             <span className="text-indigo-500">•</span> Solve 5 SQL problems this week
          </li>
          <li className="flex gap-2 text-sm text-indigo-800/90 dark:text-indigo-200/90">
             <span className="text-indigo-500">•</span> Practice HR Interviews (Weakness detected)
          </li>
        </ul>
      </div>
      <Button size="sm" variant="outline" className="w-full justify-between border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
        Generate New Insights <ArrowRight size={16} />
      </Button>
    </Card>
  );
});
AIRecommendationCard.displayName = 'AIRecommendationCard';
  `,
  "StudyPlanCard.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Calendar } from 'lucide-react';

export const StudyPlanCard = memo(() => {
  const plan = [
    { day: 'Today', tasks: ['Digital Electronics', 'SQL Practice'] },
    { day: 'Tomorrow', tasks: ['Aptitude (Speed Math)', 'HR Interview Mock'] },
    { day: 'Wednesday', tasks: ['Resume Review', 'Embedded Systems'] },
  ];
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-indigo-500" /> AI Study Plan
      </h2>
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 dark:before:via-gray-700 before:to-transparent">
        {plan.map((item, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-[.is-active]:bg-indigo-600 group-[.is-active]:text-emerald-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
               <span className="text-xs font-bold">{i+1}</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shadow-sm">
              <div className="font-bold text-gray-900 dark:text-white mb-1">{item.day}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{item.tasks.join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
StudyPlanCard.displayName = 'StudyPlanCard';
  `,
  "UpcomingTests.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Clock } from 'lucide-react';

export const UpcomingTests = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Clock size={20} className="text-indigo-500" /> Upcoming Tests
      </h2>
      <div className="space-y-3">
        {[
          { title: 'Digital Electronics Mock Test', time: 'Today, 6:00 PM' },
          { title: 'TCS NQT Aptitude Pattern', time: 'Tomorrow, 10:00 AM' }
        ].map((task, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{task.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
UpcomingTests.displayName = 'UpcomingTests';
  `,
  "RecentActivity.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Activity } from 'lucide-react';

export const RecentActivity = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Activity size={20} className="text-indigo-500" /> Recent Activity
      </h2>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <li>Completed Analog Electronics Quiz (85%)</li>
        <li>Solved 3 Python strings problems</li>
        <li>Updated Resume "Projects" section</li>
      </ul>
    </Card>
  );
});
RecentActivity.displayName = 'RecentActivity';
  `,
  "SubjectAnalysis.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { BookOpen } from 'lucide-react';

export const SubjectAnalysis = memo(() => {
  const subjects = [
    { name: 'Digital Electronics', score: 92, status: 'Excellent', color: 'bg-emerald-500' },
    { name: 'Communication Systems', score: 58, status: 'Needs Practice', color: 'bg-yellow-500' },
    { name: 'Power Electronics', score: 81, status: 'Good', color: 'bg-blue-500' },
  ];
  return (
    <Card className="col-span-full">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-indigo-500" /> Subject Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map(sub => (
          <div key={sub.name} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">{sub.name}</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold">{sub.score}%</span>
              <span className={\`text-xs px-2 py-1 rounded-full text-white \${sub.color}\`}>{sub.status}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div className={\`h-1.5 rounded-full \${sub.color}\`} style={{ width: \`\${sub.score}%\` }}></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});
SubjectAnalysis.displayName = 'SubjectAnalysis';
  `,
  "CodingProgress.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Code2 } from 'lucide-react';

export const CodingProgress = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Code2 size={20} className="text-indigo-500" /> Coding Skills
      </h2>
      <div className="flex items-center justify-between mb-2">
         <span className="text-sm font-medium">Python</span>
         <span className="text-sm font-bold text-emerald-500">Advanced</span>
      </div>
      <div className="flex items-center justify-between mb-2">
         <span className="text-sm font-medium">C++</span>
         <span className="text-sm font-bold text-yellow-500">Intermediate</span>
      </div>
      <div className="flex items-center justify-between">
         <span className="text-sm font-medium">SQL</span>
         <span className="text-sm font-bold text-red-500">Beginner</span>
      </div>
    </Card>
  );
});
CodingProgress.displayName = 'CodingProgress';
  `,
  "ResumeATSCard.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { FileText } from 'lucide-react';

export const ResumeATSCard = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText size={20} className="text-indigo-500" /> Resume Quality
      </h2>
      <div className="flex flex-col items-center justify-center">
         <span className="text-4xl font-bold text-emerald-500 mb-2">88%</span>
         <span className="text-sm text-gray-500">ATS Score</span>
      </div>
      <p className="text-xs text-center text-gray-400 mt-4">Missing keywords: "Agile", "REST APIs"</p>
    </Card>
  );
});
ResumeATSCard.displayName = 'ResumeATSCard';
  `,
  "MockInterviewCard.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Bot } from 'lucide-react';

export const MockInterviewCard = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Bot size={20} className="text-indigo-500" /> Mock Interviews
      </h2>
      <div className="space-y-3">
         <div className="flex justify-between items-center text-sm"><span>Technical</span><span className="font-bold">8/10</span></div>
         <div className="flex justify-between items-center text-sm"><span>HR</span><span className="font-bold text-red-500">4/10</span></div>
         <div className="flex justify-between items-center text-sm"><span>Communication</span><span className="font-bold">7/10</span></div>
      </div>
    </Card>
  );
});
MockInterviewCard.displayName = 'MockInterviewCard';
  `,
  "LeaderboardPreview.jsx": `
import React, { memo } from 'react';
import { Card } from '../../components/ui/Card';
import { Trophy } from 'lucide-react';

export const LeaderboardPreview = memo(() => {
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Trophy size={20} className="text-indigo-500" /> Weekly Rank
      </h2>
      <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium">
         <span>#42 Rahul Chavan</span>
         <span>4,250 XP</span>
      </div>
    </Card>
  );
});
LeaderboardPreview.displayName = 'LeaderboardPreview';
  `,
  "frontend/src/pages/Dashboard.jsx": `
import React, { Suspense, lazy } from 'react';

// Lazy load all heavy widgets to reduce bundle size
const widgets = [
  'HeroSection', 'ReadinessScoreCard', 'StatisticsCards', 'WeeklyProgressChart',
  'CompanyReadinessCard', 'AIRecommendationCard', 'StudyPlanCard', 'UpcomingTests',
  'RecentActivity', 'SubjectAnalysis', 'CodingProgress', 'ResumeATSCard',
  'MockInterviewCard', 'LeaderboardPreview'
].reduce((acc, name) => {
  acc[name] = lazy(() => import(\`../features/dashboard/\${name}\`).then(m => ({ default: m[name] })));
  return acc;
}, {});

const Fallback = () => <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl w-full"></div>;

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <Suspense fallback={<Fallback />}><widgets.HeroSection /></Suspense>
      <Suspense fallback={<Fallback />}><widgets.StatisticsCards /></Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
           <Suspense fallback={<Fallback />}><widgets.ReadinessScoreCard score={82} /></Suspense>
           <Suspense fallback={<Fallback />}><widgets.AIRecommendationCard /></Suspense>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
           <Suspense fallback={<Fallback />}><widgets.WeeklyProgressChart /></Suspense>
        </div>
      </div>
      <Suspense fallback={<Fallback />}><widgets.SubjectAnalysis /></Suspense>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Suspense fallback={<Fallback />}><widgets.StudyPlanCard /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.CompanyReadinessCard /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.CodingProgress /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.ResumeATSCard /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.MockInterviewCard /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.UpcomingTests /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.RecentActivity /></Suspense>
        <Suspense fallback={<Fallback />}><widgets.LeaderboardPreview /></Suspense>
      </div>
    </div>
  );
}
  `
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = filePath.includes('frontend/src/pages') 
    ? path.resolve(__dirname, filePath) 
    : path.resolve(__dirname, dir, filePath);
  
  const dirname = path.dirname(fullPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
});

console.log('Successfully created all widgets and refactored Dashboard.jsx');
