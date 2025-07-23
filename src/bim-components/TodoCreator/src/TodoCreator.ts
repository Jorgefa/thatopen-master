import * as OBC from "@thatopen/components"
import * as OBCF from "@thatopen/components-front"
import * as BUI from "@thatopen/ui"
import * as THREE from "three"
import { TodoData, TodoInput } from "./base-types"
import { Todo } from "./Todo"
import { createTodo, getTodos, updateTodo as updateTodoInFirebase, deleteTodo as deleteTodoFromFirebase, firebaseDataToTodoData, todoToFirebaseData } from "../../../firebase"

export class TodoCreator extends OBC.Component implements OBC.Disposable {
  static uuid = "f26555ec-4394-4349-986a-7409e4fd308e"
  enabled = true
  private _world: OBC.World
  private _cameraControls: any
  private _list: Map<string, Todo> = new Map()
  
  onTodoCreated = new OBC.Event<Todo>()
  onTodoUpdated = new OBC.Event<Todo>()
  onTodoDeleted = new OBC.Event<string>()
  onDisposed = new OBC.Event<null>()

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(TodoCreator.uuid, this)
  }

  async initializeFromFirebase(projectId?: string): Promise<void> {
    try {
      const firebaseTodos = await getTodos(projectId)
      for (const firebaseData of firebaseTodos) {
        const todoData = firebaseDataToTodoData(firebaseData)
        const todo = Todo.fromJSON(todoData)
        this._list.set(todo.id, todo)
      }
      console.log(`Loaded ${firebaseTodos.length} todos from Firebase`)
    } catch (error) {
      console.error("Failed to load todos from Firebase:", error)
    }
  }

  async dispose() {
    this.enabled = false
    this._list.clear()
    this.onDisposed.trigger()
  }

  setup() {
    const highlighter = this.components.get(OBCF.Highlighter)
    highlighter.add(`${TodoCreator.uuid}-priority-Low`, new THREE.Color(0x59bc59))
    highlighter.add(`${TodoCreator.uuid}-priority-Medium`, new THREE.Color(0x597cff))
    highlighter.add(`${TodoCreator.uuid}-priority-High`, new THREE.Color(0xff7676))
  }

  set world(world: OBC.World) {
    this._world = world
    // Store camera controls for easier access
    if (world.camera && world.camera.hasCameraControls()) {
      this._cameraControls = world.camera.controls
    }
  }

  get todos(): Todo[] {
    return Array.from(this._list.values())
  }

  getTodoById(id: string): Todo | undefined {
    return this._list.get(id)
  }

  set enablePriorityHighlight(value: boolean) {
    if (!this.enabled) return

    const highlighter = this.components.get(OBCF.Highlighter)
    if (value) {
      for (const todo of this._list.values()) {
        const fragments = this.components.get(OBC.FragmentsManager)
        const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids)
        highlighter.highlightByID(`${TodoCreator.uuid}-priority-${todo.priority}`, fragmentIdMap, false, false)
      }
    } else {
        highlighter.clear()
    }
  }

  async addTodo(data: TodoInput, projectId?: string): Promise<Todo> {
    if (!this.enabled) throw new Error("TodoCreator is not enabled")

    const fragments = this.components.get(OBC.FragmentsManager)
    const highlighter = this.components.get(OBCF.Highlighter)
    const guids = fragments.fragmentIdMapToGuids(highlighter.selection.select)

    const camera = this._world.camera

    if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
      throw new Error("No camera found in the world")
    }

    const position = new THREE.Vector3()
    camera.controls.getPosition(position)
    const target = new THREE.Vector3()
    camera.controls.getTarget(target)

    const todo = new Todo({
      name: data.name,
      task: data.task,
      priority: data.priority,
      ifcGuids: guids,
      camera: {
        position,
        target,
      },
      projectId
    })

    // Save to Firebase first, then add to local state
    try {
      await createTodo(todo.toJSON())
      this._list.set(todo.id, todo)
      this.onTodoCreated.trigger(todo)
      console.log("Todo created and saved to Firebase:", todo.id)
      return todo
    } catch (error) {
      console.error("Failed to save todo to Firebase:", error)
      throw error
    }
  }

  async updateTodo(id: string, updates: Partial<Pick<Todo, 'name' | 'task' | 'priority' | 'ifcGuids' | 'camera' | 'projectId'>>): Promise<Todo | null> {
    const todo = this._list.get(id)
    if (!todo) return null
    
    try {
      // Update local todo
      todo.update(updates)
      
      // Convert updates to Firebase format
      const firebaseUpdates: any = { ...updates }
      if (updates.camera) {
        firebaseUpdates.camera = {
          position: {
            x: updates.camera.position.x,
            y: updates.camera.position.y,
            z: updates.camera.position.z
          },
          target: {
            x: updates.camera.target.x,
            y: updates.camera.target.y,
            z: updates.camera.target.z
          }
        }
      }
      
      // Save to Firebase
      await updateTodoInFirebase(id, firebaseUpdates)
      this.onTodoUpdated.trigger(todo)
      console.log("Todo updated in Firebase:", id)
      return todo
    } catch (error) {
      console.error("Failed to update todo in Firebase:", error)
      throw error
    }
  }

  async deleteTodo(id: string): Promise<boolean> {
    try {
      // Delete from Firebase first
      await deleteTodoFromFirebase(id)
      
      // Remove from local state
      const success = this._list.delete(id)
      if (success) {
        this.onTodoDeleted.trigger(id)
        console.log("Todo deleted from Firebase:", id)
      }
      return success
    } catch (error) {
      console.error("Failed to delete todo from Firebase:", error)
      throw error
    }
  }

  async highlightTodo(todo: Todo) {
    if (!this.enabled) return
    
    const fragments = this.components.get(OBC.FragmentsManager)
    const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids)
    const highlighter = this.components.get(OBCF.Highlighter)
    highlighter.highlightByID("select", fragmentIdMap, true, false)

    if (!this._world) {
      throw new Error("No world found")
    }

    const camera = this._world.camera
    if (!(camera.hasCameraControls())) {
      throw new Error("The world camera doesn't have camera controls")
    }

    await camera.controls.setLookAt(
      todo.camera.position.x,
      todo.camera.position.y,
      todo.camera.position.z,
      todo.camera.target.x,
      todo.camera.target.y,
      todo.camera.target.z,
      true
    )
  }

  addTodoMarker(todo: Todo) {
    if (!this.enabled) return

    if (todo.ifcGuids.length === 0) return

    const fragments = this.components.get(OBC.FragmentsManager)
    const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids)
    const boundingBoxer = this.components.get(OBC.BoundingBoxer)
    boundingBoxer.addFragmentIdMap(fragmentIdMap)
    const { center } = boundingBoxer.getSphere()

    const label = BUI.Component.create<BUI.Label>(() => {
      return BUI.html `
        <bim-label
          @mouseover=${() => {
            const highlighter = this.components.get(OBCF.Highlighter)
            highlighter.highlightByID("hover", fragmentIdMap, true, false)
          }}
          style="background-color: var(--bim-ui_bg-contrast-100); cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 999px; pointer-events: auto;"
          icon="fa:map-marker"
        ></bim-label>
      `
    })

    const marker = new OBCF.Mark(this._world, label)
    marker.three.position.copy(center)
  }
}
