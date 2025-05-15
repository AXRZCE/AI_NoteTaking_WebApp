import React, { useState, useEffect, useRef } from "react";
import useSpeechToText from "../hooks/useSpeechToText.jsx";
import useSystemAudioCapture from "../hooks/useSystemAudioCapture.jsx";

export default function SpeechToText({ onTranscriptChange, initialTranscript = "", language = 'en-US' }) {
  const [appendMode, setAppendMode] = useState(true);
  const [audioSource, setAudioSource] = useState("microphone"); // "microphone" or "system"
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const debugLogRef = useRef(null);

  // Speech recognition hook for microphone
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
    error: micError,
    isBrowserSupported,
    permissionStatus
  } = useSpeechToText({
    onTranscriptChange,
    appendMode,
    language
  });

  // System audio capture hook
  const {
    isCapturing,
    startCapturing,
    stopCapturing,
    error: systemAudioError,
    debugInfo
  } = useSystemAudioCapture({
    onAudioCaptured: (audioData) => {
      // This is where we would process the audio data
      // For now, we're just using this to capture system audio
      // The actual transcription still happens through the Web Speech API
    },
    onDebugInfo: (info) => {
      setDebugLogs(prev => [...prev, info]);
      // Scroll debug log to bottom
      if (debugLogRef.current) {
        debugLogRef.current.scrollTop = debugLogRef.current.scrollHeight;
      }
    }
  });

  // Combined error state
  const error = micError || systemAudioError;

  // Combined listening state
  const isActive = listening || isCapturing;

  // Update the transcript when initialTranscript changes
  useEffect(() => {
    setTranscript(initialTranscript);
  }, [initialTranscript, setTranscript]);

  const handleToggleListening = async () => {
    if (isActive) {
      // Stop all active recording
      stopListening();
      stopCapturing();
    } else {
      // Start recording based on selected source
      if (audioSource === "microphone") {
        startListening();
      } else if (audioSource === "system") {
        // For system audio, we need to capture system audio and use speech recognition
        setDebugLogs([]); // Clear debug logs
        await startCapturing();
        startListening();
      }
    }
  };

  const handleReset = () => {
    resetTranscript();
    setDebugLogs([]);
  };

  const handleAudioSourceChange = (source) => {
    // Stop any active recording before changing source
    if (isActive) {
      stopListening();
      stopCapturing();
    }
    setAudioSource(source);
    setDebugLogs([]);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {/* Audio Source Selection */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="font-medium text-gray-700">Audio Source:</div>
        <div className="flex gap-2">
          <button
            onClick={() => handleAudioSourceChange("microphone")}
            className={`px-3 py-1 rounded-lg text-sm ${
              audioSource === "microphone"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={isActive}
          >
            Microphone
          </button>
          <button
            onClick={() => handleAudioSourceChange("system")}
            className={`px-3 py-1 rounded-lg text-sm ${
              audioSource === "system"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={isActive}
          >
            System Audio (Meetings)
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={handleToggleListening}
          className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 transition-colors ${
            isActive
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          aria-label={isActive ? "Stop speech recognition" : "Start speech recognition"}
          disabled={!isBrowserSupported || permissionStatus === "denied"}
        >
          {isActive ? (
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

        {isActive && (
          <span className="text-sm font-medium text-green-600 ml-2">
            {audioSource === "microphone" ? "Listening to microphone..." : "Capturing system audio..."}
          </span>
        )}

        {/* Debug toggle button */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="ml-auto text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          {showDebug ? "Hide Debug" : "Show Debug"}
        </button>
      </div>

      {/* Transcript Display */}
      <textarea
        className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-white"
        value={transcript}
        readOnly
        aria-label="Speech transcript"
        placeholder="Transcript will appear here as you speak..."
      />

      {/* Error Display */}
      {error && (
        <div className="text-red-600 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Debug Panel */}
      {showDebug && (
        <div className="mt-3 border border-gray-300 rounded-lg p-2">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Debug Information:</h4>
          <div
            ref={debugLogRef}
            className="bg-gray-800 text-green-400 p-2 rounded text-xs font-mono h-32 overflow-y-auto"
          >
            {debugLogs.length === 0 ? (
              <p>No debug logs yet. Start capturing to see logs.</p>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  {JSON.stringify(log, null, 2)}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-3 text-sm text-gray-500">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-1">Speech Recognition Info:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Works best in Chrome and Edge browsers</li>
            <li>Requires microphone permission</li>
            {audioSource === "system" && (
              <>
                <li className="font-medium text-blue-700">
                  System Audio mode captures sound from your entire computer
                </li>
                <li className="font-medium text-blue-700">
                  When prompted, select "Share system audio" AND select "Entire Screen" or an application window
                </li>
                <li>
                  For YouTube app or other desktop applications, share your entire screen and make sure the app is playing audio
                </li>
              </>
            )}
            <li>All processing happens locally in your browser</li>
            <li>No data is sent to any server</li>
          </ul>
        </div>

        {audioSource === "system" && (
          <div className="bg-yellow-50 p-3 rounded-lg mt-2 border border-yellow-200">
            <h3 className="font-medium text-yellow-800 mb-1">Troubleshooting System Audio:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700">
              <li>Make sure you're using Chrome or Edge (latest version)</li>
              <li>When the sharing dialog appears, check "Share system audio"</li>
              <li>Select "Entire Screen" for best results with desktop applications</li>
              <li>Make sure your application (YouTube, Zoom, etc.) is actually playing audio</li>
              <li>Try adjusting your system volume to be louder</li>
              <li>If it still doesn't work, click "Show Debug" to see diagnostic information</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
