# Authentication — How It Works

## Flow (plain English)

- User opens the app in their browser
- `App.tsx` renders `AuthProvider` which immediately asks Firebase "is anyone signed in?"
- Firebase replies with either a user or `null`
- `AuthGate` checks the answer:
  - **No user** → shows a "Sign in with Google" button, nothing else renders
  - **User exists** → renders the app (router, pages, etc.)
- When the user clicks "Sign in with Google", a popup opens, they pick their Google account
- Firebase confirms the sign-in and fires the auth state callback
- `AuthProvider` updates its state → `AuthGate` re-renders → app content appears

## Key Components

### `AuthProvider` (`src/auth/AuthProvider.tsx`)

Wraps the entire app. Listens to auth state changes and exposes `user`, `signIn`, `signOut` via React context.

```tsx
<AuthProvider adapter={firebaseAuthAdapter}>
  {/* everything inside can call useAuth() */}
</AuthProvider>
```

### `useAuth()` hook (`src/auth/AuthProvider.tsx`)

Any component can access auth state:

```tsx
const { user, signIn, signOut } = useAuth();
// user.email, user.displayName, user.token()
```

### `AuthGate` (`src/auth/AuthGate.tsx`)

Sits between `AuthProvider` and the router. Blocks rendering until signed in:

```tsx
<AuthGate>
  <IonReactRouter>...</IonReactRouter>
</AuthGate>
```

### `AuthAdapter` interface (`src/auth/types.ts`)

Defines the contract any auth provider must implement:

- `onAuthChanged(cb)` — subscribe to auth state, return unsubscribe function
- `signIn()` — trigger sign-in flow
- `signOut()` — sign the user out

### `firebaseAuthAdapter` (`src/auth/adapters/firebaseAuth.ts`)

The Firebase-specific implementation. Maps Firebase's `User` object to our `AuthUser` interface. This is the only file that imports from Firebase directly.

## Wiring in App.tsx

```tsx
import { AuthProvider } from './auth/AuthProvider';
import { firebaseAuthAdapter } from './auth/adapters/firebaseAuth';
import AuthGate from './auth/AuthGate';

<IonApp>
  <AuthProvider adapter={firebaseAuthAdapter}>  ← provides auth context
    <AuthGate>                                   ← blocks until signed in
      <IonReactRouter>                           ← app routes
        ...
      </IonReactRouter>
    </AuthGate>
  </AuthProvider>
</IonApp>
```

## Swapping provider

1. Create a new adapter in `src/auth/adapters/` implementing `AuthAdapter`
2. Change the import in `App.tsx`
3. Done — no other files change

## Email Allow List

Only emails listed in the allow list can use the app. Anyone else who signs in gets immediately signed out and sees "Access denied".

### How it works

- User signs in with Google (popup)
- `AuthGate` checks if `user.email` is in `appConfig.auth.allowList`
  - **Match** → app renders normally
  - **No match** → `signOut()` is called, "Access denied" is shown
- The allow list lives in `src/config/appConfig.ts`:

```ts
const appConfig = {
  auth: {
    allowList: ['johnstrongdublin@gmail.com'],
  },
};
```

### Adding a new allowed user

Add their email to the `allowList` array in `src/config/appConfig.ts`, rebuild, and redeploy.

### Relevant code

| File | What it does |
|------|-------------|
| `src/config/appConfig.ts` | Defines the allow list |
| `src/auth/AuthGate.tsx` | Checks email against allow list, signs out if denied |
