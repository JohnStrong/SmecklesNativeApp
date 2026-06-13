/**
 * AuthGate — renders children only when the user is authenticated
 * and their email is in the allow list.
 *
 * If not signed in, displays "Sign in with Google".
 * If signed in but not allowed, signs out and shows "Access denied".
 */
import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useAuth } from './AuthProvider';
import appConfig from '../config/appConfig';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signIn, signOut } = useAuth();

  if (!user) return (
    <IonPage>
      <IonContent className="ion-text-center ion-padding">
        <h2>Smeckles</h2>
        <IonButton onClick={signIn}>Sign in with Google</IonButton>
      </IonContent>
    </IonPage>
  );

  if (!appConfig.auth.allowList.includes(user.email)) {
    signOut();
    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <p>Access denied</p>
        </IonContent>
      </IonPage>
    );
  }

  return <>{children}</>;
};

export default AuthGate;
