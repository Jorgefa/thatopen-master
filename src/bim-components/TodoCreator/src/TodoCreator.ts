import * as OBC from "@thatopen/components"
import * as OBCF from "@thatopen/components-front"
import * as THREE from "three"
import { TodoData, TodoInput } from "./base-types"

export class TodoCreator extends OBC.Component {
  static uuid = "f26555ec-4394-4349-986a-7409e4fd308e"
  enabled = true
  private _components: OBC.Components
  onTodoCreated = new OBC.Event<TodoData>()

  constructor(components: OBC.Components) {
    super(components)
    this._components = components
    components.add(TodoCreator.uuid, this)
  }

  async addTodo(data: TodoInput) {
    const fragments = this._components.get(OBC.FragmentsManager)
    const highlighter = this._components.get(OBCF.Highlighter)
    const guids = fragments.fragmentIdMapToGuids(highlighter.selection.select)

    const world = this._components.get(OBC.Worlds).list.values().next().value as OBC.World
    const camera = world.camera

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
      fragmentGuids: guids,
      camera: {
        position,
        target,
      }
    }

    this.onTodoCreated.trigger(todoData)
  }

  async highlightTodo(todo: TodoData) {
    const fragments = this._components.get(OBC.FragmentsManager)
    const fragmentIdMap = fragments.guidToFragmentIdMap(todo.fragmentGuids)
    const highlighter = this._components.get(OBCF.Highlighter)
    await highlighter.highlightByID("select", fragmentIdMap, true, false)

    const world = this._components.get(OBC.Worlds).list.values().next().value as OBC.World
    const camera = world.camera

    if (!(camera instanceof OBC.OrthoPerspectiveCamera)) {
      throw new Error("No camera found in the world")
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
}