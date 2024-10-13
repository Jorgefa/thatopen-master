import * as Firestore from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { IProject } from "../classes/Project";

const firebaseConfig = {
  apiKey: "AIzaSyAbPtivRBx4mLYHgiIzeISsTfRc303LKfo",
  authDomain: "thatopenmaster.firebaseapp.com",
  projectId: "thatopenmaster",
  storageBucket: "thatopenmaster.appspot.com",
  messagingSenderId: "301123543503",
  appId: "1:301123543503:web:b8fea09da1a2b5d15a72ba"
};

const app = initializeApp(firebaseConfig);
export const firebaseDB = Firestore.getFirestore()

export function getCollection<T>(path: string) {
  return Firestore.collection(firebaseDB, path) as Firestore.CollectionReference<T>
}

export async function deleteDocument(path: string, id: string) {
  const doc = Firestore.doc(firebaseDB, `${path}/${id}`)
  await Firestore.deleteDoc(doc)
}

export async function updateDocument<T extends Record<string, any>>(path: string, id: string, data: T) {
  const doc = Firestore.doc(firebaseDB, `${path}/${id}`)
  await Firestore.updateDoc(doc, data)
}

