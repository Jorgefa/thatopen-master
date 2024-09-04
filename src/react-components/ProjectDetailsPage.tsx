import * as React from "react";
import * as Router from "react-router-dom";
import { ProjectsManager } from "../classes/ProjectsManager";
import { IFCViewer } from "./IFCViewer";
import { deleteDocument } from "../firebase";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import { todoUI } from "../bim-components/TodoCreator/ui";
import { TodoCreator } from "../bim-components/TodoCreator/TodoCreator";
// import { TodoCreator } from "../bim-components/TodoCreator";

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {
  const components: OBC.Components = new OBC.Components()

  const todoContainer = React.useRef<HTMLDivElement>(null)

  const routeParams = Router.useParams<{id: string}>()
  if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
  const project = props.projectsManager.getProject(routeParams.id)
  if (!project) {return (<p>The project with ID {routeParams.id} wasn't found.</p>)}

  const navigateTo = Router.useNavigate()
  props.projectsManager.OnProjectDeleted = async (id) => {
    await deleteDocument("/projects", id)
    navigateTo("/")
  }

  const tableRef = React.useRef<BUI.Table>()

  const createTodo = (name: string) => {
    if (!tableRef.current) {return}
    const newData = {
      data: {
        Name: name,
        Task: "Create Work Orders",
        Role: "Engineer",
      },
    }
    tableRef.current.data = [...tableRef.current.data, newData];
  }
  const todoCreator = components.get(TodoCreator)
  todoCreator.onTodoCreated.add((data) => createTodo(data))

  React.useEffect(() => {
    const todoButton = todoUI({ components })
    todoContainer.current?.appendChild( todoButton )
  }, [])

  return (
    <div className="page" id="project-details">
      <header>
        <div>
          <bim-label style={{ color: "#fff", fontSize: "var(--font-xl)"}} data-project-info="name">{project.name}</bim-label>
          <bim-label style={{ color: "#969696" }}>{project.description}</bim-label>
        </div>
        <div>
          <bim-button label="Delete" icon="material-symbols:delete" onClick={() => props.projectsManager.deleteProject(project.id)} style={{backgroundColor: "red"}}></bim-button>
        </div>
      </header>
      <div className="main-page-content">
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 30px",
                marginBottom: 30
              }}
            >
              <p
                  style={{
                    fontSize: 20,
                    backgroundColor: "#ca8134",
                    aspectRatio: 1,
                    borderRadius: "100%",
                    padding: 12
                  }}
                >
                  HC
              </p>
              <div>
                <bim-button style={{color: "white"}} icon="material-symbols:edit" label="edit"></bim-button>
              </div>
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <bim-label style={{ color: "#fff", fontSize: "var(--font-xl)"}}>{project.name}</bim-label>
                <bim-label>{project.description}</bim-label>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: 30,
                  padding: "30px 0px",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <bim-label style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Status
                  </bim-label>
                  <bim-label style={{ color: "#fff" }}>{project.status}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Cost
                  </bim-label>
                  <bim-label style={{ color: "#fff" }}>$ {project.cost}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Role
                  </bim-label>
                  <bim-label style={{ color: "#fff" }}>{project.userRole}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Finish Date
                  </bim-label>
                  <bim-label style={{ color: "#fff" }}>{project.finishDate.toDateString()}</bim-label>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto"
                }}
              >
                <div
                  style={{
                    width: `${project.progress * 100}%`,
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "center"
                  }}
                >
                  {project.progress * 100}%
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-card" style={{ flexGrow: 1 }}>
            <div
              style={{
                padding: "20px 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <bim-label style={{fontSize: "var(--font-lg", color: "#fff"}}>To-Do</bim-label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  columnGap: 20
                }}
                ref={todoContainer}
              >
                <div
                  style={{ display: "flex", alignItems: "center", columnGap: 10 }}
                >
                  <bim-label icon="material-symbols:search" style={{ color: "#fff" }}></bim-label>
                  <bim-text-input placeholder="Search To-Do's by name"></bim-text-input>
                </div>
              </div>
            </div>
            <bim-table id="todo-table" ref={tableRef}></bim-table>
          </div>
        </div>
        <IFCViewer components={components}/>
      </div>
    </div>
  );
}