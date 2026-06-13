import { useState } from 'react';
import { 
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { right } from '../util/Either';

const _contentPadding = {
    '--padding-start': '1.5rem',
    '--padding-end': '1.5rem',
    '--padding-top': '1.5rem',
    '--padding-bottom': '1.5rem',
     '--background': '#FAFAFA'
} as React.CSSProperties;

const _listItem = {
  '--background': '#FFFFFF',
  '--background-hover': '#FFF8E1',
  '--border-style': 'none',
  '--ion-item-background': 'transparent',
  border: '1px solid #E0E0E0',
  borderRadius: '8px',
  marginBottom: '0.5rem',
  overflow: 'hidden',
} as React.CSSProperties;

const addBtn = {
    '--background': '#00897B',
    '--background-hover': '#00695C',
    '--color': '#FFFFFF',
} as React.CSSProperties;

const removeBtn = {
  '--background': '#E53935',
  '--background-hover': '#C62828',
  '--color': '#FFFFFF',
} as React.CSSProperties;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const PersonsPage: React.FC = () => {
    const [persons, setPersons] = useState<string[]>([]);
    const [name, setName] = useState('');
    const [emailError, setEmailError] = useState('');
    const history = useHistory(); // for view routing

     const addPerson = () => {
      right<string, string>(name.trim())
        .filter((value: string) => value.length > 0,  "cannot be empty - Please enter a valid email address")
        .filter((value: string) =>  EMAIL_REGEX.test(value), "invalid pattern - Please enter a valid email address")
        .filter((value: string) => !persons.includes(value), "email already exists")
        .onLeft((error) => setEmailError(error))
        .onRight((value) => { setPersons(prev => [...prev, value]); setName(''); setEmailError(''); });
     };

    const removePerson = (index: number) => {
      setPersons(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    }

    if (persons.length === 0) {
      // no person(s) added yet
      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Smeckles</IonTitle>
            </IonToolbar>
         </IonHeader>
          <IonContent style={_contentPadding} className="ion-text-center">
            <div className="ion-margin-top" style={{ marginTop: '10vh' }}>
              <h2>New here?</h2>
              <form onSubmit={e => { e.preventDefault(); addPerson(); }}>
                <IonInput placeholder="Enter your email" value={name} onIonInput={e => setName(e.detail.value ?? '')} />
                <IonButton expand="block" style={addBtn} onClick={addPerson}>Add</IonButton>
                {emailError && <p style={{ color: '#E53935', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>{emailError}</p>}
              </form>
            </div>
          </IonContent>
        </IonPage>
      );
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Smeckles</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={_contentPadding}>
          <IonList style={{ background: 'transparent' }}>
            {persons.map((person, index) => (
              <IonItem key={person} button style={_listItem} onClick={() => history.push(`/person/${person}`)}>
                <IonLabel>{person}</IonLabel>
                <IonButton slot="end" onClick={(e) => { e.stopPropagation(); removePerson(index); }} style={removeBtn}>-</IonButton>
              </IonItem>
            ))}
          </IonList>
          <form onSubmit={e => { e.preventDefault(); addPerson(); }} style={{ display: 'flex', gap: '0.5rem' }}>
            <IonInput type="email" placeholder="Enter your email" value={name} onIonInput={e => setName(e.detail.value ?? '')} />
            <IonButton onClick={addPerson} style={addBtn}>Add</IonButton>
          </form>
          {emailError && <p style={{ color: '#E53935', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>{emailError}</p>}
        </IonContent>
      </IonPage>  
    );
}

export default PersonsPage;

