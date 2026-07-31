import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto">
          Your AI-Powered Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">ECE Placements</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Master core electronics, perfect your coding skills, and conquer interviews with our intelligent, personalized readiness engine.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8" asChild>
            <Link to="/register">Start Your Journey</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
            <Link to="/features">Explore Features</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}