import { useParams, useRouteMatch, Redirect, Route } from 'react-router-dom';
import {
    IonPage, 
    IonSplitPane, 
    IonContent, 
    IonMenu, 
    IonList, 
    IonItem, 
    IonLabel,
    IonMenuToggle, 
    IonRouterOutlet
} from '@ionic/react';
import ShoppingListsView from './views/ShoppingListsView';
import React from 'react';

import ExpenseCategory from '../models/ExpenseCategory';

// load from service 'features' table later (v2)
const _expenseCategories: ExpenseCategory[] = [
    { 
        name: 'Shopping Lists',
        description: 'Add/Mantain/View/Delete common shopping-list expenses against your budget'
    }
];

const _dividerStyle = { 
    '--min-height': '1px', 
    borderBottom: '1px solid #E0E0E0', 
    marginTop: '0.5rem', 
    marginBottom: '0.5rem' 
} as React.CSSProperties;

const _subCategoryStyle = {
    '--padding-start': '2rem' 
} as React.CSSProperties;

const BudgetingPage: React.FC = () => {
    // use name later find the persons expenses 
    const { name } = useParams<{ name: string }>();
    const { path, url } = useRouteMatch();
    
    return (
        <IonPage>
        <IonSplitPane contentId="budgeting-content" when={true}>
            <IonMenu contentId="budgeting-content">
                <IonContent>
                    <IonList>
                        <IonMenuToggle>
                            <IonItem lines="none" button routerLink="/">
                                <IonLabel>Persons</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        {/* Divider */}
                        <IonItem lines="none" style={_dividerStyle}/>
                        
                        <IonItem lines="none">
                            <IonLabel><strong>Expenses</strong></IonLabel>
                        </IonItem>
                        <IonMenuToggle>
                            {_expenseCategories.map((category) => (
                                <IonItem lines="none" key={category.name} button routerLink={`${url}/${category.name.toLowerCase().replace(/\s+/g, '-')}`} style={_subCategoryStyle}>
                                    <IonLabel><strong>{category.name}</strong></IonLabel>
                                </IonItem>
                            ))}
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
            </IonMenu>
            <IonRouterOutlet id="budgeting-content">
                {/* (v1) future: <Route exact path={`${path}/budget-summary`} component={BudgetSummaryView} /> */}
                <Route exact path={`${path}/shopping-lists`} component={ShoppingListsView} />
                {/* (v1) future: <Route exact path={`${path}/utility-bills`} component={UtilityBillsView} /> */}
                {/* (v1) future: <Route exact path={`${path}/rent-morgage`} component={RentOrMorgageView} /> */}
                {/* (v1) future: <Route exact path={`${path}/subscriptions`} component={SubscriptionsView} /> */}
                {/* (v2) future: + Add Custom Expense Category */}
                <Redirect exact from={path} to={`${url}/shopping-lists`} />
            </IonRouterOutlet>
        </IonSplitPane>
    </IonPage>
    );
};

export default BudgetingPage;
