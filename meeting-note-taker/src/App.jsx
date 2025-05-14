import React, { useState, useEffect } from "react";
import SpeechToText from "./components/SpeechToText.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
import ExportButton from "./components/ExportButton.jsx";
import ImportButton from "./components/ImportButton.jsx";
import NotesList from "./components/NotesList.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import AboutPanel from "./components/AboutPanel.jsx";
import {
  initializeNotes,
  getNotesList,
  getNote,
  createNote,
  updateNoteContent,
  updateNoteTitle,
  setNoteArchived,
  deleteNote
} from "./utils/notesStorage.jsx";

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'system', // 'light', 'dark', or 'system'
  fontSize: 16,
  privacyLock: false,
  autoSave: true,
  defaultAppendMode: true,
  language: 'en-US'
};

// Settings storage key
const SETTINGS_KEY = 'meeting-note-taker-settings';

const App = () => {
  // State for notes management
  const [activeNote, setActiveNote] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State for settings and modals
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Apply theme based on settings
  const [currentTheme, setCurrentTheme] = useState('light');

  // Effect to handle theme changes
  useEffect(() => {
    if (settings.theme === 'dark') {
      setCurrentTheme('dark');
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      setCurrentTheme('light');
      document.documentElement.classList.remove('dark');
    } else if (settings.theme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(prefersDark ? 'dark' : 'light');
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Listen for changes in system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (settings.theme === 'system') {
          setCurrentTheme(e.matches ? 'dark' : 'light');
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Handle privacy lock mode
  useEffect(() => {
    if (settings.privacyLock) {
      const handleBeforeUnload = () => {
        // Clear all notes when the user leaves the page
        localStorage.clear();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [settings.privacyLock]);

  // Initialize notes on first load
  useEffect(() => {
    const initialNote = initializeNotes();
    setActiveNote(initialNote);
    setNotesList(getNotesList());
  }, []);

  // Handle transcript changes from speech recognition
  const handleTranscriptChange = (transcript) => {
    if (activeNote) {
      const updatedNote = updateNoteContent(activeNote.id, transcript);
      setActiveNote(updatedNote);
      // Refresh the notes list to update the "updatedAt" time
      setNotesList(getNotesList());
    }
  };

  // Handle note content changes from the editor
  const handleNoteChange = (content) => {
    if (activeNote) {
      const updatedNote = updateNoteContent(activeNote.id, content);
      setActiveNote(updatedNote);
      // Refresh the notes list to update the "updatedAt" time
      setNotesList(getNotesList());
    }
  };

  // Handle selecting a note
  const handleSelectNote = (noteId) => {
    const selectedNote = getNote(noteId);
    if (selectedNote) {
      setActiveNote(selectedNote);
    }
  };

  // Handle creating a new note
  const handleCreateNote = (title) => {
    const newNote = createNote(title);
    setActiveNote(newNote);
    setNotesList(getNotesList());
  };

  // Handle renaming a note
  const handleRenameNote = (noteId, newTitle) => {
    const updatedNote = updateNoteTitle(noteId, newTitle);
    if (updatedNote && activeNote && activeNote.id === noteId) {
      setActiveNote(updatedNote);
    }
    setNotesList(getNotesList());
  };

  // Handle archiving/unarchiving a note
  const handleArchiveNote = (noteId, archived) => {
    const updatedNote = setNoteArchived(noteId, archived);

    // If we're archiving the active note, switch to another note
    if (archived && activeNote && activeNote.id === noteId) {
      const activeNotes = notesList.filter(note => !note.archived && note.id !== noteId);
      if (activeNotes.length > 0) {
        handleSelectNote(activeNotes[0].id);
      } else {
        // Create a new note if there are no active notes left
        handleCreateNote("New Meeting");
      }
    } else if (updatedNote && activeNote && activeNote.id === noteId) {
      setActiveNote(updatedNote);
    }

    setNotesList(getNotesList());
  };

  // Handle deleting a note
  const handleDeleteNote = (noteId) => {
    const success = deleteNote(noteId);

    if (success) {
      // If we're deleting the active note, switch to another note
      if (activeNote && activeNote.id === noteId) {
        const remainingNotes = notesList.filter(note => note.id !== noteId);
        if (remainingNotes.length > 0) {
          handleSelectNote(remainingNotes[0].id);
        } else {
          // Create a new note if there are no notes left
          handleCreateNote("New Meeting");
        }
      }

      setNotesList(getNotesList());
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Update settings
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className={`min-h-screen ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col`}>
      <header className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm py-4 px-6 border-b`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`mr-4 p-2 rounded-lg ${currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              aria-label={isSidebarOpen ? "Hide notes list" : "Show notes list"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Meeting Note Taker</h1>
          </div>

          <div className="flex items-center gap-2">
            <p className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hidden md:block mr-4`}>
              Privacy-first speech-to-text
            </p>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-lg ${currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              aria-label="Open settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <button
              onClick={() => setIsAboutOpen(true)}
              className={`p-2 rounded-lg ${currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              aria-label="About and help"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className={`w-80 p-4 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r overflow-y-auto`}>
            <NotesList
              notes={notesList}
              activeNoteId={activeNote?.id}
              onSelectNote={handleSelectNote}
              onCreateNote={handleCreateNote}
              onRenameNote={handleRenameNote}
              onArchiveNote={handleArchiveNote}
              onDeleteNote={handleDeleteNote}
            />
          </aside>
        )}

        {/* Main content */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {activeNote ? (
              <>
                <div className={`mb-4 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow p-4`}>
                  <h2 className="text-xl font-bold mb-1">{activeNote.title}</h2>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Created: {new Date(activeNote.createdAt).toLocaleString()}
                  </p>
                </div>

                <SpeechToText
                  onTranscriptChange={handleTranscriptChange}
                  initialTranscript={activeNote.content}
                  language={settings.language}
                />
                <NoteEditor
                  notes={activeNote.content}
                  setNotes={handleNoteChange}
                  fontSize={settings.fontSize}
                />
                <div className="flex flex-wrap gap-2 mb-6">
                  <ImportButton
                    onImport={(content) => handleNoteChange(content)}
                  />
                  <ExportButton
                    notes={activeNote.content}
                    noteTitle={activeNote.title}
                  />
                </div>
              </>
            ) : (
              <div className={`flex items-center justify-center h-64 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow`}>
                <p className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Loading notes...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={`${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'} border-t py-4 px-6 text-center text-sm`}>
        <div className="max-w-6xl mx-auto">
          <p>Privacy-first. All notes are processed locally and saved in your browser.</p>
          <p className="mt-1">
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API"
              target="_blank"
              rel="noopener noreferrer"
              className={`${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-500'} hover:underline`}
              aria-label="Learn more about Web Speech API"
            >
              Powered by Web Speech API
            </a>
          </p>
        </div>
      </footer>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <SettingsPanel
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* About Panel */}
      {isAboutOpen && (
        <AboutPanel
          onClose={() => setIsAboutOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
