import * as OBC from "@thatopen/components"
import * as OBCF from "@thatopen/components-front"
import * as BUI from "@thatopen/ui"
import * as THREE from "three"
import { TodoData, TodoInput } from "./base-types"

export class TodoCreator extends OBC.Component implements OBC.Disposable {
  static uuid = "f26555ec-4394-4349-986a-7409e4fd308e"
  enabled = true
  private _components: OBC.Components
  private _world: OBC.World
  private _list: TodoData[] = []
  
  onTodoCreated = new OBC.Event<TodoData>()
  onDisposed = new OBC.Event<null>()

  constructor(components: OBC.Components) {
    super(components)
    this._components = components
    components.add(TodoCreator.uuid, this)
  }

  async dispose() {
    this.onDisposed.trigger()
    this.enabled = false
    this._list = []
  }

  setup() {
    const highlighter = this._components.get(OBCF.Highlighter)
    highlighter.add(`${TodoCreator.uuid}-priority-Low`, new THREE.Color(0x59bc59))
    highlighter.add(`${TodoCreator.uuid}-priority-Medium`, new THREE.Color(0x597cff))
    highlighter.add(`${TodoCreator.uuid}-priority-High`, new THREE.Color(0xff7676))
  }

  set world(world: OBC.World) {
    this._world = world
  }

  set enablePriorityHighlight(value: boolean) {
    const highlighter = this._components.get(OBCF.Highlighter)
    if (value) {
      for (const todo of this._list) {
        const fragments = this._components.get(OBC.FragmentsManager)
        const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids)
        highlighter.highlightByID(`${TodoCreator.uuid}-priority-${todo.priority}`, fragmentIdMap, false, false)
      }
    } else {
        highlighter.clear()
    }
  }

  async addTodo(data: TodoInput) {
    if (!this.enabled) return

    const fragments = this._components.get(OBC.FragmentsManager)
    const highlighter = this._components.get(OBCF.Highlighter)
    const guids = fragments.fragmentIdMapToGuids(highlighter.selection.select)

    const camera = this._world.camera

    if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
      throw new Error("No camera found in the world")
    }

    const position = new THREE.Vector3()
    camera.controls.getPosition(position)
    const target = new THREE.Vector3()
    camera.controls.getTarget(target)

    const todoData: TodoData = {
      name: data.name,
      task: data.task,
      priority: data.priority,
      ifcGuids: guids,
      camera: {
        position,
        target,
      }
    }

    this._list.push(todoData)
    this.onTodoCreated.trigger(todoData)
  }

  async highlightTodo(todo: TodoData) {
    const fragments = this._components.get(OBC.FragmentsManager)
    const fragmentIdMap = fragments.guidToFragmentIdMap(todo.ifcGuids)
    const highlighter = this._components.get(OBCF.Highlighter)
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

  async addTodoMarker(todo: TodoData) {
    if (todo.fragmentGuids.length === 0) return
    const fragments = this._components.get(OBC.FragmentsManager)
    const fragmentIdMap = fragments.guidToFragmentIdMap(todo.fragmentGuids)
    const boundingBoxer = this._components.get(OBC.BoundingBoxer)
    boundingBoxer.addFragmentIdMap(fragmentIdMap)
    const { center } = boundingBoxer.getSphere()

    const label = BUI.Component.create(() => {
      return BUI.html`
        <bim-label
          icon="jam:document-f"
          style="background-color: var(--bim-ui_bg-contrast-100); cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 999px; pointer-events: auto;">
        </bim-label>
      `;
    });
    const marker = new OBCF.Mark(this._world, label)
    marker.three.position.copy(center);
  }
}