import * as React from "react";
import { Project } from "../classes/Project";
import { ProjectTodoCard } from "./ProjectTodoCard";

interface Props {
    project: Project
}

export function ProjectTodoSection(props: Props) {
  return (
              <div className="dashboard-card" style={{ flexGrow: 1 }}>
                <div
                  style={{
                    padding: "20px 30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h4>To-Do</h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                      columnGap: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: 10,
                      }}
                    >
                      <span className="material-icons-round">search</span>
                      <input
                        type="text"
                        placeholder="Search To-Do's by name"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <span className="material-icons-round">add</span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px 30px",
                    rowGap: 20,
                  }}
                >
                  <ProjectTodoCard task={props.project.taskList[0]} />
                  <ProjectTodoCard task={props.project.taskList[1]} />
                </div>
              </div>
    
  )
}