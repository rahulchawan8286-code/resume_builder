import { useResumeStore } from '../../store/resumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import PersonalForm from './PersonalForm';
import ObjectiveForm from './ObjectiveForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import ProjectsForm from './ProjectsForm';
import SkillsForm from './SkillsForm';
import CertificationsForm from './CertificationsForm';
import ThemePanel from '../Theme/ThemePanel';
import AIPanel from '../AI/AIPanel';
import AutosaveBar from './AutosaveBar';

const sectionMap = {
  personal:       <PersonalForm />,
  objective:      <ObjectiveForm />,
  education:      <EducationForm />,
  experience:     <ExperienceForm />,
  projects:       <ProjectsForm />,
  skills:         <SkillsForm />,
  certifications: <CertificationsForm />,
  theme:          <ThemePanel />,
  ai:             <AIPanel />,
};

// onSave and resumeId are passed from BuilderPage
export default function EditorPanel({ onSave, resumeId }) {
  const activeSection = useResumeStore((s) => s.activeSection);

  return (
    <div className="flex h-full flex-col">
      {/* Autosave / Undo-Redo Toolbar */}
      <AutosaveBar onSave={onSave} resumeId={resumeId} />

      {/* Scrollable section forms */}
      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {sectionMap[activeSection] ?? (
              <p className="text-sm text-muted-foreground">Select a section from the left panel.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
