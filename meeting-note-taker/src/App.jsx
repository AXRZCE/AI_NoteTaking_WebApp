import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
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

export default function App() {
  // State for notes management
  const [activeNote, setActiveNote] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State for settings and modals
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

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

  // Handle importing content
  const handleImport = (content) => {
    handleNoteChange(content);
  };

  // Update settings
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const themeClasses = currentTheme === 'dark'
    ? 'bg-gray-900 text-white'
    : 'bg-gray-100 text-gray-900';

  return (
    <div className={`min-h-screen ${themeClasses} flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <header className={`flex items-center justify-between px-6 py-4 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow border-b`}>
        <h1 className={`text-2xl font-bold tracking-tight ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-700'} flex items-center`}>
          <span className="w-4 h-4 rounded-full bg-red-600 inline-block mr-2"></span>
          Meeting Note Taker (UPDATED VERSION)
        </h1>
        <div className="space-x-2">
          <button
            className={`rounded-lg px-3 py-1 ${
              currentTheme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? "Hide Notes" : "Show Notes"}
          </button>
          <button
            className={`rounded-lg px-3 py-1 ${
              currentTheme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            onClick={() => setSettingsOpen(true)}
            aria-label="Open Settings"
          >
            Settings
          </button>
          <button
            className={`rounded-lg px-3 py-1 ${
              currentTheme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            onClick={() => setAboutOpen(true)}
            aria-label="About"
          >
            About
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`w-72 min-w-[220px] ${
            currentTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } border-r p-4 flex-shrink-0 transition-all duration-200 overflow-y-auto`}>
            <Sidebar
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <NoteEditor
            note={activeNote}
            onUpdateContent={handleNoteChange}
            onImport={handleImport}
            language={settings.language}
            fontSize={settings.fontSize}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className={`${
        currentTheme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-gray-400'
          : 'bg-white border-gray-200 text-gray-500'
      } text-xs p-3 flex flex-col md:flex-row items-center justify-between shadow-inner border-t`}>
        <span>
          Privacy-first. All notes are processed locally and saved in your browser.
        </span>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API"
          target="_blank"
          rel="noopener noreferrer"
          className={`${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} underline ml-2`}
        >
          Powered by Web Speech API
        </a>
      </footer>

      {/* Settings & About Panels */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
      <AboutPanel
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}
