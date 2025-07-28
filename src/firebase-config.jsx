import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZDPyFjxZo02dQUPocIcqjd4yaUPSsj6Y",
  authDomain: "writeon-bd926.firebaseapp.com",
  projectId: "writeon-bd926",
  storageBucket: "writeon-bd926.firebasestorage.app",
  messagingSenderId: "117698739426",
  appId: "1:117698739426:web:36f57f2f47826c032532bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
