import React from 'react';

const AboutPanel = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">About Meeting Note Taker</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close about panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">What is Meeting Note Taker?</h3>
            <p>
              Meeting Note Taker is a free, privacy-first web application for real-time meeting transcription and note-taking.
              It's designed for organizations that require fast, secure, and easy-to-use note-taking tools—no installation, 
              no server, no compromise on privacy.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">Privacy & Security</h3>
            <p className="mb-2">
              Meeting Note Taker is built with privacy as the top priority:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All speech processing happens locally in your browser</li>
              <li>Your audio and notes never leave your device</li>
              <li>No data is sent to any server</li>
              <li>No analytics, no cookies, no tracking</li>
              <li>All notes are stored only in your browser's local storage</li>
              <li>Optional Privacy Lock mode can clear notes when you close the app</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Which browsers are supported?</h4>
                <p className="text-gray-700">
                  Meeting Note Taker works best in Chrome, Edge, and Safari. Firefox has limited support for the Web Speech API.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">How do I grant microphone permissions?</h4>
                <p className="text-gray-700">
                  When you first click "Start" to begin transcription, your browser will ask for permission to use your microphone.
                  Click "Allow" to grant permission. If you accidentally denied permission, you can click on the padlock icon in your
                  browser's address bar to change the permission settings.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">How do I transcribe online meeting audio?</h4>
                <p className="text-gray-700">
                  For online meetings, you'll need to set your system to route meeting audio to your microphone input.
                  On Windows, you can use "Stereo Mix" if available. On Mac, you might need a virtual audio cable solution
                  like Loopback or BlackHole.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">What's the difference between the export formats?</h4>
                <p className="text-gray-700">
                  Word (.docx) provides the richest formatting with proper headings and page layout.
                  PDF is ideal for sharing with others who don't need to edit the content.
                  Text (.txt) is the simplest format, compatible with any text editor.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Will my notes be saved if I close the browser?</h4>
                <p className="text-gray-700">
                  Yes, your notes are automatically saved in your browser's local storage and will be available
                  when you return, unless you've enabled Privacy Lock mode in settings.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Start/Stop Transcription:</div>
              <div>Ctrl+Space (Cmd+Space on Mac)</div>
              
              <div className="font-medium">Create New Note:</div>
              <div>Ctrl+N (Cmd+N on Mac)</div>
              
              <div className="font-medium">Save Note:</div>
              <div>Ctrl+S (Cmd+S on Mac)</div>
              
              <div className="font-medium">Export as Word:</div>
              <div>Ctrl+E (Cmd+E on Mac)</div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2">Technology</h3>
            <p className="mb-2">
              Meeting Note Taker is built with modern web technologies:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>React + Vite for the user interface</li>
              <li>Web Speech API for speech recognition</li>
              <li>docx.js for Word document generation</li>
              <li>jsPDF for PDF generation</li>
              <li>Tailwind CSS for styling</li>
              <li>Browser LocalStorage for secure, offline saving</li>
            </ul>
          </section>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Meeting Note Taker v1.0.0</p>
          <p>MIT License - Open Source</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;
