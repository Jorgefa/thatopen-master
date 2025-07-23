import { v4 as uuidv4 } from 'uuid'
import * as THREE from "three"
import { Priority, TodoInput } from "./base-types"

export interface ITodo {
  id: string
  name: string
  task: string
  priority: Priority
  ifcGuids: string[]
  camera: {position: THREE.Vector3, target: THREE.Vector3}
  projectId?: string
  createdAt: Date
  updatedAt: Date
}

export class Todo implements ITodo {
  id: string
  name: string
  task: string
  priority: Priority
  ifcGuids: string[]
  camera: {position: THREE.Vector3, target: THREE.Vector3}
  projectId?: string
  createdAt: Date
  updatedAt: Date

  constructor(input: TodoInput & {
    ifcGuids: string[]
    camera: {position: THREE.Vector3, target: THREE.Vector3}
    projectId?: string
  }, id?: string) {
    this.id = id || uuidv4()
    this.name = input.name
    this.task = input.task
    this.priority = input.priority
    this.ifcGuids = input.ifcGuids
    this.camera = input.camera
    this.projectId = input.projectId
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  update(updates: Partial<Pick<ITodo, 'name' | 'task' | 'priority' | 'ifcGuids' | 'camera' | 'projectId'>>) {
    Object.assign(this, updates)
    this.updatedAt = new Date()
  }

  getElementCount(): number {
    return this.ifcGuids.length
  }

  toJSON(): ITodo {
    return {
      id: this.id,
      name: this.name,
      task: this.task,
      priority: this.priority,
      ifcGuids: this.ifcGuids,
      camera: this.camera,
      projectId: this.projectId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  static fromJSON(data: ITodo): Todo {
    const todo = new Todo({
      name: data.name,
      task: data.task,
      priority: data.priority,
      ifcGuids: data.ifcGuids,
      camera: data.camera,
      projectId: data.projectId
    }, data.id)
    
    todo.createdAt = data.createdAt
    todo.updatedAt = data.updatedAt
    
    return todo
  }
}
