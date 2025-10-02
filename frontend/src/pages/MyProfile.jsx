import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Input from "../components/ui/input";
import { toast } from "react-hot-toast";

export default function MyProfile() {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Fetch user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUserData(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/users/me", userData);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            {editing ? (
              <Input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <p className="text-muted-foreground mt-1">
                {userData.fullName || "Not set"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            {editing ? (
              <Input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <p className="text-muted-foreground mt-1">
                {userData.email || "Not set"}
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            {editing ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
