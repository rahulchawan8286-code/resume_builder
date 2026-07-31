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