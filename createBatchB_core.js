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
  "frontend/src/pages/core/Subjects.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { mockSubjects } from '../../mocks';
import { motion } from 'framer-motion';

export default function Subjects() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Core ECE Subjects</h1>
        <p className="text-gray-500 dark:text-gray-400">Master the fundamentals of Electronics & Communication.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSubjects.map((sub, i) => (
          <motion.div key={sub.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full flex flex-col hover:border-indigo-500 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className={\`text-xs font-semibold px-2 py-1 rounded-full \${sub.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}\`}>
                    {sub.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{sub.estimatedTime}</span>
                </div>
                <CardTitle className="text-lg line-clamp-1">{sub.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium dark:text-white">{sub.progress}%</span>
                  </div>
                  <Progress value={sub.progress} className="h-2" />
                  <p className="text-xs text-gray-500 text-right">{sub.completedTopics} / {sub.totalTopics} topics</p>
                </div>
                <Button asChild className="w-full">
                  <Link to={\`/core/subjects/\${sub.id}\`}>View Details</Link>
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
  "frontend/src/pages/core/SubjectDetails.jsx": `
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Stepper } from '../../components/ui/Stepper';
import { mockSubjectDetails } from '../../mocks';
import { BookOpen, FileCode2 } from 'lucide-react';

export default function SubjectDetails() {
  const { id } = useParams();
  const subject = mockSubjectDetails; // Assume fetched based on id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{subject.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{subject.overview}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link to={\`/core/notes/\${id}\`}><BookOpen className="mr-2" size={16}/> Read Notes</Link></Button>
          <Button asChild className="bg-indigo-600 text-white"><Link to={\`/core/practice/\${id}\`}><FileCode2 className="mr-2" size={16}/> Practice Test</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Course Modules</CardTitle></CardHeader>
          <CardContent>
            <Stepper 
              steps={subject.modules.map(m => ({ title: m.title }))} 
              currentStep={2} 
              className="mt-8 flex-col items-start gap-8 md:flex-row md:items-center md:gap-0" 
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader><CardTitle>Learning Outcomes</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {subject.learningOutcomes.map((outcome, i) => (
                <li key={i}>{outcome}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/core/NotesViewer.jsx": `
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { mockSubjectDetails } from '../../mocks';

export default function NotesViewer() {
  const { id } = useParams();
  const subject = mockSubjectDetails;

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-white dark:bg-gray-950 min-h-screen p-8 border dark:border-gray-800 rounded-xl">
      <div className="flex justify-between items-center border-b pb-4 dark:border-gray-800">
        <h1 className="text-2xl font-bold dark:text-white">{subject.name} - Study Notes</h1>
        <Button variant="outline" asChild><Link to={\`/core/subjects/\${id}\`}>Back to Subject</Link></Button>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <h2>Chapter 1: Number Systems</h2>
        <p>A number system is defined as a system of writing to express numbers. It is the mathematical notation for representing numbers of a given set by using digits or other symbols in a consistent manner.</p>
        <h3>Binary Number System</h3>
        <p>The binary numeral system uses only two digits: 0 and 1. Computers operate in binary, meaning they store data and perform calculations using only zeros and ones.</p>
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md font-mono text-sm">
          Binary to Decimal Conversion:<br/>
          1011₂ = (1 × 2³) + (0 × 2²) + (1 × 2¹) + (1 × 2⁰) = 8 + 0 + 2 + 1 = 11₁₀
        </div>
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/core/PracticeTest.jsx": `
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Play } from 'lucide-react';

export default function PracticeTest() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-12">
      <Card className="text-center py-12">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 mb-4">
            <Play size={32} />
          </div>
          <CardTitle className="text-3xl">Digital Electronics Practice Test</CardTitle>
          <CardDescription className="text-lg mt-2">Test your knowledge before the final interview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <p className="text-gray-500">Questions</p>
              <p className="font-bold text-xl dark:text-white">30</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-bold text-xl dark:text-white">45 mins</p>
            </div>
            <div>
              <p className="text-gray-500">Passing Score</p>
              <p className="font-bold text-xl dark:text-white">70%</p>
            </div>
          </div>
          <Button size="lg" className="bg-indigo-600 text-white w-full max-w-sm mt-8" asChild>
            <Link to={\`/placement/quiz/\${id}\`}>Start Test Now</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
  `
};

writeFiles(files);
console.log('Batch B - Core ECE Pages generated.');
