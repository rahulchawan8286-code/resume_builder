import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial:   { opacity: 0, y: 12 },
  animate:   { opacity: 1, y: 0,  transition: { duration: 0.28, ease: 'easeOut' } },
  exit:      { opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } },
};

export function PageTransition({ children }) {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
