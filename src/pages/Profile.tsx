import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import StudentProfileForm from "@/components/profile/StudentProfileForm";
import CounselorProfileForm from "@/components/profile/CounselorProfileForm";
import RoleSelection from "@/components/profile/RoleSelection";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    // Check if user has a role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData) {
      setUserRole(roleData.role);
    }

    setLoading(false);
  };

  const handleRoleSelected = async (role: string) => {
    if (!user) return;

    try {
      // Insert user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert([{ 
          user_id: user.id, 
          role: role as any 
        }]);

      if (roleError) throw roleError;

      setUserRole(role);
      toast.success(`Role set to ${role}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <RoleSelection onRoleSelected={handleRoleSelected} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            {userRole === "student" 
              ? "Complete your student profile to get personalized career guidance"
              : "Complete your counselor profile to start helping students"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRole === "student" && <StudentProfileForm user={user!} />}
          {userRole === "counselor" && <CounselorProfileForm user={user!} />}
        </CardContent>
      </Card>
    </div>
  );
}
