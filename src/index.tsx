import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { Sidebar } from "./react-components/Sidebar"
import * as THREE from "three"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import { IProject, ProjectStatus, UserRole } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <Sidebar />
)

function showModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

function closeModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
  console.warn("New projects button was not found")
}

const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
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
      const project = projectsManager.newProject(projectData)
      console.log(project)
      projectForm.reset()
      closeModal("new-project-modal")
    } catch (err) {
      alert(err)
    }
  })
} else {
	console.warn("The project form was not found. Check the ID!")
}

const exportProjectsBtn= document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

//ThreeJS viewer
const scene = new THREE.Scene()

const viewerContainer = document.getElementById("viewer-container") as HTMLElement

const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)

function resizeViewer() {
  const containerDimensions = viewerContainer.getBoundingClientRect()
  renderer.setSize(containerDimensions.width, containerDimensions.height)
  const aspectRatio = containerDimensions.width / containerDimensions.height
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()
}

window.addEventListener("resize", resizeViewer)

resizeViewer()

const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)

const directionalLight = new THREE.DirectionalLight()
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.4

scene.add(directionalLight, ambientLight)

const cameraControls = new OrbitControls(camera, viewerContainer)

function renderScene() {
  renderer.render(scene, camera)
  requestAnimationFrame(renderScene)
}

renderScene()

const axes = new THREE.AxesHelper()
const grid = new THREE.GridHelper()
grid.material.transparent = true
grid.material.opacity = 0.4
grid.material.color = new THREE.Color("#808080")

scene.add(axes, grid)

const gui = new GUI()

const cubeControls = gui.addFolder("Cube")

cubeControls.add(cube.position, "x", -10, 10, 1)
cubeControls.add(cube.position, "y", -10, 10, 1)
cubeControls.add(cube.position, "z", -10, 10, 1)
cubeControls.add(cube, "visible")
cubeControls.addColor(cube.material, "color")

const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()

mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
  materials.preload()
  objLoader.setMaterials(materials)
  objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
    scene.add(mesh)
  })
})