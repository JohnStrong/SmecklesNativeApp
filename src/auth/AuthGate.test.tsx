import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from './AuthProvider';
import AuthGate from './AuthGate';
import { AuthAdapter } from './types';

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

  it('renders children when authenticated', () => {
    const user = { email: 'a@b.com', displayName: 'A', token: () => Promise.resolve('tok') };
    render(
      <AuthProvider adapter={mockAdapter(user as any)}>
        <AuthGate><span>app content</span></AuthGate>
      </AuthProvider>
    );
    expect(screen.getByText('app content')).toBeInTheDocument();
    expect(screen.queryByText('Sign in with Google')).not.toBeInTheDocument();
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
