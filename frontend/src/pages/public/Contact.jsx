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