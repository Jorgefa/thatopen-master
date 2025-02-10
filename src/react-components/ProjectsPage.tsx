import * as React from 'react';
import * as Router from 'react-router-dom';
import * as Firestore from "firebase/firestore";
import { IProject, Project, ProjectStatus, UserRole } from '../classes/Project';
import { ProjectsManager } from '../classes/ProjectsManager';
import { ProjectCard } from "./ProjectCard"
import { SearchBox } from './SearchBox';
import { getCollection } from "../firebase"
import { ProjectForm } from './ProjectForm';
import { Message } from './Message';

interface Props {
  projectsManager: ProjectsManager
}

const projectsCollection = getCollection<IProject>("/projects")

export function ProjectsPage(props: Props) {

  const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list)
  const [isFormVisible, setFormVisible] = React.useState<boolean>(false)

  props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.list])}

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
        //TODO
        console.error("Error adding project: ", error);
        
      }
    }
  }

  React.useEffect(() => {
    getFirestoreProjects()
  }, [])
  
  React.useEffect(() => {
    console.log("Projects state updated", projects)
  }, [projects])

  const projectCards = projects.map((project) => {
    return (
    <Router.Link to={`/project/${project.id}`} key={project.id}>
      <ProjectCard project={project}/>
    </Router.Link>

    )
  })

  const onNewProjectClick = () => {
    console.log("it should be opening")
    setFormVisible(true)
  }
  const closeProjectForm = () => {
    console.log("it should be clossing")
    setFormVisible(false)
  };

  const onExportProject = () => {
    props.projectsManager.exportToJSON()
  }

  const onImportProject = () => {
    props.projectsManager.importFromJSON()
  }

  const onProjectSearch = (value: string) => {
    const filteredProjects = props.projectsManager.filterProjects(value)
    setProjects(filteredProjects)
  }

  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
      <ProjectForm
        projectsManager = {props.projectsManager}
        project = {null}
        isVisible = {isFormVisible}
        onClose = {closeProjectForm}
        />
      <header>
        <bim-label>Projects</bim-label>
        <SearchBox onChange={(value) => onProjectSearch(value)}/>
        <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
          <bim-button
            id="import-projects-btn"
            icon="iconoir:import"
            onClick={onImportProject}
          />
          <bim-button
            id="export-projects-btn"
            icon="ph:export"
            onClick={onExportProject}
          />
          <bim-button onClick={onNewProjectClick} id="new-project-btn"
          label="New Project"
          icon="fluent:add-20-regular"/>
        </div>
      </header>
      {
        projects.length > 0 ?
        <div id="projects-list"> { projectCards} </div> :
        <Message title={"No projects found"} message={"Try again with another search."} />

      }
    </div>
  )
}