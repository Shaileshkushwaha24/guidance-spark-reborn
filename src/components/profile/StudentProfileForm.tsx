import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentProfileFormProps {
  user: User;
}

export default function StudentProfileForm({ user }: StudentProfileFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: user.email || "",
    phone: "",
    date_of_birth: "",
    grade: "",
    school: "",
    interests: [] as string[],
    career_goals: "",
    profile_picture_url: "",
  });
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        date_of_birth: data.date_of_birth || "",
        grade: data.grade || "",
        school: data.school || "",
        interests: data.interests || [],
        career_goals: data.career_goals || "",
        profile_picture_url: data.profile_picture_url || "",
      });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/profile-picture.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("profile-assets")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("profile-assets")
        .getPublicUrl(fileName);

      setProfile({ ...profile, profile_picture_url: publicUrl });
      toast.success("Profile picture uploaded");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({ ...profile, interests: [...profile.interests, newInterest.trim()] });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests.filter(i => i !== interest) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("student_profiles")
        .upsert({
          user_id: user.id,
          ...profile,
        });

      if (error) throw error;
      toast.success("Profile saved successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={profile.profile_picture_url} />
          <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
            <UserIcon className="w-16 h-16" />
          </AvatarFallback>
        </Avatar>
        <Label htmlFor="profile-picture" className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
          </div>
          <Input
            id="profile-picture"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={profile.date_of_birth}
            onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade/Year</Label>
          <Input
            id="grade"
            placeholder="e.g., 12th Grade, Freshman"
            value={profile.grade}
            onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="school">School/Institution</Label>
          <Input
            id="school"
            value={profile.school}
            onChange={(e) => setProfile({ ...profile, school: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests</Label>
        <div className="flex gap-2">
          <Input
            id="interests"
            placeholder="Add interest (e.g., Technology, Art, Sports)"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
          />
          <Button type="button" onClick={addInterest} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.interests.map((interest) => (
            <Badge key={interest} variant="secondary" className="cursor-pointer" onClick={() => removeInterest(interest)}>
              {interest} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="career_goals">Career Goals</Label>
        <Textarea
          id="career_goals"
          placeholder="What are your career aspirations?"
          value={profile.career_goals}
          onChange={(e) => setProfile({ ...profile, career_goals: e.target.value })}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Profile"
        )}
      </Button>
    </form>
  );
}
