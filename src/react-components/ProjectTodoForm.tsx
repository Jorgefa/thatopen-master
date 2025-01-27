import React, { useState } from 'react';
import { Task, ITask } from '../classes/Task';
import { ProjectsManager } from "../classes/ProjectsManager";

interface Props {
    task: ITask;
    description: string;
    onSave: (task: string, description: string) => void;
    onCancel: () => void;
}

export function ProjectTodoForm(props: Props) {

    const modalRef = React.useRef<HTMLDialogElement | null>(null)
    
    return (
        <dialog id="new-todo-modal" ref={modalRef}>
            <p>Task</p>
        </dialog>
    );
};

export default ProjectTodoForm;