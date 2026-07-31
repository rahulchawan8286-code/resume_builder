import React from 'react';
import { Button } from '../../components/ui/Button';

export default function Error500() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 text-center">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">500</h1>
      <h2 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Internal Server Error</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">Something went completely wrong on our end. Please try refreshing.</p>
      <Button onClick={() => window.location.reload()} className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white">
        Refresh Page
      </Button>
    </div>
  );
}