import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { 
  signUp as authSignUp, 
  login as authLogin, 
  logout as authLogout, 
  getCurrentUser, 
  resetPassword as authResetPassword,
  signInWithGoogle as authSignInWithGoogle,
  onAuthStateChange,
  AuthResponse 
} from "@/lib/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const unsubscribe = onAuthStateChange((user, session) => {
      setUser(user);
      setSession(session);
      setLoading(false);
    });

    // THEN check for existing session
    getCurrentUser().then(({ user, session }) => {
      setUser(user);
      setSession(session);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    return authSignUp(email, password);
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    return authLogin(email, password);
  };

  const logout = async (): Promise<AuthResponse> => {
    return authLogout();
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    return authResetPassword(email);
  };

  const signInWithGoogle = async (): Promise<AuthResponse> => {
    return authSignInWithGoogle();
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    signUp,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
  };
};
