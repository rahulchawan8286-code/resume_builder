import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Timeline } from '../../components/ui/Timeline';
import { useCompanyStore } from '../../store/companyStore';
import { Map, ChevronLeft, Target, Loader2, Building2, ExternalLink } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';
import { toast } from 'sonner';

export default function CompanyDetails() {
  const { id } = useParams();
  const { currentCompany, fetchCompanyById, isLoading, error, targets, fetchTargets, updateTarget, removeTarget } = useCompanyStore();
  const [targetStatus, setTargetStatus] = useState('');

  useEffect(() => {
    fetchCompanyById(id);
    fetchTargets();
  }, [id, fetchCompanyById, fetchTargets]);

  useEffect(() => {
    const t = targets.find(t => t.company?._id === id || t.company === id);
    setTargetStatus(t ? t.status : '');
  }, [targets, id]);

  const handleTargetChange = async (e) => {
    const val = e.target.value;
    try {
      if (val === '') {
        await removeTarget(id);
        setTargetStatus('');
        toast.success('Removed from Target Companies');
      } else {
        await updateTarget(id, val);
        setTargetStatus(val);
        toast.success(`Target status updated to ${val}`);
      }
    } catch (err) {
      toast.error('Failed to update target status');
    }
  };

  if (isLoading && !currentCompany) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (error && !currentCompany) return <ErrorState message={error} onRetry={() => fetchCompanyById(id)} />;
  if (!currentCompany) return null;

  return (
    <div className="space-y-6 pb-12">
      <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2"><Link to="/companies"><ChevronLeft size={20} className="mr-1"/> Back to Directory</Link></Button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {currentCompany.logoUrl ? (
            <img src={currentCompany.logoUrl} alt={currentCompany.name} className="w-16 h-16 rounded-xl object-contain bg-white p-2 border shadow-sm" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 border flex justify-center items-center text-gray-400"><Building2 size={32}/></div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              {currentCompany.name}
              {currentCompany.website && <a href={currentCompany.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-600"><ExternalLink size={16}/></a>}
            </h1>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{currentCompany.industry}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 dark:border-gray-700 bg-white dark:bg-gray-900">
            <Target size={16} className={targetStatus ? "text-emerald-500" : "text-gray-400"} />
            <select 
              className="bg-transparent text-sm font-medium outline-none text-gray-700 dark:text-gray-300"
              value={targetStatus}
              onChange={handleTargetChange}
            >
              <option value="">Not Targeted</option>
              <option value="Interested">Interested</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Applied">Applied</option>
            </select>
          </div>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white"><Link to={`/companies/roadmap/${id}`}><Map size={16} className="mr-2"/> View Roadmap</Link></Button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {currentCompany.description?.replace(/\[DEVELOPMENT DATA\]/g, '')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Hiring Process</CardTitle></CardHeader>
            <CardContent>
              {currentCompany.interviewRounds?.length > 0 ? (
                <Timeline items={currentCompany.interviewRounds.map(r => ({ title: r.title, description: r.desc }))} />
              ) : (
                <p className="text-sm text-gray-500">Information not available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Available Roles</CardTitle></CardHeader>
            <CardContent>
              {currentCompany.openRoles?.length > 0 ? (
                <div className="space-y-4">
                  {currentCompany.openRoles.map((role, i) => (
                    <div key={i} className="border-b last:border-0 pb-4 last:pb-0 dark:border-gray-800">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{role.title}</h4>
                        {role.applyLink && role.applyLink !== '#' && <a href={role.applyLink} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">Apply</a>}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{role.description}</p>
                      <p className="text-xs text-gray-500"><strong>Reqs:</strong> {role.requirements}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No specific roles listed.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Eligibility</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentCompany.eligibility?.replace(/\[DEVELOPMENT DATA\]/g, '') || 'Information not available'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="text-sm">Required Skills</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {currentCompany.requiredSkills?.length > 0 ? (
                currentCompany.requiredSkills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)
              ) : (
                <span className="text-sm text-gray-500">Information not available</span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}