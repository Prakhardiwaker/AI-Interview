import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import { ROUTES } from "./lib/constants";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Interviews from "./pages/Interviews";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import MyProfile from "./pages/MyProfile";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

// Component that handles redirect for new users
function RedirectNewUser() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      // Example check: if account was created in the last 1 minute
      const createdAt = new Date(user.createdAt).getTime();
      const now = Date.now();
      if (now - createdAt < 60 * 1000) {
        navigate(ROUTES.PROFILE, { replace: true });
      }
    }
  }, [isSignedIn, user, navigate]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey}>
        <ThemeProvider>
          <Router>
            <RedirectNewUser /> {/* Auto-redirect new users to ProfilePage */}
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path={ROUTES.HOME} element={<Home />} />
                  <Route
                    path={ROUTES.DASHBOARD}
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
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
                    path={ROUTES.PROFILE}
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
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
              </main>
            </div>
          </Router>
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
