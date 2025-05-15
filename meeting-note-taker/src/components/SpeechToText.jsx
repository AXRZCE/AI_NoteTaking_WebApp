import React, { useState, useEffect } from "react";
import useSpeechToText from "../hooks/useSpeechToText.jsx";
import useSystemAudioCapture from "../hooks/useSystemAudioCapture.jsx";

export default function SpeechToText({ onTranscriptChange, initialTranscript = "", language = 'en-US' }) {
  const [appendMode, setAppendMode] = useState(true);
  const [audioSource, setAudioSource] = useState("microphone"); // "microphone" or "system"

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
    error: systemAudioError
  } = useSystemAudioCapture({
    onAudioCaptured: (audioData) => {
      // This is where we would process the audio data
      // For now, we're just using this to capture system audio
      // The actual transcription still happens through the Web Speech API
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
        // For system audio, we still need to use the microphone for speech recognition
        // but we'll also capture system audio to route it to the microphone
        await startCapturing();
        startListening();
      }
    }
  };

  const handleReset = () => {
    resetTranscript();
  };

  const handleAudioSourceChange = (source) => {
    // Stop any active recording before changing source
    if (isActive) {
      stopListening();
      stopCapturing();
    }
    setAudioSource(source);
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

      {/* Info Box */}
      <div className="mt-3 text-sm text-gray-500">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-1">Speech Recognition Info:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Works best in Chrome, Edge, and Safari</li>
            <li>Requires microphone permission</li>
            {audioSource === "system" && (
              <li className="font-medium text-blue-700">
                System Audio mode will ask for screen sharing permission - select "Share system audio" when prompted
              </li>
            )}
            <li>All processing happens locally in your browser</li>
            <li>No data is sent to any server</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
