import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload, User as UserIcon, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface CounselorProfileFormProps {
  user: User;
}

export default function CounselorProfileForm({ user }: CounselorProfileFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: user.email || "",
    phone: "",
    specialization: [] as string[],
    experience_years: 0,
    qualifications: "",
    bio: "",
    hourly_rate: 0,
    profile_picture_url: "",
    verification_document_url: "",
    is_available: true,
  });
  const [newSpecialization, setNewSpecialization] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("counselor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        specialization: data.specialization || [],
        experience_years: data.experience_years || 0,
        qualifications: data.qualifications || "",
        bio: data.bio || "",
        hourly_rate: data.hourly_rate || 0,
        profile_picture_url: data.profile_picture_url || "",
        verification_document_url: data.verification_document_url || "",
        is_available: data.is_available ?? true,
      });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "picture" | "document") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (type === "picture") {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
    } else {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
    }

    type === "picture" ? setUploading(true) : setUploadingDoc(true);
    
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = type === "picture" 
        ? `${user.id}/profile-picture.${fileExt}`
        : `${user.id}/verification-document.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("profile-assets")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("profile-assets")
        .getPublicUrl(fileName);

      if (type === "picture") {
        setProfile({ ...profile, profile_picture_url: publicUrl });
        toast.success("Profile picture uploaded");
      } else {
        setProfile({ ...profile, verification_document_url: publicUrl });
        toast.success("Verification document uploaded");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      type === "picture" ? setUploading(false) : setUploadingDoc(false);
    }
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !profile.specialization.includes(newSpecialization.trim())) {
      setProfile({ ...profile, specialization: [...profile.specialization, newSpecialization.trim()] });
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setProfile({ ...profile, specialization: profile.specialization.filter(s => s !== spec) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("counselor_profiles")
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
            onChange={(e) => handleFileUpload(e, "picture")}
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
          <Label htmlFor="experience_years">Years of Experience</Label>
          <Input
            id="experience_years"
            type="number"
            min="0"
            value={profile.experience_years}
            onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
          <Input
            id="hourly_rate"
            type="number"
            min="0"
            step="0.01"
            value={profile.hourly_rate}
            onChange={(e) => setProfile({ ...profile, hourly_rate: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_available" className="flex items-center gap-2">
            <span>Currently Available</span>
            <Switch
              id="is_available"
              checked={profile.is_available}
              onCheckedChange={(checked) => setProfile({ ...profile, is_available: checked })}
            />
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization Areas</Label>
        <div className="flex gap-2">
          <Input
            id="specialization"
            placeholder="Add specialization (e.g., Career Counseling, College Admissions)"
            value={newSpecialization}
            onChange={(e) => setNewSpecialization(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
          />
          <Button type="button" onClick={addSpecialization} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.specialization.map((spec) => (
            <Badge key={spec} variant="secondary" className="cursor-pointer" onClick={() => removeSpecialization(spec)}>
              {spec} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="qualifications">Qualifications & Certifications</Label>
        <Textarea
          id="qualifications"
          placeholder="List your degrees, certifications, and credentials"
          value={profile.qualifications}
          onChange={(e) => setProfile({ ...profile, qualifications: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell students about your background and expertise"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="verification-document">Verification Document</Label>
        <Label htmlFor="verification-document" className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors">
            {uploadingDoc ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>
              {uploadingDoc 
                ? "Uploading..." 
                : profile.verification_document_url 
                  ? "Document uploaded - Click to change"
                  : "Upload verification document (degree, license, etc.)"}
            </span>
          </div>
          <Input
            id="verification-document"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, "document")}
            className="hidden"
          />
        </Label>
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
