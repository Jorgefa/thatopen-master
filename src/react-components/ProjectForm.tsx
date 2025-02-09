import * as React from "react";
import * as Router from "react-router-dom";
import * as Firestore from "firebase/firestore";
import { IProject, ProjectStatus, UserRole } from "../classes/Project";
import { getCollection } from "../firebase";
import { ProjectsManager } from "../classes/ProjectsManager";
import { Message } from "./Message";
import { updateDocument } from "../firebase";


interface Props {
  projectsManager: ProjectsManager,
  project: IProject | null,
  isVisible: boolean,
  onClose(): void
}

const projectsCollection = getCollection<IProject>("/projects")

export function ProjectForm(props: Props) {

  const modalRef = React.useRef<HTMLDialogElement | null>(null)

  const [name, setName] = React.useState<string>(props.project?.name || "");
  const [description, setDescription] = React.useState<string>(props.project?.description || "");
  const [status, setStatus] = React.useState<ProjectStatus>(props.project?.status || "Pending");
  const [userRole, setUserRole] = React.useState<UserRole>(props.project?.userRole || "Developer");
  const [finishDate, setFinishDate] = React.useState<string>(
    props.project?.finishDate ? props.project.finishDate.toISOString().substring(0, 10) : ""
  );

  let projectId : string | null

  if(props.project) {
    const routeParams = Router.useParams<{ id: string }>();
    if (!routeParams.id) {
      return (
        <Message
          title={"Project not found"}
          message={"Project ID is needed to see this page."}
        />
      );
    }
    projectId = routeParams.id
  }

  React.useEffect(() => {
    const modal = modalRef.current
    if (props.isVisible && modal) {
      if (!props.project) {
        resetFormFields()
      }
      modal.showModal()
    } else if (modal) {
      modal.close()
    }
  }, [props.isVisible, props.project])

  React.useEffect(() => {
    if (props.project) {
      setName(props.project.name);
      setDescription(props.project.description);
      setStatus(props.project.status);
      setUserRole(props.project.userRole);
      setFinishDate(props.project.finishDate ? props.project.finishDate.toISOString().substring(0, 10) : "");
    } else {
      resetFormFields()
    }
  }, [props.project]);

  const resetFormFields = () => {
    setName("");
    setDescription("");
    setStatus("Pending");
    setUserRole("Developer");
    setFinishDate("");}

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: IProject = {
      name,
      description,
      status,
      userRole,
      finishDate: new Date(finishDate),
    };

    try {
      if (props.project) {
        if(!projectId) return
        await updateDocument("/projects", projectId, projectData);
        props.projectsManager.updateProject(projectData, projectId)
        console.log("Project updated", projectId)
      } else {
        const docRef = await Firestore.addDoc(projectsCollection, projectData);
        projectId = docRef.id;
        props.projectsManager.newProject(projectData, projectId);
        console.log("Project added", projectId)
      }

      props.onClose();
    } catch (err) {
      alert("Error submitting project: " + err);
    }
  };

  const onFormCancel = () => {
    if (modalRef.current) {
      modalRef.current.close()
    }
    props.onClose()
  }

  return (
    <dialog id="new-project-modal" ref={modalRef}>
    <form onSubmit={onFormSubmit} id="new-project-form">
      <h2>{props.project ? "Edit Project" : "New Project"}</h2>
      <div className="input-list">
        <div className="form-field-container">
          <label>Name</label>
          <input
            name="name"
            type="text"
            placeholder="What's the name of your project?"
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
          <label>Role</label>
          <select name="userRole" value={userRole} onChange={(e) => setUserRole(e.target.value as UserRole)}>
            <option>Architect</option>
            <option>Engineer</option>
            <option>Developer</option>
          </select>
        </div>
        <div className="form-field-container">
          <label>Status</label>
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
            <option>Pending</option>
            <option>Active</option>
            <option>Finished</option>
          </select>
        </div>
        <div className="form-field-container">
          <label>Finish Date</label>
          <input
            name="finishDate"
            type="date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" onClick={onFormCancel}>Cancel</button>
          <button type="submit">{props.project ? "Update" : "Create"}</button>
        </div>
      </div>
    </form>
  </dialog>
  )
}