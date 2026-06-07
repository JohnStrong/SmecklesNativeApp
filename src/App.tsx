import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

import PersonsPage from './pages/PersonsPage';
import BudgetingPage from './pages/BudgetingPage';

const App: React.FC = () => (
  <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={PersonsPage} />
          <Route path="/person/:name" component={BudgetingPage} />
        </IonRouterOutlet>
      </IonReactRouter>
  </IonApp>
);

export default App;
