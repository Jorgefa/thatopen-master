import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import { TodoCreator } from "./TodoCreator"

export interface todoUIState {
  components: OBC.Components
}
export const todoTool = (state: todoUIState) => {
  const { components } = state
  const todoCreator = components.get(TodoCreator)
  
  return BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        @click=${() => todoCreator.addTodo()}
        icon="pajamas:todo-done"
        tooltip-title="To-Do"
      ></bim-button>
    `
  })
}