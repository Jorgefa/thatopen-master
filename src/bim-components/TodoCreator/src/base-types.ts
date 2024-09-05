export interface TodoInput {
  name: string
  task: string
}

export interface TodoData {
  name: string
  task: string
  fragmentGuids: string[]
  camera: {position: THREE.Vector3, target: THREE.Vector3}
}