import React, { useState } from "react";
import {
  Download,
  Share2,
  MessageCircle,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const FeedbackPage = ({ feedbackData = {} }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState(null);

  // Default Data
  const defaultFeedback = {
    technical: {
      score: 78,
      feedback:
        "Good understanding of core concepts with room for improvement in system design.",
      strengths: ["Problem Solving", "Communication", "Code Quality"],
      areasToImprove: ["System Design", "Optimization", "Edge Cases"],
      suggestions: [
        "Practice more with large-scale system design problems",
        "Focus on algorithmic optimization techniques",
        "Work on handling edge cases more systematically",
      ],
    },
    behavioral: {
      score: 82,
      feedback:
        "Excellent communication skills and good team collaboration examples.",
      strengths: ["Leadership", "Communication", "Teamwork", "Adaptability"],
      areasToImprove: ["Conflict Resolution", "Stress Management"],
      suggestions: [
        "Share more examples of handling conflicts in teams",
        "Prepare better examples of working under pressure",
      ],
    },
    coding: {
      score: 75,
      feedback:
        "Solved problems with decent complexity but needs optimization work.",
      strengths: ["Logic", "Implementation Speed", "Debugging"],
      areasToImprove: ["Time Complexity", "Space Optimization"],
      suggestions: [
        "Focus on Big O analysis during interviews",
        "Practice more optimization techniques",
        "Consider multiple approaches before coding",
      ],
    },
    average_confidence: 0.82,
    average_focus: 0.88,
    interview_duration: "25 minutes",
    questions_asked: 12,
    transcript: [
      {
        question: "Tell me about your experience with React",
        answer:
          "I have 3 years of experience working with React in production environments...",
      },
      {
        question: "What are hooks?",
        answer:
          "Hooks are functions that let you use state and other React features in React functional components...",
      },
    ],
  };

  const data = { ...defaultFeedback, ...feedbackData };

  // SCORE CARD
  const ScoreCard = ({ label, score, color = "purple" }) => {
    const percentage = Math.round((score || 0) * 100);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    const colors = {
      purple: "#8B5CF6",
      green: "#10B981",
      blue: "#0EA5E9",
    };

    return (
      <div className="bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-2xl p-6 text-center shadow-sm transition">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="45"
              strokeWidth="8"
              stroke="rgba(0,0,0,0.1)"
              className="dark:stroke-[rgba(255,255,255,0.1)]"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              strokeWidth="8"
              stroke={colors[color]}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="none"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {percentage}%
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-800 dark:text-gray-300 font-semibold">
          {label}
        </p>
      </div>
    );
  };

  // EXPANDABLE CARD
  const ExpandableCard = ({ title, children, icon: Icon }) => {
    const isOpen = expandedSection === title;

    return (
      <div className="bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl overflow-hidden transition shadow-sm">
        <button
          onClick={() => setExpandedSection(isOpen ? null : title)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-200 dark:hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <Icon className="text-purple-600 dark:text-purple-400" size={20} />
            <h3 className="text-gray-900 dark:text-white font-semibold">
              {title}
            </h3>
          </div>
          <ChevronDown
            className={`text-gray-600 dark:text-gray-300 transform transition ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="p-4 bg-white dark:bg-black/20 border-t border-gray-300 dark:border-white/20">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6 transition">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Interview Results
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Your complete interview performance analysis
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg transition">
              <Download size={18} /> Download
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg transition">
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-6xl mx-auto mb-6 border-b border-gray-300 dark:border-white/20">
        <div className="flex gap-4 overflow-x-auto">
          {["overview", "transcript", "details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 pb-3 font-semibold capitalize transition text-sm ${
                activeTab === tab
                  ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* SCORE SECTION */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Performance Scores
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <ScoreCard
                label="Technical"
                score={data.technical.score / 100}
                color="purple"
              />
              <ScoreCard
                label="Behavioral"
                score={data.behavioral.score / 100}
                color="green"
              />
              <ScoreCard
                label="Coding"
                score={data.coding.score / 100}
                color="blue"
              />
            </div>

            {/* TECHNICAL */}
            <ExpandableCard title="Technical Interview" icon={BarChart3}>
              <p className="text-gray-700 dark:text-gray-300">
                {data.technical.feedback}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex gap-2 items-center">
                    <CheckCircle size={18} /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {data.technical.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-gray-800 dark:text-gray-300 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full" />{" "}
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-500 dark:text-orange-400 mb-3 flex gap-2 items-center">
                    <AlertCircle size={18} /> Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {data.technical.areasToImprove.map((a, i) => (
                      <li
                        key={i}
                        className="text-gray-800 dark:text-gray-300 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full" />{" "}
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ExpandableCard>

            {/* BEHAVIORAL */}
            <ExpandableCard title="Behavioral Interview" icon={MessageCircle}>
              <p className="text-gray-700 dark:text-gray-300">
                {data.behavioral.feedback}
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex gap-2 items-center">
                    <CheckCircle size={18} /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {data.behavioral.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-gray-800 dark:text-gray-300 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full" />{" "}
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-500 dark:text-orange-400 mb-3 flex gap-2 items-center">
                    <AlertCircle size={18} /> Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {data.behavioral.areasToImprove.map((a, i) => (
                      <li
                        key={i}
                        className="text-gray-800 dark:text-gray-300 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full" />{" "}
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ExpandableCard>

            {/* CODING */}
            <ExpandableCard title="Coding Challenge" icon={Award}>
              <p className="text-gray-700 dark:text-gray-300">
                {data.coding.feedback}
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {data.coding.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-gray-800 dark:text-gray-300 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full" />{" "}
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-500 dark:text-orange-400 mb-3 flex gap-2 items-center">
                    <AlertCircle size={18} /> Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {data.coding.areasToImprove.map((a, i) => (
                      <li
                        key={i}
                        className="text-gray-800 dark:text-gray-300 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full" />{" "}
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ExpandableCard>
          </div>
        )}

        {/* TRANSCRIPT */}
        {activeTab === "transcript" && (
          <div className="space-y-4">
            {data.transcript.map((item, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl overflow-hidden"
              >
                <div className="p-4 bg-purple-100 dark:bg-purple-500/20 border-b border-gray-300 dark:border-white/10">
                  <p className="text-purple-800 dark:text-purple-300 font-semibold">
                    Question {i + 1}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {item.question}
                  </p>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    Your Answer:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DETAILS */}
        {activeTab === "details" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Performance Metrics
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-300 dark:border-white/10 pb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Confidence
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    {Math.round(data.average_confidence * 100)}%
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-300 dark:border-white/10 pb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Focus
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {Math.round(data.average_focus * 100)}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Duration
                  </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    {data.interview_duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Next Steps
              </h3>

              <ul className="space-y-2 text-gray-800 dark:text-gray-300">
                <li className="flex gap-2">
                  <span className="text-purple-600 dark:text-purple-400">
                    →
                  </span>
                  Review weak areas
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600 dark:text-purple-400">
                    →
                  </span>
                  Practice suggestions
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600 dark:text-purple-400">
                    →
                  </span>
                  Attempt another mock interview
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
