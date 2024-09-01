import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"

export class TodoCreator extends OBC.Component {
  static uuid = "f26555ec-4394-4349-986a-7409e4fd308e"
  enabled = true
  private _components: OBC.Components

  constructor(components: OBC.Components) {
    super(components)
    this._components = components
    components.add(TodoCreator.uuid, this)
  }

  private setUI() {
    
  }
}