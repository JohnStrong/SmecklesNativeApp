import React from 'react';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

import PersonsPage from './pages/PersonsPage';

const App: React.FC = () => (
  <IonApp>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Smeckles</IonTitle>
      </IonToolbar>
    </IonHeader>
    <PersonsPage />
  </IonApp>
);

export default App;
