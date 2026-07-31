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
  "frontend/src/layouts/PublicLayout.jsx": `
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">EC</div>
              <span className="font-bold text-xl hidden sm:inline-block">ECE Compass</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link to="/features" className="hover:text-indigo-600 transition-colors">Features</Link>
              <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
              <Link to="/faq" className="hover:text-indigo-600 transition-colors">FAQ</Link>
              <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2026 ECE Career Compass. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
  `,
  "frontend/src/pages/public/Landing.jsx": `
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
  `,
  "frontend/src/pages/public/About.jsx": `
import React from 'react';
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
  `,
  "frontend/src/pages/public/Features.jsx": `
import React from 'react';
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
  `,
  "frontend/src/pages/public/Contact.jsx": `
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white text-center">Contact Us</h1>
        <form className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <TextArea placeholder="How can we help?" rows={5} />
          </div>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Send Message</Button>
        </form>
      </motion.div>
    </div>
  );
}
  `,
  "frontend/src/pages/public/FAQ.jsx": `
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/Accordion';

export default function FAQ() {
  const faqs = [
    { q: "Is this free for students?", a: "The core platform is free. We offer premium features for advanced AI interview mocks." },
    { q: "Does it support Non-IT placements?", a: "Absolutely! We cover Core ECE companies like Intel, Qualcomm, and Texas Instruments in depth." },
    { q: "How accurate is the AI Prediction?", a: "Our AI Readiness Engine utilizes data from thousands of successful candidates to provide a highly accurate probability score." }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white text-center">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={\`item-\${i}\`}>
            <AccordionTrigger className="text-left text-lg font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-gray-500 dark:text-gray-400">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
  `,
  "frontend/src/pages/public/PrivacyPolicy.jsx": `
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Privacy Policy</h1>
      <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400">
        <p>Last updated: July 2026</p>
        <h2>Data Collection</h2>
        <p>We collect information you provide directly to us when you create an account, build a resume, or interact with the AI assistant.</p>
        <h2>How We Use Your Data</h2>
        <p>Your data is strictly used to improve your placement readiness score and provide personalized study plans. We do not sell your personal data to third parties.</p>
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/public/TermsAndConditions.jsx": `
import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Terms & Conditions</h1>
      <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400">
        <p>Last updated: July 2026</p>
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using ECE Career Compass, you agree to be bound by these Terms and Conditions.</p>
        <h2>User Conduct</h2>
        <p>You agree to use the platform for its intended educational purposes. Any misuse or attempt to manipulate the AI scoring engine will result in account termination.</p>
      </div>
    </div>
  );
}
  `
};

writeFiles(files);
console.log('Batch A - Public pages generated.');
