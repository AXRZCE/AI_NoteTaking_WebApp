import React from 'react';

export default function AboutPanel({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40 transition-opacity duration-200">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[500px] max-w-full max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">About & Privacy</h3>
          <button
            className="text-gray-400 hover:text-gray-700 transition-colors"
            onClick={onClose}
            aria-label="Close about panel"
          >
            &#10005;
          </button>
        </header>

        <div className="space-y-5">
          <section>
            <h4 className="font-medium text-blue-700 mb-2">What is Meeting Note Taker?</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Meeting Note Taker is a free, privacy-first web application for real-time meeting transcription and note-taking.
              It's designed for anyone who needs fast, secure, and easy-to-use note-taking tools—no installation,
              no server, no compromise on privacy.
            </p>
          </section>

          <section>
            <h4 className="font-medium text-blue-700 mb-2">Privacy & Security</h4>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Meeting Note Taker is built with privacy as the top priority:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>All speech processing happens locally in your browser</li>
                <li>Your audio and notes never leave your device</li>
                <li>No data is sent to any server</li>
                <li>No analytics, no cookies, no tracking</li>
                <li>All notes are stored only in your browser's local storage</li>
                <li>Optional Privacy Lock mode can clear notes when you close the app</li>
              </ul>
            </div>
          </section>

          <section>
            <h4 className="font-medium text-blue-700 mb-2">Frequently Asked Questions</h4>

            <div className="space-y-3">
              <details className="group">
                <summary className="font-medium text-sm cursor-pointer hover:text-blue-600">
                  Which browsers are supported?
                </summary>
                <p className="text-sm text-gray-600 mt-1 pl-4">
                  Meeting Note Taker works best in Chrome, Edge, and Safari. Firefox has limited support for the Web Speech API.
                </p>
              </details>

              <details className="group">
                <summary className="font-medium text-sm cursor-pointer hover:text-blue-600">
                  How do I grant microphone permissions?
                </summary>
                <p className="text-sm text-gray-600 mt-1 pl-4">
                  When you first click "Start" to begin transcription, your browser will ask for permission to use your microphone.
                  Click "Allow" to grant permission. If you accidentally denied permission, you can click on the padlock icon in your
                  browser's address bar to change the permission settings.
                </p>
              </details>

              <details className="group">
                <summary className="font-medium text-sm cursor-pointer hover:text-blue-600">
                  How do I transcribe online meeting audio?
                </summary>
                <div className="text-sm text-gray-600 mt-1 pl-4 space-y-2">
                  <p>
                    Select "System Audio (Meetings)" in the Speech Recognition section, then click "Start".
                    Your browser will ask for screen sharing permission - make sure to check "Share system audio"
                    when prompted AND select "Entire Screen" or the specific application window.
                  </p>
                  <p className="font-medium text-blue-700">
                    Important: For desktop applications like YouTube app (not browser), Zoom, or Teams,
                    you must select "Entire Screen" when sharing and ensure the application is actively playing audio.
                  </p>
                  <p>
                    If you're having trouble, click the "Show Debug" button in the Speech Recognition panel to see
                    diagnostic information that can help troubleshoot the issue.
                  </p>
                </div>
              </details>

              <details className="group">
                <summary className="font-medium text-sm cursor-pointer hover:text-blue-600">
                  Will my notes be saved if I close the browser?
                </summary>
                <p className="text-sm text-gray-600 mt-1 pl-4">
                  Yes, your notes are automatically saved in your browser's local storage and will be available
                  when you return, unless you've enabled Privacy Lock mode in settings.
                </p>
              </details>
            </div>
          </section>

          <section>
            <h4 className="font-medium text-blue-700 mb-2">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <div className="font-medium text-gray-700">Start/Stop Transcription:</div>
              <div className="text-gray-600">Ctrl+Space (Cmd+Space on Mac)</div>

              <div className="font-medium text-gray-700">Create New Note:</div>
              <div className="text-gray-600">Ctrl+N (Cmd+N on Mac)</div>

              <div className="font-medium text-gray-700">Save Note:</div>
              <div className="text-gray-600">Ctrl+S (Cmd+S on Mac)</div>
            </div>
          </section>
        </div>

        <div className="mt-6 text-center text-gray-400 text-xs">
          <p>Meeting Note Taker v1.0.0</p>
          <p>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Powered by Web Speech API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
