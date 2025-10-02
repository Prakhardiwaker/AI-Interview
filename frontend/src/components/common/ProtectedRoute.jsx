// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { checkProfileCompletion } from "../../lib/api";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, requireProfile = false }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();
  const [checkingProfile, setCheckingProfile] = useState(requireProfile);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (requireProfile && isSignedIn && user) {
        try {
          const result = await checkProfileCompletion(user);
          setProfileComplete(result.profileCompleted);
        } catch (error) {
          console.error("Error checking profile:", error);
        } finally {
          setCheckingProfile(false);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      checkProfile();
    }
  }, [isLoaded, isSignedIn, user, requireProfile]);

  // Show loading spinner while Clerk is loading
  if (!isLoaded || checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Redirect to profile if profile is required but not completed
  if (requireProfile && !profileComplete && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
