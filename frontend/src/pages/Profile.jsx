import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Profile() {
  const { user } = useUser();

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
            <p className="text-muted-foreground mt-1">
              {user?.fullName || "Not set"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-muted-foreground mt-1">
              {user?.primaryEmailAddress?.emailAddress || "Not set"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
