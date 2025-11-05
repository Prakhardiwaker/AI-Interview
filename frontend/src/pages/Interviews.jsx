// src/pages/Interviews.jsx - Enhanced with full backend integration
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Plus,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInterviewHistory } from "../lib/api";

export default function Interviews() {
  const navigate = useNavigate();
  const location = useLocation();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    loadInterviews();
  }, []);

  // Check if we should show feedback from location state
  useEffect(() => {
    if (location.state?.showFeedback && location.state?.feedback) {
      console.log("Showing feedback:", location.state.feedback);
      // You can display this in a modal or dedicated section
    }
  }, [location.state]);

  const loadInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInterviewHistory();
      // Sort by date (most recent first)
      const sortedData = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setInterviews(sortedData);
    } catch (err) {
      console.error("Failed to load interviews:", err);
      setError("Failed to load interview history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewInterview = () => {
    navigate("/setup");
  };

  const handleViewInterview = (interviewId) => {
    navigate(`/interviews/${interviewId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getModeDisplay = (mode) => {
    const modes = {
      full: "Full Interview",
      custom: "Custom Round",
      technical: "Technical",
      behavioral: "Behavioral",
      coding: "Coding Challenge",
    };
    return modes[mode] || mode;
  };

  // Statistics Card
  const StatsCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  // Calculate statistics
  const stats = {
    total: interviews.length,
    avgConfidence:
      interviews.length > 0
        ? Math.round(
            (interviews.reduce(
              (sum, i) => sum + (i.average_confidence || 0),
              0
            ) /
              interviews.length) *
              100
          )
        : 0,
    avgScore:
      interviews.length > 0
        ? (
            interviews
              .filter((i) => i.feedback?.technical?.score)
              .reduce(
                (sum, i) => sum + (i.feedback?.technical?.score || 0),
                0
              ) / interviews.filter((i) => i.feedback?.technical?.score).length
          ).toFixed(1)
        : 0,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground mt-2">
            Manage and practice your mock interviews
          </p>
        </div>
        <Button
          onClick={handleNewInterview}
          className="gradient-primary text-white hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Interview
        </Button>
      </div>

      {/* Statistics Overview */}
      {interviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={Target}
            label="Total Interviews"
            value={stats.total}
            color="bg-blue-500"
          />
          <StatsCard
            icon={TrendingUp}
            label="Avg. Confidence"
            value={`${stats.avgConfidence}%`}
            color="bg-purple-500"
          />
          <StatsCard
            icon={Clock}
            label="Avg. Score"
            value={stats.avgScore || "N/A"}
            color="bg-green-500"
          />
        </div>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Interviews</CardTitle>
          <CardDescription>
            All your interview sessions in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12 text-muted-foreground">
              <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
              <p>Loading interviews...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 inline-flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-red-800 font-semibold">
                    Error Loading Interviews
                  </p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
              <Button
                onClick={loadInterviews}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && interviews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-semibold mb-2">No interviews found</p>
              <p className="text-sm mb-6">
                Create your first interview to get started
              </p>
              <Button
                onClick={handleNewInterview}
                className="gradient-primary text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Interview
              </Button>
            </div>
          )}

          {/* Interviews List */}
          {!loading && !error && interviews.length > 0 && (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4"
                >
                  <div className="flex-1 w-full md:w-auto">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        {interview.role}
                      </h3>
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {getModeDisplay(interview.mode)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        📅 {formatDate(interview.date)}
                      </span>
                      {interview.average_confidence !== undefined && (
                        <span className="flex items-center gap-1">
                          💪 Confidence:{" "}
                          {Math.round(interview.average_confidence * 100)}%
                        </span>
                      )}
                      {interview.average_focus !== undefined && (
                        <span className="flex items-center gap-1">
                          🎯 Focus: {Math.round(interview.average_focus * 100)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="flex items-center gap-4">
                    {interview.feedback?.technical?.score && (
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            interview.feedback.technical.score
                          )}`}
                        >
                          {interview.feedback.technical.score}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Technical
                        </p>
                      </div>
                    )}
                    {interview.feedback?.behavioral?.score && (
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            interview.feedback.behavioral.score
                          )}`}
                        >
                          {interview.feedback.behavioral.score}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Behavioral
                        </p>
                      </div>
                    )}
                    {interview.feedback?.coding?.score && (
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            interview.feedback.coding.score
                          )}`}
                        >
                          {interview.feedback.coding.score}
                        </div>
                        <p className="text-xs text-muted-foreground">Coding</p>
                      </div>
                    )}

                    <Button
                      onClick={() => handleViewInterview(interview._id)}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Note */}
      {interviews.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {interviews.length} interview
          {interviews.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
