import { v4 as uuidv4 } from 'uuid'
import { ITask, Task } from './Task'
import * as Firestore from "firebase/firestore";
import { getCollection } from "../firebase"


export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"

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

  onTaskCreated = (task: Task) => {}
  onTaskDeleted = (id: string) => {}


	//To satisfy IProject
  name: string
	description: string
	status: "Pending" | "Active" | "Finished" 
	userRole: "Architect" | "Engineer" | "Developer"
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

  newTask(data: ITask, id?: string) {
    const task = new Task(data, id)
    this.taskList.push(task)
    this.onTaskCreated(task)
    return task
  }

  updateTask(id: string, data: ITask) {
    const task = this.taskList.find((task) => task.id === id)
    if (task) {
      for (const key in data) {
        task[key] = data[key]
      }
    }
  }

  filterTasks(value: string){
    const filteredTasks = this.taskList.filter((task) => {
      return task.name.includes(value)
    })
    return filteredTasks
  }

  getFirestoreTask = async () => {
    try {
      const firebaseTasks = await Firestore.getDocs(tasksCollection);
      for (const doc of firebaseTasks.docs) {
        const data = doc.data();
        const task: ITask = {
          ...data,
          dueDate: (data.dueDate as unknown as Firestore.Timestamp).toDate(),
        };
        const taskProjectId = task.projectPath?.split("/")[2]; // Add optional chaining
        if (taskProjectId === this.id) {
          try {
            this.newTask(task, doc.id);
          } catch (error) {
            console.error("Error adding task:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching tasks from Firestore:", error);
    }
  }
}