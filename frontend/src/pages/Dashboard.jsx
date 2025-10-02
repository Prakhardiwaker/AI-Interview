import { getUserProfile, getDashboardStats, getInterviewHistory } from "../lib/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react"; 
import { useApi } from "../hooks/useApi";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Code, Calendar, Target, CheckCircle, AlertCircle, Eye, Bell, User, Briefcase, FolderKanban, Brain } from 'lucide-react';


// Mock Data
const statsData = {
  totalInterviews: 24,
  avgConfidence: 78,
  codingAccuracy: 85,
  lastActive: 'Sep 28, 2025'
};

const confidenceTrend = [
  { date: 'Week 1', score: 65 },
  { date: 'Week 2', score: 70 },
  { date: 'Week 3', score: 72 },
  { date: 'Week 4', score: 75 },
  { date: 'Week 5', score: 78 },
  { date: 'Week 6', score: 82 }
];

const performanceData = [
  { category: 'Technical', score: 82 },
  { category: 'HR', score: 88 },
  { category: 'Coding', score: 85 }
];

const codingInsights = [
  { name: 'Solved', value: 145 },
  { name: 'Attempted', value: 35 }
];

const interviewHistory = [
  { id: 1, date: 'Sep 28, 2025', role: 'Senior Frontend Developer', mode: 'Full', score: 85, status: 'Completed' },
  { id: 2, date: 'Sep 25, 2025', role: 'React Developer', mode: 'Technical', score: 78, status: 'Completed' },
  { id: 3, date: 'Sep 22, 2025', role: 'Software Engineer', mode: 'Coding', score: 92, status: 'Completed' },
  { id: 4, date: 'Sep 20, 2025', role: 'Full Stack Developer', mode: 'HR', score: 88, status: 'Completed' },
  { id: 5, date: 'Sep 18, 2025', role: 'Backend Developer', mode: 'Technical', score: 75, status: 'Completed' },
  { id: 6, date: 'Sep 15, 2025', role: 'DevOps Engineer', mode: 'Full', score: 80, status: 'Completed' }
];

const commonMistakes = [
  'Time complexity analysis needs improvement',
  'Edge case handling in coding problems',
  'Communication clarity during explanations',
  'Nervous body language in initial responses'
];

const notifications = [
  { id: 1, type: 'achievement', message: 'You completed 3 interviews this week!', icon: Award },
  { id: 2, type: 'update', message: 'New JavaScript challenges available.', icon: Code },
  { id: 3, type: 'tip', message: 'Try practicing system design questions.', icon: Target },
  { id: 4, type: 'achievement', message: 'Streak of 5 days maintained!', icon: TrendingUp }
];

const strengths = [
  "Clear communication",
  "Problem-solving approach",
  "Code optimization",
  "Technical depth",
];

const improvements = [
  "Time management",
  "Edge case handling",
  "Initial nervousness",
];

const COLORS = ["#9333ea", "#e9d5ff"];

// Reusable StatCard component
const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
    </div>
    <p className="text-2xl font-bold text-gray-900 ml-11">{value}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-1 ml-11">{subtitle}</p>}
  </div>
);


