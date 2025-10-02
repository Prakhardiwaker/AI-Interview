import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";
import { ROUTES } from "./lib/constants";

// Pages (we'll create these next)
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

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey}>
        <ThemeProvider>
          <Router>
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
