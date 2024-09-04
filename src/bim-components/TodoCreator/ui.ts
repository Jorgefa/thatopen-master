import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import { TodoCreator } from "./TodoCreator"


export interface todoUIState {
  components: OBC.Components
}
export const todoUI = (state: todoUIState) => {
  const { components } = state
  const todoCreator = components.get(TodoCreator)
  
  const todoInput = document.createElement("bim-text-input")

  const todoModal = BUI.Component.create<HTMLDialogElement>(() => {
    return BUI.html`
      <dialog>
        <bim-panel style="width: 20rem;">
          <bim-panel-section label="To-Do" fixed>
            <bim-label>Create A To-Do For Future</bim-label>
            ${todoInput}
            <bim-button 
              label="Create todo"
              @click=${() => {
                const todoValue = todoInput.value
                if (!todoValue) {return}
                todoCreator.createTodo(todoValue)
                todoModal.close()
              }}
            ></bim-button>
          </bim-panel-section>
        </bim-panel>
      </dialog>
    `
  })
  document.body.appendChild(todoModal)

  return BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        @click=${() => todoModal.showModal()}
        icon="pajamas:todo-done"
        tooltip-title="To-Do"
      ></bim-button>
    `
  })
}