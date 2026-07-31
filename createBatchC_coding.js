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
  "frontend/src/pages/coding/CodingDashboard.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { mockCodingProblems } from '../../mocks';

export default function CodingDashboard() {
  const columns = [
    { header: 'Status', accessorKey: 'status', cell: () => <span className="text-gray-400">-</span> },
    { header: 'Title', accessorKey: 'title', cell: (row) => <Link to={\`/coding/problem/\${row.id}\`} className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{row.title}</Link> },
    { header: 'Acceptance', accessorKey: 'acceptance' },
    { header: 'Difficulty', accessorKey: 'difficulty', cell: (row) => (
      <span className={\`\${row.difficulty === 'Easy' ? 'text-emerald-500' : row.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'}\`}>
        {row.difficulty}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Coding Practice</h1>
        <p className="text-gray-500 dark:text-gray-400">Enhance your algorithmic and data structure skills.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Set</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockCodingProblems} />
        </CardContent>
      </Card>
    </div>
  );
}
  `,
  "frontend/src/pages/coding/ProblemDetails.jsx": `
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { mockProblemDetails } from '../../mocks';
import { Play, Check, ChevronLeft } from 'lucide-react';

export default function ProblemDetails() {
  const { id } = useParams();
  const problem = mockProblemDetails;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 -m-4 md:-m-8 p-4 md:p-8 bg-gray-50 dark:bg-gray-950">
      
      {/* Left Panel: Description */}
      <div className="w-full md:w-1/2 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" asChild className="p-0 hover:bg-transparent"><Link to="/coding"><ChevronLeft size={20} /> Back</Link></Button>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex-1 overflow-y-auto shadow-sm">
          <h2 className="text-2xl font-bold dark:text-white mb-2">{problem.title}</h2>
          <div className="flex gap-4 mb-6 text-sm">
            <span className="text-emerald-500 font-medium">{problem.difficulty}</span>
            <span className="text-gray-500">Time Limit: {problem.timeLimit}</span>
            <span className="text-gray-500">Memory Limit: {problem.memoryLimit}</span>
          </div>
          
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="hints">Hints</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{problem.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold dark:text-white">Example:</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                  <p><strong>Input:</strong> {problem.sampleInput}</p>
                  <p><strong>Output:</strong> {problem.sampleOutput}</p>
                  <p className="mt-2 text-gray-500"><strong>Explanation:</strong> {problem.explanation}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="hints" className="space-y-4">
              {problem.hints.map((hint, i) => (
                <div key={i} className="p-4 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200 rounded-lg text-sm">
                  <span className="font-bold mr-2">Hint {i+1}:</span>{hint}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel: Code Editor Mock */}
      <div className="w-full md:w-1/2 flex flex-col gap-4 overflow-hidden">
        <div className="bg-gray-900 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl flex-1 flex flex-col shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <select className="bg-gray-700 text-white text-sm rounded-md px-2 py-1 outline-none">
              <option>C++</option>
              <option>Python</option>
              <option>Java</option>
              <option>JavaScript</option>
            </select>
          </div>
          <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto">
            <pre><code>{\`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};\`}</code></pre>
          </div>
          <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">Console</Button>
            <div className="flex gap-2">
              <Button variant="secondary" className="gap-2"><Play size={16}/> Run</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"><Check size={16}/> Submit</Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
  `,
  "frontend/src/pages/coding/SubmissionHistory.jsx": `
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { mockSubmissions } from '../../mocks';

export default function SubmissionHistory() {
  const columns = [
    { header: 'Time Submitted', accessorKey: 'date', cell: (row) => new Date(row.date).toLocaleString() },
    { header: 'Problem', accessorKey: 'problemTitle' },
    { header: 'Status', accessorKey: 'status', cell: (row) => (
      <span className={\`font-medium \${row.status === 'Accepted' ? 'text-emerald-500' : 'text-red-500'}\`}>
        {row.status}
      </span>
    )},
    { header: 'Runtime', accessorKey: 'runtime' },
    { header: 'Memory', accessorKey: 'memory' },
    { header: 'Language', accessorKey: 'language' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Submission History</h1>
        <p className="text-gray-500 dark:text-gray-400">Review your past code submissions and results.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockSubmissions} />
        </CardContent>
      </Card>
    </div>
  );
}
  `
};

writeFiles(files);
console.log('Batch C - Coding Pages generated.');
