import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Download, Edit3, BarChart } from 'lucide-react';

export default function ResumeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Resume Studio</h1>
          <p className="text-gray-500 dark:text-gray-400">Build, analyze, and perfect your ATS-friendly resume.</p>
        </div>
        <Button asChild className="bg-indigo-600 text-white"><Link to="/resume/builder">Create New</Link></Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-indigo-500 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
              <FileText size={24} />
            </div>
            <CardTitle>Main Resume - ECE Profile</CardTitle>
            <CardDescription>Last updated: 2 days ago</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild className="flex-1"><Link to="/resume/builder"><Edit3 size={16} className="mr-2"/> Edit</Link></Button>
              <Button variant="outline" size="sm" asChild className="flex-1"><Link to="/resume/preview"><FileText size={16} className="mr-2"/> View</Link></Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" asChild className="flex-1"><Link to="/resume/ats"><BarChart size={16} className="mr-2"/> ATS Score</Link></Button>
              <Button variant="outline" size="sm" className="flex-1"><Download size={16} className="mr-2"/> Export</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}