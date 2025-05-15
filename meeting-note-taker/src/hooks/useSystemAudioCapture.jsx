import { useState, useRef, useEffect } from "react";

/**
 * Hook to capture system audio for transcription
 * This uses the browser's getDisplayMedia API to capture system audio
 */
const useSystemAudioCapture = ({ onAudioCaptured }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);

  // Start capturing system audio
  const startCapturing = async () => {
    try {
      setError(null);
      
      // Check if browser supports getDisplayMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error("Your browser doesn't support screen sharing with audio. Please try Chrome or Edge.");
      }

      // Request screen sharing with audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: true,
      });

      // Check if audio track is available
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error("No audio track available. Please make sure to select 'Share system audio' when prompted.");
      }

      // Store the stream for later cleanup
      mediaStreamRef.current = stream;

      // Create audio context to process the audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create source node from the stream
      const source = audioContext.createMediaStreamSource(stream);
      
      // Create a script processor node to access the audio data
      // Note: ScriptProcessorNode is deprecated but still widely supported
      // In a production app, consider using AudioWorklet instead
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      // Connect the nodes
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      // Process audio data
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        if (onAudioCaptured) {
          onAudioCaptured(inputData);
        }
      };
      
      // Handle when user stops sharing
      stream.getAudioTracks()[0].onended = () => {
        stopCapturing();
      };

      setIsCapturing(true);
    } catch (err) {
      setError(err.message);
      console.error("Error capturing system audio:", err);
    }
  };

  // Stop capturing system audio
  const stopCapturing = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsCapturing(false);
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
    error
  };
};

export default useSystemAudioCapture;
