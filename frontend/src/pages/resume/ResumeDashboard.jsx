import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, FileText, Copy, Trash2, Edit, Loader2 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { ErrorState } from '../../components/ui/ErrorState';
import { toast } from 'sonner';

export default function ResumeDashboard() {
  const { resumes, fetchResumes, createResume, deleteResume, duplicateResume, isLoading, error } = useResumeStore();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(null); // stores id of resume being duplicated/deleted

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const newResume = await createResume({ title: 'Untitled Resume' });
      toast.success('Resume created successfully!');
      navigate(`/resume/builder/${newResume._id}`);
    } catch (err) {
      toast.error('Failed to create resume.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    setIsProcessing(id);
    try {
      await deleteResume(id);
      toast.success('Resume deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete resume.');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDuplicate = async (id) => {
    setIsProcessing(id);
    try {
      await duplicateResume(id);
      toast.success('Resume duplicated successfully.');
    } catch (err) {
      toast.error('Failed to duplicate resume.');
    } finally {
      setIsProcessing(null);
    }
  };

  if (error && !resumes.length) {
    return <ErrorState message={error} onRetry={fetchResumes} />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Resume Manager</h1>
          <p className="text-gray-500 dark:text-gray-400">Build, manage, and optimize your resumes for ATS.</p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          {isCreating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />} Create New Resume
        </Button>
      </div>

      {isLoading && !resumes.length && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      )}

      {!isLoading && resumes.length === 0 && (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <FileText size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No resumes created yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm">Create your first professional resume to start tracking your ATS score and applying for jobs.</p>
          <Button onClick={handleCreate} disabled={isCreating}>Create Resume</Button>
        </Card>
      )}

      {resumes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => (
            <Card key={resume._id} className="overflow-hidden group hover:border-indigo-500 transition-colors">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 flex flex-col items-center justify-center border-b border-gray-100 dark:border-gray-700 h-48 relative">
                <FileText size={64} className="text-indigo-200 dark:text-indigo-900/50" />
                {isProcessing === resume._id && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 size={24} className="animate-spin text-indigo-600" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate" title={resume.title}>{resume.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Last updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                    <Link to={`/resume/builder/${resume._id}`}><Edit size={14}/> Edit</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDuplicate(resume._id)} disabled={isProcessing === resume._id} title="Duplicate">
                    <Copy size={16} className="text-gray-500 hover:text-indigo-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(resume._id)} disabled={isProcessing === resume._id} title="Delete">
                    <Trash2 size={16} className="text-gray-500 hover:text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}