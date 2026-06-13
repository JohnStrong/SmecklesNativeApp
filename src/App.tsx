import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

import PersonsPage from './pages/PersonsPage';
import BudgetingPage from './pages/BudgetingPage';

import { AuthProvider } from './auth/AuthProvider';
import { firebaseAuthAdapter } from './auth/adapters/firebaseAuth';
import AuthGate from './auth/AuthGate';
  
const App: React.FC = () => (
  <IonApp>
    <AuthProvider adapter={firebaseAuthAdapter}>
      <AuthGate>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/" component={PersonsPage} />
            <Route path="/person/:name" component={BudgetingPage} />
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthGate>
    </AuthProvider>
  </IonApp>
);

export default App;
