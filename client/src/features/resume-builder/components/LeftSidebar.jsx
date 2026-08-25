import React, { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  Wrench, 
  Award,
  Palette,
  Sparkles,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const navItems = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'objective', label: 'Objective', icon: Sparkles }, // We'll put AI features here too
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'certifications', label: 'Certifications', icon: Award },
];

const topTools = [
  { id: 'theme', label: 'Theme & Layout', icon: Palette },
  { id: 'ai', label: 'AI Tools', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function LeftSidebar() {
  const activeSection = useResumeStore((state) => state.activeSection);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center px-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Core Tools */}
        <div>
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Resume Sections
          </h3>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Tools */}
        <div>
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Global Tools
          </h3>
          <div className="space-y-1">
            {topTools.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
