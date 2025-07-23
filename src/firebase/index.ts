import * as Firestore from "firebase/firestore";
import { initializeApp } from "firebase/app"
import * as THREE from "three"
import { ITodo } from "../bim-components/TodoCreator/src/Todo"

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

// Todo-specific Firebase functions
export interface TodoFirebaseData {
  id: string
  name: string
  task: string
  priority: 'Low' | 'Medium' | 'High'
  ifcGuids: string[]
  camera: {
    position: { x: number, y: number, z: number }
    target: { x: number, y: number, z: number }
  }
  projectId?: string
  createdAt: Firestore.Timestamp
  updatedAt: Firestore.Timestamp
}

export const todosCollection = getCollection<TodoFirebaseData>("todos")

export async function createTodo(todoData: ITodo): Promise<void> {
  const firebaseData: TodoFirebaseData = {
    id: todoData.id,
    name: todoData.name,
    task: todoData.task,
    priority: todoData.priority,
    ifcGuids: todoData.ifcGuids,
    camera: {
      position: {
        x: todoData.camera.position.x,
        y: todoData.camera.position.y,
        z: todoData.camera.position.z
      },
      target: {
        x: todoData.camera.target.x,
        y: todoData.camera.target.y,
        z: todoData.camera.target.z
      }
    },
    projectId: todoData.projectId,
    createdAt: Firestore.Timestamp.fromDate(todoData.createdAt),
    updatedAt: Firestore.Timestamp.fromDate(todoData.updatedAt)
  }
  
  const docRef = Firestore.doc(firestoreDB, `todos/${todoData.id}`)
  await Firestore.setDoc(docRef, firebaseData)
}

export async function getTodos(projectId?: string): Promise<TodoFirebaseData[]> {
  let query = Firestore.query(todosCollection)
  
  if (projectId) {
    query = Firestore.query(todosCollection, Firestore.where("projectId", "==", projectId))
  }
  
  const snapshot = await Firestore.getDocs(query)
  return snapshot.docs.map(doc => doc.data())
}

export async function updateTodo(todoId: string, updates: Partial<TodoFirebaseData>): Promise<void> {
  const docRef = Firestore.doc(firestoreDB, `todos/${todoId}`)
  await Firestore.updateDoc(docRef, {
    ...updates,
    updatedAt: Firestore.Timestamp.now()
  })
}

export async function deleteTodo(todoId: string): Promise<void> {
  await deleteDocument("todos", todoId)
}

// Conversion utilities
export function todoToFirebaseData(todo: ITodo): TodoFirebaseData {
  return {
    id: todo.id,
    name: todo.name,
    task: todo.task,
    priority: todo.priority,
    ifcGuids: todo.ifcGuids,
    camera: {
      position: {
        x: todo.camera.position.x,
        y: todo.camera.position.y,
        z: todo.camera.position.z
      },
      target: {
        x: todo.camera.target.x,
        y: todo.camera.target.y,
        z: todo.camera.target.z
      }
    },
    projectId: todo.projectId,
    createdAt: Firestore.Timestamp.fromDate(todo.createdAt),
    updatedAt: Firestore.Timestamp.fromDate(todo.updatedAt)
  }
}

export function firebaseDataToTodoData(data: TodoFirebaseData): ITodo {
  return {
    id: data.id,
    name: data.name,
    task: data.task,
    priority: data.priority,
    ifcGuids: data.ifcGuids,
    camera: {
      position: new THREE.Vector3(data.camera.position.x, data.camera.position.y, data.camera.position.z),
      target: new THREE.Vector3(data.camera.target.x, data.camera.target.y, data.camera.target.z)
    },
    projectId: data.projectId,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate()
  }
}
