// src/pages/InterviewSession.jsx
import React, { useState, useEffect, useRef } from "react";
import { Volume2, SkipForward } from "lucide-react";
import { useNavigate } from "react-router-dom";

const useAutoDetectRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [frequency, setFrequency] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.start();

      return analyser;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      return null;
    }
  };

  const stopAudioCapture = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
          streamRef.current?.getTracks().forEach((track) => track.stop());
          setIsRecording(false);
          setFrequency([]);
          setRecordingTime(0);
          resolve(audioBlob);
        };
        mediaRecorderRef.current.stop();
      }
    });
  };

  const detectSpeech = (analyser, onSpeechStart, onSpeechEnd) => {
    let isSpeaking = false;
    let silenceCounter = 0;
    const SILENCE_THRESHOLD = 30;
    const VOLUME_THRESHOLD = 20;
    let timeElapsed = 0;

    const checkAudio = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

      setFrequency(Array.from(dataArray.slice(0, 20)));

      if (average > VOLUME_THRESHOLD) {
        silenceCounter = 0;
        if (!isSpeaking) {
          isSpeaking = true;
          onSpeechStart();
        }
      } else {
        silenceCounter++;
        if (isSpeaking && silenceCounter > SILENCE_THRESHOLD) {
          isSpeaking = false;
          onSpeechEnd();
        }
      }

      if (isSpeaking) {
        timeElapsed++;
        setRecordingTime(timeElapsed);
      }

      requestAnimationFrame(checkAudio);
    };

    checkAudio();
  };

  return {
    startAudioCapture,
    stopAudioCapture,
    detectSpeech,
    frequency,
    recordingTime,
  };
};

const AudioVisualization = ({ frequency }) => {
  return (
    <div className="flex items-end justify-center gap-1 h-32">
      {frequency.map((freq, idx) => (
        <div
          key={idx}
          className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full transition-all duration-75"
          style={{
            height: `${Math.min((freq / 255) * 120, 120)}px`,
            opacity: Math.max(0.3, freq / 255),
          }}
        />
      ))}
    </div>
  );
};

