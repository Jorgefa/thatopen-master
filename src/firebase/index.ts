import * as Firestore from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC_8LGL4hcmkgsft84WXH_BVCgfAmHQzzU",
  authDomain: "bim-dev-master-d1a5b.firebaseapp.com",
  projectId: "bim-dev-master-d1a5b",
  storageBucket: "bim-dev-master-d1a5b.appspot.com",
  messagingSenderId: "614427913592",
  appId: "1:614427913592:web:01985bb027ba89c8a0ac8d"
};

const app = initializeApp(firebaseConfig);
export const firebaseDB = Firestore.getFirestore(app);

export function getCollection<T>(path: string) {
  return Firestore.collection(firebaseDB, path)as Firestore.CollectionReference<T>
}

export async function deleteDocument(path: string, id: string) {
  const doc = Firestore.doc(firebaseDB, `${path}/${id}`)
  await Firestore.deleteDoc(doc)
}

export async function updateDocument<T extends Record<string, any>>(path: string, id: string, data: T) {
  const doc = Firestore.doc(firebaseDB, `${path}/${id}`)
  await Firestore.updateDoc(doc, data)
}
