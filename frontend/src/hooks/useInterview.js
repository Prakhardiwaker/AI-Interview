// src/hooks/useInterview.js - Custom hook for interview management
import { useState, useEffect, useCallback } from "react";
import { storage } from "../lib/api";

/**
 * Custom hook for managing interview sessions
 * Provides utilities for session management, localStorage integration,
 * and interview state tracking
 */
export const useInterview = () => {
  const [currentSession, setCurrentSession] = useState(null);
  const [setupHistory, setSetupHistory] = useState([]);
  const [lastSetup, setLastSetup] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = useCallback(() => {
    const session = storage.getCurrentSession();
    const history = storage.getSetupHistory();
    const last = storage.getLastSetup();

    setCurrentSession(session);
    setSetupHistory(history);
    setLastSetup(last);
  }, []);

  // Start new interview session
  const startSession = useCallback((sessionData) => {
    const session = {
      ...sessionData,
      startTime: new Date().toISOString(),
      status: "active",
    };

    storage.saveCurrentSession(session);
    setCurrentSession(session);

    return session;
  }, []);

  // Update current session
  const updateSession = useCallback(
    (updates) => {
      if (!currentSession) {
        console.warn("No active session to update");
        return null;
      }

      const updated = {
        ...currentSession,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };

      storage.saveCurrentSession(updated);
      setCurrentSession(updated);

      return updated;
    },
    [currentSession]
  );

  // End current session
  const endSession = useCallback(() => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        status: "completed",
      };

      // Optionally save to history before clearing
      storage.clearCurrentSession();
      setCurrentSession(null);

      return endedSession;
    }
    return null;
  }, [currentSession]);

  // Check if session is active
  const isSessionActive = useCallback(() => {
    return currentSession !== null && currentSession.status === "active";
  }, [currentSession]);

  // Get session duration in minutes
  const getSessionDuration = useCallback(() => {
    if (!currentSession?.startTime) return 0;

    const start = new Date(currentSession.startTime);
    const now = new Date();
    const diffMs = now - start;
    return Math.floor(diffMs / 60000); // Convert to minutes
  }, [currentSession]);

  // Save setup configuration
  const saveSetupConfig = useCallback(
    (config) => {
      storage.saveSetupConfig(config);
      loadSessionData(); // Reload to update state
    },
    [loadSessionData]
  );

  // Get quick setup suggestions
  const getSetupSuggestions = useCallback(() => {
    if (setupHistory.length === 0) {
      return [
        { role: "frontend developer", interviewType: "technical", duration: 5 },
        { role: "backend developer", interviewType: "technical", duration: 10 },
        { role: "full stack developer", interviewType: "full", duration: 15 },
      ];
    }

    // Get unique recent setups
    const uniqueSetups = [];
    const seen = new Set();

    for (const setup of setupHistory) {
      const key = `${setup.role}-${setup.interviewType}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueSetups.push(setup);
        if (uniqueSetups.length >= 3) break;
      }
    }

    return uniqueSetups;
  }, [setupHistory]);

  // Clear all interview data
  const clearAllData = useCallback(() => {
    storage.clearAll();
    setCurrentSession(null);
    setSetupHistory([]);
    setLastSetup(null);
  }, []);

  // Check if session has expired (optional timeout)
  const isSessionExpired = useCallback(
    (timeoutMinutes = 60) => {
      if (!currentSession?.startTime) return false;

      const start = new Date(currentSession.startTime);
      const now = new Date();
      const diffMinutes = (now - start) / 60000;

      return diffMinutes > timeoutMinutes;
    },
    [currentSession]
  );

  // Resume session after page refresh
  const canResumeSession = useCallback(() => {
    return (
      currentSession !== null &&
      currentSession.status === "active" &&
      !isSessionExpired()
    );
  }, [currentSession, isSessionExpired]);

  return {
    // State
    currentSession,
    setupHistory,
    lastSetup,

    // Session management
    startSession,
    updateSession,
    endSession,
    isSessionActive,
    getSessionDuration,

    // Setup management
    saveSetupConfig,
    getSetupSuggestions,

    // Utilities
    loadSessionData,
    clearAllData,
    isSessionExpired,
    canResumeSession,
  };
};

/**
 * Hook for tracking interview statistics
 */
export const useInterviewStats = (interviews = []) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    avgConfidence: 0,
    avgFocus: 0,
    avgScore: 0,
    byType: {},
    recentActivity: [],
  });

  useEffect(() => {
    if (interviews.length === 0) {
      setStats({
        total: 0,
        completed: 0,
        avgConfidence: 0,
        avgFocus: 0,
        avgScore: 0,
        byType: {},
        recentActivity: [],
      });
      return;
    }

    // Calculate statistics
    const total = interviews.length;
    const completed = interviews.filter((i) => i.feedback).length;

    const confidenceScores = interviews
      .map((i) => i.average_confidence)
      .filter((c) => c !== undefined);
    const avgConfidence =
      confidenceScores.length > 0
        ? confidenceScores.reduce((sum, c) => sum + c, 0) /
          confidenceScores.length
        : 0;

    const focusScores = interviews
      .map((i) => i.average_focus)
      .filter((f) => f !== undefined);
    const avgFocus =
      focusScores.length > 0
        ? focusScores.reduce((sum, f) => sum + f, 0) / focusScores.length
        : 0;

    // Calculate average score across all types
    const allScores = interviews.flatMap((i) => {
      const scores = [];
      if (i.feedback?.technical?.score) scores.push(i.feedback.technical.score);
      if (i.feedback?.behavioral?.score)
        scores.push(i.feedback.behavioral.score);
      if (i.feedback?.coding?.score) scores.push(i.feedback.coding.score);
      return scores;
    });
    const avgScore =
      allScores.length > 0
        ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length
        : 0;

    // Group by type
    const byType = interviews.reduce((acc, interview) => {
      const type = interview.mode || "custom";
      if (!acc[type]) {
        acc[type] = { count: 0, interviews: [] };
      }
      acc[type].count++;
      acc[type].interviews.push(interview);
      return acc;
    }, {});

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = interviews
      .filter((i) => new Date(i.date) > sevenDaysAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setStats({
      total,
      completed,
      avgConfidence: Math.round(avgConfidence * 100),
      avgFocus: Math.round(avgFocus * 100),
      avgScore: avgScore.toFixed(1),
      byType,
      recentActivity,
    });
  }, [interviews]);

  return stats;
};

/**
 * Hook for managing interview timer
 */
export const useInterviewTimer = (durationMinutes = 5) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback(
    (newDuration) => {
      const duration = newDuration || durationMinutes;
      setTimeLeft(duration * 60);
      setIsRunning(false);
      setIsPaused(false);
    },
    [durationMinutes]
  );

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const getProgress = useCallback(() => {
    const total = durationMinutes * 60;
    return ((total - timeLeft) / total) * 100;
  }, [timeLeft, durationMinutes]);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    isPaused,
    progress: getProgress(),
    start,
    pause,
    resume,
    stop,
    reset,
  };
};
