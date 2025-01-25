import { v4 as uuidv4 } from 'uuid'
import { Project } from "./Project";

export type Priority = "P1" | "P2" | "P3";
export type taskStatus = "todo" | "done";

export interface ITask {
    project: Project;
    description: string;
    priority: Priority
    taskStatus: taskStatus;
}

export class Task {
    // ITask
    project: Project;
    description: string;
    priority: "P1" | "P2" | "P3";
    taskStatus: "todo" | "done";

    //Internals
    id: string;
    
    constructor(data: ITask, id = uuidv4()) {
        for (const key in data) {
            this[key] = data[key]
        }
        this.id = id
    }

}