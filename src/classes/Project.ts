import { v4 as uuidv4 } from 'uuid'
import { ITask, Task } from './Task'
import * as Firestore from "firebase/firestore";
import { getCollection } from "../firebase"


export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
  name: string
	description: string
	status: ProjectStatus
	userRole: UserRole
	finishDate: Date
  taskList: Task[]

}

const tasksCollection = getCollection<ITask>("/tasks")

export class Project implements IProject {

	//To satisfy IProject
  name: string
	description: string
	status: "pending" | "active" | "finished" 
	userRole: "architect" | "engineer" | "developer"
  finishDate: Date

  //Tasks
  taskList: Task[]
  
  //Class internals
  cost: number = 0
  progress: number = 0
  id: string

  constructor(data: IProject, id = uuidv4()) {
    for (const key in data) {
      this[key] = data[key]
    }
    this.id = id
    this.taskList = []
  }

  newTask(project: ITask, id: string) {
    const task = new Task(project, id)
    this.taskList.push(task)
  }

  getFirestoreTask = async () => {
    const firebaseTasks = await Firestore.getDocs(tasksCollection)
    for (const doc of firebaseTasks.docs) {
      const data = doc.data()
      const task: ITask = {
        ...data,
        dueDate: (data.dueDate as unknown as Firestore.Timestamp).toDate()
      }
      if (task.project.id === this.id) {
        try {
          this.newTask(task, doc.id)
        } catch (error) {
          //TODO
          console.error("Error adding task: ", error);   
        }
      }
    }
  }
}