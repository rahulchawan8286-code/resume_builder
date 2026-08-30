import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { subjectService } from '../../api/subjectService';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subjectService.getAllSubjects();
      const eceSubjects = data.filter(s => s.code?.startsWith('ECE'));
      setSubjects(eceSubjects);
    } catch (err) {
      setError('Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchSubjects} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Core ECE Subjects</h1>
        <p className="text-gray-500 dark:text-gray-400">Master the fundamentals of Electronics & Communication.</p>
      </div>

      {subjects.length === 0 ? (
        <EmptyState 
          icon={AlertCircle}
          title="No Core ECE Subjects Found"
          description="Check back later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub, i) => (
            <motion.div key={sub._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full flex flex-col hover:border-indigo-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{sub.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="text-sm text-gray-500 mb-6 h-10 overflow-hidden">
                    {sub.description}
                  </div>
                  <Button asChild className="w-full">
                    {/* Assuming SubjectDetails isn't fully migrated, we could link to quizzes for this subject instead. The user said 'Start Practice action'. Let's link to SubjectDetails which could list quizzes. Wait, the user asked to reuse existing routes. SubjectDetails exists. */}
                    <Link to={`/core/subjects/${sub._id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}