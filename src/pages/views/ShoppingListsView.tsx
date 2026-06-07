 
import { useParams } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import { Link } from 'react-router-dom';
import BudgetingHeader from '../common/Header';

const _mainContentStyle = { 
    '--padding-start': '1.5rem', '--padding-end': '1.5rem', '--padding-top': '1rem' 
} as React.CSSProperties;
  
const ShoppingListsView: React.FC = () => {
    const { name } = useParams<{ name: string }>();

    return (
       <IonPage>
            <BudgetingHeader />
            <IonContent>
                <nav style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                    <Link to="/" style={{ color: '#00897B', textDecoration: 'none' }}>Persons</Link>
                    <span style={{ color: '#757575' }}> &gt; </span>
                    <span style={{ color: '#212121' }}> Expenses ({name})</span>
                    <span style={{ color: '#757575' }}> &gt; </span>
                    <span style={{ color: '#212121' }}>Shopping Lists</span>
                </nav>
                <p>No shopping lists yet.</p>
            </IonContent>
        </IonPage>
    );
};

export default ShoppingListsView;
