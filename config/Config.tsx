
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyDCsynZepPniUAWQsOwP5YLEuiV8jUKZxc",
  authDomain: "app-login-13c72.firebaseapp.com",
  databaseURL: "https://app-login-13c72-default-rtdb.firebaseio.com",
  projectId: "app-login-13c72",
  storageBucket: "app-login-13c72.appspot.com",
  messagingSenderId: "580578977514",
  appId: "1:580578977514:web:ed511726ac53a4ba9e1993"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);