export default function Dashboard() {
  const { user, isLoaded } = useApi();
  const [Profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) return;
      try {
        setLoading(true);

        const [profileData, statsData, interviewsData] = await Promise.all([
          getUserProfile(),
          getDashboardStats(),
          getInterviewHistory(),
        ]);

        setProfile(profileData);
        setStats(statsData);
        setInterviews(interviewsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoaded]);


  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


 return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm shadow-sm">
            Start New Interview
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Advanced User Profile Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-start justify-between">
            {/* Left Side - User Info */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-purple-600 text-3xl font-bold shadow-xl">
                {Profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{Profile.name}</h2>
                <p className="text-purple-100 mb-3">{Profile.email}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <Briefcase className="w-4 h-4 text-white" />
                    <span className="text-sm text-white font-medium">{Profile.experience} Experience</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <FolderKanban className="w-4 h-4 text-white" />
                    <span className="text-sm text-white font-medium">{Profile.projects} Projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-white" />
                  <p className="text-xs text-purple-100 font-medium">Interviews</p>
                </div>
                <p className="text-3xl font-bold text-white">{statsData.totalInterviews}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <p className="text-xs text-purple-100 font-medium">Confidence</p>
                </div>
                <p className="text-3xl font-bold text-white">{statsData.avgConfidence}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-white" />
                  <p className="text-xs text-purple-100 font-medium">Accuracy</p>
                </div>
                <p className="text-3xl font-bold text-white">{statsData.codingAccuracy}%</p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-purple-100 font-semibold mb-3">Technical Skills</p>
            <div className="flex flex-wrap gap-2">
              {Profile.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-5">
              <StatCard 
                icon={Target} 
                title="Total Interviews" 
                value={statsData.totalInterviews} 
                subtitle="All time"
                color="bg-purple-600" 
              />
              <StatCard 
                icon={TrendingUp} 
                title="Avg Confidence" 
                value={`${statsData.avgConfidence}%`} 
                subtitle="+5% from last month"
                color="bg-blue-600" 
              />
              <StatCard 
                icon={Code} 
                title="Coding Accuracy" 
                value={`${statsData.codingAccuracy}%`} 
                subtitle="145 problems solved"
                color="bg-teal-600" 
              />
              <StatCard 
                icon={Calendar} 
                title="Last Active" 
                value={statsData.lastActive} 
                subtitle="2 days ago"
                color="bg-cyan-600" 
              />
            </div>

            {/* Performance Analytics */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Performance Analytics
              </h2>
              <div className="grid grid-cols-2 gap-5">
                {/* Confidence Trend */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Confidence Score Trend</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={confidenceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '11px' }} tick={{ fill: '#6B7280' }} />
                      <YAxis stroke="#9CA3AF" style={{ fontSize: '11px' }} tick={{ fill: '#6B7280' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Line type="monotone" dataKey="score" stroke="#9333ea" strokeWidth={2.5} dot={{ fill: '#9333ea', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Performance by Category */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance by Category</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="category" stroke="#9CA3AF" style={{ fontSize: '11px' }} tick={{ fill: '#6B7280' }} />
                      <YAxis stroke="#9CA3AF" style={{ fontSize: '11px' }} tick={{ fill: '#6B7280' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }} 
                      />
                      <Bar dataKey="score" fill="#9333ea" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Coding Practice Insights */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                Coding Practice Insights
              </h2>
              <div className="grid grid-cols-2 gap-5">
                {/* Pie Chart */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Problems Solved vs Attempted</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={codingInsights}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {codingInsights.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                      <span className="text-xs text-gray-600">Solved: 145</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-200"></div>
                      <span className="text-xs text-gray-600">Remaining: 35</span>
                    </div>
                  </div>
                </div>

                {/* Common Mistakes */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Common Mistakes</h3>
                  <ul className="space-y-3">
                    {commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                        <span className="leading-relaxed">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Interview History */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Interview History
              </h2>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Mode</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {interviewHistory.map((interview) => (
                        <tr key={interview.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{interview.date}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{interview.role}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                              {interview.mode}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{interview.score}%</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                              {interview.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-[400px] space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
            {/* Profile Snapshot */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                Profile Snapshot
              </h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {Profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{Profile.name}</p>
                  <p className="text-sm text-gray-600">{Profile.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Profile.skills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>Experience</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{Profile.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FolderKanban className="w-4 h-4" />
                      <span>Projects</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{Profile.projects}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Insights */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Feedback Insights
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-semibold text-gray-900">Strengths</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {strengths.map((strength, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <p className="text-xs font-semibold text-gray-900">Areas for Improvement</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {improvements.map((improvement, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                        {improvement}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 mt-4">
                  <div className="flex items-start gap-2">
                    <Brain className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-purple-900 mb-1">AI Insight</p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Your performance has improved by 12% over the last month. Focus on system design questions to reach the next level.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications & Updates */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-600" />
                Updates & Notifications
              </h3>
              <div className="space-y-3">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div key={notif.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-1.5 bg-purple-100 rounded-lg mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed flex-1">{notif.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

