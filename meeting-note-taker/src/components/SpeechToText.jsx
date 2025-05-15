import React, { useState, useEffect } from "react";
import useSpeechToText from "../hooks/useSpeechToText.jsx";

export default function SpeechToText({ onTranscriptChange, initialTranscript = "", language = 'en-US' }) {
  const [appendMode, setAppendMode] = useState(true);
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
    error,
    isBrowserSupported,
    permissionStatus
  } = useSpeechToText({
    onTranscriptChange,
    appendMode,
    language
  });

  // Update the transcript when initialTranscript changes
  useEffect(() => {
    setTranscript(initialTranscript);
  }, [initialTranscript, setTranscript]);

  const handleToggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleReset = () => {
    resetTranscript();
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={handleToggleListening}
          className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-colors ${
            listening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          aria-label={listening ? "Stop speech recognition" : "Start speech recognition"}
          disabled={!isBrowserSupported || permissionStatus === "denied"}
        >
          {listening ? (
            <>
              <span className="inline-block h-3 w-3 rounded-full bg-white animate-pulse"></span>
              Stop
            </>
          ) : (
            "Start"
          )}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg shadow bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          aria-label="Reset transcript"
        >
          Reset
        </button>

        <div className="flex items-center gap-2 ml-2">
          <input
            type="checkbox"
            id="append-mode"
            checked={appendMode}
            onChange={() => setAppendMode(!appendMode)}
            className="h-4 w-4 accent-blue-600"
            aria-label="Append mode"
          />
          <label htmlFor="append-mode" className="text-gray-700">
            Append Mode
          </label>
        </div>

        {listening && (
          <span className="text-sm font-medium text-green-600 ml-2">
            Listening...
          </span>
        )}
      </div>

      <textarea
        className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white"
        value={transcript}
        readOnly
        aria-label="Speech transcript"
        placeholder="Transcript will appear here as you speak..."
      />

      {error && (
        <div className="text-red-600 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="mt-3 text-sm text-gray-500">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-1">Speech Recognition Info:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Works best in Chrome, Edge, and Safari</li>
            <li>Requires microphone permission</li>
            <li>All processing happens locally in your browser</li>
            <li>No data is sent to any server</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
