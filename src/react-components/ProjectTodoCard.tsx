import React from 'react';
import { Task } from '../classes/Task';

interface Props {
    task: Task
}

export function ProjectTodoCard (props: Props) {

    const getBackgroundColor = (priority: string): string => {
        switch (priority) {
            case "P1":
                return "#e57373"; // High Priority - Red
            case "P2":
                return "#ffb74d"; // Medium Priority - Orange
            case "P3":
                return "#f5f5f5"; // Low Priority - Grey
            default:
                return "#f5f5f5"; // Default - White
        }
    }

    const backgroundColor = getBackgroundColor(props.task.priority)? getBackgroundColor(props.task.priority): "#f5f5f5";


    return (
    <div
        className="todo-item"
        style={{
            padding: "10px",
            borderRadius: "8px",
            }}>
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
                backgroundColor,
                borderRadius: 10,
              }}
            >
              construction
            </span>
            <div style={{ marginLeft: 10, textAlign: "left" }}>
                    <div>
                        <h5>{props.task.name}</h5>
                        <p>{props.task.status}</p>
                    </div>
                </div>
        </div>
          </div>
          <div style={{ marginLeft: 10, textAlign: "right" }}>
                    <div>
                        <p>{props.task.dueDate.toLocaleDateString("es-ES")}</p>
                    </div>
                </div>
        </div>
    );
};