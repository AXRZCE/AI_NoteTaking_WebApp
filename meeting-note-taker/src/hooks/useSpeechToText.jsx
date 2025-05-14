import { useState, useRef, useEffect } from "react";

const useSpeechToText = ({ onTranscriptChange, appendMode = false, language = 'en-US' }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt"); // "prompt", "granted", "denied"
  const recognitionRef = useRef(null);
  const currentTranscriptRef = useRef("");

  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isBrowserSupported = !!SpeechRecognition;

  // Check for microphone permissions
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "microphone" })
        .then((permissionStatus) => {
          setPermissionStatus(permissionStatus.state);

          permissionStatus.onchange = () => {
            setPermissionStatus(permissionStatus.state);
          };
        })
        .catch((error) => {
          console.error("Error checking microphone permission:", error);
        });
    }
  }, []);

  const startListening = () => {
    if (!isBrowserSupported) {
      setError("Speech Recognition is not supported in your browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (permissionStatus === "denied") {
      setError("Microphone access is denied. Please allow microphone access in your browser settings.");
      return;
    }

    setError(null);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    // Save current transcript for append mode
    currentTranscriptRef.current = transcript;

    recognition.onresult = (event) => {
      let newTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        newTranscript += event.results[i][0].transcript;
      }

      // In append mode, we add to the existing transcript
      const fullTranscript = appendMode
        ? currentTranscriptRef.current + " " + newTranscript
        : newTranscript;

      setTranscript(fullTranscript);
      if (onTranscriptChange) onTranscriptChange(fullTranscript);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setError("Microphone access was denied. Please allow microphone access to use speech recognition.");
        setPermissionStatus("denied");
      } else if (event.error === "no-speech") {
        // This is a common error that doesn't need to alarm the user
        setError("No speech detected. Please speak louder or check your microphone.");
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      // Only set listening to false if we're not in the middle of a restart
      if (recognitionRef.current === recognition) {
        setListening(false);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
    } catch (err) {
      setError(`Failed to start speech recognition: ${err.message}`);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const resetTranscript = () => {
    setTranscript("");
    currentTranscriptRef.current = "";
    if (onTranscriptChange) onTranscriptChange("");
  };

  const appendToTranscript = (text) => {
    const newTranscript = transcript + " " + text;
    setTranscript(newTranscript);
    currentTranscriptRef.current = newTranscript;
    if (onTranscriptChange) onTranscriptChange(newTranscript);
  };

  return {
    transcript,
    setTranscript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    appendToTranscript,
    error,
    isBrowserSupported,
    permissionStatus
  };
};

export default useSpeechToText;
