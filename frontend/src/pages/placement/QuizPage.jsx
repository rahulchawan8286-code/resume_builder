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
    navigate(`/placement/result/${id}`);
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
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentIdx] === i ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100' : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:text-gray-300'}`}
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