import { useState } from 'react';
import toast from 'react-hot-toast';
import { Settings, Shield, Cpu, Sliders, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('ResumeAI Pro');
  const [maintenance, setMaintenance] = useState(false);
  const [provider, setProvider] = useState('gemini');
  const [limit, setLimit] = useState(50);

  const saveSettings = (e) => {
    e.preventDefault();
    toast.success('Global console settings updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Global Configurations</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Control operational limits and infrastructure variables.</p>
      </div>

      <form onSubmit={saveSettings} className="space-y-5">
        
        {/* Site Details Card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Platform Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Site Title</label>
              <input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="col-span-2 flex items-center justify-between border-t border-border pt-4">
              <div>
                <h4 className="text-sm font-semibold">Maintenance Mode</h4>
                <p className="text-xs text-muted-foreground">Force offline message across the entire platform.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenance}
                  onChange={(e) => setMaintenance(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* AI API quotas */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Cpu className="h-4 w-4 text-pink-500" /> AI Provider Selector
          </h3>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active API Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none"
            >
              <option value="gemini">Google Gemini Cloud (Recommended)</option>
              <option value="openai">OpenAI GPT Engines (Failover)</option>
            </select>
          </div>
        </div>

        {/* Rate limits */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Sliders className="h-4 w-4 text-yellow-500" /> Quotas & Rate Limits
          </h3>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Max AI Operations per day: <span className="text-primary font-bold">{limit} requests</span>
            </label>
            <input
              type="range" min={10} max={200} step={5}
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-destructive px-5 py-3 text-sm font-semibold text-white hover:bg-destructive/95 transition-all shadow-md shadow-destructive/15"
        >
          Save Configurations
        </button>

      </form>
    </div>
  );
}
