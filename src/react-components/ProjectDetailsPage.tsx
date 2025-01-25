import * as React from "react";
import * as Router from "react-router-dom";
import { ProjectsManager } from "../classes/ProjectsManager";
import { ThreeViewer } from "./ThreeViewer";
import { deleteDocument } from "../firebase";
import { Message } from "./Message";
import { ProjectForm } from "./ProjectForm";
import { ProjectTodoSection } from "./ProjectTodoSection";

interface Props {
  projectsManager: ProjectsManager;
}

export function ProjectDetailsPage(props: Props) {

  const [isFormVisible, setFormVisible] = React.useState<boolean>(false)

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

  return (
    <div className="page" id="project-details">
      <ProjectForm
        projectsManager={props.projectsManager}
        project={project}
        isVisible={isFormVisible}
        onClose={closeProjectForm}
      />
      <header>
        <div>
          <h2 data-project-info="name">{project.name}</h2>
          <p style={{ color: "#969696" }}>{project.description}</p>
        </div>
        <button
          onClick={() => {
            props.projectsManager.deleteProject(project.id);
          }}
          style={{ background: "gray" }}
        >
          Delete project
        </button>
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
              <button className="btn-secondary" onClick={onEditProjectClick}>
                <p style={{ width: "100%" }}>Edit</p>
              </button>
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <h5>{project.name}r</h5>
                <p>{project.description}</p>
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
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Status
                  </p>
                  <p>{project.status}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Cost
                  </p>
                  <p>{project.cost}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Role
                  </p>
                  <p>{project.userRole}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Finish Date
                  </p>
                  <p>{project.finishDate.toDateString()}</p>
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
                    width: `${project.progress * 100}%`,
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "center",
                  }}
                >
                  {project.progress * 100}%
                </div>
              </div>
            </div>
          </div>
          <ProjectTodoSection project={project} />
        </div>
        <ThreeViewer />
      </div>
    </div>
  );
}
