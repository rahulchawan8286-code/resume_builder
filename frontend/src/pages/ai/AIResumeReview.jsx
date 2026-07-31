import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AIResumeReview() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">AI Resume Review</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">Our AI Resume Review system is integrated directly into the Resume Builder as the ATS Report feature.</p>
      <Button asChild className="bg-indigo-600 text-white"><Link to="/resume/ats">Go to ATS Report</Link></Button>
    </div>
  );
}