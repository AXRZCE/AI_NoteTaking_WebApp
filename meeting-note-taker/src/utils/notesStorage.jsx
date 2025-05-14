/**
 * Utility functions for managing notes in localStorage
 */

// Keys for localStorage
const NOTES_LIST_KEY = 'meeting-note-taker-notes-list';
const NOTE_PREFIX = 'meeting-note-taker-note-';

/**
 * Generate a unique ID for a new note
 * @returns {string} A unique ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Get the list of all notes metadata
 * @returns {Array} Array of note metadata objects
 */
export const getNotesList = () => {
  const notesList = localStorage.getItem(NOTES_LIST_KEY);
  return notesList ? JSON.parse(notesList) : [];
};

/**
 * Save the list of notes metadata
 * @param {Array} notesList - Array of note metadata objects
 */
export const saveNotesList = (notesList) => {
  localStorage.setItem(NOTES_LIST_KEY, JSON.stringify(notesList));
};

/**
 * Get a specific note by ID
 * @param {string} id - The note ID
 * @returns {Object} The note object or null if not found
 */
export const getNote = (id) => {
  const noteData = localStorage.getItem(`${NOTE_PREFIX}${id}`);
  return noteData ? JSON.parse(noteData) : null;
};

/**
 * Save a note
 * @param {Object} note - The note object to save
 */
export const saveNote = (note) => {
  localStorage.setItem(`${NOTE_PREFIX}${note.id}`, JSON.stringify(note));
  
  // Update the notes list
  const notesList = getNotesList();
  const existingIndex = notesList.findIndex(n => n.id === note.id);
  
  if (existingIndex >= 0) {
    // Update existing note metadata
    notesList[existingIndex] = {
      id: note.id,
      title: note.title,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      archived: note.archived || false
    };
  } else {
    // Add new note metadata
    notesList.push({
      id: note.id,
      title: note.title,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      archived: note.archived || false
    });
  }
  
  saveNotesList(notesList);
};

/**
 * Create a new note
 * @param {string} title - The note title
 * @returns {Object} The newly created note
 */
export const createNote = (title = 'Untitled Meeting') => {
  const now = new Date();
  const note = {
    id: generateId(),
    title,
    content: '',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    archived: false
  };
  
  saveNote(note);
  return note;
};

/**
 * Update a note's content
 * @param {string} id - The note ID
 * @param {string} content - The new content
 * @returns {Object} The updated note
 */
export const updateNoteContent = (id, content) => {
  const note = getNote(id);
  if (!note) return null;
  
  note.content = content;
  note.updatedAt = new Date().toISOString();
  
  saveNote(note);
  return note;
};

/**
 * Update a note's title
 * @param {string} id - The note ID
 * @param {string} title - The new title
 * @returns {Object} The updated note
 */
export const updateNoteTitle = (id, title) => {
  const note = getNote(id);
  if (!note) return null;
  
  note.title = title;
  note.updatedAt = new Date().toISOString();
  
  saveNote(note);
  return note;
};

/**
 * Archive or unarchive a note
 * @param {string} id - The note ID
 * @param {boolean} archived - Whether to archive (true) or unarchive (false)
 * @returns {Object} The updated note
 */
export const setNoteArchived = (id, archived) => {
  const note = getNote(id);
  if (!note) return null;
  
  note.archived = archived;
  note.updatedAt = new Date().toISOString();
  
  saveNote(note);
  return note;
};

/**
 * Delete a note
 * @param {string} id - The note ID to delete
 * @returns {boolean} Success status
 */
export const deleteNote = (id) => {
  try {
    // Remove from localStorage
    localStorage.removeItem(`${NOTE_PREFIX}${id}`);
    
    // Update the notes list
    const notesList = getNotesList();
    const updatedList = notesList.filter(note => note.id !== id);
    saveNotesList(updatedList);
    
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};

/**
 * Initialize the notes system
 * Creates a default note if none exist
 * @returns {Object} The active note
 */
export const initializeNotes = () => {
  const notesList = getNotesList();
  
  if (notesList.length === 0) {
    // Create a default note
    return createNote('My First Meeting');
  }
  
  // Return the most recently updated non-archived note
  const activeNotes = notesList.filter(note => !note.archived);
  if (activeNotes.length > 0) {
    // Sort by updatedAt (most recent first)
    activeNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return getNote(activeNotes[0].id);
  }
  
  // If all notes are archived, return the most recent one
  notesList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return getNote(notesList[0].id);
};
