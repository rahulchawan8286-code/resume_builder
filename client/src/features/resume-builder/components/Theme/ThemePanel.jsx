import { useResumeStore } from '../../store/resumeStore';
import { Palette } from 'lucide-react';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#10b981', '#3b82f6', '#14b8a6', '#ef4444',
];

const FONTS = ['Inter', 'Roboto', 'Plus Jakarta Sans', 'Outfit', 'Lora', 'Merriweather'];

const TEMPLATES = [
  { id: 'modern',  label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'minimal', label: 'Minimal' },
];

export default function ThemePanel() {
  const { theme, updateTheme } = useResumeStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" /> Theme & Layout
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Customise your resume's appearance.</p>
      </div>

      {/* Template Switcher */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Template</label>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateTheme({ template: t.id })}
              className={`rounded-xl border py-3 text-xs font-semibold transition-all ${
                theme.template === t.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Primary Color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => updateTheme({ primaryColor: c })}
              style={{ backgroundColor: c }}
              className={`h-8 w-8 rounded-full transition-all hover:scale-110 ${
                theme.primaryColor === c ? 'ring-2 ring-offset-2 ring-offset-background ring-current scale-110' : ''
              }`}
            />
          ))}
          {/* Custom hex color picker */}
          <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border hover:border-primary transition-colors" title="Custom color">
            <span className="text-xs text-muted-foreground">+</span>
            <input type="color" value={theme.primaryColor} onChange={(e) => updateTheme({ primaryColor: e.target.value })} className="sr-only" />
          </label>
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Font Family</label>
        <select
          value={theme.fontFamily}
          onChange={(e) => updateTheme({ fontFamily: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Font Size: <span className="text-primary">{theme.fontSize}</span>
        </label>
        <input
          type="range" min={9} max={13} step={0.5}
          value={parseFloat(theme.fontSize)}
          onChange={(e) => updateTheme({ fontSize: `${e.target.value}pt` })}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Small (9pt)</span><span>Large (13pt)</span>
        </div>
      </div>
    </div>
  );
}
