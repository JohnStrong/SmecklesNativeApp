import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../config/firebase', () => ({
  auth: {},
  googleProvider: { providerId: 'google.com' },
}));

const mockUnsubscribe = vi.fn();
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_, cb) => { cb(null); return mockUnsubscribe; }),
  signInWithPopup: vi.fn().mockResolvedValue({}),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

import { firebaseAuthAdapter } from './firebaseAuth';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

describe('firebaseAuthAdapter', () => {
  beforeEach(() => vi.clearAllMocks());

  it('onAuthChanged subscribes and returns unsubscribe', () => {
    const cb = vi.fn();
    const unsub = firebaseAuthAdapter.onAuthChanged(cb);
    expect(onAuthStateChanged).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledWith(null);
    expect(unsub).toBe(mockUnsubscribe);
  });

  it('onAuthChanged maps Firebase user to AuthUser', () => {
    const fakeUser = { email: 'a@b.com', displayName: 'A', getIdToken: () => Promise.resolve('tok') };
    (onAuthStateChanged as any).mockImplementation((_, cb: any) => { cb(fakeUser); return mockUnsubscribe; });

    const cb = vi.fn();
    firebaseAuthAdapter.onAuthChanged(cb);

    const mapped = cb.mock.calls[0][0];
    expect(mapped.email).toBe('a@b.com');
    expect(mapped.displayName).toBe('A');
    expect(mapped.token()).resolves.toBe('tok');
  });

  it('signIn calls signInWithPopup', async () => {
    await firebaseAuthAdapter.signIn();
    expect(signInWithPopup).toHaveBeenCalled();
  });

  it('signOut calls signOut', async () => {
    await firebaseAuthAdapter.signOut();
    expect(signOut).toHaveBeenCalled();
  });
});
