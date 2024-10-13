import * as React from "react";
import * as Firestore from "firebase/firestore";
import { IProject, ProjectStatus, UserRole } from "../classes/Project";
import { getCollection } from "../firebase";
import { ProjectsManager } from "../classes/ProjectsManager";

interface Props {
  projectsManager: ProjectsManager,
  isVisible: boolean,
  onClose(): void
}

const projectsCollection = getCollection<IProject>("/projects")

export function ProjectForm(props: Props) {

  const modalRef = React.useRef<HTMLDialogElement | null>(null)

  React.useEffect(() => {
    const modal = modalRef.current
    if (props.isVisible && modal) {
      modal.showModal()
    } else if (modal) {
      modal.close()
    }
  }, [props.isVisible])

    
  const onFormSubmit = (e: React.FormEvent) => {
    const projectForm = document.getElementById("new-project-form")
    if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate") as string)
    }
    try {
      Firestore.addDoc(projectsCollection, projectData)
      const project = props.projectsManager.newProject(projectData)
      projectForm.reset()
      const modal = document.getElementById("new-project-modal")
      if (!(modal && modal instanceof HTMLDialogElement)) {return}
      modal.close()
    } catch (err) {
      alert(err)
    }
  }

  const onFormCancel = () => {
    if (modalRef.current) {
      modalRef.current.close()
    }
    props.onClose()
  }

  return (
    <dialog id="new-project-modal" ref={modalRef}>
      <form onSubmit={(e) => onFormSubmit(e)} id="new-project-form">
        <h2>New Project</h2>
        <div className="input-list">
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">apartment</span>Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="What's the name of your project?"
            />
            <p
              style={{
                color: "gray",
                fontSize: "var(--font-sm)",
                marginTop: 5,
                fontStyle: "italic"
              }}
            >
              TIP: Give it a short name
            </p>
          </div>
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">subject</span>Description
            </label>
            <textarea
              name="description"
              cols={30}
              rows={5}
              placeholder="Give your project a nice description! So people is jealous about it."
              defaultValue={""}
            />
          </div>
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">person</span>Role
            </label>
            <select name="userRole">
              <option>Architect</option>
              <option>Engineer</option>
              <option>Developer</option>
            </select>
          </div>
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">not_listed_location</span>
              Status
            </label>
            <select name="status">
              <option>Pending</option>
              <option>Active</option>
              <option>Finished</option>
            </select>
          </div>
          <div className="form-field-container">
            <label htmlFor="finishDate">
              <span className="material-icons-round">calendar_month</span>
              Finish Date
            </label>
            <input name="finishDate" type="date" />
          </div>
          <div
            style={{
              display: "flex",
              margin: "10px 0px 10px auto",
              columnGap: 10
            }}
          >
            <button type="button" style={{ backgroundColor: "transparent" }} onClick={onFormCancel}>
              Cancel
            </button>
            <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
              Accept
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}