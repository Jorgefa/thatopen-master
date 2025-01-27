import React, { useState } from 'react';
import { Task, ITask, taskStatus, Priority } from '../classes/Task';
import { ProjectsManager } from "../classes/ProjectsManager";
import { Project } from '../classes/Project';
import { getCollection } from '../firebase';

interface Props {
    project: Project;
    task: ITask | null;
    isVisible: boolean,
    onClose(): void;
}

const tasksCollection = getCollection<ITask>("/tasks")

export function ProjectTodoForm(props: Props) {

    const modalRef = React.useRef<HTMLDialogElement | null>(null)
    
    const [name, setName] = React.useState<string>(props.task?.name || "");
    const [description, setDescription] = React.useState<string>(props.task?.description || "");
    const [status, setStatus] = React.useState<taskStatus>(props.task?.status || "todo");
    const [priority, setPriority] = React.useState<Priority>(props.task?.priority || "P3");
    const [dueDate, setDueDate] = React.useState<string>(
        props.task?.dueDate ? props.task.dueDate.toISOString().substring(0, 10) : ""
    )
    


    let taskId : string | null

    React.useEffect(() => {
    const modal = modalRef.current
    if (props.isVisible && modal) {
        modal.showModal()
    } else if (modal) {
        modal.close()
    }
    }, [props.isVisible])

    return (
        <dialog id="new-todo-modal" ref={modalRef}>
            <p>Task</p>
        </dialog>
    );
};

