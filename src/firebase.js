// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";   

const firebaseConfig = {
  apiKey: "AIzaSyCBao1XuBNSuZGA4mVlTomj7Ut1xOInDiE",
  authDomain: "task71-57c06.firebaseapp.com",
  projectId: "task71-57c06",
  storageBucket: "task71-57c06.appspot.com",
  messagingSenderId: "791132787706",
  appId: "1:791132787706:web:33bff84d10af98365c4a43"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);   
