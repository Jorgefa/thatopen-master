import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAkYexzjufLcJxGjQ4IBs0wHsKIpKQy9uM",
  authDomain: "bim-dev-master-3edda.firebaseapp.com",
  projectId: "bim-dev-master-3edda",
  storageBucket: "bim-dev-master-3edda.appspot.com",
  messagingSenderId: "924916602634",
  appId: "1:924916602634:web:06123053d6eaa77ccd0cf3"
};

const app = initializeApp(firebaseConfig)
export const firebaseDB = getFirestore()