import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { motion } from 'framer-motion';

export function AuthCard({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}