import React, { useState } from "react";
import { ChevronRight, Clock, Code2, Users, Brain } from "lucide-react";

const InterviewSetup = ({ onStart }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(5);

  const roles = [
    { id: "frontend", name: "Frontend Developer", icon: "⚛️" },
    { id: "backend", name: "Backend Developer", icon: "🔧" },
    { id: "fullstack", name: "Full Stack Developer", icon: "🔗" },
    { id: "devops", name: "DevOps Engineer", icon: "☁️" },
    { id: "data_science", name: "Data Scientist", icon: "📊" },
    { id: "product_manager", name: "Product Manager", icon: "📱" },
  ];

  const interviewTypes = [
    {
      id: "technical",
      name: "Technical Interview",
      description: "Focus on coding and technical problem-solving",
      icon: <Code2 className="w-8 h-8" />,
    },
    {
      id: "behavioral",
      name: "Behavioral Interview",
      description: "HR-focused questions about your experience",
      icon: <Users className="w-8 h-8" />,
    },
    {
      id: "coding",
      name: "Coding Challenge",
      description: "Live coding problems with multiple rounds",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      id: "full",
      name: "Full Interview",
      description: "Complete interview with all rounds",
      icon: <Clock className="w-8 h-8" />,
    },
  ];

  const durations = [3, 5, 10, 15, 20, 30];

  const handleStart = () => {
    onStart({
      role: selectedRole,
      interviewType: selectedType,
      duration: selectedDuration,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Prepare for Your Interview
        </h1>
        <p className="text-xl text-gray-300">
          Configure your interview session and get ready to showcase your skills
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step >= s
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 transition-all ${
                    step > s
                      ? "bg-gradient-to-r from-purple-600 to-blue-600"
                      : "bg-white/10"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span
            className={`font-semibold ${
              step >= 1 ? "text-white" : "text-gray-400"
            }`}
          >
            Select Role
          </span>
          <span
            className={`font-semibold ${
              step >= 2 ? "text-white" : "text-gray-400"
            }`}
          >
            Interview Type
          </span>
          <span
            className={`font-semibold ${
              step >= 3 ? "text-white" : "text-gray-400"
            }`}
          >
            Duration
          </span>
        </div>
      </div>

      {/* Step 1: Select Role */}
      {step === 1 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">
            What is your target role?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedRole === role.id
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/20 bg-white/10 hover:border-white/40"
                }`}
              >
                <div className="text-4xl mb-3">{role.icon}</div>
                <p className="font-semibold text-white">{role.name}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedRole}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Interview Type */}
      {step === 2 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">
            Choose interview type
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {interviewTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedType === type.id
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-white/20 bg-white/10 hover:border-white/40"
                }`}
              >
                <div
                  className={`mb-4 ${
                    selectedType === type.id
                      ? "text-purple-300"
                      : "text-gray-400"
                  }`}
                >
                  {type.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{type.name}</h3>
                <p className="text-sm text-gray-300">{type.description}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedType}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Duration */}
      {step === 3 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">
            Select interview duration
          </h2>

          {/* Duration Slider */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <p className="text-gray-300">Duration</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {selectedDuration} min
                </p>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>3 min (Quick)</span>
                <span>30 min (Full)</span>
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
              {durations.map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSelectedDuration(dur)}
                  className={`py-2 rounded-lg font-semibold transition ${
                    selectedDuration === dur
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {dur}m
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-bold text-white mb-6">
              Interview Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-gray-300">Role</span>
                <span className="font-semibold text-white">
                  {roles.find((r) => r.id === selectedRole)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-gray-300">Interview Type</span>
                <span className="font-semibold text-white">
                  {interviewTypes.find((t) => t.id === selectedType)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Duration</span>
                <span className="font-semibold text-white">
                  {selectedDuration} minutes
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-8">
            <p className="text-sm text-blue-200">
              💡 Make sure you're in a quiet environment with good lighting and
              a stable internet connection before starting.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
            >
              Back
            </button>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Start Interview <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSetup;
