import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockCompanies } from '../../mocks';
import { motion } from 'framer-motion';

export default function CompanyList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Company Profiles</h1>
        <p className="text-gray-500 dark:text-gray-400">Explore hiring processes and roadmaps for top tech companies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCompanies.map((company, i) => (
          <motion.div key={company.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-md object-contain bg-white p-1 border dark:border-gray-800" />
                <div>
                  <h3 className="font-bold text-lg dark:text-white">{company.name}</h3>
                  <p className="text-xs text-gray-500">{company.industry}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-4">
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium">{company.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Your Match Score</span>
                    <span className={`font-bold ${company.match > 85 ? 'text-emerald-500' : 'text-amber-500'}`}>{company.match}%</span>
                  </div>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to={`/companies/${company.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}