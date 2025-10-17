import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInterviewHistory } from "../lib/api";

export default function Interviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await getInterviewHistory();
        setInterviews(data);
      } catch (error) {
        console.error("Failed to load interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);

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

  return (
    <div className="space-y-8 animate-fade-in">
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

      <Card>
        <CardHeader>
          <CardTitle>Your Interviews</CardTitle>
          <CardDescription>
            All your interview sessions in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No interviews found</p>
              <p className="text-sm mt-2">
                Create your first interview to get started
              </p>
              <Button
                onClick={handleNewInterview}
                className="mt-4 gradient-primary text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{interview.role}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>📅 {formatDate(interview.date)}</span>
                      <span>🎯 Type: {interview.mode}</span>
                      {interview.average_confidence && (
                        <span>
                          💪 Confidence:{" "}
                          {Math.round(interview.average_confidence * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    {interview.feedback?.technical?.score && (
                      <div className="text-2xl font-bold text-purple-600">
                        {interview.feedback.technical.score}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <Button
                    onClick={() => handleViewInterview(interview._id)}
                    variant="outline"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
