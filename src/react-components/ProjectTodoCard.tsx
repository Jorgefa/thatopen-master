import React from 'react';
import { Task } from '../classes/Task';

interface Props {
    task: Task
}

export function ProjectTodoCard (props: Props) {
    return (
        <div className="todo-item">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              columnGap: 15,
              alignItems: "center",
            }}
          >
            <span
              className="material-icons-round"
              style={{
                padding: 10,
                backgroundColor: "#686868",
                borderRadius: 10,
              }}
            >
              construction
            </span>
            <p>
              {props.task.description}.
            </p>
          </div>
          <p style={{ textWrap: "nowrap", marginLeft: 10 }}>
            {props.task.dueDate ? new Date(props.task.dueDate).toDateString() : "No Due Date"}
          </p>
        </div>
      </div>
    );
};