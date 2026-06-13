import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';
import { AuthAdapter } from './types';

const mockAdapter = (user = null): AuthAdapter => ({
  onAuthChanged: (cb) => { cb(user); return () => {}; },
  signIn: vi.fn().mockResolvedValue(undefined),
  signOut: vi.fn().mockResolvedValue(undefined),
});

const TestConsumer: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  return (
    <div>
      <span data-testid="user">{user?.email ?? 'none'}</span>
      <button onClick={signIn}>sign-in</button>
      <button onClick={signOut}>sign-out</button>
    </div>
  );
};

describe('AuthProvider', () => {
  it('provides null user when not authenticated', () => {
    render(<AuthProvider adapter={mockAdapter()}><TestConsumer /></AuthProvider>);
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  it('provides user when authenticated', () => {
    const user = { email: 'a@b.com', displayName: 'A', token: () => Promise.resolve('tok') };
    render(<AuthProvider adapter={mockAdapter(user as any)}><TestConsumer /></AuthProvider>);
    expect(screen.getByTestId('user').textContent).toBe('a@b.com');
  });

  it('calls adapter signIn when signIn is invoked', () => {
    const adapter = mockAdapter();
    render(<AuthProvider adapter={adapter}><TestConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText('sign-in'));
    expect(adapter.signIn).toHaveBeenCalled();
  });

  it('calls adapter signOut when signOut is invoked', () => {
    const adapter = mockAdapter();
    render(<AuthProvider adapter={adapter}><TestConsumer /></AuthProvider>);
    fireEvent.click(screen.getByText('sign-out'));
    expect(adapter.signOut).toHaveBeenCalled();
  });
});
