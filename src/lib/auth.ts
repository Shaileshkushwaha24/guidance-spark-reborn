import { supabase } from "@/integrations/supabase/client";
import { User, Session, AuthError } from "@supabase/supabase-js";

// ============================================
// AUTH RESPONSE TYPES
// ============================================

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User | null;
  session?: Session | null;
  error?: AuthError | null;
}

// ============================================
// ERROR MESSAGES (Human-readable)
// ============================================

const getErrorMessage = (error: AuthError): string => {
  const errorMessages: Record<string, string> = {
    "Invalid login credentials": "Email or password is incorrect",
    "Email not confirmed": "Please verify your email before signing in",
    "User already registered": "An account with this email already exists",
    "Password should be at least 6 characters": "Password must be at least 6 characters",
    "Invalid email": "Please enter a valid email address",
    "Signup requires a valid password": "Please enter a valid password",
    "Email rate limit exceeded": "Too many attempts. Please try again later",
  };

  return errorMessages[error.message] || error.message;
};

// ============================================
// AUTH FUNCTIONS
// ============================================

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Basic validation
    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      return {
        success: false,
        message: getErrorMessage(error),
        error,
      };
    }

    return {
      success: true,
      message: "Account created successfully!",
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Login user with email and password
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Basic validation
    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }

    if (!password) {
      return {
        success: false,
        message: "Please enter your password",
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return {
        success: false,
        message: getErrorMessage(error),
        error,
      };
    }

    return {
      success: true,
      message: "Signed in successfully!",
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Logout current user
 */
export const logout = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: getErrorMessage(error),
        error,
      };
    }

    return {
      success: true,
      message: "Logged out successfully!",
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<{
  user: User | null;
  session: Session | null;
}> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      user: session?.user ?? null,
      session: session ?? null,
    };
  } catch (err) {
    return {
      user: null,
      session: null,
    };
  }
};

/**
 * Reset password - sends reset email
 */
export const resetPassword = async (email: string): Promise<AuthResponse> => {
  try {
    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/`,
    });

    if (error) {
      return {
        success: false,
        message: getErrorMessage(error),
        error,
      };
    }

    return {
      success: true,
      message: "Password reset email sent! Check your inbox.",
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Google OAuth sign in
 */
export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      return {
        success: false,
        message: getErrorMessage(error),
        error,
      };
    }

    return {
      success: true,
      message: "Redirecting to Google...",
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

/**
 * Subscribe to auth state changes
 * Returns unsubscribe function
 */
export const onAuthStateChange = (
  callback: (user: User | null, session: Session | null) => void
) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session?.user ?? null, session ?? null);
    }
  );

  return () => subscription.unsubscribe();
};
