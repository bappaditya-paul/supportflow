import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '../types';

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
  name: 'Hackathon Judge',
  email: 'judge@fliptheswitch.dev',
  role: 'judge',
  roleTitle: 'Guest Evaluator · Track 1',
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
  logout: () => void;
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

  const loginWithCredentials = async (email: string): Promise<AuthUser> => {
    // Simulate real auth network latency (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));
    
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
    await new Promise((resolve) => setTimeout(resolve, 450));
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

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAs,
        loginWithCredentials,
        signupWithCredentials,
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
