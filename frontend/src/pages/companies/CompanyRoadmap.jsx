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