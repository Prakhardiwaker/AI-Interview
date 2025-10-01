// src/pages/Dashboard.jsx - Example Usage
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { getDashboardStats, getInterviewHistory } from "../lib/api";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, isLoaded } = useApi(); // This automatically sets auth headers
  const [stats, setStats] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);

        // These API calls now automatically include Clerk user headers
        const [statsData, interviewsData] = await Promise.all([
          getDashboardStats(),
          getInterviewHistory(),
        ]);

        setStats(statsData);
        setInterviews(interviewsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || "User"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's your interview practice overview
        </p>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Interviews
            </h3>
            <p className="text-3xl font-bold mt-2">{stats.totalInterviews}</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Average Score
            </h3>
            <p className="text-3xl font-bold mt-2">{stats.averageScore}%</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              This Week
            </h3>
            <p className="text-3xl font-bold mt-2">{stats.thisWeek}</p>
          </div>
        </div>
      )}

      {/* Recent Interviews */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Interviews</h2>
        <div className="space-y-4">
          {interviews.length === 0 ? (
            <p className="text-muted-foreground">
              No interviews yet. Start your first one!
            </p>
          ) : (
            interviews.map((interview) => (
              <div
                key={interview._id}
                className="bg-card border rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{interview.role}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(interview.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Confidence:{" "}
                      {interview.average_confidence?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
