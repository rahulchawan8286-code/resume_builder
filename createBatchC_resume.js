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
  "frontend/src/pages/resume/ResumeDashboard.jsx": `
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
  `,
  "frontend/src/pages/resume/ResumeBuilder.jsx": `
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/Accordion';
import { Progress } from '../../components/ui/Progress';
import { mockResumeData } from '../../mocks';

export default function ResumeBuilder() {
  const [data, setData] = useState(mockResumeData);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 -m-4 md:-m-8 p-4 md:p-8 bg-gray-50 dark:bg-gray-950">
      
      {/* Editor Panel */}
      <div className="w-full md:w-1/2 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex-1 overflow-y-auto shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold dark:text-white">Editor</h2>
              <p className="text-sm text-gray-500">Auto-saved just now</p>
            </div>
            <div className="w-32">
              <div className="flex justify-between text-xs mb-1">
                <span>Completeness</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>

          <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-xs">Full Name</label><Input defaultValue={data.personalInfo.fullName} /></div>
                  <div className="space-y-2"><label className="text-xs">Email</label><Input defaultValue={data.personalInfo.email} /></div>
                  <div className="space-y-2"><label className="text-xs">Phone</label><Input defaultValue={data.personalInfo.phone} /></div>
                  <div className="space-y-2"><label className="text-xs">LinkedIn</label><Input defaultValue={data.personalInfo.linkedin} /></div>
                </div>
                <div className="space-y-2"><label className="text-xs">Summary</label><TextArea rows={3} defaultValue={data.personalInfo.summary} /></div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Education</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {data.education.map((edu, i) => (
                  <Card key={i} className="p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                    <div className="space-y-2"><label className="text-xs">Institution</label><Input defaultValue={edu.institution} /></div>
                    <div className="space-y-2"><label className="text-xs">Degree</label><Input defaultValue={edu.degree} /></div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">+ Add Education</Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="w-full md:w-1/2 flex flex-col gap-4 overflow-hidden">
        <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl flex-1 flex flex-col shadow-inner overflow-hidden p-8 items-center justify-start">
          <div className="w-full max-w-[210mm] aspect-[1/1.414] bg-white shadow-xl p-8 overflow-hidden text-gray-900 text-[10px]">
             <h1 className="text-2xl font-bold uppercase tracking-widest text-center">{data.personalInfo.fullName}</h1>
             <p className="text-center mt-1">{data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.linkedin}</p>
             <hr className="my-4 border-gray-400" />
             <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-800">Summary</h2>
             <p>{data.personalInfo.summary}</p>
             <h2 className="text-xs font-bold uppercase tracking-wider mb-2 mt-4 text-indigo-800">Education</h2>
             {data.education.map((edu, i) => (
               <div key={i} className="mb-2">
                 <div className="flex justify-between font-bold"><span>{edu.degree}</span><span>{edu.startYear} - {edu.endYear}</span></div>
                 <div className="flex justify-between italic"><span>{edu.institution}</span><span>GPA: {edu.gpa}</span></div>
               </div>
             ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" asChild><Link to="/resume/ats">Check ATS Score</Link></Button>
          <Button className="bg-indigo-600 text-white">Export PDF</Button>
        </div>
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/resume/ResumePreview.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { mockResumeData } from '../../mocks';

export default function ResumePreview() {
  const data = mockResumeData;
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 -m-8 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Print Preview</h1>
        <div className="flex gap-4">
          <Button variant="outline" asChild><Link to="/resume/builder">Back to Editor</Link></Button>
          <Button className="bg-indigo-600 text-white">Download PDF</Button>
        </div>
      </div>
      
      {/* A4 Paper Size Mock */}
      <div className="w-full max-w-[210mm] aspect-[1/1.414] bg-white shadow-2xl p-12 overflow-hidden text-gray-900 text-sm">
        <h1 className="text-4xl font-bold uppercase tracking-widest text-center">{data.personalInfo.fullName}</h1>
        <p className="text-center mt-2 text-gray-600">{data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.linkedin}</p>
        <hr className="my-6 border-gray-400" />
        <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-800 border-b pb-1">Summary</h2>
        <p className="mb-6">{data.personalInfo.summary}</p>
        
        <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-800 border-b pb-1">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="mb-6">
            <div className="flex justify-between font-bold"><span>{edu.degree}</span><span>{edu.startYear} - {edu.endYear}</span></div>
            <div className="flex justify-between italic text-gray-700"><span>{edu.institution}</span><span>GPA: {edu.gpa}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/resume/ATSReport.jsx": `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { AIChatBubble } from '../../components/ui/AIChatBubble';
import { mockATSReport } from '../../mocks';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ATSReport() {
  const report = mockATSReport;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">ATS Analysis Report</h1>
        <p className="text-gray-500 dark:text-gray-400">See how your resume parses in standard Applicant Tracking Systems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-8">
          <CircularProgress value={report.score} size={160} color={report.score > 75 ? "text-emerald-500" : "text-amber-500"} />
          <h2 className="mt-4 text-2xl font-bold dark:text-white">Good Score</h2>
          <p className="text-gray-500 text-sm text-center px-4 mt-2">Your resume will pass most basic ATS filters, but there is room for improvement.</p>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>AI Recommendations</CardTitle></CardHeader>
          <CardContent>
            <AIChatBubble isUser={false} message={report.aiRecommendations} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-400 flex items-center gap-2 mb-2"><AlertTriangle size={16}/> Missing Keywords</h4>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300">
                  {report.missingKeywords.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-2"><AlertTriangle size={16}/> Formatting Issues</h4>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300">
                  {report.formattingSuggestions.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
  `
};

writeFiles(files);
console.log('Batch C - Resume Pages generated.');
