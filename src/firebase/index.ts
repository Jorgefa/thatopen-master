import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_8LGL4hcmkgsft84WXH_BVCgfAmHQzzU",
  authDomain: "bim-dev-master-d1a5b.firebaseapp.com",
  projectId: "bim-dev-master-d1a5b",
  storageBucket: "bim-dev-master-d1a5b.appspot.com",
  messagingSenderId: "614427913592",
  appId: "1:614427913592:web:01985bb027ba89c8a0ac8d"
};

const app = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(app);