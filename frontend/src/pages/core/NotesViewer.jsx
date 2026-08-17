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
        <Button variant="outline" asChild><Link to={`/core/subjects/${id}`}>Back to Subject</Link></Button>
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