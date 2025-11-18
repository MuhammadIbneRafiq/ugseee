import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  referral_source: string | null;
  avatar_url: string | null;
}

interface UserSubscription {
  id: string;
  user_id: string;
  credits_remaining: number;
  credits_total: number;
  status: string;
  plan_id: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization?: string;
  referralSource?: string;
  credits: number;
  isSubscribed: boolean;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  consumeCredit: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch subscription
      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subError) throw subError;

      return {
        id: userId,
        email: profile.email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        organization: profile.organization || '',
        referralSource: profile.referral_source || '',
        credits: subscription.credits_remaining,
        isSubscribed: subscription.status === 'active',
        avatarUrl: profile.avatar_url || undefined,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer user data fetching to avoid auth state deadlock
          setTimeout(async () => {
            const userData = await fetchUserData(session.user.id);
            setUser(userData);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(async () => {
          const userData = await fetchUserData(session.user.id);
          setUser(userData);
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const register = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user || !session?.user) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          organization: userData.organization,
          referral_source: userData.referralSource,
          avatar_url: userData.avatarUrl,
        })
        .eq('user_id', session.user.id);

      if (profileError) throw profileError;

      // Update local state
      setUser({ ...user, ...userData });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const consumeCredit = async (): Promise<boolean> => {
    if (!user || !session?.user || user.credits <= 0) return false;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ credits_remaining: user.credits - 1 })
        .eq('user_id', session.user.id);

      if (error) throw error;

      setUser({ ...user, credits: user.credits - 1 });
      return true;
    } catch (error) {
      console.error('Error consuming credit:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session?.user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        consumeCredit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};