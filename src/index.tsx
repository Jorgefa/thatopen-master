import * as THREE from "three"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import * as Router from "react-router-dom"
import { Sidebar } from "./react-components/Sidebar"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import { ProjectsPage } from "./react-components/ProjectsPage"
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage"
import { ProjectsManager } from "./classes/ProjectsManager"

const projectsManager = new ProjectsManager

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
  <>
    <Router.BrowserRouter>
      <Sidebar />
      <Router.Routes>
        <Router.Route path="/" element={<ProjectsPage projectsManager={projectsManager}/>} />
        <Router.Route path="/project/:id" element={<ProjectDetailsPage projectsManager={projectsManager}/>} />
      </Router.Routes>
    </Router.BrowserRouter>
  </>
)

// //ThreeJS viewer
// const scene = new THREE.Scene()

// const viewerContainer = document.getElementById("viewer-container") as HTMLElement

// const camera = new THREE.PerspectiveCamera(75)
// camera.position.z = 5

// const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
// viewerContainer.append(renderer.domElement)

// function resizeViewer() {
//   const containerDimensions = viewerContainer.getBoundingClientRect()
//   renderer.setSize(containerDimensions.width, containerDimensions.height)
//   const aspectRatio = containerDimensions.width / containerDimensions.height
//   camera.aspect = aspectRatio
//   camera.updateProjectionMatrix()
// }

// window.addEventListener("resize", resizeViewer)

// resizeViewer()

// const boxGeometry = new THREE.BoxGeometry()
// const material = new THREE.MeshStandardMaterial()
// const cube = new THREE.Mesh(boxGeometry, material)

// const directionalLight = new THREE.DirectionalLight()
// const ambientLight = new THREE.AmbientLight()
// ambientLight.intensity = 0.4

// scene.add(directionalLight, ambientLight)

// const cameraControls = new OrbitControls(camera, viewerContainer)

// function renderScene() {
//   renderer.render(scene, camera)
//   requestAnimationFrame(renderScene)
// }

// renderScene()

// const axes = new THREE.AxesHelper()
// const grid = new THREE.GridHelper()
// grid.material.transparent = true
// grid.material.opacity = 0.4
// grid.material.color = new THREE.Color("#808080")

// scene.add(axes, grid)

// const gui = new GUI()

// const cubeControls = gui.addFolder("Cube")

// cubeControls.add(cube.position, "x", -10, 10, 1)
// cubeControls.add(cube.position, "y", -10, 10, 1)
// cubeControls.add(cube.position, "z", -10, 10, 1)
// cubeControls.add(cube, "visible")
// cubeControls.addColor(cube.material, "color")

// const objLoader = new OBJLoader()
// const mtlLoader = new MTLLoader()

// mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
//   materials.preload()
//   objLoader.setMaterials(materials)
//   objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
//     scene.add(mesh)
//   })
// })