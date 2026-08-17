import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Brain, Code2, FileText, Cpu } from 'lucide-react';

export default function Features() {
  const features = [
    { title: "AI Readiness Engine", desc: "Predicts your placement probability.", icon: Brain },
    { title: "Core ECE Mastery", desc: "VLSI, Embedded Systems, and more.", icon: Cpu },
    { title: "Coding Labs", desc: "Python, C++, and SQL environments.", icon: Code2 },
    { title: "Smart Resume Builder", desc: "ATS-optimized template generation.", icon: FileText }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features</h1>
        <p className="text-xl text-gray-500">Everything you need to secure top-tier placements.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="h-full border-none shadow-md bg-white dark:bg-gray-900">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <f.icon size={24} />
                </div>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}