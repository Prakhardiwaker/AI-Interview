// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import { ROUTES } from "./lib/constants";
import { checkProfileCompletion, setClerkHeaders } from "./lib/api"; // ✅ Imported setClerkHeaders

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Interviews from "./pages/Interviews";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import MyProfile from "./pages/MyProfile";
import CompleteProfile from "./pages/CompleteProfile";
import InterviewSession from "./pages/InterviewSession";
import InterviewSetup from "./pages/InterviewSetup";
import FeedbackPage from "./pages/FeedbackPage";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

// ✅ Component that handles profile completion redirect
function ProfileCompletionGuard({ children }) {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (isSignedIn && user && location.pathname !== ROUTES.PROFILE) {
        try {
          const result = await checkProfileCompletion(user);

          // Redirect to profile page if not completed
          if (!result.profileCompleted) {
            navigate(ROUTES.PROFILE, { replace: true });
          }
        } catch (error) {
          console.error("Error checking profile:", error);
        } finally {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    };

    checkProfile();
  }, [isSignedIn, user, location.pathname, navigate]);

  // Show loading while checking
  if (checking && isSignedIn && location.pathname !== ROUTES.PROFILE) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}

// ✅ Main content component (inside Router)
function AppContent() {
  const navigate = useNavigate();
  const [sessionConfig, setSessionConfig] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);

  const { user, isSignedIn } = useUser();

  // ✅ Automatically attach Clerk headers globally to all API requests
  useEffect(() => {
    if (isSignedIn && user) {
      setClerkHeaders(user);
      console.log("✅ Clerk headers attached for user:", user.id);
    } else {
      // Remove headers if user logs out
      setClerkHeaders(null);
      console.log("🧹 Clerk headers cleared");
    }
  }, [isSignedIn, user]);

  // Handle interview setup completion
  const handleSetup = (config) => {
    setSessionConfig(config);
    navigate("/interview");
  };

  // Handle interview completion
  const handleInterviewComplete = (data) => {
    setFeedbackData(data);
    navigate("/feedback");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <ProfileCompletionGuard>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />

            {/* Profile route - accessible without completion */}
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <CompleteProfile />
                </ProtectedRoute>
              }
            />

            {/* Protected routes - require profile completion */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Interview Flow Routes */}
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <InterviewSetup onStart={handleSetup} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <InterviewSession
                    sessionConfig={sessionConfig}
                    onComplete={handleInterviewComplete}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <FeedbackPage feedbackData={feedbackData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews/:id"
              element={
                <ProtectedRoute>
                  <FeedbackPage />
                </ProtectedRoute>
              }
            />

            {/* Other routes */}
            <Route
              path={ROUTES.INTERVIEWS}
              element={
                <ProtectedRoute>
                  <Interviews />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.SETTINGS}
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.MYPROFILE}
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProfileCompletionGuard>
      </main>
    </div>
  );
}

// ✅ Main App component
function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey}>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
