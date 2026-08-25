import { mockAdminAiStats } from '../data/mockAdminData';
import { Sparkles, Cpu, Clock, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminAiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Engine Operations</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Operational load, token consumption, and model efficiency metrics.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Requests', value: mockAdminAiStats.requests, icon: Sparkles, color: 'text-indigo-500' },
          { label: 'Estimated Tokens Used', value: mockAdminAiStats.tokens, icon: Cpu, color: 'text-pink-500' },
          { label: 'Avg Response Time', value: mockAdminAiStats.responseTime, icon: Clock, color: 'text-yellow-500' },
          { label: 'Cache Hit Rate', value: mockAdminAiStats.cacheHitRate, icon: RefreshCw, color: 'text-green-500' },
          { label: 'Fail Rate', value: mockAdminAiStats.failedRequests, icon: AlertCircle, color: 'text-red-500' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold">{stat.label}</span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-black mt-3">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Model status */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-bold">API Providers Configuration</h3>
          <div className="space-y-3">
            {[
              { name: 'Gemini 1.5 Flash (Primary)', provider: 'Google Cloud AI', latency: '420ms', status: 'Healthy' },
              { name: 'OpenAI GPT-4o (Secondary)', provider: 'OpenAI API', latency: '650ms', status: 'Standby' },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-sm font-semibold">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">{p.provider} · Latency: {p.latency}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Limits */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-bold">Default AI Service Quotas</h3>
          <div className="space-y-3">
            {[
              { rule: 'Max operations / user / day', value: '50 requests' },
              { rule: 'Token rate limit (TPM)', value: '150,000 tpm' },
              { rule: 'Concurrent requests / user', value: '3 requests' },
            ].map((q) => (
              <div key={q.rule} className="flex justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                <span className="text-muted-foreground">{q.rule}</span>
                <span className="font-bold">{q.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
