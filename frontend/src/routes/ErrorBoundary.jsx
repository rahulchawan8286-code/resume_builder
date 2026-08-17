import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  
  // We can log to an error reporting service here if needed
  console.error('Route ErrorBoundary caught an error:', error);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          An unexpected error occurred while rendering this page. We&apos;ve noted the issue.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Reload Page
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};