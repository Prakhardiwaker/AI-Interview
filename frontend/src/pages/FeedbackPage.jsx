// src/pages/FeedbackPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Download,
  Share2,
  MessageCircle,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { getFeedback, getInterview } from "../lib/api";
import {TranscriptView} from "../components/transcriptView"

/**
 * FeedbackPage
 *
 * Loads feedback either from:
 *  - router state (location.state.feedback)  OR
 *  - GET /api/interviews/:id  (if :id param present) OR
 *  - GET /api/feedback (active session)
 *
 * Normalizes multiple possible backend shapes:
 *  - payload.technical / payload.behavioral / payload.coding
 *  - payload.feedback (an overall metrics object as in your example)
 *  - transcript as array or string
 */

export default function FeedbackPage() {
  const { id } = useParams(); // optional
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    let mounted = true;

    // If router passed feedback object (immediate), use it
    if (location.state?.feedback) {
      const normalized = normalizeFeedbackResponse(location.state.feedback);
      setData(normalized);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        let payload;
        if (id) {
          // fetch past interview by id
          payload = await getInterview(id);
        } else {
          // fetch current session feedback
          payload = await getFeedback();
        }
        if (!mounted) return;
        setData(normalizeFeedbackResponse(payload));
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Failed to load feedback. If you just finished an interview, you will be redirected automatically."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state?.feedback]);

  // ---------------- Normalization ----------------
  function normalizeFeedbackResponse(payload) {
    if (!payload) return {};

    // If wrapper object { data: ... } accidentally passed, unwrap
    const p = payload.data ?? payload;

    const out = {
      technical: null,
      behavioral: null,
      coding: null,
      overallFeedback: null, // your DB shape: p.feedback
      average_confidence: p.average_confidence ?? p.avg_confidence ?? null,
      average_focus: p.average_focus ?? p.avg_focus ?? null,
      interview_duration:
        p.interview_duration ?? p.duration ?? p.duration_str ?? p.duration_in_minutes ?? null,
      questions_asked: p.questions_asked ?? p.questions ?? p.num_questions ?? null,
      transcript: [],
      raw: p,
      id: p._id || p.id || null,
      date: p.date || p.createdAt || p.created_at || null,
      role: p.role || null,
      mode: p.mode || null,
    };

    // If backend uses 'technical'/'behavioral'/'coding' use them directly
    if (p.technical || p.behavioral || p.coding) {
      out.technical = p.technical ?? null;
      out.behavioral = p.behavioral ?? null;
      out.coding = p.coding ?? null;
    }

    // If backend uses 'tech','hr','code' keys
    if (!out.technical && p.tech) out.technical = p.tech;
    if (!out.behavioral && p.hr) out.behavioral = p.hr;
    if (!out.coding && p.code) out.coding = p.code;

    // If backend stores unified feedback object (your example)
    // e.g. p.feedback = { relevance, clarity, overall, summary, ... }
    if (p.feedback && typeof p.feedback === "object") {
      out.overallFeedback = p.feedback;
      // For convenience set an overallSummary and overallScore (if present)
      out.overallSummary = p.feedback.summary ?? null;
      // If no technical/behavioral exist, map some of overall metrics to UI
      if (!out.technical && !out.behavioral && !out.coding) {
        // create a lightweight behavioral object from overall
        out.behavioral = {
          score: p.feedback.overall ?? null,
          feedback: p.feedback.summary ?? "",
          metrics: p.feedback,
        };
      }
    }

    // transcript normalization
    if (Array.isArray(p.transcript)) {
      out.transcript = p.transcript.map((t) => {
        // keep { question, answer } or try to map other shapes
        if (typeof t === "string") return parseTranscriptStringSingle(t);
        if (t.question && t.answer) return t;
        // other shapes
        const q = t.q || t.questionText || t.prompt || "";
        const a = t.a || t.answerText || t.response || "";
        return { question: q, answer: a };
      });
    } else if (typeof p.transcript === "string") {
      out.transcript = parseTranscriptString(p.transcript);
    } else if (p.history && Array.isArray(p.history)) {
      out.transcript = p.history.map((h) => ({
        question: h.question || h.q || "",
        answer: h.answer || h.a || "",
      }));
    } else {
      out.transcript = [];
    }

    return out;
  }

  function parseTranscriptString(txt) {
    if (!txt) return [];
    const lines = txt.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const arr = [];
    let current = { question: "", answer: "" };
    lines.forEach((line) => {
      if (/^Q[:\s]/i.test(line)) {
        if (current.question || current.answer) {
          arr.push(current);
          current = { question: "", answer: "" };
        }
        current.question = line.replace(/^Q[:\s]+/i, "").trim();
      } else if (/^A[:\s]/i.test(line)) {
        current.answer = line.replace(/^A[:\s]+/i, "").trim();
      } else {
        if (!current.question) current.question = line;
        else if (!current.answer) current.answer = line;
        else current.answer += " " + line;
      }
    });
    if (current.question || current.answer) arr.push(current);
    return arr;
  }

  function parseTranscriptStringSingle(str) {
    const qMatch = str.match(/Q[:\s]*(.*?)\s*A[:\s]*(.*)/i);
    if (qMatch) return { question: qMatch[1].trim(), answer: qMatch[2].trim() };
    return { question: "", answer: str };
  }

  // ---------------- UI components ----------------
  const Stat = ({ label, value, className }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl mt-1 font-bold ${className || "text-gray-900 dark:text-white"}`}>{value}</p>
    </div>
  );

  const ScoreCard = ({ label, score, color = "purple" }) => {
    const percent = score != null ? Math.round(score) : null;
    const circumference = 2 * Math.PI * 45;
    const offset = percent != null ? circumference - (percent / 100) * circumference : circumference;
    const colors = { purple: "#9333ea", blue: "#2563eb", green: "#10b981" };
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="relative w-28 h-28 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(0,0,0,0.06)" className="dark:stroke-gray-700" strokeWidth="8" />
            <circle cx="60" cy="60" r="45" fill="none" stroke={colors[color]} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{percent != null ? percent : "--"}</p>
          </div>
        </div>
        <p className="text-center text-gray-900 dark:text-gray-300 font-semibold">{label}</p>
      </div>
    );
  };

  const ExpandableCard = ({ title, children, icon: Icon }) => {
    const open = expandedSection === title;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <button onClick={() => setExpandedSection(open ? null : title)} className="w-full flex justify-between items-center px-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="text-purple-600 dark:text-purple-400" size={18} />}
            <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
          </div>
          <ChevronDown className={`text-gray-600 dark:text-gray-300 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">{children}</div>}
      </div>
    );
  };

  const InterviewBlock = ({ block }) => {
    const { feedback = "", strengths = [], areasToImprove = [], suggestions = [], metrics } = block || {};
    return (
      <div className="space-y-4">
        <p className="text-gray-800 dark:text-gray-300">{feedback || (metrics && metrics.summary) || "No feedback available."}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Strengths</h4>
            <ul className="space-y-2">
              {strengths.length ? strengths.map((s,i)=>(<li key={i} className="text-gray-700 dark:text-gray-300">• {s}</li>)) : <li className="text-gray-500">No strengths listed</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Areas to Improve</h4>
            <ul className="space-y-2">
              {areasToImprove.length ? areasToImprove.map((s,i)=>(<li key={i} className="text-gray-700 dark:text-gray-300">• {s}</li>)) : <li className="text-gray-500">No areas listed</li>}
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Suggestions</h5>
          <ul className="space-y-1">
            {suggestions.length ? suggestions.map((s,idx)=>(<li key={idx} className="text-gray-800 dark:text-gray-300">{idx+1}. {s}</li>)) : <li className="text-gray-500">No suggestions</li>}
          </ul>
        </div>
      </div>
    );
  };

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Interview Feedback</h1>
            <p className="text-gray-600 dark:text-gray-400">Detailed feedback summary</p>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">
              <Download size={16} /> Download
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading feedback…</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <button onClick={()=> navigate("/interviews")} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Go to History</button>
            </div>
          </div>
        )}

        {!loading && !error && data && (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Stat label="Duration" value={data.interview_duration || data.raw?.duration || "—"} />
              <Stat label="Questions" value={data.questions_asked ?? data.transcript?.length ?? "—"} />
              <Stat label="Confidence" value={data.average_confidence != null ? `${Math.round(data.average_confidence * 100)}%` : "—"} className="text-green-600 dark:text-green-400" />
              <Stat label="Focus" value={data.average_focus != null ? `${Math.round(data.average_focus * 100)}%` : "—"} className="text-blue-600 dark:text-blue-400" />
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-6">
              {["overview", "transcript", "details"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 transition font-medium border-b-2 ${activeTab === tab ? "border-purple-600 text-purple-600 dark:text-purple-400" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Scores</h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <ScoreCard label="Technical" score={data.technical?.score ?? data.raw?.technical?.score ?? null} color="purple" />
                  <ScoreCard label="Behavioral" score={data.behavioral?.score ?? data.raw?.behavioral?.score ?? (data.overallFeedback?.overall ? data.overallFeedback.overall * 20 : null)} color="green" />
                  <ScoreCard label="Coding" score={data.coding?.score ?? data.raw?.coding?.score ?? null} color="blue" />
                </div>

                {/* If overallFeedback present, show it */}
                {data.overallFeedback && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Overall Feedback</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Relevance</p>
                        <p className="font-bold">{data.overallFeedback.relevance ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Clarity</p>
                        <p className="font-bold">{data.overallFeedback.clarity ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Depth</p>
                        <p className="font-bold">{data.overallFeedback.depth ?? "—"}</p>
                      </div>
                    </div>

                    <div className="mt-4 text-gray-800 dark:text-gray-300">
                      <p className="font-medium">Summary</p>
                      <p className="mt-2 text-sm">{data.overallFeedback.summary ?? "--"}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {data.technical && <ExpandableCard title="Technical Interview" icon={BarChart3}><InterviewBlock block={data.technical} /></ExpandableCard>}
                  {data.behavioral && <ExpandableCard title="Behavioral Interview" icon={MessageCircle}><InterviewBlock block={data.behavioral} /></ExpandableCard>}
                  {data.coding && <ExpandableCard title="Coding Challenge" icon={Award}><InterviewBlock block={data.coding} /></ExpandableCard>}
                </div>
              </div>
            )}

           {/* Transcript Section */}
{activeTab === "transcript" && (
  <div className="space-y-4">
    <TranscriptView transcript={data.transcript || []} />
  </div>
)}


            {/* Details */}
            {activeTab === "details" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Average Confidence</span>
                      <span className="font-bold text-gray-900 dark:text-white">{data.average_confidence != null ? `${Math.round(data.average_confidence * 100)}%` : "—"}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Average Focus</span>
                      <span className="font-bold text-gray-900 dark:text-white">{data.average_focus != null ? `${Math.round(data.average_focus * 100)}%` : "—"}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-700 dark:text-gray-300">Interview Duration</span>
                      <span className="font-bold text-gray-900 dark:text-white">{data.interview_duration ?? "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Next Steps</h3>
                  <ul className="space-y-2 text-gray-800 dark:text-gray-300">
                    <li>Review your weak areas</li>
                    <li>Practice suggested topics</li>
                    <li>Schedule another mock interview</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Small helper components reused (Stat, ScoreCard already defined above)
const Stat = ({ label, value, className }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
    <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
    <p className={`text-2xl mt-1 font-bold ${className || "text-gray-900 dark:text-white"}`}>{value}</p>
  </div>
);
