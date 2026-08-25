import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subjectService } from '../../api/subjectService';
import { Button } from '../../components/ui/Button';
import { Loader2, AlertCircle, BookOpen, ChevronRight, Menu } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

// Simple lightweight markdown parser for the seeded notes
const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  let elements = [];
  let currentList = [];
  let keyCounter = 0;

  const pushList = () => {
    if (currentList.length > 0) {
      elements.push(<ul key={keyCounter++} className="list-disc pl-5 my-2 space-y-1 text-gray-700 dark:text-gray-300">{currentList}</ul>);
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      pushList();
      elements.push(<div key={keyCounter++} className="h-2"></div>);
      return;
    }

    if (trimmed.startsWith('# ')) {
      pushList();
      elements.push(<h1 key={keyCounter++} className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-800">{trimmed.substring(2)}</h1>);
    } else if (trimmed.startsWith('## ')) {
      pushList();
      elements.push(<h2 key={keyCounter++} className="text-xl font-semibold mt-5 mb-3 text-gray-800 dark:text-gray-100">{trimmed.substring(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      pushList();
      elements.push(<h3 key={keyCounter++} className="text-lg font-medium mt-4 mb-2 text-gray-800 dark:text-gray-200">{trimmed.substring(4)}</h3>);
    } else if (trimmed.startsWith('- ')) {
      // Handle bold within list items
      const content = trimmed.substring(2).split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
      currentList.push(<li key={keyCounter++}>{content}</li>);
    } else if (trimmed.startsWith('|')) {
      // Very basic table row render (monospace)
      pushList();
      elements.push(<div key={keyCounter++} className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-1 px-3 border-b dark:border-gray-800 text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{trimmed}</div>);
    } else {
      pushList();
      // Handle bold within paragraphs
      const content = trimmed.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
      elements.push(<p key={keyCounter++} className="text-gray-700 dark:text-gray-300 leading-relaxed my-2">{content}</p>);
    }
  });
  
  pushList();
  return elements;
};

export default function NotesViewer() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  useEffect(() => {
    fetchNotes();
  }, [id]);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subjectService.getSubjectNotes(id);
      setNotes(data || []);
      if (data && data.length > 0) {
        setSelectedNote(data[0]);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load study notes');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading study materials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <ErrorState message={error} onRetry={fetchNotes} />
        <div className="mt-4 text-center">
          <Button variant="outline" asChild><Link to={`/core/subjects/${id}`}>Go Back</Link></Button>
        </div>
      </div>
    );
  }

  const subjectName = notes.length > 0 && notes[0].subject?.name ? notes[0].subject.name : 'Subject';

  if (!notes || notes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-2xl font-bold dark:text-white">Study Notes</h1>
          <Button variant="outline" asChild><Link to={`/core/subjects/${id}`}>Back to Subject</Link></Button>
        </div>
        <EmptyState 
          icon={BookOpen} 
          title="No Notes Available" 
          description="Study materials for this subject have not been published yet."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 md:-m-8 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold dark:text-white">{subjectName}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Study Notes & Chapters</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild><Link to={`/core/subjects/${id}`}>Back to Subject</Link></Button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Chapters) */}
        <div className={`
          absolute md:relative z-20 md:z-0
          w-64 md:w-72 h-full bg-white dark:bg-gray-900 border-r dark:border-gray-800 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}>
          <div className="p-4 border-b dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Chapters</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {notes.map((note, index) => (
              <button
                key={note._id}
                onClick={() => {
                  setSelectedNote(note);
                  setIsSidebarOpen(false); // Auto close on mobile
                }}
                className={`
                  w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${selectedNote?._id === note._id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span className="truncate pr-2">
                  <span className="opacity-50 mr-2 text-xs">{index + 1}.</span>
                  {note.title}
                </span>
                {selectedNote?._id === note._id && <ChevronRight size={16} className="shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-8 relative scroll-smooth">
          {selectedNote ? (
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border dark:border-gray-800 p-6 md:p-10 min-h-full">
              <div className="prose dark:prose-invert max-w-none">
                {renderMarkdown(selectedNote.content)}
              </div>
              
              {/* Pagination / Next Chapter */}
              <div className="mt-12 pt-6 border-t dark:border-gray-800 flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Chapter {notes.findIndex(n => n._id === selectedNote._id) + 1} of {notes.length}
                </div>
                {notes.findIndex(n => n._id === selectedNote._id) < notes.length - 1 && (
                  <Button 
                    onClick={() => {
                      const nextIndex = notes.findIndex(n => n._id === selectedNote._id) + 1;
                      setSelectedNote(notes[nextIndex]);
                    }}
                    variant="ghost" 
                    className="gap-2"
                  >
                    Next Chapter <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <EmptyState icon={BookOpen} title="Select a chapter" description="Choose a chapter from the sidebar to begin reading." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}