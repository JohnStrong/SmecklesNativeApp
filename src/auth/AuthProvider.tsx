/**
 * AuthProvider — React context provider that manages auth state.
 *
 * Accepts an AuthAdapter prop, making it provider-agnostic.
 * Wraps the app and exposes user state + signIn/signOut actions
 * via the useAuth() hook.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthAdapter } from './types';

interface AuthContextValue { user: AuthUser | null; signIn: () => void; signOut: () => void; }
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ adapter: AuthAdapter; children: ReactNode }> = ({ adapter, children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => adapter.onAuthChanged(setUser), []);
  return <AuthContext.Provider value={{ user, signIn: adapter.signIn, signOut: adapter.signOut }}>{children}</AuthContext.Provider>;
};

/** Hook to access auth state and actions from any component. */
export const useAuth = () => useContext(AuthContext)!;
