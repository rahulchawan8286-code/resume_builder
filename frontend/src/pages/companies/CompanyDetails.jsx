import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { Timeline } from '../../components/ui/Timeline';
import { mockCompanyDetails } from '../../mocks';
import { Map, ChevronLeft } from 'lucide-react';

export default function CompanyDetails() {
  const { id } = useParams();
  const company = mockCompanyDetails; // Mock fetch

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2"><Link to="/companies"><ChevronLeft size={20} className="mr-1"/> Back</Link></Button>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-xl object-contain bg-white p-2 border shadow-sm" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{company.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{company.description}</p>
          </div>
        </div>
        <Button asChild className="bg-indigo-600 text-white"><Link to={`/companies/roadmap/${id}`}><Map size={16} className="mr-2"/> View Roadmap</Link></Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Hiring Process</CardTitle></CardHeader>
            <CardContent>
              <Timeline items={company.interviewRounds.map(r => ({ title: r.title, description: r.desc }))} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Required Skills</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {company.requiredSkills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center p-6">
            <CircularProgress value={company.aiReadinessScore} size={140} color="text-indigo-600" />
            <h3 className="mt-4 font-bold text-lg dark:text-white">AI Readiness</h3>
            <p className="text-sm text-gray-500 mt-2">Based on your aptitude and core ECE scores.</p>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Eligibility</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-gray-600 dark:text-gray-300">{company.eligibility}</p></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}