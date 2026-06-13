import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from './AuthProvider';
import AuthGate from './AuthGate';
import { AuthAdapter } from './types';

vi.mock('../config/appConfig', () => ({
  default: { auth: { allowList: ['allowed@test.com'] } },
}));

const mockAdapter = (user = null): AuthAdapter => ({
  onAuthChanged: (cb) => { cb(user); return () => {}; },
  signIn: vi.fn().mockResolvedValue(undefined),
  signOut: vi.fn().mockResolvedValue(undefined),
});

describe('AuthGate', () => {
  it('shows sign-in button when not authenticated', () => {
    render(
      <AuthProvider adapter={mockAdapter()}>
        <AuthGate><span>app content</span></AuthGate>
      </AuthProvider>
    );
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.queryByText('app content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated with allowed email', () => {
    const user = { email: 'allowed@test.com', displayName: 'A', token: () => Promise.resolve('tok') };
    render(
      <AuthProvider adapter={mockAdapter(user as any)}>
        <AuthGate><span>app content</span></AuthGate>
      </AuthProvider>
    );
    expect(screen.getByText('app content')).toBeInTheDocument();
  });

  it('shows access denied and calls signOut for disallowed email', () => {
    const adapter = mockAdapter({ email: 'hacker@evil.com', displayName: 'H', token: () => Promise.resolve('tok') } as any);
    render(
      <AuthProvider adapter={adapter}>
        <AuthGate><span>app content</span></AuthGate>
      </AuthProvider>
    );
    expect(screen.getByText('Access denied')).toBeInTheDocument();
    expect(screen.queryByText('app content')).not.toBeInTheDocument();
    expect(adapter.signOut).toHaveBeenCalled();
  });

  it('calls signIn when button is clicked', () => {
    const adapter = mockAdapter();
    render(
      <AuthProvider adapter={adapter}>
        <AuthGate><span>app content</span></AuthGate>
      </AuthProvider>
    );
    fireEvent.click(screen.getByText('Sign in with Google'));
    expect(adapter.signIn).toHaveBeenCalled();
  });
});
