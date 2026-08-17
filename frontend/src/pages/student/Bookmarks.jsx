import { EmptyState } from '../../components/ui/EmptyState';
import { BookmarkX } from 'lucide-react';

export default function Bookmarks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Bookmarks</h1>
        <p className="text-gray-500 dark:text-gray-400">Your saved questions, notes, and topics.</p>
      </div>

      <EmptyState 
        title="No bookmarks yet" 
        description="When you bookmark difficult questions or important notes, they will appear here for quick review." 
        icon={BookmarkX} 
      />
    </div>
  );
}