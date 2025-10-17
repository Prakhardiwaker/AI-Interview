// hooks/useAudioRecorder.js
import { useState, useRef, useCallback, useEffect } from "react";

export const useAudioRecorder = (onFrequencyUpdate = null) => {
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const animationFrameRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [frequency, setFrequency] = useState([]);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingStartTimeRef = useRef(null);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Get frequency data for visualization
  const updateFrequency = useCallback(() => {
    if (analyserRef.current && isRecording) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Get a subset of frequencies for visualization (20 bars)
      const frequencyData = Array.from(dataArray.slice(0, 20));
      setFrequency(frequencyData);

      if (onFrequencyUpdate) {
        onFrequencyUpdate(frequencyData);
      }

      animationFrameRef.current = requestAnimationFrame(updateFrequency);
    }
  }, [isRecording, onFrequencyUpdate]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Setup Web Audio API
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser for frequency visualization
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();

      // Start frequency visualization
      updateFrequency();

      // Update recording time
      const timerInterval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Store interval ID for cleanup
      mediaRecorderRef.current.timerInterval = timerInterval;
    } catch (err) {
      setError(err.message);
      console.error("Error accessing microphone:", err);
    }
  }, [updateFrequency]);

  // Stop recording and return audio blob
  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          try {
            // Create audio blob from recorded chunks
            const audioBlob = new Blob(chunksRef.current, {
              type: "audio/webm",
            });

            // Cleanup
            streamRef.current?.getTracks().forEach((track) => track.stop());
            audioContextRef.current?.close();

            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }

            if (mediaRecorderRef.current.timerInterval) {
              clearInterval(mediaRecorderRef.current.timerInterval);
            }

            setIsRecording(false);
            setFrequency([]);
            setRecordingTime(0);

            resolve(audioBlob);
          } catch (err) {
            reject(err);
          }
        };

        mediaRecorderRef.current.stop();
      } else {
        reject(new Error("No recording in progress"));
      }
    });
  }, [isRecording]);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsRecording(false);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isRecording]);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsRecording(true);
      updateFrequency();
    }
  }, [updateFrequency]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaRecorderRef.current?.timerInterval) {
        clearInterval(mediaRecorderRef.current.timerInterval);
      }
    };
  }, []);

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isRecording,
    frequency,
    error,
    recordingTime,
    formatTime,
  };
};
