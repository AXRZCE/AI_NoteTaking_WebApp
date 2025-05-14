import React, { useState, useEffect } from "react";
import useSpeechToText from "../hooks/useSpeechToText.jsx";

const SpeechToText = ({ onTranscriptChange, initialTranscript = "", language = 'en-US' }) => {
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
    <div className="p-4 bg-white rounded-2xl shadow mb-4">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleListening}
            className={`px-4 py-2 rounded-xl shadow flex items-center gap-2 transition-colors ${
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
            className="px-4 py-2 rounded-xl shadow bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            aria-label="Reset transcript"
          >
            Reset
          </button>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="append-mode"
              checked={appendMode}
              onChange={() => setAppendMode(!appendMode)}
              className="h-4 w-4"
              aria-label="Append mode"
            />
            <label htmlFor="append-mode" className="text-gray-700">
              Append Mode
            </label>
          </div>
        </div>

        <div className="text-gray-700 flex items-center gap-2">
          {listening ? (
            <span className="font-medium text-green-600">Listening...</span>
          ) : (
            <span>Click Start to transcribe</span>
          )}
        </div>
      </div>

      <textarea
        className="w-full h-40 p-2 border rounded-xl focus:outline-none focus:ring"
        value={transcript}
        readOnly
        aria-label="Speech transcript"
      />

      {error && (
        <div className="text-red-500 mt-2 p-2 bg-red-50 border border-red-200 rounded" role="alert">
          {error}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <h3 className="font-medium mb-1">Speech Recognition Info:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Works best in Chrome, Edge, and Safari</li>
          <li>Requires microphone permission</li>
          <li>All processing happens locally in your browser</li>
          <li>No data is sent to any server</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechToText;
