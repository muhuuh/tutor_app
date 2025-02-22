import { createClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for changes in auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "USER_UPDATED") {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log("Attempting to sign up user:", email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          // Optional custom metadata
          email_confirmed: false,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);
      throw error;
    }

    console.log("Signup response:", data);

    // Check if the user was created
    if (data.user) {
      console.log(
        "User created successfully, confirmation email should be sent"
      );
      console.log("Email confirmation status:", data.user.email_confirmed_at);
      console.log("User ID:", data.user.id);
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    console.log("Attempting to sign in user:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }

    console.log(
      "Sign in successful:",
      data.user?.email_confirmed_at ? "Email verified" : "Email not verified"
    );
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
