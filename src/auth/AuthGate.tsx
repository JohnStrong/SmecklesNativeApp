/**
 * AuthGate — renders children only when the user is authenticated
 * and their email is in the allow list.
 *
 * If not signed in, displays "Sign in with Google".
 * If signed in but not allowed, signs out and shows "Access denied".
 */
import { useState } from 'react';
import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useAuth } from './AuthProvider';
import appConfig from '../config/appConfig';

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signIn, signOut } = useAuth();
  const [denied, setDenied] = useState(false);

  if (user && !appConfig.auth.allowList.includes(user.email)) {
    signOut();
    if (!denied) setDenied(true);
  }

  if (denied && !user) return (
    <IonPage>
      <IonContent className="ion-text-center ion-padding">
        <p>Access denied</p>
      </IonContent>
    </IonPage>
  );

  if (!user) return (
    <IonPage>
      <IonContent className="ion-text-center ion-padding">
        <h2>Smeckles</h2>
        <IonButton onClick={() => { setDenied(false); signIn(); }}>Sign in with Google</IonButton>
      </IonContent>
    </IonPage>
  );

  return <>{children}</>;
};

export default AuthGate;
