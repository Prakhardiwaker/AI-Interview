export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
export const APP_NAME =
  import.meta.env.VITE_APP_NAME || "AI Interview Platform";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  INTERVIEWS: "/interviews",
  INTERVIEW_DETAIL: "/interviews/:id",
  START_INTERVIEW: "/interviews/:id/start",
  INTERVIEW_SESSION: "/interviews/:id/session",
  RESULTS: "/interviews/:id/results",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

export const INTERVIEW_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const INTERVIEW_DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

export const QUESTION_TYPES = {
  TECHNICAL: "technical",
  BEHAVIORAL: "behavioral",
  SITUATIONAL: "situational",
  CODING: "coding",
};

export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: "Welcome back!",
    LOGOUT: "Logged out successfully",
    INTERVIEW_CREATED: "Interview created successfully",
    INTERVIEW_UPDATED: "Interview updated successfully",
    INTERVIEW_DELETED: "Interview deleted successfully",
    ANSWER_SUBMITTED: "Answer submitted successfully",
  },
  ERROR: {
    GENERIC: "Something went wrong. Please try again.",
    NETWORK: "Network error. Please check your connection.",
    AUTH: "Authentication failed. Please login again.",
    NOT_FOUND: "Resource not found.",
    PERMISSION: "You do not have permission to perform this action.",
  },
};

export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};
