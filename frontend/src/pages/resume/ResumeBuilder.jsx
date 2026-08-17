import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/Accordion';
import { useResumeStore } from '../../store/resumeStore';
import ResumePreview from './ResumePreview';
import { Loader2, ChevronLeft, Plus, Trash2, Printer, BarChart } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';

const resumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  personalInfo: z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').or(z.literal('')),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional()
  }),
  summary: z.string().optional(),
  education: z.array(z.object({
    institution: z.string().min(1, 'Required'),
    degree: z.string().min(1, 'Required'),
    branch: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    score: z.string().optional()
  })),
  projects: z.array(z.object({
    title: z.string().min(1, 'Required'),
    description: z.string().optional(),
    technologies: z.string().optional(),
    role: z.string().optional(),
    duration: z.string().optional(),
    link: z.string().optional()
  })),
  experience: z.array(z.object({
    company: z.string().min(1, 'Required'),
    position: z.string().min(1, 'Required'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional()
  })),
  skills: z.object({
    technical: z.string().optional(),
    soft: z.string().optional(),
    tools: z.string().optional()
  })
});

export default function ResumeBuilder() {
  const { id } = useParams();
  const { currentResume, fetchResumeById, updateCurrentResumeLocal, isLoading, error, saveStatus } = useResumeStore();

  const { register, control, watch, reset } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      title: '', personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
      summary: '', education: [], projects: [], experience: [], skills: { technical: '', soft: '', tools: '' }
    }
  });

  const { fields: eduFields, append: eduAppend, remove: eduRemove } = useFieldArray({ control, name: 'education' });
  const { fields: projFields, append: projAppend, remove: projRemove } = useFieldArray({ control, name: 'projects' });
  const { fields: expFields, append: expAppend, remove: expRemove } = useFieldArray({ control, name: 'experience' });

  useEffect(() => {
    fetchResumeById(id);
  }, [id, fetchResumeById]);

  useEffect(() => {
    if (currentResume) {
      // transform arrays to string for skills if needed, though they are stored as arrays.
      const transformed = {
        ...currentResume,
        skills: {
          technical: Array.isArray(currentResume.skills?.technical) ? currentResume.skills.technical.join(', ') : '',
          soft: Array.isArray(currentResume.skills?.soft) ? currentResume.skills.soft.join(', ') : '',
          tools: Array.isArray(currentResume.skills?.tools) ? currentResume.skills.tools.join(', ') : ''
        }
      };
      reset(transformed);
    }
  }, [currentResume, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      // Transform skills back to array for the store
      const dataToSave = {
        ...value,
        skills: {
          technical: value.skills?.technical ? value.skills.technical.split(',').map(s=>s.trim()).filter(Boolean) : [],
          soft: value.skills?.soft ? value.skills.soft.split(',').map(s=>s.trim()).filter(Boolean) : [],
          tools: value.skills?.tools ? value.skills.tools.split(',').map(s=>s.trim()).filter(Boolean) : []
        }
      };
      updateCurrentResumeLocal(dataToSave);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateCurrentResumeLocal]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading && !currentResume) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (error && !currentResume) return <ErrorState message={error} onRetry={() => fetchResumeById(id)} />;
  if (!currentResume) return null;

  const watchedData = watch();

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 -m-4 md:-m-8 p-4 md:p-8 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      
      {/* Editor Panel */}
      <div className="w-full md:w-[45%] flex flex-col gap-4 h-full print:hidden">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6 flex-1 overflow-y-auto shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" asChild className="p-0 hover:bg-transparent h-auto"><Link to="/resume"><ChevronLeft size={16} /> Back</Link></Button>
              </div>
              <input 
                {...register('title')} 
                className="text-xl font-bold dark:text-white bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                placeholder="Resume Title"
              />
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                {saveStatus === 'saving' && <><Loader2 size={12} className="animate-spin"/> Saving...</>}
                {saveStatus === 'saved' && <span className="text-emerald-500">All changes saved</span>}
                {saveStatus === 'error' && <span className="text-red-500">Failed to save</span>}
                {saveStatus === 'idle' && 'Saved'}
              </span>
              <Button size="sm" asChild variant="outline" className="text-xs h-7 px-2"><Link to={`/resume/ats/${id}`}><BarChart size={14} className="mr-1"/> Analyze ATS</Link></Button>
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue="personalInfo" className="w-full">
            <AccordionItem value="personalInfo">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4 px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-medium">Full Name</label><input {...register('personalInfo.fullName')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Email</label><input {...register('personalInfo.email')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Phone</label><input {...register('personalInfo.phone')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Location</label><input {...register('personalInfo.location')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">LinkedIn</label><input {...register('personalInfo.linkedin')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">GitHub</label><input {...register('personalInfo.github')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="summary">
              <AccordionTrigger>Professional Summary</AccordionTrigger>
              <AccordionContent className="pt-4 px-1">
                <textarea {...register('summary')} rows={4} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500 resize-none" placeholder="Brief professional summary..."></textarea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="education">
              <AccordionTrigger>Education</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4 px-1">
                {eduFields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-gray-50 dark:bg-gray-800 relative">
                    <button onClick={() => eduRemove(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1"><label className="text-xs font-medium">Institution</label><input {...register(`education.${index}.institution`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Degree</label><input {...register(`education.${index}.degree`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Branch/Major</label><input {...register(`education.${index}.branch`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Score (CGPA/%)</label><input {...register(`education.${index}.score`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Start Date</label><input {...register(`education.${index}.startDate`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="e.g. Aug 2020" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">End Date</label><input {...register(`education.${index}.endDate`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="e.g. May 2024" /></div>
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => eduAppend({ institution: '', degree: '', branch: '', score: '', startDate: '', endDate: '' })} className="w-full border-dashed"><Plus size={16} className="mr-2"/> Add Education</Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger>Experience</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4 px-1">
                {expFields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-gray-50 dark:bg-gray-800 relative">
                    <button onClick={() => expRemove(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1"><label className="text-xs font-medium">Company</label><input {...register(`experience.${index}.company`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Position</label><input {...register(`experience.${index}.position`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Start Date</label><input {...register(`experience.${index}.startDate`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="e.g. Jan 2023" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">End Date</label><input {...register(`experience.${index}.endDate`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="e.g. Present" /></div>
                    </div>
                    <div className="space-y-1"><label className="text-xs font-medium">Description</label><textarea {...register(`experience.${index}.description`)} rows={3} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500 resize-none" placeholder="Bullet points..."></textarea></div>
                  </Card>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => expAppend({ company: '', position: '', startDate: '', endDate: '', description: '' })} className="w-full border-dashed"><Plus size={16} className="mr-2"/> Add Experience</Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="projects">
              <AccordionTrigger>Projects</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4 px-1">
                {projFields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-gray-50 dark:bg-gray-800 relative">
                    <button onClick={() => projRemove(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1"><label className="text-xs font-medium">Project Title</label><input {...register(`projects.${index}.title`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Technologies</label><input {...register(`projects.${index}.technologies`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="e.g. React, Node.js" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Link</label><input {...register(`projects.${index}.link`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium">Duration</label><input {...register(`projects.${index}.duration`)} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="e.g. 2 months" /></div>
                    </div>
                    <div className="space-y-1"><label className="text-xs font-medium">Description</label><textarea {...register(`projects.${index}.description`)} rows={3} className="w-full text-sm p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500 resize-none"></textarea></div>
                  </Card>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => projAppend({ title: '', description: '', technologies: '', link: '', duration: '' })} className="w-full border-dashed"><Plus size={16} className="mr-2"/> Add Project</Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skills">
              <AccordionTrigger>Skills</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4 px-1">
                <div className="space-y-1"><label className="text-xs font-medium">Technical Skills (comma separated)</label><input {...register('skills.technical')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="JavaScript, Python, C++" /></div>
                <div className="space-y-1"><label className="text-xs font-medium">Tools/Frameworks (comma separated)</label><input {...register('skills.tools')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="React, Docker, Git" /></div>
                <div className="space-y-1"><label className="text-xs font-medium">Soft Skills (comma separated)</label><input {...register('skills.soft')} className="w-full text-sm p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:border-indigo-500" placeholder="Leadership, Communication" /></div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="w-full md:w-[55%] h-full flex flex-col bg-gray-200 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 print:w-full print:border-none print:bg-white print:m-0 print:p-0 relative">
        <div className="absolute top-4 right-4 z-10 print:hidden">
          <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg gap-2"><Printer size={16} /> Export PDF</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 print:overflow-visible print:p-0 flex justify-center">
          <ResumePreview data={watchedData} />
        </div>
      </div>
    </div>
  );
}