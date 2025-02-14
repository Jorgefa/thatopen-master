import * as Firestore from "firebase/firestore";
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyAbPtivRBx4mLYHgiIzeISsTfRc303LKfo",
  authDomain: "thatopenmaster.firebaseapp.com",
  projectId: "thatopenmaster",
  storageBucket: "thatopenmaster.appspot.com",
  messagingSenderId: "301123543503",
  appId: "1:301123543503:web:b8fea09da1a2b5d15a72ba"
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
