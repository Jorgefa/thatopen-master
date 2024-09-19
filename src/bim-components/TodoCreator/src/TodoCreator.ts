import * as OBC from "@thatopen/components"

export interface TodoData {
  name: string
  task: string
}

export class TodoCreator extends OBC.Component {
  static uuid = "f26555ec-4394-4349-986a-7409e4fd308e"
  enabled = true
  onTodoCreated = new OBC.Event<TodoData>()

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(TodoCreator.uuid, this)
  }

  addTodo(data: TodoData) {
    this.onTodoCreated.trigger(data)
  }
}