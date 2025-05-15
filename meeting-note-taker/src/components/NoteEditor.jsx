import React, { useState } from "react";
import SpeechToText from "./SpeechToText";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";
import AudioRecorder from "./AudioRecorder";
import SystemAudioGuide from "./SystemAudioGuide";

export default function NoteEditor({
  note,
  onUpdateContent,
  onImport,
  language = 'en-US',
  fontSize = 16
}) {
  const [transcriptVisible, setTranscriptVisible] = useState(true);
  const [audioToolsVisible, setAudioToolsVisible] = useState(false);
  const [systemGuideVisible, setSystemGuideVisible] = useState(false);

  const handleChange = (e) => {
    if (onUpdateContent) {
      onUpdateContent(e.target.value);
    }
  };

  const handleTranscriptChange = (transcript) => {
    if (onUpdateContent) {
      onUpdateContent(transcript);
    }
  };

  const handleImport = (content) => {
    if (onImport) {
      onImport(content);
    }
  };

  // Handle audio recording completion
  const handleRecordingComplete = (audioBlob, audioUrl) => {
    // We could potentially send this to a server-side speech-to-text service
    // For now, we'll just provide the recording for manual transcription
    console.log("Recording completed:", audioUrl);
  };

  if (!note) {
    return (
      <section className="bg-white rounded-2xl shadow-lg p-6 mb-4 flex items-center justify-center h-64">
        <p className="text-gray-500">Select a note or create a new one to get started</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 mb-4">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{note.title}</h2>
        <span className="text-sm text-gray-400">
          Created: {new Date(note.createdAt).toLocaleString()}
        </span>
      </header>

      {/* Speech to Text Component */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-700">Speech Recognition</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSystemGuideVisible(!systemGuideVisible)}
              className="text-sm text-yellow-600 hover:text-yellow-800"
            >
              {systemGuideVisible ? 'Hide System Audio Guide' : 'System Audio Guide'}
            </button>
            <button
              onClick={() => setAudioToolsVisible(!audioToolsVisible)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {audioToolsVisible ? 'Hide Audio Tools' : 'Show Audio Tools'}
            </button>
            <button
              onClick={() => setTranscriptVisible(!transcriptVisible)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {transcriptVisible ? 'Hide Speech Recognition' : 'Show Speech Recognition'}
            </button>
          </div>
        </div>

        {/* System Audio Guide */}
        {systemGuideVisible && <SystemAudioGuide />}

        {/* Audio Recorder */}
        {audioToolsVisible && <AudioRecorder onRecordingComplete={handleRecordingComplete} />}

        {/* Speech Recognition */}
        {transcriptVisible && (
          <SpeechToText
            onTranscriptChange={handleTranscriptChange}
            initialTranscript={note.content}
            language={language}
          />
        )}
      </div>

      {/* Note Editor */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="meeting-notes" className="font-medium text-gray-700">
            Meeting Notes:
          </label>
          <div className="text-sm text-gray-400">
            {note.content ? note.content.length : 0} characters
          </div>
        </div>

        <textarea
          id="meeting-notes"
          className="w-full h-56 p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          style={{ fontSize: `${fontSize}px` }}
          value={note.content || ''}
          onChange={handleChange}
          placeholder="Edit your meeting notes here..."
          aria-label="Meeting notes editor"
        />

        <div className="mt-2 text-sm text-gray-500">
          <p>
            You can edit these notes while speech recognition is paused.
            When speech recognition is active, new text will be added based on the append mode setting.
          </p>
        </div>
      </div>

      {/* Export/Import Buttons */}
      <div className="flex flex-wrap gap-2">
        <ImportButton onImport={handleImport} />
        <ExportButton
          notes={note.content || ''}
          noteTitle={note.title}
          transcript={note.transcript}
        />
      </div>
    </section>
  );
}
