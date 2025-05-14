import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const NotesList = ({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onCreateNote, 
  onRenameNote, 
  onArchiveNote, 
  onDeleteNote 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteTitle, setEditingNoteTitle] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  
  // Filter notes based on archived status
  const filteredNotes = notes.filter(note => note.archived === showArchived);
  
  // Handle creating a new note
  const handleCreateNote = () => {
    if (newNoteTitle.trim()) {
      onCreateNote(newNoteTitle.trim());
      setNewNoteTitle('');
      setIsCreating(false);
    }
  };
  
  // Handle renaming a note
  const handleRenameNote = () => {
    if (editingNoteTitle.trim()) {
      onRenameNote(editingNoteId, editingNoteTitle.trim());
      setEditingNoteId(null);
      setEditingNoteTitle('');
    }
  };
  
  // Start editing a note title
  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteTitle(note.title);
  };
  
  // Format the date for display
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">My Notes</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          aria-label="Create new note"
        >
          New Note
        </button>
      </div>
      
      {/* Create new note form */}
      {isCreating && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Enter note title..."
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring focus:border-blue-300"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNote}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={!newNoteTitle.trim()}
            >
              Create
            </button>
          </div>
        </div>
      )}
      
      {/* Filter toggle */}
      <div className="mb-4 flex items-center">
        <button
          onClick={() => setShowArchived(false)}
          className={`px-3 py-1 rounded-l-lg transition-colors ${
            !showArchived 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`px-3 py-1 rounded-r-lg transition-colors ${
            showArchived 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Archived
        </button>
      </div>
      
      {/* Notes list */}
      {filteredNotes.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          {showArchived 
            ? 'No archived notes yet.' 
            : 'No notes yet. Create your first note!'}
        </div>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {filteredNotes.map(note => (
            <li 
              key={note.id}
              className={`p-3 rounded-lg transition-colors ${
                note.id === activeNoteId 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {editingNoteId === note.id ? (
                <div>
                  <input
                    type="text"
                    value={editingNoteTitle}
                    onChange={(e) => setEditingNoteTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring focus:border-blue-300"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRenameNote}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      disabled={!editingNoteTitle.trim()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div 
                    className="font-medium cursor-pointer"
                    onClick={() => onSelectNote(note.id)}
                  >
                    {note.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Updated {formatDate(note.updatedAt)}
                  </div>
                  <div className="flex justify-end gap-1 mt-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="p-1 text-xs text-gray-600 hover:text-blue-600"
                      aria-label={`Rename ${note.title}`}
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => onArchiveNote(note.id, !note.archived)}
                      className="p-1 text-xs text-gray-600 hover:text-amber-600"
                      aria-label={note.archived ? `Unarchive ${note.title}` : `Archive ${note.title}`}
                    >
                      {note.archived ? 'Unarchive' : 'Archive'}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${note.title}"? This cannot be undone.`)) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="p-1 text-xs text-gray-600 hover:text-red-600"
                      aria-label={`Delete ${note.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesList;
