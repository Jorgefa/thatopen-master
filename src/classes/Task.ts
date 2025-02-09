import { v4 as uuidv4 } from 'uuid'
import { Project } from "./Project";

export type Priority = "P1" | "P2" | "P3";
export type TaskStatus = "Todo" | "Done";

export interface ITask {
    projectPath: string
    name: string
    description: string
    priority: Priority
    status: TaskStatus
    dueDate: Date
}

export class Task implements ITask {
    //ITask
    projectPath: string;
    name: string
    description: string;
    priority: "P1" | "P2" | "P3";
    status: "Todo" | "Done";
    dueDate: Date;

    //Class internals
    id: string;
    
    constructor(data: ITask, id = uuidv4()) {
        for (const key in data) {
            this[key] = data[key]
        }
        this.id = id
    }
}