const InterviewSession = ({ sessionConfig, onComplete }) => {
  const navigate = useNavigate();

  // Provide default values if sessionConfig is null
  const config = sessionConfig || {
    role: "Software Developer",
    interviewType: "technical",
    duration: 5,
  };

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState((config.duration || 5) * 60);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showUserVideo, setShowUserVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusScore, setFocusScore] = useState(1.0);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(5);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const {
    startAudioCapture,
    stopAudioCapture,
    detectSpeech,
    frequency,
    recordingTime,
  } = useAutoDetectRecorder();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const speakQuestion = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsListening(true);
        setTimeout(() => {
          startListening();
        }, 500);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = async () => {
    setIsCapturing(true);
    const analyser = await startAudioCapture();

    if (analyser) {
      detectSpeech(
        analyser,
        () => {
          // Speech detected
        },
        () => {
          // Speech ended
          handleSpeechEnd();
        }
      );
    }
  };

  const handleSpeechEnd = async () => {
    setIsCapturing(false);
    setIsListening(false);
    setLoading(true);

    try {
      const audioBlob = await stopAudioCapture();

      const simulatedTranscript = `[Answer recorded - ${recordingTime} seconds]`;
      setTranscript(simulatedTranscript);

      const newAnswer = {
        question: currentQuestion,
        answer: simulatedTranscript,
        recordingTime,
      };
      setAnswers([...answers, newAnswer]);
      setQuestionsRemaining((prev) => Math.max(0, prev - 1));

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const questions = [
        "What are your key strengths and how do they apply to this role?",
        "Describe a challenging project you worked on and how you solved it.",
        "How do you handle conflicts or disagreements with team members?",
        "What is your approach to learning new technologies and frameworks?",
        "Tell me about your proudest achievement in your career.",
      ];

      if (answers.length < 4) {
        const nextQuestion =
          questions[Math.floor(Math.random() * questions.length)];
        setCurrentQuestion(nextQuestion);
        setTranscript("");

        setTimeout(() => {
          speakQuestion(nextQuestion);
        }, 1000);
      } else {
        setSessionComplete(true);
      }
    } catch (err) {
      setError("Failed to process answer");
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setSessionComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, []);

  // Setup webcam
  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 180, height: 180 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    if (showUserVideo) {
      setupWebcam();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showUserVideo]);

  // Initialize with first question
  useEffect(() => {
    const initializeInterview = async () => {
      setLoading(true);
      try {
        const firstQuestion =
          "Tell me about your background and experience in this role?";
        setCurrentQuestion(firstQuestion);

        setTimeout(() => {
          speakQuestion(firstQuestion);
        }, 1000);
      } catch (err) {
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    initializeInterview();
  }, []);

  const handleSkipQuestion = () => {
    window.speechSynthesis.cancel();
    setIsCapturing(false);
    setIsListening(false);
    setTranscript("");
    setCurrentQuestion("");
    setQuestionsRemaining((prev) => Math.max(0, prev - 1));
  };

  const handleRepeatQuestion = () => {
    window.speechSynthesis.cancel();
    speakQuestion(currentQuestion);
  };

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Interview Complete!
          </h1>
          <p className="text-gray-300 mb-4 text-lg">
            Great job finishing the interview.
          </p>
          <p className="text-gray-400 mb-8">
            You answered{" "}
            <span className="font-bold text-purple-400">{answers.length}</span>{" "}
            questions
          </p>

          <div className="space-y-3">
            <button
              onClick={() =>
                onComplete?.({
                  answers,
                  totalTime: config.duration * 60 - timeLeft,
                })
              }
              className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition"
            >
              View Results
            </button>
            <button
              onClick={() => navigate("/interviews")}
              className="w-full px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
            >
              Back to Interviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Interview Session</h1>
          <p className="text-gray-400 text-sm mt-1">
            Role: {config.role || "Software Developer"}
          </p>
        </div>
        <div
          className={`text-center px-4 py-2 rounded-lg ${
            timeLeft < 60
              ? "bg-red-500/20 border border-red-500/50"
              : "bg-white/10 border border-white/20"
          }`}
        >
          <p className="text-gray-400 text-xs">Time Left</p>
          <p
            className={`text-2xl font-bold font-mono ${
              timeLeft < 60 ? "text-red-400 animate-pulse" : "text-green-400"
            }`}
          >
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-12 gap-6">
        {/* Main Interview Area */}
        <div className="md:col-span-9">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-400 text-sm uppercase tracking-widest">
                Question {answers.length + 1}
              </p>
              <span className="text-xs font-semibold px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full">
                {questionsRemaining} remaining
              </span>
            </div>

            {loading && !currentQuestion ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mb-3"></div>
                <p className="text-gray-300">Loading next question...</p>
              </div>
            ) : (
              <>
                {/* Question Display */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {currentQuestion}
                  </h2>
                  <div className="flex items-center gap-2 mt-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isSpeaking
                          ? "bg-green-500/30 text-green-200 animate-pulse"
                          : "bg-gray-500/30 text-gray-200"
                      }`}
                    >
                      {isSpeaking ? "Speaking Question..." : "Ready"}
                    </span>
                  </div>
                </div>

                {/* Audio Visualization */}
                <div className="bg-black/30 rounded-xl p-8 my-8 border border-white/5">
                  {isCapturing ? (
                    <div>
                      <AudioVisualization frequency={frequency} />
                      <p className="text-center text-gray-300 mt-4 font-semibold">
                        {isListening
                          ? "Listening... Speak now"
                          : "Processing..."}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <Volume2
                          size={40}
                          className="text-gray-400 mx-auto mb-2"
                        />
                        <p className="text-gray-300">
                          Waiting for question to be read...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recording Time */}
                {isCapturing && (
                  <div className="text-center mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-gray-300">
                      Recording:{" "}
                      <span className="text-red-400 font-bold animate-pulse">
                        {formatTime(recordingTime)}
                      </span>
                    </p>
                  </div>
                )}

                {/* Transcript Display */}
                {transcript && (
                  <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-5 mb-6">
                    <p className="text-sm text-purple-200 font-semibold mb-3">
                      Answer Recorded
                    </p>
                    <p className="text-white leading-relaxed">{transcript}</p>
                  </div>
                )}

                {/* Focus Score */}
                {!isCapturing && transcript && (
                  <div className="mb-6 bg-black/30 rounded-xl p-5 border border-white/5">
                    <label className="text-gray-300 text-sm font-semibold mb-3 block">
                      How focused were you during this answer?
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={focusScore}
                        onChange={(e) =>
                          setFocusScore(parseFloat(e.target.value))
                        }
                        className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <span className="text-purple-400 font-bold min-w-fit">
                        {Math.round(focusScore * 100)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={handleRepeatQuestion}
                    disabled={loading || isSpeaking || isCapturing}
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
                  >
                    <Volume2 size={20} />
                    Repeat Question
                  </button>
                  <button
                    onClick={handleSkipQuestion}
                    disabled={loading || isSpeaking}
                    className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
                  >
                    <SkipForward size={20} />
                    Skip Question
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Answer History */}
          {answers.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Answers Given ({answers.length})
              </h3>
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {answers.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-black/30 rounded-lg p-4 border border-white/10"
                  >
                    <p className="text-purple-300 font-semibold mb-2">
                      Q{idx + 1}: {item.question}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Duration: {formatTime(item.recordingTime)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-3 space-y-6">
          {/* User Camera */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowUserVideo(!showUserVideo)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition border-b border-white/10"
            >
              {showUserVideo ? "Camera On" : "Camera Off"}
            </button>
            {showUserVideo ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-square object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <Volume2
                    size={40}
                    className="text-white mx-auto mb-2 opacity-70"
                  />
                  <p className="text-white text-sm opacity-70">Camera off</p>
                </div>
              </div>
            )}
          </div>

          {/* Session Status */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5">
              Session Status
            </h3>
            <div className="space-y-4">
              <div className="pb-4 border-b border-white/10">
                <p className="text-gray-400 text-sm mb-1">Questions Answered</p>
                <p className="text-3xl font-bold text-purple-400">
                  {answers.length}
                </p>
              </div>
              <div className="pb-4 border-b border-white/10">
                <p className="text-gray-400 text-sm mb-1">Time Left</p>
                <p className="text-3xl font-bold text-green-400">
                  {formatTime(timeLeft)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Microphone</p>
                <p
                  className={`text-sm font-semibold flex items-center gap-2 ${
                    isCapturing
                      ? "text-red-400 animate-pulse"
                      : isListening
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCapturing
                        ? "bg-red-400 animate-pulse"
                        : isListening
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  {isCapturing
                    ? "Recording"
                    : isListening
                    ? "Listening"
                    : "Idle"}
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-2xl p-5">
            <p className="text-sm text-blue-200 leading-relaxed">
              <span className="font-semibold block mb-2">How it works:</span>•
              Question will be read aloud • Start speaking naturally • Pause
              when done • System auto-detects • Next question plays
              automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
