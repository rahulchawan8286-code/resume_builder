/**
 * React Bits - Animated Card
 * 
 * WHY IT WAS CHOSEN: Adds a premium, modern SaaS feel with smooth hover and entry animations.
 * LOCATION: src/components/react-bits/AnimatedCard.jsx
 * CUSTOMIZATION: Configurable animation parameters using framer-motion. Uses Tailwind for layout.
 * REUSE: Wrap any UI element in <AnimatedCard> to give it a premium glassmorphism aesthetic.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const AnimatedCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className={cn("glass-card overflow-hidden transition-all duration-300", className)}
    >
      {children}
    </motion.div>
  );
};
