import * as OBC from "@thatopen/components"

export class TodoCreator extends OBC.Component {
  components: OBC.Components
  enabled: boolean = false
  onTodoCreated: OBC.Event<string> = new OBC.Event<string>()

  static uuid = "f26555ec-4394-4349-986a-7409e4fd342e"
  constructor(components: OBC.Components) {
    super(components)
    this.components.add(TodoCreator.uuid, this)
  }

  createTodo(data: string) {
    this.onTodoCreated.trigger(data)
  }
}