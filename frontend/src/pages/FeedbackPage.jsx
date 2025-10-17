import React, { useState } from "react";
import {
  Download,
  Share2,
  MessageCircle,
  TrendingUp,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const FeedbackPage = ({ feedbackData = {} }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState(null);

  // Mock data structure
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
          "Hooks are functions that let you use state and other React features in functional components...",
      },
    ],
  };

  const data = { ...defaultFeedback, ...feedbackData };

  const ScoreCard = ({ label, score, color = "purple" }) => {
    const percentage = Math.round((score || 0) * 100);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      purple: { gradient: "from-purple-500 to-blue-500", circle: "#8B5CF6" },
      green: { gradient: "from-green-500 to-emerald-500", circle: "#10B981" },
      blue: { gradient: "from-blue-500 to-cyan-500", circle: "#0EA5E9" },
      orange: { gradient: "from-orange-500 to-red-500", circle: "#F97316" },
    }[color];

    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={colorClasses.circle}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <p className="text-3xl font-bold text-white">{percentage}</p>
              <p className="text-xs text-gray-400">%</p>
            </div>
          </div>
        </div>
        <p className="text-gray-300 font-semibold">{label}</p>
      </div>
    );
  };

  const ExpandableCard = ({ title, children, icon: Icon }) => {
    const isExpanded = expandedSection === title;
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:border-white/40 transition">
        <button
          onClick={() => setExpandedSection(isExpanded ? null : title)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <Icon className="text-purple-400" size={20} />
            <h3 className="font-semibold text-white">{title}</h3>
          </div>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
        {isExpanded && (
          <div className="border-t border-white/10 p-4 bg-black/20">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Interview Results
            </h1>
            <p className="text-gray-300">
              Your comprehensive feedback and performance analysis
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition">
              <Download size={18} />
              Download
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Duration</p>
            <p className="text-2xl font-bold text-white">
              {data.interview_duration}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Questions</p>
            <p className="text-2xl font-bold text-white">
              {data.questions_asked}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Confidence</p>
            <p className="text-2xl font-bold text-green-400">
              {Math.round(data.average_confidence * 100)}%
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Focus</p>
            <p className="text-2xl font-bold text-blue-400">
              {Math.round(data.average_focus * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
          {["overview", "transcript", "details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold whitespace-nowrap transition border-b-2 ${
                activeTab === tab
                  ? "border-purple-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Score Cards */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Performance Scores
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {data.technical && (
                  <ScoreCard
                    label="Technical"
                    score={data.technical.score / 100}
                    color="purple"
                  />
                )}
                {data.behavioral && (
                  <ScoreCard
                    label="Behavioral"
                    score={data.behavioral.score / 100}
                    color="green"
                  />
                )}
                {data.coding && (
                  <ScoreCard
                    label="Coding"
                    score={data.coding.score / 100}
                    color="blue"
                  />
                )}
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Detailed Feedback
              </h2>

              {data.technical && (
                <ExpandableCard title="Technical Interview" icon={BarChart3}>
                  <div className="space-y-4">
                    <p className="text-gray-300">{data.technical.feedback}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                          <CheckCircle size={18} />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {data.technical.strengths.map((strength, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <span className="w-2 h-2 bg-green-400 rounded-full" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                          <AlertCircle size={18} />
                          Areas to Improve
                        </h4>
                        <ul className="space-y-2">
                          {data.technical.areasToImprove.map((area, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <span className="w-2 h-2 bg-orange-400 rounded-full" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {data.technical.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex gap-3 text-gray-300">
                            <span className="text-blue-400 font-bold">
                              {idx + 1}.
                            </span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ExpandableCard>
              )}

              {data.behavioral && (
                <ExpandableCard
                  title="Behavioral Interview"
                  icon={MessageCircle}
                >
                  <div className="space-y-4">
                    <p className="text-gray-300">{data.behavioral.feedback}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                          <CheckCircle size={18} />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {data.behavioral.strengths.map((strength, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <span className="w-2 h-2 bg-green-400 rounded-full" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                          <AlertCircle size={18} />
                          Areas to Improve
                        </h4>
                        <ul className="space-y-2">
                          {data.behavioral.areasToImprove.map((area, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <span className="w-2 h-2 bg-orange-400 rounded-full" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {data.behavioral.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex gap-3 text-gray-300">
                            <span className="text-blue-400 font-bold">
                              {idx + 1}.
                            </span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ExpandableCard>
              )}

              {data.coding && (
                <ExpandableCard title="Coding Challenge" icon={Award}>
                  <div className="space-y-4">
                    <p className="text-gray-300">{data.coding.feedback}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                          <CheckCircle size={18} />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {data.coding.strengths.map((strength, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <span className="w-2 h-2 bg-green-400 rounded-full" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                          <AlertCircle size={18} />
                          Areas to Improve
                        </h4>
                        <ul className="space-y-2">
                          {data.coding.areasToImprove.map((area, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <span className="w-2 h-2 bg-orange-400 rounded-full" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {data.coding.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex gap-3 text-gray-300">
                            <span className="text-blue-400 font-bold">
                              {idx + 1}.
                            </span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ExpandableCard>
              )}
            </div>
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === "transcript" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Interview Transcript
            </h2>
            {data.transcript?.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl overflow-hidden"
              >
                <div className="bg-purple-500/20 border-b border-white/10 p-4">
                  <p className="text-purple-300 font-semibold">
                    Question {idx + 1}
                  </p>
                  <p className="text-white mt-2">{item.question}</p>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm mb-2 text-gray-400">
                    Your Answer:
                  </p>
                  <p className="text-gray-200">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-gray-300">Average Confidence</span>
                  <span className="font-bold text-green-400">
                    {Math.round(data.average_confidence * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-gray-300">Average Focus</span>
                  <span className="font-bold text-blue-400">
                    {Math.round(data.average_focus * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Interview Duration</span>
                  <span className="font-bold text-white">
                    {data.interview_duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Next Steps</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-300">
                  <span className="text-purple-400">→</span>
                  Review your weak areas
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-purple-400">→</span>
                  Practice suggested topics
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-purple-400">→</span>
                  Schedule another mock interview
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
