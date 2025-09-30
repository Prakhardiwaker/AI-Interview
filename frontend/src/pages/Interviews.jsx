import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Plus } from "lucide-react";

export default function Interviews() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground mt-2">
            Manage and practice your mock interviews
          </p>
        </div>
        <Button className="gradient-primary text-white">
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
          <div className="text-center py-12 text-muted-foreground">
            <p>No interviews found</p>
            <p className="text-sm mt-2">
              Create your first interview to get started
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
