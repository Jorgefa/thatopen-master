import * as Firestore from "firebase/firestore";
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyAkYexzjufLcJxGjQ4IBs0wHsKIpKQy9uM",
  authDomain: "bim-dev-master-3edda.firebaseapp.com",
  projectId: "bim-dev-master-3edda",
  storageBucket: "bim-dev-master-3edda.appspot.com",
  messagingSenderId: "924916602634",
  appId: "1:924916602634:web:06123053d6eaa77ccd0cf3"
};

const app = initializeApp(firebaseConfig);
export const firestoreDB = Firestore.getFirestore(app);

export function getCollection<T>(path: string) {
  return Firestore.collection(firestoreDB, path) as Firestore.CollectionReference<T>
}

export async function deleteDocument(path: string, id: string) {
  const doc = Firestore.doc(firestoreDB, `${path}/${id}`)
  await Firestore.deleteDoc(doc)
}

export async function updateDocument<T extends Record<string, any>>(path: string, id: string, data: T) {
  const doc = Firestore.doc(firestoreDB, `${path}/${id}`)
  await Firestore.updateDoc(doc, data)
}
