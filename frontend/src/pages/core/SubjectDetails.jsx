import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Stepper } from '../../components/ui/Stepper';
import { BookOpen, FileCode2, Loader2 } from 'lucide-react';
import { subjectService } from '../../api/subjectService';
import { ErrorState } from '../../components/ui/ErrorState';

export default function SubjectDetails() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await subjectService.getSubjectById(id);
        setSubject(data);
      } catch (err) {
        setError('Failed to load subject details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !subject) {
    return <ErrorState message={error || 'Subject not found'} />;
  }

  // Fallback modules for now, since Subject model only has name/description
  const modules = [{ title: "Fundamentals" }, { title: "Core Concepts" }, { title: "Advanced Topics" }, { title: "Applications" }];
  const learningOutcomes = ["Understand the basic principles", "Analyze complex problems", "Design practical solutions"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{subject.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{subject.description || 'No description available.'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link to={`/core/notes/${id}`}><BookOpen className="mr-2" size={16}/> Read Notes</Link></Button>
          <Button asChild className="bg-indigo-600 text-white"><Link to={`/core/practice/${id}`}><FileCode2 className="mr-2" size={16}/> Practice Test</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Course Modules</CardTitle></CardHeader>
          <CardContent>
            <Stepper 
              steps={modules.map(m => ({ title: m.title }))} 
              currentStep={2} 
              className="mt-8 flex-col items-start gap-8 md:flex-row md:items-center md:gap-0" 
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader><CardTitle>Learning Outcomes</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {learningOutcomes.map((outcome, i) => (
                <li key={i}>{outcome}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}