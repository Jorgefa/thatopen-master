import * as React from "react";
import * as Router from "react-router-dom";
import * as Firestore from "firebase/firestore";
import { IProject, Project, ProjectStatus, UserRole } from "../classes/Project";
import { ProjectCard } from "./ProjectCard";
import { SearchBox } from "./SearchBox";
import { ProjectsManager } from "../classes/ProjectsManager";
import { getCollection } from "../firebase";
import * as BUI from "@thatopen/ui";

interface Props {
  projectsManager: ProjectsManager
}

const projectsCollection = getCollection<IProject>("projects")

export function ProjectsPage(props: Props) {

  const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list)
  props.projectsManager.OnProjectCreated = () => {setProjects([...props.projectsManager.list])}

  const getFirestoreProjects = async () => {
    const firebaseProjects = await Firestore.getDocs(projectsCollection)
    for (const doc of firebaseProjects.docs) {
      const data = doc.data()
      const project: IProject = {
        ...data,
        finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate()
      }
      try {
        props.projectsManager.newProject(project, doc.id)
      } catch (error) {
        
      }
    }
  }

  React.useEffect(() => {
    getFirestoreProjects()
  }, [])

  const projectCards = projects.map((project) => {
    return (
      <Router.Link to={`/project/${project.id}`} key={project.id} >
        <ProjectCard project={project} />
      </Router.Link>
    )
  })

  React.useEffect(() => {
    console.log("Projects state updated", projects)
  }, [projects])

  const onNewProjectClick = () => {
    const modal = document.getElementById("new-project-modal")
    if (!(modal && modal instanceof HTMLDialogElement)) {return}
    modal.showModal()
  }

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

  const onExportProject = () => {
    props.projectsManager.exportToJSON()
  }

  const onImportProject = () => {
    props.projectsManager.importFromJSON()
  }

  const onProjectSearch = (value: string) => {
    setProjects(props.projectsManager.filterProjects(value))
  }

  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
      <dialog id="new-project-modal">
        <form onSubmit={(e) => onFormSubmit(e)} id="new-project-form">
          <h2>New Project</h2>
          <div className="input-list">
            <div className="form-field-container">
              <bim-label icon="material-symbols:apartment" style={{ marginBottom: 5 }}>Name</bim-label>
              <bim-text-input 
                name="name" 
                type="text"
                placeholder="What's the name of your project?"
              ></bim-text-input>
              <bim-label
                style={{
                  color: "gray",
                  fontSize: "var(--font-sm)",
                  marginTop: 5,
                  fontStyle: "italic"
                }}
              >
                TIP: Give it a short name
              </bim-label>
            </div>
            <div className="form-field-container">
              <bim-label icon="material-symbols:subject" style={{ marginBottom: 5 }}>Description</bim-label>
              <textarea
                name="description"
                cols={30}
                rows={5}
                placeholder="Give your project a nice description! So people is jealous about it."
                defaultValue={""}
                style={{ background: "var(--bim-ui_bg-contrast-20)" }}
              />
            </div>
            <div className="form-field-container">
              <bim-label icon="material-symbols:person" style={{ marginBottom: 5 }}>Role</bim-label>
              <bim-dropdown name="userRole">
                <bim-option label="Architect" checked></bim-option>
                <bim-option label="Engineer"></bim-option>
                <bim-option label="Developer"></bim-option>
              </bim-dropdown>
            </div>
            <div className="form-field-container">
              <bim-label icon="material-symbols:info" style={{ marginBottom: 5 }}>Status</bim-label>
              <bim-dropdown name="status">
                <bim-option label="Pending" checked></bim-option>
                <bim-option label="Active"></bim-option>
                <bim-option label="Finished"></bim-option>
              </bim-dropdown>
            </div>
            <div className="form-field-container">
              <bim-label icon="mdi:calendar" style={{ marginBottom: 5 }}>Finish Date</bim-label>
              <bim-text-input type="date" name="finishDate"></bim-text-input>
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10
              }}
            >
              <bim-button type="button" label="Cancel" 
                onClick={() => { 
                  const modal = document.getElementById("new-project-modal")
                  if (!(modal && modal instanceof HTMLDialogElement)) {return}
                  modal.close()
                }}
              ></bim-button>
              <bim-button type="submit" name="submit" label="Accept" style={{ backgroundColor: "rgb(18, 145, 18)" }}></bim-button>
            </div>
          </div>
        </form>
      </dialog>
      <header>
        <bim-label>Projects</bim-label>
        <SearchBox onChange={(value) => onProjectSearch(value)}/>
        <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
          <bim-button 
            id="upload-btn" 
            icon="ic:round-upload"
            onClick={onImportProject}
          ></bim-button>
          <bim-button 
            id="download-btn" 
            icon="ic:round-download"
            onClick={onExportProject}
          ></bim-button>
          <bim-button 
            id="new-project-btn" 
            label="New Project" 
            icon="fluent:add-20-regular" 
            onClick={onNewProjectClick}
          ></bim-button>
        </div>
      </header>
      {
        projects.length > 0 ? <div id="projects-list">{ projectCards }</div> : <p>There is no projects to display!</p>
      }
    </div>
  )
}