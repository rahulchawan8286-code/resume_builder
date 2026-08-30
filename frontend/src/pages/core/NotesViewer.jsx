import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { subjectService } from '../../api/subjectService';
import { progressService } from '../../api/progressService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Loader2, BookOpen, ChevronRight, Menu, CheckCircle2, Search, ArrowLeft, Lightbulb, FileText, HelpCircle, Trophy } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';

// Helper to render basic markdown strings
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

  lines.forEach((line) => {
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
      const content = trimmed.substring(2).split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
      currentList.push(<li key={keyCounter++}>{content}</li>);
    } else {
      pushList();
      const content = trimmed.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
      elements.push(<p key={keyCounter++} className="text-gray-700 dark:text-gray-300 leading-relaxed my-2">{content}</p>);
    }
  });
  pushList();
  return elements;
};

export default function NotesViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [progress, setProgress] = useState(null);
  
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState('notes'); // notes, revision, questions, mcqs
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mcqState, setMcqState] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [notesData, progressData] = await Promise.all([
        subjectService.getSubjectNotes(id),
        progressService.getSubjectProgress(id).catch(() => null)
      ]);
      setNotes(Array.isArray(notesData) ? notesData : []);
      if (progressData) setProgress(progressData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load study notes');
    } finally {
      setIsLoading(false);
    }
  };

  const markCompleted = async (chapterId) => {
    try {
      const updatedProgress = await progressService.markChapterCompleted(id, chapterId);
      setProgress(updatedProgress);
    } catch (err) {
      console.error('Failed to mark complete', err);
    }
  };

  const handleMcqSelect = (mcqIndex, option) => {
    setMcqState(prev => ({
      ...prev,
      [mcqIndex]: option
    }));
  };

  const submitMcqs = async () => {
    if (!selectedNote || !selectedNote.mcqs) return;
    let score = 0;
    selectedNote.mcqs.forEach((mcq, idx) => {
      if (mcqState[idx] === mcq.correctAnswer) score++;
    });
    
    setMcqState(prev => ({ ...prev, submitted: true, score }));
    
    try {
      const updatedProgress = await progressService.saveMcqScore(id, selectedNote._id, score, selectedNote.mcqs.length);
      setProgress(updatedProgress);
    } catch (err) {
      console.error('Failed to save MCQ score', err);
    }
  };

  // Switch chapter resets MCQ state and active tab
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setActiveTab('notes');
    setMcqState({});
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredNotes = useMemo(() => {
    if (!Array.isArray(notes)) return [];
    if (!searchQuery.trim()) return notes;
    const lowerQuery = searchQuery.toLowerCase();
    return notes.filter(n => 
      (n.title?.toLowerCase() || '').includes(lowerQuery) || 
      (n.topics && n.topics.some(t => (t?.toLowerCase() || '').includes(lowerQuery))) ||
      (n.importantConcepts && n.importantConcepts.some(c => (c?.toLowerCase() || '').includes(lowerQuery)))
    );
  }, [notes, searchQuery]);

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
        <ErrorState message={error} onRetry={fetchData} />
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const subjectName = notes.length > 0 && notes[0].subject?.name ? notes[0].subject.name : 'Subject';
  const completedCount = progress?.completedChapters?.length || 0;
  const progressPercent = notes.length > 0 ? Math.round((completedCount / notes.length) * 100) : 0;

  if (!notes || notes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-2xl font-bold dark:text-white">Study Notes</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>Back to Subject</Button>
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
          {selectedNote ? (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={20} />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-bold dark:text-white truncate max-w-[200px] sm:max-w-xs">{subjectName}</h1>
            {selectedNote && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-xs">{selectedNote.title}</p>
            )}
          </div>
        </div>
        
        {/* Progress Display in Header */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <div className="text-sm font-medium dark:text-gray-200">{progressPercent}% Completed</div>
          </div>
          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Dashboard View (When no note is selected) */}
        {!selectedNote && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
            <div className="max-w-5xl mx-auto space-y-8">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">Chapters</h2>
                  <p className="text-gray-500 dark:text-gray-400">Select a chapter to begin studying.</p>
                </div>
                
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Search topics..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredNotes.length === 0 ? (
                <EmptyState icon={Search} title="No chapters found" description="Try a different search term." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNotes.map((note, index) => {
                    const isCompleted = progress?.completedChapters?.includes(note._id);
                    return (
                      <div key={note._id} className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
                            Chapter {note.chapterNumber}
                          </span>
                          {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                        </div>
                        <h3 className="font-bold text-lg dark:text-white mb-2 line-clamp-2">{note.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                          {note.shortDescription || 'No description provided.'}
                        </p>
                        
                        <div className="flex justify-between items-center mt-auto pt-4 border-t dark:border-gray-800">
                          <div className="flex gap-2">
                            {note.difficulty === 'Hard' && <span className="text-[10px] uppercase font-bold text-red-500">Hard</span>}
                            {note.examImportance === 'High' && <span className="text-[10px] uppercase font-bold text-amber-500">High Exam Imp.</span>}
                          </div>
                          <Button size="sm" onClick={() => handleSelectNote(note)}>Start</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar (Only when a note is selected) */}
        {selectedNote && (
          <div className={`
            absolute md:relative z-20 md:z-0
            w-64 md:w-72 h-full bg-white dark:bg-gray-900 border-r dark:border-gray-800 
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            flex flex-col
          `}>
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Chapters</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNote(null)} className="h-8 px-2 text-xs">Back to Grid</Button>
            </div>
            
            <div className="p-2 border-b dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <Input 
                  placeholder="Filter chapters..." 
                  className="pl-8 h-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredNotes.map((note) => {
                const isCompleted = progress?.completedChapters?.includes(note._id);
                return (
                  <button
                    key={note._id}
                    onClick={() => handleSelectNote(note)}
                    className={`
                      w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm transition-colors
                      ${selectedNote?._id === note._id 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <div className="flex items-center truncate pr-2">
                      <span className="opacity-50 mr-2 text-xs w-4">{note.chapterNumber}.</span>
                      <span className="truncate">{note.title}</span>
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                    ) : (
                      selectedNote?._id === note._id && <ChevronRight size={16} className="shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && selectedNote && (
          <div className="absolute inset-0 bg-black/50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content Area (When a note is selected) */}
        {selectedNote && (
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-8 relative scroll-smooth">
            <div className="max-w-4xl mx-auto min-h-full flex flex-col">
              
              {/* Note Header & Navigation Tabs */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 overflow-hidden mb-6">
                <div className="p-6 md:p-8 border-b dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full">
                      Chapter {selectedNote.chapterNumber}
                    </span>
                    {progress?.completedChapters?.includes(selectedNote._id) && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold dark:text-white">{selectedNote.title}</h1>
                  {selectedNote.topics && selectedNote.topics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedNote.topics.map((t, i) => (
                        <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className={`flex items-center justify-center gap-2 flex-1 min-w-[120px] py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notes' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <FileText className="w-4 h-4" /> Notes
                  </button>
                  <button 
                    onClick={() => setActiveTab('revision')}
                    className={`flex items-center justify-center gap-2 flex-1 min-w-[120px] py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'revision' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <Lightbulb className="w-4 h-4" /> Quick Revision
                  </button>
                  <button 
                    onClick={() => setActiveTab('questions')}
                    className={`flex items-center justify-center gap-2 flex-1 min-w-[120px] py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'questions' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <HelpCircle className="w-4 h-4" /> Exam Qs
                  </button>
                  {selectedNote.mcqs && selectedNote.mcqs.length > 0 && (
                    <button 
                      onClick={() => setActiveTab('mcqs')}
                      className={`flex items-center justify-center gap-2 flex-1 min-w-[120px] py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'mcqs' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Practice MCQs
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Contents */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6 md:p-10 flex-1">
                
                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div className="prose dark:prose-invert max-w-none">
                    {renderMarkdown(selectedNote.content)}
                  </div>
                )}
                
                {/* Revision Tab */}
                {activeTab === 'revision' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2 border-b dark:border-gray-800 pb-4">
                      <Lightbulb className="text-amber-500" /> Quick Revision Points
                    </h2>
                    {selectedNote.quickRevision && selectedNote.quickRevision.length > 0 ? (
                      <ul className="space-y-4">
                        {selectedNote.quickRevision.map((point, i) => (
                          <li key={i} className="flex gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30 text-gray-800 dark:text-gray-200">
                            <span className="font-bold text-amber-500 shrink-0">{i + 1}.</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No revision points available for this chapter.</p>
                    )}
                  </div>
                )}
                
                {/* Questions Tab */}
                {activeTab === 'questions' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold dark:text-white border-b dark:border-gray-800 pb-4">Important Exam Questions</h2>
                    
                    {selectedNote.questions2Mark && selectedNote.questions2Mark.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-md inline-block">2-Mark Questions (Short)</h3>
                        <ul className="list-decimal pl-5 space-y-2 dark:text-gray-300">
                          {selectedNote.questions2Mark.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {selectedNote.questions5Mark && selectedNote.questions5Mark.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-md inline-block">5-Mark Questions (Conceptual)</h3>
                        <ul className="list-decimal pl-5 space-y-2 dark:text-gray-300">
                          {selectedNote.questions5Mark.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {selectedNote.questions10Mark && selectedNote.questions10Mark.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-md inline-block">10-Mark Questions (Detailed)</h3>
                        <ul className="list-decimal pl-5 space-y-2 dark:text-gray-300">
                          {selectedNote.questions10Mark.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {!selectedNote.questions2Mark?.length && !selectedNote.questions5Mark?.length && !selectedNote.questions10Mark?.length && (
                      <p className="text-gray-500 dark:text-gray-400">No specific questions mapped for this chapter.</p>
                    )}
                  </div>
                )}
                
                {/* MCQs Tab */}
                {activeTab === 'mcqs' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold dark:text-white border-b dark:border-gray-800 pb-4 flex justify-between items-center">
                      <span>Practice MCQs</span>
                      {mcqState.submitted && (
                        <span className="text-lg font-normal bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-4 py-1 rounded-full">
                          Score: {mcqState.score} / {selectedNote.mcqs.length}
                        </span>
                      )}
                    </h2>
                    
                    {selectedNote.mcqs.map((mcq, qIdx) => (
                      <div key={qIdx} className="p-5 border dark:border-gray-800 rounded-xl space-y-4">
                        <p className="font-medium text-lg dark:text-gray-200">
                          <span className="text-gray-500 mr-2">Q{qIdx + 1}.</span> {mcq.question}
                        </p>
                        
                        <div className="space-y-2">
                          {mcq.options.map((option, oIdx) => {
                            const isSelected = mcqState[qIdx] === option;
                            const isCorrect = mcq.correctAnswer === option;
                            
                            let btnClass = "w-full text-left justify-start font-normal p-4 h-auto whitespace-normal ";
                            
                            if (!mcqState.submitted) {
                              btnClass += isSelected 
                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400" 
                                : "bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 border dark:border-gray-700";
                            } else {
                              if (isCorrect) {
                                btnClass += "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-500";
                              } else if (isSelected && !isCorrect) {
                                btnClass += "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-500";
                              } else {
                                btnClass += "opacity-50 border dark:border-gray-700";
                              }
                            }
                            
                            return (
                              <Button
                                key={oIdx}
                                variant="outline"
                                className={btnClass}
                                onClick={() => !mcqState.submitted && handleMcqSelect(qIdx, option)}
                                disabled={mcqState.submitted}
                              >
                                <span className="mr-3 font-semibold w-5 shrink-0 opacity-50">{String.fromCharCode(65 + oIdx)}.</span> 
                                <span>{option}</span>
                              </Button>
                            );
                          })}
                        </div>
                        
                        {mcqState.submitted && (
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm dark:text-gray-300">
                            <strong className="block mb-1">Explanation:</strong>
                            {mcq.explanation || 'No explanation provided.'}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {!mcqState.submitted && (
                      <Button 
                        size="lg" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                        onClick={submitMcqs}
                        disabled={Object.keys(mcqState).length < selectedNote.mcqs.length}
                      >
                        Submit Answers
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Bottom Navigation & Actions */}
              <div className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button 
                  variant={progress?.completedChapters?.includes(selectedNote._id) ? "outline" : "default"}
                  className={!progress?.completedChapters?.includes(selectedNote._id) ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-500 text-green-600"}
                  onClick={() => markCompleted(selectedNote._id)}
                  disabled={progress?.completedChapters?.includes(selectedNote._id)}
                >
                  <CheckCircle2 className="mr-2 w-4 h-4" /> 
                  {progress?.completedChapters?.includes(selectedNote._id) ? 'Completed' : 'Mark as Completed'}
                </Button>
                
                <div className="flex gap-2">
                  {filteredNotes.findIndex(n => n._id === selectedNote._id) > 0 && (
                    <Button 
                      onClick={() => handleSelectNote(filteredNotes[filteredNotes.findIndex(n => n._id === selectedNote._id) - 1])}
                      variant="outline" 
                    >
                      <ChevronRight size={16} className="rotate-180 mr-2" /> Prev
                    </Button>
                  )}
                  {filteredNotes.findIndex(n => n._id === selectedNote._id) < filteredNotes.length - 1 && (
                    <Button 
                      onClick={() => handleSelectNote(filteredNotes[filteredNotes.findIndex(n => n._id === selectedNote._id) + 1])}
                      variant="outline" 
                    >
                      Next <ChevronRight size={16} className="ml-2" />
                    </Button>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}