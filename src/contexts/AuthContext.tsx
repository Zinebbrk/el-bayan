import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, 'User:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      // Profile will be created automatically by database trigger
      // No need to manually create it - the trigger handles it securely
      // The trigger runs with SECURITY DEFINER, so it bypasses RLS

      console.log('Signup successful, user:', data.user?.id);
      console.log('Session after signup:', data.session ? 'exists' : 'missing');
      
      // If no session was created (email confirmation enabled), try to sign in automatically
      // This handles the case where email confirmation is disabled but session isn't created
      if (!data.session && data.user) {
        console.log('No session after signup, attempting auto sign-in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.warn('Auto sign-in failed (this is normal if email confirmation is required):', signInError.message);
          // Don't return error - user was created, they just need to confirm email
        } else {
          console.log('Auto sign-in successful!');
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign-in error:', error);
        // Provide more helpful error message for email confirmation
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          return { 
            error: { 
              ...error, 
              message: 'Email not confirmed. If you disabled email confirmation in Supabase, you may need to delete this user and register again. Go to Supabase Dashboard → Authentication → Users → Delete user → Register again.' 
            } 
          };
        }
        if (error.message.includes('Invalid login credentials')) {
          return { 
            error: { 
              ...error, 
              message: 'Invalid credentials. If you just registered, you may need to confirm your email first. Check your email inbox or disable email confirmation in Supabase settings.' 
            } 
          };
        }
        return { error };
      }

      console.log('Sign-in successful, user:', data.user?.id);

      // Update last active date
      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({ last_active_date: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      return { error: null };
    } catch (error) {
      console.error('Sign-in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
