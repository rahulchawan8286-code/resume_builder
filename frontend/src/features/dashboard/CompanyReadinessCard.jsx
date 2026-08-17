import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Building2, Target, ExternalLink } from 'lucide-react';
import { useCompanyStore } from '../../store/companyStore';

export const CompanyReadinessCard = memo(() => {
  const { targets, fetchTargets, isLoading } = useCompanyStore();

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  return (
    <Card className="flex flex-col h-full">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Target size={20} className="text-indigo-500" /> Target Companies
      </h2>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">Loading targets...</div>
      ) : targets.length > 0 ? (
        <div className="flex-1 flex flex-col gap-3">
          {targets.map((t) => (
            <div key={t._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                {t.company?.logoUrl ? (
                  <img src={t.company.logoUrl} alt={t.company.name} className="w-8 h-8 rounded bg-white p-1" />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500"><Building2 size={16}/></div>
                )}
                <div>
                  <h4 className="font-semibold text-sm dark:text-white">{t.company?.name || 'Unknown'}</h4>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">{t.status}</span>
                </div>
              </div>
              <Link to={`/companies/roadmap/${t.company?._id}`} className="text-indigo-600 hover:text-indigo-700 p-2">
                <ExternalLink size={16} />
              </Link>
            </div>
          ))}
          <Link to="/companies" className="text-xs text-center text-indigo-600 mt-2 hover:underline">Manage Targets &rarr;</Link>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center mt-4 text-center space-y-3">
          <Building2 size={32} className="text-gray-300" />
          <p className="text-sm text-gray-500">You haven&apos;t set any target companies yet.</p>
          <Link to="/companies" className="text-xs text-indigo-600 font-medium">Explore Companies</Link>
        </div>
      )}
    </Card>
  );
});
CompanyReadinessCard.displayName = 'CompanyReadinessCard';