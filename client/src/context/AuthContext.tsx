import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '../types';
import { supabase } from '../lib/supabase';

export const DEMO_OPERATOR: AuthUser = {
  id: 'usr-op-01',
  name: 'Alex Rivera',
  email: 'operator@supportflow.ai',
  role: 'operator',
  roleTitle: 'Lead Tier-2 Operator',
  workspace: 'SupportFlow · Pro Swarm',
  avatarSeed: 'alex',
  token: 'sf_demo_tok_operator_34079',
};

export const DEMO_FOUNDER: AuthUser = {
  id: 'usr-fnd-02',
  name: 'Sarah Chen',
  email: 'founder@startup.io',
  role: 'admin',
  roleTitle: 'Founder & Infrastructure Admin',
  workspace: 'CloudDesk HQ',
  avatarSeed: 'sarah',
  token: 'sf_demo_tok_founder_34079',
};

export const DEMO_JUDGE: AuthUser = {
  id: 'usr-jdg-03',
  name: 'Guest Auditor & Evaluator',
  email: 'evaluator@supportflow.ai',
  role: 'judge',
  roleTitle: 'Guest Evaluator · Governance Audit',
  workspace: 'Evaluation Sandbox',
  avatarSeed: 'judge',
  token: 'sf_demo_tok_judge_34079',
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginAs: (preset: AuthUser) => void;
  loginWithCredentials: (email: string, password?: string) => Promise<AuthUser>;
  signupWithCredentials: (name: string, email: string, workspace: string) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'supportflow_session_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default to DEMO_OPERATOR so initial loads are ready and not empty
    return DEMO_OPERATOR;
  });

  // Sync Supabase Auth session & OAuth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const supaUser = session.user;
        const mappedUser: AuthUser = {
          id: supaUser.id,
          name:
            supaUser.user_metadata?.full_name ||
            supaUser.user_metadata?.name ||
            supaUser.email?.split('@')[0] ||
            'Operator',
          email: supaUser.email || 'operator@supportflow.ai',
          role: (supaUser.user_metadata?.role as any) || 'operator',
          roleTitle: 'Verified Google Operator',
          workspace: supaUser.user_metadata?.workspace || 'SupportFlow · Pro Swarm',
          avatarSeed: supaUser.email || 'operator',
          token: session.access_token,
        };
        setUser(mappedUser);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const supaUser = session.user;
        const mappedUser: AuthUser = {
          id: supaUser.id,
          name:
            supaUser.user_metadata?.full_name ||
            supaUser.user_metadata?.name ||
            supaUser.email?.split('@')[0] ||
            'Operator',
          email: supaUser.email || 'operator@supportflow.ai',
          role: (supaUser.user_metadata?.role as any) || 'operator',
          roleTitle: 'Verified Google Operator',
          workspace: supaUser.user_metadata?.workspace || 'SupportFlow · Pro Swarm',
          avatarSeed: supaUser.email || 'operator',
          token: session.access_token,
        };
        setUser(mappedUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const loginAs = (preset: AuthUser) => {
    setUser(preset);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      console.warn('Supabase Google OAuth initiation warning:', error.message);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      console.warn('Supabase GitHub OAuth initiation warning:', error.message);
      throw error;
    }
  };

  const loginWithCredentials = async (email: string, password?: string): Promise<AuthUser> => {
    // Attempt Supabase Password Auth if password is provided and not default mock
    if (password && !password.includes('•')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.session?.user) {
          const supaUser = data.session.user;
          const authUser: AuthUser = {
            id: supaUser.id,
            name:
              supaUser.user_metadata?.full_name ||
              supaUser.user_metadata?.name ||
              email.split('@')[0],
            email,
            role: (supaUser.user_metadata?.role as any) || 'operator',
            roleTitle: 'Verified Operator',
            workspace: supaUser.user_metadata?.workspace || 'SupportFlow · Swarm',
            avatarSeed: email,
            token: data.session.access_token,
          };
          setUser(authUser);
          return authUser;
        }
      } catch (err) {
        console.warn('Supabase password login fallback to local persona:', err);
      }
    }

    // Fallback persona selection
    let authenticatedUser = DEMO_OPERATOR;
    if (email.toLowerCase().includes('founder') || email.toLowerCase().includes('admin')) {
      authenticatedUser = DEMO_FOUNDER;
    } else if (email.toLowerCase().includes('judge')) {
      authenticatedUser = DEMO_JUDGE;
    } else if (email !== DEMO_OPERATOR.email) {
      authenticatedUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'operator',
        roleTitle: 'Verified Operator',
        workspace: 'SupportFlow · Custom Swarm',
        avatarSeed: email,
        token: `sf_tok_${Date.now()}`,
      };
    }
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const signupWithCredentials = async (
    name: string,
    email: string,
    workspace: string
  ): Promise<AuthUser> => {
    // 1. Register business workspace with FastAPI backend
    try {
      const cleanDomain = (workspace || 'company')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') + '.io';
      await fetch('http://localhost:8000/api/v1/onboarding/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website_name: workspace || 'Acme Cloud Platform',
          domain: cleanDomain,
          framework: 'nextjs',
        }),
      });
    } catch (err) {
      console.warn('Backend website onboarding sync warning:', err);
    }

    // 2. Register with Supabase if online
    try {
      await supabase.auth.signUp({
        email,
        password: 'TemporaryPassword123!',
        options: {
          data: {
            full_name: name,
            workspace,
          },
        },
      });
    } catch (e) {
      console.warn('Supabase signup fallback:', e);
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: name || 'Demo User',
      email: email || 'demo@clouddesk.dev',
      role: 'admin',
      roleTitle: 'Workspace Owner',
      workspace: workspace || 'CloudDesk Org',
      avatarSeed: name || email,
      token: `sf_tok_${Date.now()}`,
    };
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAs,
        loginWithCredentials,
        signupWithCredentials,
        signInWithGoogle,
        signInWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
