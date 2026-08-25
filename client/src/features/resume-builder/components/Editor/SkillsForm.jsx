import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Wrench, Plus, X } from 'lucide-react';

function TagInput({ label, tags, onAdd, onRemove }) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-background p-3 min-h-[80px]">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {tag}
            <button onClick={() => onRemove(tag)} className="hover:text-destructive transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter…"
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

export default function SkillsForm() {
  const skills = useResumeStore((s) => s.resumeData.skills);
  const setResumeData = useResumeStore((s) => s.setResumeData);

  const add = (category, tag) => {
    setResumeData({ skills: { ...skills, [category]: [...skills[category], tag] } });
  };

  const remove = (category, tag) => {
    setResumeData({ skills: { ...skills, [category]: skills[category].filter((t) => t !== tag) } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base font-bold flex items-center gap-2">
        <Wrench className="h-4 w-4 text-primary" /> Skills
      </h2>
      <TagInput
        label="Technical Skills"
        tags={skills.technical}
        onAdd={(t) => add('technical', t)}
        onRemove={(t) => remove('technical', t)}
      />
      <TagInput
        label="Soft Skills"
        tags={skills.soft}
        onAdd={(t) => add('soft', t)}
        onRemove={(t) => remove('soft', t)}
      />
    </div>
  );
}
