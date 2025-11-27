// src/lib/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

// Auth token getter (for Clerk getToken)
let getTokenFunction = null;
export const setAuthTokenGetter = (getToken) => {
  getTokenFunction = getToken;
};

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility: Attach Bearer token if available
const applyAuthToken = async (headers = {}) => {
  if (getTokenFunction) {
    try {
      const token = await getTokenFunction();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("applyAuthToken: failed to get token", e);
    }
  }
  return headers;
};

// Set Clerk headers (optional additional user headers)
export const setClerkHeaders = (user) => {
  if (user) {
    api.defaults.headers.common["X-User-Id"] = user.id;
    api.defaults.headers.common["X-User-Email"] =
      user.emailAddresses?.[0]?.emailAddress ||
      user.primaryEmailAddress?.emailAddress;
  } else {
    delete api.defaults.headers.common["X-User-Id"];
    delete api.defaults.headers.common["X-User-Email"];
  }
};

// ========== LOCAL STORAGE UTILITIES ==========

const STORAGE_KEYS = {
  CURRENT_INTERVIEW: "current_interview_session",
  INTERVIEW_HISTORY: "interview_setup_history",
  LAST_SETUP: "last_interview_setup",
};

export const storage = {
  saveCurrentSession: (sessionData) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_INTERVIEW,
        JSON.stringify({
          ...sessionData,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Failed to save session to localStorage:", error);
    }
  },

  getCurrentSession: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_INTERVIEW);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to retrieve session from localStorage:", error);
      return null;
    }
  },

  clearCurrentSession: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_INTERVIEW);
    } catch (error) {
      console.error("Failed to clear session from localStorage:", error);
    }
  },

  saveSetupConfig: (config) => {
    try {
      const timestamp = new Date().toISOString();
      const setupData = { ...config, timestamp };

      localStorage.setItem(STORAGE_KEYS.LAST_SETUP, JSON.stringify(setupData));

      const history = storage.getSetupHistory();
      history.unshift(setupData);
      const trimmedHistory = history.slice(0, 10);
      localStorage.setItem(
        STORAGE_KEYS.INTERVIEW_HISTORY,
        JSON.stringify(trimmedHistory)
      );
    } catch (error) {
      console.error("Failed to save setup config:", error);
    }
  },

  getLastSetup: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_SETUP);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to retrieve last setup:", error);
      return null;
    }
  },

  getSetupHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INTERVIEW_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to retrieve setup history:", error);
      return [];
    }
  },

  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  },
};

// ========== API ENDPOINTS ==========

// ---------- Interview Setup ----------
export const setupInterview = async (data) => {
  // Get token manually from Clerk
  const headers = await applyAuthToken();

  // Do NOT set Content-Type manually when using FormData on server side
  const response = await api.post(
    "/api/setup",
    {
      role: data.role,
      interview_type: data.interviewType,
      duration: data.duration,
    },
    { headers }
  );

  return response.data;
};

// ---------- Parse Resume ----------
export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const headers = await applyAuthToken({
    "Content-Type": "multipart/form-data",
  });
  const response = await api.post("/api/parse-resume", formData, { headers });
  return response.data;
};

// ---------- Send Audio ----------
export const sendAudio = async (audioBlob, focusScore = 1.0) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("focus_score", focusScore.toString());

  const headers = await applyAuthToken({
    "Content-Type": "multipart/form-data",
  });
  const response = await api.post("/api/audio", formData, { headers });
  return response.data;
};

// ---------- Code Explanation Audio ----------
export const sendCodeExplanation = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "explanation.wav");

  const headers = await applyAuthToken({
    "Content-Type": "multipart/form-data",
  });
  const response = await api.post("/api/code-explanation", formData, {
    headers,
  });
  return response.data;
};

// ---------- Feedback ----------
export const getInterviewFeedback = async () => {
  const headers = await applyAuthToken();
  const response = await api.get("/api/feedback", { headers });
  // backend may clear session; keep local storage clear consistent with backend
  try {
    storage.clearCurrentSession();
  } catch (e) {
    // ignore
  }
  return response.data;
};
export const getFeedback = getInterviewFeedback;

// ---------- Interview History ----------
export const getInterviewHistory = async () => {
  const headers = await applyAuthToken();
  const response = await api.get("/api/interviews", { headers });
  // return as-is; backend should ensure _id is string and fields present
  return response.data;
};

export const getInterview = async (interviewId) => {
  const headers = await applyAuthToken();
  const response = await api.get(`/api/interviews/${interviewId}`, { headers });
  return response.data;
};

// ---------- Coding Problem ----------
export const getCodingProblem = async () => {
  const headers = await applyAuthToken();
  const response = await api.get("/api/coding-problem", { headers });
  return response.data;
};

// ---------- Submit Code ----------
export const submitCode = async (code) => {
  const headers = await applyAuthToken();
  const response = await api.post("/api/submit-code", { code }, { headers });
  return response.data;
};

// ---------- Conversation History ----------
export const getHistory = async () => {
  const headers = await applyAuthToken();
  const response = await api.get("/api/history", { headers });
  return response.data;
};

// ---------- Dashboard Stats ----------
export const getDashboardStats = async () => {
  const headers = await applyAuthToken();
  const response = await api.get("/api/dashboard/stats", { headers });
  return response.data;
};

// ---------- User Profile ----------
export const getUserProfile = async () => {
  const headers = await applyAuthToken();
  const response = await api.get("/api/user/profile", { headers });
  return response.data;
};

export const updateUserProfile = async (user, data) => {
  const headers = await applyAuthToken({
    "Content-Type": "application/json",
    "X-User-Id": user?.id,
    "X-User-Email": user?.emailAddresses?.[0]?.emailAddress,
  });

  const response = await api.put("/api/user/profile", data, { headers });
  return response.data;
};

export const checkProfileCompletion = async (user) => {
  const headers = await applyAuthToken({
    "X-User-Id": user?.id,
    "X-User-Email": user?.emailAddresses?.[0]?.emailAddress,
  });

  const response = await api.get("/api/user/check-profile", { headers });
  return response.data;
};

// ========== ERROR HANDLER ==========
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
