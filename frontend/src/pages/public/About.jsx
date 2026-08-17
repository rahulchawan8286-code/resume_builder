import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">About Us</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p className="text-lg">ECE Career Compass was built by engineers, for engineers. Our mission is to bridge the gap between academic curriculum and industry expectations.</p>
          <p className="mt-4">We noticed that Electronics and Communication Engineering students struggle to balance core hardware concepts with necessary software skills. We built an AI engine to personalize that journey.</p>
        </div>
      </motion.div>
    </div>
  );
}