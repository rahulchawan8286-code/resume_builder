import { useResumeStore } from '../../store/resumeStore';
import SortableList from './SortableList';
import { Award, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';

function CertFields({ item }) {
  const updateItem = useResumeStore((s) => s.updateItem);
  const u = (field, val) => updateItem('certifications', item.id, { [field]: val });

  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Certification Name', field: 'name', placeholder: 'AWS Solutions Architect', span: 2 },
        { label: 'Issuing Organization', field: 'issuer', placeholder: 'Amazon Web Services', span: 2 },
        { label: 'Issue Date', field: 'issueDate', placeholder: 'Mar 2024' },
        { label: 'Credential ID', field: 'credentialId', placeholder: 'AWS-123456' },
        { label: 'URL', field: 'url', placeholder: 'https://...', span: 2 },
      ].map(({ label, field, placeholder, span }) => (
        <div key={field} className={span === 2 ? 'col-span-2' : ''}>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
          <input
            value={item[field] || ''}
            onChange={(e) => u(field, e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      ))}
    </div>
  );
}

export default function CertificationsForm() {
  const certifications = useResumeStore((s) => s.resumeData.certifications);
  const addItem = useResumeStore((s) => s.addItem);
  const deleteItem = useResumeStore((s) => s.deleteItem);

  const add = () =>
    addItem('certifications', { id: nanoid(), name: '', issuer: '', issueDate: '', credentialId: '', url: '' });

  const reorder = (newList) =>
    useResumeStore.setState((s) => ({ resumeData: { ...s.resumeData, certifications: newList } }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" /> Certifications
        </h2>
        <button onClick={add} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {certifications.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No certifications yet.
        </p>
      )}

      <SortableList
        items={certifications}
        onReorder={reorder}
        onDelete={(id) => deleteItem('certifications', id)}
        getTitle={(item) => item.name || 'Certification'}
        renderItem={(item) => <CertFields item={item} />}
      />
    </div>
  );
}
