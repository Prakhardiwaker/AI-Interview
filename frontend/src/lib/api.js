// src/lib/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set Clerk user headers
export const setClerkHeaders = (user) => {
  if (user) {
    api.defaults.headers.common["X-User-Id"] = user.id;
    api.defaults.headers.common["X-User-Email"] =
      user.emailAddresses[0]?.emailAddress ||
      user.primaryEmailAddress?.emailAddress;
  } else {
    delete api.defaults.headers.common["X-User-Id"];
    delete api.defaults.headers.common["X-User-Email"];
  }
};

// Interview APIs
export const setupInterview = async (data) => {
  const formData = new FormData();
  formData.append("role", data.role);
  formData.append("interview_type", data.interview_type);
  if (data.custom_round) {
    formData.append("custom_round", data.custom_round);
  }

  const response = await api.post("/api/setup", formData);
  return response.data;
};

export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post("/api/parse-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const sendAudio = async (audioBlob, focusScore = 1.0) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.wav");
  formData.append("focus_score", focusScore);

  const response = await api.post("/api/audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getFeedback = async () => {
  const response = await api.get("/api/feedback");
  return response.data;
};

export const getCodingProblem = async () => {
  const response = await api.get("/api/coding-problem");
  return response.data;
};

export const submitCode = async (code) => {
  const response = await api.post("/api/submit-code", { code });
  return response.data;
};

export const sendCodeExplanation = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "explanation.wav");

  const response = await api.post("/api/code-explanation", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await api.get("/api/interviews");
  return response.data;
};

export const getInterview = async (interviewId) => {
  const response = await api.get(`/api/interviews/${interviewId}`);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get("/api/history");
  return response.data;
};

// User APIs
export const getUserProfile = async () => {
  const response = await api.get("/api/user/profile");
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await api.put("/api/user/profile", data);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/api/dashboard/stats");
  return response.data;
};

export default api;
