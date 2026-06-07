import { 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonMenuButton 
} from '@ionic/react';

const BudgetingHeader: React.FC = () => (
<IonHeader>
    <IonToolbar>
    <IonButtons slot="start"><IonMenuButton /></IonButtons>
    <IonTitle>Smeckles</IonTitle>
    </IonToolbar>
</IonHeader>
);

export default BudgetingHeader;
