// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Signup = async (Username, Email, Password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, Email, Password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,

      Username: Username.toLowerCase(),
      Email,
      name: "",
      avtar: "",
      bio: "hey there , i am using Hi5",
      Password,
      lastseen: Date.now(),
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatdata: [],
    });
  } catch (error) {
    alert(error);
    console.log(error);
  }
};
const LogIn = async (Email, Password) => {
  try {
    await signInWithEmailAndPassword(auth, Email, Password);
  } catch (error) {
    alert(error);
  }
};
const Logout = async () => {
  try {
    alert("are sure you want to logout?");
    await signOut(auth);
  } catch (error) {
    alert(error);
  }
};
export { Signup, LogIn, Logout, auth, db };
