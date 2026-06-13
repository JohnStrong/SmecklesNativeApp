/**
 * Represents an authenticated user in the app.
 * Decoupled from any specific auth provider (Firebase, Auth0, etc).
 */
export interface AuthUser {
    email: string;
    displayName: string | null;
    /** Returns a JWT ID token for authenticating API calls to the backend. */
    token: () => Promise<string>;
}

/**
 * Auth adapter interface — abstracts the auth provider so the app
 * can switch providers (Firebase, Cognito, Auth0) without changing
 * business logic or UI components.
 */
export interface AuthAdapter {
    /** Subscribes to auth state changes. Returns an unsubscribe function. */
    onAuthChanged: (cb: (user: AuthUser | null) => void) => () => void;
    /** Triggers the sign-in flow (e.g. popup, redirect). */
    signIn: () => Promise<void>;
    /** Signs the current user out. */
    signOut: () => Promise<void>;
}
