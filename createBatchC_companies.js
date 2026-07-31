const fs = require('fs');
const path = require('path');

const writeFiles = (files) => {
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content.trim(), 'utf8');
  });
};

const files = {
  "frontend/src/pages/companies/CompanyList.jsx": `
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
                    <span className={\`font-bold \${company.match > 85 ? 'text-emerald-500' : 'text-amber-500'}\`}>{company.match}%</span>
                  </div>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to={\`/companies/\${company.id}\`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/companies/CompanyDetails.jsx": `
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
        <Button asChild className="bg-indigo-600 text-white"><Link to={\`/companies/roadmap/\${id}\`}><Map size={16} className="mr-2"/> View Roadmap</Link></Button>
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
  `,
  "frontend/src/pages/companies/CompanyRoadmap.jsx": `
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockCompanyDetails } from '../../mocks';

export default function CompanyRoadmap() {
  const { id } = useParams();
  const company = mockCompanyDetails;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{company.name} - Preparation Roadmap</h1>
        <p className="text-gray-500 dark:text-gray-400">Your personalized 3-month guide to cracking {company.name}.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-indigo-600 h-2 w-full"></div>
        <CardContent className="p-8">
          <Stepper steps={company.roadmap.map(r => ({ title: r.month }))} currentStep={1} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {company.roadmap.map((step, i) => (
          <Card key={i} className={i === 1 ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'opacity-70'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{step.month}</span>
                {i === 1 && <Badge className="bg-indigo-600 text-white border-transparent">Current Focus</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">{step.task}</p>
              {i === 1 && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm">Go to Syllabus</Button>
                  <Button size="sm" variant="outline">Take Mock Test</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
  `
};

writeFiles(files);
console.log('Batch C - Companies Pages generated.');
