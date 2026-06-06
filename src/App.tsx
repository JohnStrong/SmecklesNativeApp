import React from 'react';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const App: React.FC = () => (
  <IonApp>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Smeckles</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <p>Welcome to Smeckles — your personal budgeting companion.</p>
    </IonContent>
  </IonApp>
);

export default App;
