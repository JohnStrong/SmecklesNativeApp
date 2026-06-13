/**
 * AuthGate — renders children only when the user is authenticated.
 *
 * If no user is signed in, displays a "Sign in with Google" button.
 * Used in App.tsx to wrap all routes, preventing unauthenticated access.
 */
import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useAuth } from './AuthProvider';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signIn } = useAuth();
  if (!user) return (
    <IonPage>
      <IonContent className="ion-text-center ion-padding">
        <h2>Smeckles</h2>
        <IonButton onClick={signIn}>Sign in with Google</IonButton>
      </IonContent>
    </IonPage>
  );
  return <>{children}</>;
};

export default AuthGate;
