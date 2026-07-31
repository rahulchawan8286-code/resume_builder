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