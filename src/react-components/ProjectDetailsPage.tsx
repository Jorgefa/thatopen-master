import * as React from "react";
import * as Router from "react-router-dom";
import { ProjectsManager } from "../classes/ProjectsManager";
import { ThreeViewer } from "./ThreeViewer";
import { deleteDocument } from "../firebase";
import { Message } from "./Message";
import { ProjectForm } from "./ProjectForm";
import { ProjectTodoSection } from "./ProjectTodoSection";
import { ProjectTodoForm } from "./ProjectTodoForm";
import { Task } from "../classes/Task";
import { color } from "three/examples/jsm/nodes/Nodes.js";
import * as BUI from "@thatopen/ui"

interface Props {
  projectsManager: ProjectsManager;
}

export function ProjectDetailsPage(props: Props) {

  const [isFormVisible, setFormVisible] = React.useState<boolean>(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isTaskFormVisible, setTaskFormVisible] = React.useState<boolean>(false)

  const handleNewTaskClick = () => {
    setSelectedTask(null);      // Clear any selected task
    setTaskFormVisible(true);   // Open the task form
  };

  const handleTaskEditClick = (task: Task) => {
    setSelectedTask(task);        // Set the task to be edited
    setTaskFormVisible(true);     // Open the task form
  };

  const handleCloseTaskForm = () => {
    setTaskFormVisible(false);
    setSelectedTask(null);
};
  const handleCloseForm = () => {
      setFormVisible(false);
      setSelectedTask(null);
  };

  const routeParams = Router.useParams<{ id: string }>();
  if (!routeParams.id) {
    return (
      <Message
        title={"Project not found"}
        message={"Project ID is needed to see this page."}
      />
    );
  }
  const project = props.projectsManager.getProject(routeParams.id);
  if (!project) {
    return (
      <Message
        title={"Project not found"}
        message={`The project with ID ${routeParams.id} wasn't found`}
      />
    );
  }

  const navigateTo = Router.useNavigate();

  props.projectsManager.onProjectDeleted = async (id) => {
    await deleteDocument("/projects", id);
    navigateTo("/");
  };

  const onEditProjectClick = () => {
    setFormVisible(true)
  }
  const closeProjectForm = () => {
    setFormVisible(false)
  };
  const closeTaskForm = () => {
    setTaskFormVisible(false)
  };

  return (
    <div className="page" id="project-details">
      <ProjectForm
        projectsManager={props.projectsManager}
        project={project}
        isVisible={isFormVisible}
        onClose={closeProjectForm}
      />
      <ProjectTodoForm
        project={project}
        task={selectedTask}
        isVisible={isTaskFormVisible}
        onClose={closeTaskForm}
      />
      <header>
        <div>
          <bim-label style={{ color: "#000", fontsize: "var(--font-xl)"}} data-project-info="name">{project.name}</bim-label>
        </div>
        <div>
          <bim-button
            label="Delete"
            icon="material-symbols:delete"
            onClick={() => 
              props.projectsManager.deleteProject(project.id)}
            style={{ background: "gray" }}
          />
        </div>
      </header>
      <div className="main-page-content" >
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 30px",
                marginBottom: 30,
              }}
            >
              <p
                style={{
                  fontSize: 20,
                  backgroundColor: "#ca8134",
                  aspectRatio: 1,
                  borderRadius: "100%",
                  padding: 12,
                }}
              >
                HC
              </p>
              <bim-button
                label="Edit"
                icon="material-symbols:edit"
                onClick={onEditProjectClick}
                style={{ background: "white" }}
              />
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <bim-label style={{ color: "#000", fontsize: "var(--font-xl)"}}>{project.name}</bim-label>
                <bim-label >{project.description}</bim-label>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: 30,
                  padding: "30px 0px",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <bim-label style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Status
                  </bim-label>
                  <bim-label style={{ color: "#000"}}>{project.status}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Cost
                  </bim-label>
                  <bim-label style={{ color: "#000"}}>{project.cost}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Role
                  </bim-label>
                  <bim-label style={{ color: "#000"}}>{project.userRole}</bim-label>
                </div>
                <div>
                  <bim-label style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Finish Date
                  </bim-label>
                  <bim-label style={{ color: "#000"}}>{project.finishDate.toLocaleDateString("es-ES")}</bim-label>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    width: `${project.progress+0.3 * 100}%`,
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "center",
                  }}
                >
                  {project.progress+0.3 * 100}%
                </div>
              </div>
            </div>
          </div>
          <ProjectTodoSection
            project={project}
            onNewTaskClick={handleNewTaskClick}
            onTaskEditClick={handleTaskEditClick}
            selectedTask={null}          />
        </div>
        <ThreeViewer />
      </div>
    </div>
  );
}
