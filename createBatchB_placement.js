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
  "frontend/src/pages/placement/AptitudeDashboard.jsx": `
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockQuizzes } from '../../mocks';

export default function AptitudeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Aptitude Practice</h1>
        <p className="text-gray-500 dark:text-gray-400">Master quantitative and logical reasoning for placements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQuizzes.filter(q => q.category === 'Aptitude').map(quiz => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.totalQuestions} Questions • {quiz.duration} mins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-md">
                  {quiz.difficulty}
                </span>
                <Button asChild>
                  <Link to={\`/placement/quiz/\${quiz.id}\`}>Start Test</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/placement/QuizPage.jsx": `
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { mockQuizQuestions } from '../../mocks';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = mockQuizQuestions[currentIdx];
  const progress = ((currentIdx + 1) / mockQuizQuestions.length) * 100;

  const handleSelect = (idx) => {
    setAnswers({ ...answers, [currentIdx]: idx });
  };

  const handleNext = () => {
    if (currentIdx < mockQuizQuestions.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const handleSubmit = () => {
    navigate(\`/placement/result/\${id}\`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold dark:text-white">Question {currentIdx + 1} of {mockQuizQuestions.length}</h2>
        <div className="text-lg font-mono text-indigo-600 dark:text-indigo-400">29:59</div>
      </div>
      <Progress value={progress} className="h-2" />

      <Card className="mt-8">
        <CardContent className="p-8">
          <h3 className="text-xl font-medium mb-8 dark:text-gray-100">{question.text}</h3>
          <div className="space-y-4">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={\`w-full text-left p-4 rounded-lg border-2 transition-all \${answers[currentIdx] === i ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100' : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:text-gray-300'}\`}
              >
                {opt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
          Previous
        </Button>
        {currentIdx === mockQuizQuestions.length - 1 ? (
          <Button onClick={handleSubmit} className="bg-indigo-600 text-white">Submit Test</Button>
        ) : (
          <Button onClick={handleNext}>Next Question</Button>
        )}
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/placement/QuizResult.jsx": `
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { AIChatBubble } from '../../components/ui/AIChatBubble';
import { motion } from 'framer-motion';

export default function QuizResult() {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Test Results</h1>
        <p className="text-gray-500 dark:text-gray-400">Detailed breakdown of your performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center justify-center py-8">
          <CircularProgress value={85} size={160} color="text-emerald-500" />
          <h2 className="mt-4 text-2xl font-bold dark:text-white">Excellent!</h2>
          <p className="text-gray-500 text-sm">Top 10% of class</p>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AI Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AIChatBubble isUser={false} message="Great job! Your accuracy in Time & Distance problems is perfect. However, you spent too much time on Percentages. I recommend practicing more percentage tricks." />
            <div className="flex gap-4 mt-6">
              <Button asChild className="bg-indigo-600 text-white"><Link to="/placement/aptitude">Practice Weak Topics</Link></Button>
              <Button variant="outline" asChild><Link to="/placement/leaderboard">View Leaderboard</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
  `,
  "frontend/src/pages/placement/Leaderboard.jsx": `
import React from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { mockLeaderboard } from '../../mocks';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/Avatar';

export default function Leaderboard() {
  const columns = [
    { header: 'Rank', accessorKey: 'rank', cell: (row) => <span className="font-bold text-lg dark:text-white">#{row.rank}</span> },
    { header: 'Student', accessorKey: 'name', cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.avatar} />
          <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-medium dark:text-white">{row.name}</span>
      </div>
    )},
    { header: 'Score', accessorKey: 'score', cell: (row) => <span className="text-indigo-600 dark:text-indigo-400 font-bold">{row.score}</span> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400">See how you stack up against your peers.</p>
      </div>
      <DataTable columns={columns} data={mockLeaderboard} />
    </div>
  );
}
  `
};

writeFiles(files);
console.log('Batch B - Placement Pages generated.');
