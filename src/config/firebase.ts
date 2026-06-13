import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
  
const firebaseConfig = {
  "projectId": "smeckles-app-11ca3",
  "appId": "1:932374094311:web:0cdef02944a7c6fa171d42",
  "storageBucket": "smeckles-app-11ca3.firebasestorage.app",
  "apiKey": "AIzaSyCwB3r_-hdkita4o8IjzZdpbD486BcDr0M",
  "authDomain": "smeckles-app-11ca3.firebaseapp.com",
  "messagingSenderId": "932374094311",
  "measurementId": "G-WNH6BMK08E",
  "projectNumber": "932374094311",
  "version": "2"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();