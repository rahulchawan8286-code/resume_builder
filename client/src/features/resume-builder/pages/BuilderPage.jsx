import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useResumeStore } from '../store/resumeStore';
import LeftSidebar from '../components/LeftSidebar';
import EditorPanel from '../components/Editor/EditorPanel';
import PreviewPanel from '../components/Preview/PreviewPanel';
import { resumeAPI } from '@/services/apiServices';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setResumeData, setSaveState } = useResumeStore();

  const [status, setStatus] = React.useState('loading'); // 'loading' | 'ready' | 'error'
  const [resumeId, setResumeId] = React.useState(id || null);

  // Load or create a resume on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        if (id) {
          // Edit existing resume
          const res = await resumeAPI.getById(id);
          if (!cancelled) {
            const resume = res.data.data.resume;
            // Map backend fields into the store shape
            setResumeData({
              personalInfo: resume.personalInfo || {},
              objective: resume.objective || resume.careerObjective || '',
              education: resume.education || [],
              experience: resume.experience || [],
              projects: resume.projects || [],
              skills: {
                technical: resume.technicalSkills || [],
                soft: resume.softSkills || [],
              },
              certifications: resume.certificates || [],
              languages: resume.languages || [],
            });
            setResumeId(resume._id);
            setStatus('ready');
          }
        } else {
          // Create new resume
          const res = await resumeAPI.create({ title: 'Untitled Resume' });
          if (!cancelled) {
            const resume = res.data.data.resume;
            setResumeId(resume._id);
            // Replace URL without adding to history so back button works
            navigate(`/resumes/${resume._id}`, { replace: true });
            setStatus('ready');
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('BuilderPage init error:', err);
          toast.error('Failed to load resume. Please try again.');
          setStatus('error');
        }
      }
    }

    setStatus('loading');
    init();
    return () => { cancelled = true; };
  }, [id]);

  // Save resume data to API
  const saveResume = useCallback(async (data) => {
    if (!resumeId) return;
    setSaveState(true);
    try {
      await resumeAPI.update(resumeId, {
        personalInfo: data.personalInfo,
        objective: data.objective,
        education: data.education,
        experience: data.experience,
        projects: data.projects,
        technicalSkills: data.skills?.technical || [],
        softSkills: data.skills?.soft || [],
        certificates: data.certifications || [],
        languages: data.languages || [],
      });
      setSaveState(false, new Date());
    } catch (err) {
      setSaveState(false);
      console.error('Autosave failed:', err);
    }
  }, [resumeId]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">Failed to load resume</p>
        <button
          onClick={() => navigate('/resumes')}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
        >
          Back to My Resumes
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <PanelGroup direction="horizontal">
        {/* Left Toolbar */}
        <Panel defaultSize={20} minSize={15} maxSize={25} className="border-r border-border bg-card">
          <LeftSidebar />
        </Panel>

        <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />

        {/* Center Editor */}
        <Panel defaultSize={35} minSize={30} className="bg-background">
          <EditorPanel onSave={saveResume} resumeId={resumeId} />
        </Panel>

        <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />

        {/* Right Preview */}
        <Panel defaultSize={45} minSize={35} className="bg-muted">
          <PreviewPanel resumeId={resumeId} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
