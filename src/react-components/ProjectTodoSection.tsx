import * as React from "react";
import { Project } from "../classes/Project";
import { ProjectTodoCard } from "./ProjectTodoCard";
import { Task } from "../classes/Task";
import { Router } from "react-router-dom";
import { SearchBox } from "./SearchBox";

interface Props {
    project: Project
    onNewTaskClick: () => void
    onTaskEditClick: (task: Task) => void
}

export function ProjectTodoSection(props: Props) {

  const [tasks, setTasks] = React.useState<Task[]>(props.project.taskList)
  
  React.useEffect(() => {
    console.log("tasks state updated", tasks)
  }, [tasks])

  const projectTodoCards = tasks.map((task) => {
    return (
    <ProjectTodoCard task={task}/>
    )
  })

  const onTodoSearch = (value: string) => {
    const filteredTasks = props.project.filterTasks(value)
    setTasks(filteredTasks)
  }

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
                      <SearchBox onChange={(value) => onTodoSearch(value)}/>
                    </div>
                    <button onClick={props.onNewTaskClick} id="new-task-btn">
                      <span className="material-icons-round">add</span>
                    </button>
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
                  {projectTodoCards}
                </div>
              </div>
    
  )
}