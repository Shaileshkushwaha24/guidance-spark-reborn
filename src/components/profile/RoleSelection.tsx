import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelected: (role: string) => void;
}

export default function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedRole) {
      onRoleSelected(selectedRole);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Role</CardTitle>
        <CardDescription>
          Select how you want to use PathFinder
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedRole("student")}
            className={`p-6 rounded-lg border-2 transition-all hover:border-primary ${
              selectedRole === "student" 
                ? "border-primary bg-primary/5" 
                : "border-border"
            }`}
          >
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Student</h3>
            <p className="text-sm text-muted-foreground">
              Get career guidance, access study materials, and connect with counselors
            </p>
          </button>

          <button
            onClick={() => setSelectedRole("counselor")}
            className={`p-6 rounded-lg border-2 transition-all hover:border-primary ${
              selectedRole === "counselor" 
                ? "border-primary bg-primary/5" 
                : "border-border"
            }`}
          >
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Counselor</h3>
            <p className="text-sm text-muted-foreground">
              Help students achieve their goals and provide professional guidance
            </p>
          </button>
        </div>

        <Button 
          onClick={handleConfirm} 
          disabled={!selectedRole}
          className="w-full"
          size="lg"
        >
          Continue as {selectedRole === "student" ? "Student" : "Counselor"}
        </Button>
      </CardContent>
    </Card>
  );
}
