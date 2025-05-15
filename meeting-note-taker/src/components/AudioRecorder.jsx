import React, { useState, useRef, useEffect } from "react";

/**
 * A component that records audio directly and saves it as a file
 * This is a more reliable alternative to the system audio capture
 */
export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState("");
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  // Start recording audio
  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create audio blob and URL
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Notify parent component
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, url);
        }
      };
      
      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      setError(`Failed to start recording: ${err.message}`);
      console.error("Error starting recording:", err);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  // Format recording time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);
  
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
      <h3 className="font-medium text-gray-700 mb-3">Audio Recorder</h3>
      
      <div className="flex items-center gap-3 mb-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
          >
            <span className="w-3 h-3 rounded-full bg-white"></span>
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
          >
            <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>
            Stop Recording
          </button>
        )}
        
        {isRecording && (
          <div className="text-red-600 font-medium">
            Recording: {formatTime(recordingTime)}
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-600 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}
      
      {audioURL && !isRecording && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recording Preview:</h4>
          <audio controls src={audioURL} className="w-full"></audio>
          <div className="mt-2 flex gap-2">
            <a
              href={audioURL}
              download="meeting-recording.wav"
              className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
            >
              Download Recording
            </a>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-sm text-gray-500">
        <p>
          This recorder captures audio directly from your microphone. For meeting audio:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Position your device near the meeting speakers</li>
          <li>Ensure the meeting volume is loud enough</li>
          <li>Minimize background noise</li>
        </ul>
      </div>
    </div>
  );
}
