import { useState, useRef, useEffect } from "react";

/**
 * Hook to capture system audio for transcription
 * This uses multiple approaches to capture system audio for maximum compatibility
 */
const useSystemAudioCapture = ({ onAudioCaptured, onDebugInfo }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneStreamRef = useRef(null);

  // Helper function to log debug information
  const logDebug = (info) => {
    const newInfo = { ...debugInfo, ...info, timestamp: new Date().toISOString() };
    setDebugInfo(newInfo);
    if (onDebugInfo) {
      onDebugInfo(newInfo);
    }
    console.log("Audio Capture Debug:", newInfo);
  };

  // Method 1: Capture system audio via screen sharing
  const captureViaScreenShare = async () => {
    try {
      logDebug({ method: "screenShare", status: "starting" });

      // Check if browser supports getDisplayMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Your browser doesn't support screen sharing with audio. Please try Chrome or Edge.");
      }

      // Request screen sharing with audio
      const constraints = {
        video: {
          displaySurface: "browser",
          logicalSurface: true,
          cursor: "never",
          width: { ideal: 640 },
          height: { ideal: 360 },
          frameRate: { ideal: 1 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      logDebug({ method: "screenShare", status: "requesting", constraints });
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

      // Check if audio track is available
      const audioTracks = stream.getAudioTracks();
      logDebug({
        method: "screenShare",
        status: "received",
        audioTracks: audioTracks.length,
        audioTrackLabels: audioTracks.map(track => track.label),
        videoTracks: stream.getVideoTracks().length
      });

      if (audioTracks.length === 0) {
        throw new Error("No audio track available. Please make sure to select 'Share system audio' when prompted.");
      }

      // Store the stream for later cleanup
      mediaStreamRef.current = stream;

      // Create audio context to process the audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      logDebug({ method: "screenShare", status: "audioContextCreated", sampleRate: audioContext.sampleRate });

      // Create source node from the stream
      const source = audioContext.createMediaStreamSource(stream);

      // Create an analyser to monitor audio levels
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Connect the source to the analyser
      source.connect(analyser);

      // Connect to destination to hear the audio (optional - can be commented out)
      // analyser.connect(audioContext.destination);

      // Set up audio level monitoring
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!isCapturing || !analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Log audio level periodically (every 3 seconds)
        if (Date.now() % 3000 < 100) {
          logDebug({ method: "screenShare", status: "monitoring", audioLevel: average });
        }

        // If we have a callback, send the audio data
        if (onAudioCaptured && average > 5) { // Only send if there's actual audio
          onAudioCaptured(dataArray);
        }

        // Continue monitoring
        requestAnimationFrame(checkAudioLevel);
      };

      // Start monitoring audio levels
      checkAudioLevel();

      // Handle when user stops sharing
      stream.getAudioTracks()[0].onended = () => {
        logDebug({ method: "screenShare", status: "trackEnded" });
        stopCapturing();
      };

      logDebug({ method: "screenShare", status: "success" });
      return true;
    } catch (err) {
      logDebug({ method: "screenShare", status: "error", error: err.message });
      console.error("Error capturing system audio via screen share:", err);
      return false;
    }
  };

  // Method 2: Fallback to microphone with system audio routing instructions
  const captureViaMicrophone = async () => {
    try {
      logDebug({ method: "microphone", status: "starting" });

      // Request microphone access
      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      };

      logDebug({ method: "microphone", status: "requesting", constraints });
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Store the stream for later cleanup
      microphoneStreamRef.current = stream;

      logDebug({
        method: "microphone",
        status: "received",
        audioTracks: stream.getAudioTracks().length,
        audioTrackLabels: stream.getAudioTracks().map(track => track.label)
      });

      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create source node from the stream
      const source = audioContext.createMediaStreamSource(stream);

      // Create an analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Connect the source to the analyser
      source.connect(analyser);

      // Set up audio level monitoring
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!isCapturing || !analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Log audio level periodically
        if (Date.now() % 3000 < 100) {
          logDebug({ method: "microphone", status: "monitoring", audioLevel: average });
        }

        // Continue monitoring
        requestAnimationFrame(checkAudioLevel);
      };

      // Start monitoring audio levels
      checkAudioLevel();

      logDebug({ method: "microphone", status: "success" });
      return true;
    } catch (err) {
      logDebug({ method: "microphone", status: "error", error: err.message });
      console.error("Error capturing audio via microphone:", err);
      return false;
    }
  };

  // Start capturing system audio using the best available method
  const startCapturing = async () => {
    try {
      setError(null);
      logDebug({ action: "startCapturing" });

      // Try screen sharing method first
      const screenShareSuccess = await captureViaScreenShare();

      // If screen sharing fails, fall back to microphone method
      if (!screenShareSuccess) {
        logDebug({ status: "fallbackToMicrophone" });
        const micSuccess = await captureViaMicrophone();

        if (!micSuccess) {
          throw new Error("Failed to capture audio. Please check your browser permissions and try again.");
        }

        // Show a warning that we're using the fallback method
        setError("Using microphone fallback. For best results with system audio, please use Chrome or Edge and ensure you select 'Share system audio' when prompted.");
      }

      setIsCapturing(true);
    } catch (err) {
      setError(err.message);
      logDebug({ status: "startCapturingFailed", error: err.message });
      console.error("Error starting audio capture:", err);
    }
  };

  // Stop capturing system audio
  const stopCapturing = () => {
    logDebug({ action: "stopCapturing" });

    // Stop screen sharing stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Stop microphone stream
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(err => {
        console.error("Error closing audio context:", err);
      });
      audioContextRef.current = null;
    }

    // Clear analyser
    analyserRef.current = null;

    setIsCapturing(false);
    logDebug({ status: "captureStoppedSuccessfully" });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCapturing();
    };
  }, []);

  return {
    isCapturing,
    startCapturing,
    stopCapturing,
    error,
    debugInfo
  };
};

export default useSystemAudioCapture;
