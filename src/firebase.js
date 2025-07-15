import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoxcLtcX2PWw4BfaMntKw1nev4dEBTpMI",
  authDomain: "talk-more-tonight.firebaseapp.com",
  projectId: "talk-more-tonight",
  storageBucket: "talk-more-tonight.appspot.com",
  messagingSenderId: "75138083455",
  appId: "1:75138083455:web:fc76c1fe4680854620ad4a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
