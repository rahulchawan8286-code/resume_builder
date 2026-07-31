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