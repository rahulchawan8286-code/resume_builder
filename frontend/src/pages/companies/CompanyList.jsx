import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { useCompanyStore } from '../../store/companyStore';
import { Loader2, Search, Building2, Bookmark, BookmarkCheck, Target } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';

export default function CompanyList() {
  const { companies, fetchCompanies, isLoading, error, bookmarks, fetchBookmarks, toggleBookmark, targets, fetchTargets } = useCompanyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  useEffect(() => {
    fetchCompanies();
    fetchBookmarks();
    fetchTargets();
  }, [fetchCompanies, fetchBookmarks, fetchTargets]);

  // Derived unique industries for filter
  const industries = [...new Set(companies.map(c => c.industry).filter(Boolean))];

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter ? company.industry === industryFilter : true;
    return matchesSearch && matchesIndustry;
  });

  const isBookmarked = (id) => bookmarks.some(b => b.company?._id === id || b.company === id);
  const isTarget = (id) => targets.some(t => t.company?._id === id || t.company === id);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Company Profiles</h1>
        <p className="text-gray-500 dark:text-gray-400">Explore hiring processes and roadmaps for top tech companies.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="w-full pl-10 pr-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          <option value="">All Industries</option>
          {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchCompanies()} />
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No companies found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, i) => (
            <motion.div key={company._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-md transition-shadow h-full flex flex-col relative overflow-hidden group">
                <button 
                  onClick={() => toggleBookmark(company._id)}
                  className="absolute top-4 right-4 z-10 text-gray-400 hover:text-indigo-600 transition-colors"
                  title={isBookmarked(company._id) ? "Remove Bookmark" : "Bookmark"}
                >
                  {isBookmarked(company._id) ? <BookmarkCheck className="text-indigo-600" fill="currentColor" size={20} /> : <Bookmark size={20} />}
                </button>

                <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-6">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-12 h-12 rounded-md object-contain bg-white p-1 border dark:border-gray-800" />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><Building2 size={24}/></div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg dark:text-white pr-6 line-clamp-1">{company.name}</h3>
                    <p className="text-xs text-gray-500">{company.industry || 'Technology'}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-4">
                  <div className="space-y-4 mb-6 text-sm">
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-xs">
                      {company.description?.replace(/\[DEVELOPMENT DATA\]/g, '') || 'No description available.'}
                    </p>
                    {isTarget(company._id) && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded w-fit">
                        <Target size={14} /> Target Company
                      </div>
                    )}
                  </div>
                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Link to={`/companies/${company._id}`}>View Details & Roadmap</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}