import * as Firestore from "firebase/firestore";
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyBO-OD8DK0jMga9Wa4RMKX0UUrDYDdP9UY",
  authDomain: "bim-project-39d6b.firebaseapp.com",
  projectId: "bim-project-39d6b",
  storageBucket: "bim-project-39d6b.appspot.com",
  messagingSenderId: "875385188876",
  appId: "1:875385188876:web:c69fc4e4910a642279b429"
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
