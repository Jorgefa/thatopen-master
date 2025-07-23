import * as React from "react";
import * as Router from "react-router-dom";
import { ProjectsManager } from "../classes/ProjectsManager";
import { IFCViewer } from "./IFCViewer";
import { deleteDocument } from "../firebase";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import { TodoCreator, todoTool, Todo, createEditTodoModal } from "../bim-components/TodoCreator/";
import { TodoData } from "../bim-components/TodoCreator/src/base-types";

interface Props {
  projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {
  const routeParams = Router.useParams<{id: string}>()
  if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
  const project = props.projectsManager.getProject(routeParams.id)
  if (!project) {return (<p>The project with ID {routeParams.id} wasn't found.</p>)}

  const components: OBC.Components = new OBC.Components()

  const dashboard = React.useRef<HTMLDivElement>(null)
  const todoContainer = React.useRef<HTMLDivElement>(null)
  
  const navigateTo = Router.useNavigate()
  props.projectsManager.OnProjectDeleted = async (id) => {
    await deleteDocument("/projects", id)
    navigateTo("/")
  }

  const onRowCreated = (event) => {
    event.stopImmediatePropagation()
    const { row } = event.detail;
    row.addEventListener("click", async () => {
      // Use the TodoId stored in the row to get the Todo instance
      const todoId = row.data.TodoId
      const todo = todoCreator.getTodoById(todoId)
      if (todo) {
        await todoCreator.highlightTodo(todo)
      }
    })
  }
  
  const todoTable = BUI.Component.create<BUI.Table>(() => {
    return BUI.html`
      <bim-table @rowcreated=${ onRowCreated }></bim-table>`
  })

  const addTodo = (todo: Todo) => {
    const newData = {
      data: {
        TodoId: todo.id,
        Name: todo.name,
        Task: todo.task,
        Priority: todo.priority,
        "Elements Count": todo.getElementCount(),
        Date: todo.createdAt.toDateString(),
        Actions: "" 
      },
    }
    todoTable.data = [...todoTable.data, newData]
    
    todoTable.dataTransform = {
      Actions: () => {
        return BUI.html`
          <div style="display: flex; gap: 5px;">
            <bim-button 
              icon="material-symbols:edit" 
              style="background-color: var(--bim-ui_accent-base)"
              @click=${() => {
                const editModal = createEditTodoModal(todo, todoCreator)
                editModal.showModal()
              }}
            ></bim-button>
            <bim-button 
              icon="material-symbols:delete" 
              style="background-color: red"
              @click=${async () => {
                if (confirm('Are you sure you want to delete this todo?')) {
                  try {
                    await todoCreator.deleteTodo(todo.id)
                    // Remove from table
                    todoTable.data = todoTable.data.filter(item => item.data.TodoId !== todo.id)
                  } catch (error) {
                    console.error("Failed to delete todo:", error)
                    alert("Failed to delete todo. Please try again.")
                  }
                }
              }}
            ></bim-button>
            <bim-button
              icon="ion:navigate"
              @click=${() => todoCreator.addTodoMarker(todo)}
            ></bim-button>
          </div>
        `
      }
    }
    todoTable.hiddenColumns = ["TodoId"];
  }

  const todoCreator = components.get(TodoCreator)
  todoCreator.onTodoCreated.add((todo) => addTodo(todo))
  
  // Listen for todo updates to refresh the table
  todoCreator.onTodoUpdated.add((updatedTodo) => {
    // Find and update the row in the table
    todoTable.data = todoTable.data.map(item => {
      if (item.data.TodoId === updatedTodo.id) {
        return {
          data: {
            TodoId: updatedTodo.id,
            Name: updatedTodo.name,
            Task: updatedTodo.task,
            Priority: updatedTodo.priority,
            "Elements Count": updatedTodo.getElementCount(),
            Date: updatedTodo.createdAt.toDateString(),
            Actions: ""
          }
        }
      }
      return item
    })
  })

  // Initialize todos from Firebase
  React.useEffect(() => {
    const initializeTodos = async () => {
      try {
        await todoCreator.initializeFromFirebase(project.id)
        // Add existing todos to the table
        for (const todo of todoCreator.todos) {
          addTodo(todo)
        }
      } catch (error) {
        console.error("Failed to initialize todos:", error)
      }
    }
    
    initializeTodos()
  }, [project.id])

  // Add search functionality
  const setupSearchFilter = () => {
    const searchInput = document.querySelector('bim-text-input[placeholder="Search To-Do\'s by name"]') as any
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        todoTable.queryString = searchInput.value
      })
    }
  }

  React.useEffect(() => {
    dashboard.current?.appendChild(todoTable)
    const [todoButton, todoPriorityButton] = todoTool({ components, projectId: project.id })
    todoContainer.current?.appendChild( todoButton )
    todoContainer.current?.appendChild( todoPriorityButton )

    // Setup search functionality after components are rendered
    setTimeout(setupSearchFilter, 100)

    todoCreator.onDisposed.add(() => {
      todoTable.data = []
      todoTable.remove()
    })
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
          <div className="dashboard-card" style={{ flexGrow: 1 }} ref={dashboard}>
            <div
              style={{
                padding: "20px 30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <bim-label style={{ fontSize: "var(--font-lg", color: "#fff" }}>To-Do</bim-label>
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
          </div>
        </div>
        <IFCViewer components={ components }/>
      </div>
    </div>
  );
}