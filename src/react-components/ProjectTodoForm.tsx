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

    const onFormSubmit = async (e: React.FormEvent) => {
        console.log(e)
    }

    const onFormCancel = () => {
        if (modalRef.current) {
          modalRef.current.close()
        }
        props.onClose()
      }


    return (
        <dialog id="new-todo-modal" ref={modalRef}>
            <form onSubmit={onFormSubmit} id="new-todo-form">
                <h2>{props.task ? "Edit todo" : "New todo"}</h2>
                <div className="input-list">
                    <div className="form-field-container">
                    <label>Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="What's the name of your task?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                    <div className="form-field-container">
                    <label>Description</label>
                    <textarea
                        name="description"
                        cols={30}
                        rows={5}
                        placeholder="Describe your project"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    </div>
                    <div className="form-field-container">
                    <label>Status</label>
                    <select name="status" value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
                        <option>todo</option>
                        <option>done</option>
                    </select>
                    </div>
                    <div className="form-field-container">
                    <label>Due Date</label>
                    <input
                        name="finishDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button type="button" onClick={onFormCancel}>Cancel</button>
                    <button type="submit">{props.task ? "Update" : "Create"}</button>
                    </div>
                </div>
                </form>
        </dialog>
    );
};

