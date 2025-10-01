// src/hooks/useApi.js
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { setClerkHeaders } from "../lib/api";

/**
 * Custom hook that automatically sets Clerk user headers for API calls
 * Use this in your components to ensure authenticated API requests
 */
export const useApi = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Set headers whenever user changes
      setClerkHeaders(user);
    }
  }, [user, isLoaded]);

  return { user, isLoaded };
};
