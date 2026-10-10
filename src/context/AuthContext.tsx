'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  role: 'traveler' | 'admin';
  points: number; // Redeemable current balance
  total_earned_points?: number; // Lifetime competitive earned total
  badge_title?: string;
  rank?: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile;
  role: 'traveler' | 'admin';
  isLoading: boolean;
  isDemoUser: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  switchDemoRole: (newRole: 'traveler' | 'admin') => void;
  refreshProfile: () => Promise<void>;
}

const DEFAULT_DEMO_TRAVELER: UserProfile = {
  id: 'u6',
  username: 'alex_mercer',
  display_name: 'Alex Mercer',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  role: 'traveler',
  points: 850,
  total_earned_points: 1350,
  badge_title: 'Alpine Voyager',
  rank: 6,
};

const DEFAULT_DEMO_ADMIN: UserProfile = {
  id: 'admin-01',
  username: 'clara_admin',
  display_name: 'Clara Vance (Admin)',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  points: 4200,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: DEFAULT_DEMO_TRAVELER,
  role: 'traveler',
  isLoading: true,
  isDemoUser: true,
  signInWithEmail: async () => ({}),
  signUpWithEmail: async () => ({}),
  signOut: async () => {},
  switchDemoRole: () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_DEMO_TRAVELER);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(true);

  const supabase = createClient();

  const fetchSupabaseProfile = async (supabaseUser: User) => {
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const { data: ledger } = await supabase
        .from('point_ledger')
        .select('points_delta')
        .eq('user_id', supabaseUser.id);

      const pts = (ledger || []).reduce((sum: number, l: any) => sum + (l.points_delta || 0), 0);

      if (prof) {
        setProfile({
          id: prof.id,
          username: prof.username,
          display_name: prof.display_name,
          avatar_url: prof.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: prof.role as 'traveler' | 'admin',
          points: pts,
        });
        setIsDemoUser(false);
      }
    } catch (err) {
      console.warn('Error fetching Supabase user profile:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUser(data.user);
          await fetchSupabaseProfile(data.user);
        } else {
          // Default to traveler demo profile for instant evaluation
          setProfile(DEFAULT_DEMO_TRAVELER);
          setIsDemoUser(true);
        }
      } catch (err) {
        console.warn('Init auth fallback to demo profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchSupabaseProfile(session.user);
      } else {
        setUser(null);
        setProfile(DEFAULT_DEMO_TRAVELER);
        setIsDemoUser(true);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    if (data.user) {
      setUser(data.user);
      await fetchSupabaseProfile(data.user);
    }
    return {};
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          username: displayName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        },
      },
    });
    if (error) {
      return { error: error.message };
    }
    return {
      message: 'Registration successful! If email confirmation is enabled, please verify your email.',
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(DEFAULT_DEMO_TRAVELER);
    setIsDemoUser(true);
    if (typeof document !== 'undefined') {
      document.cookie = 'tt_demo_role=; path=/; max-age=0; SameSite=Lax';
    }
  };

  const switchDemoRole = (newRole: 'traveler' | 'admin') => {
    if (newRole === 'admin') {
      setProfile(DEFAULT_DEMO_ADMIN);
    } else {
      setProfile(DEFAULT_DEMO_TRAVELER);
    }
    setIsDemoUser(true);
    if (typeof document !== 'undefined') {
      document.cookie = `tt_demo_role=${newRole}; path=/; max-age=86400; SameSite=Lax`;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchSupabaseProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile.role,
        isLoading,
        isDemoUser,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        switchDemoRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
