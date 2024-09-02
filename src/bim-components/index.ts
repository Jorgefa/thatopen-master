import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"

export class TodoCreator extends OBC.Component {
  static uuid = "f26555ec-4394-4349-986a-7409e4fd308e"
  enabled = true
  private _components: OBC.Components
  uiElement: BUI.Button
  todoPanel: BUI.Panel
  _grid: BUI.Grid

  constructor(components: OBC.Components) {
    super(components)
    this._components = components
    components.add(TodoCreator.uuid, this)
    this.setUI()
  }

  set grid(value: BUI.Grid) {
    this._grid = value
  }

  private setUI() {
    const addTodo = () => {
      console.log("Adding todo")
    }

    const todoCreatorPanel = BUI.Component.create<BUI.Panel>(() => {
      return BUI.html`
        <bim-panel name="todoCreatorPanel" label="ToDo Creator">
          <bim-panel-section>
            <bim-text-input placeholder="Enter Your Todo"></bim-text-input>
            <div style="display: flex; align-items: center; column-gap: 15px">
              <bim-button label="Cancel"
                @click=${() => {
                  todoCreatorPanel.style.display = "none"
                }}
              ></bim-button>
              <bim-button label="Create Todo"
                @click=${() => {
                  todoCreatorPanel.style.display = "none"
                  addTodo()
                }}
              ></bim-button>
            </div>
        </bim-panel>
      `
    })

    const contextMenu = BUI.Component.create<BUI.ContextMenu>(() => {
      return BUI.html`
        <bim-context-menu>
          <bim-button label="Show Todo"
            @click=${() => {
              // How to disable blur?
              contextMenu.hidden = true

              this._grid.layout = "todoLayout"
            }}
          ></bim-button>
          <bim-button label="Create Todo"
            @click=${() => {
              // How to disable blur?
              contextMenu.hidden = true
              document.getElementById("project-details")?.appendChild(todoCreatorPanel)
              todoCreatorPanel.style.display = "block"
              todoCreatorPanel.style.position = "absolute"
              // move the panel to center
              todoCreatorPanel.style.left = "50%"
              todoCreatorPanel.style.top = "50%"
              todoCreatorPanel.style.transform = "translate(-50%, -50%)"
              todoCreatorPanel.style.zIndex = "1000"
            }}
          ></bim-button>
        </bim-context-menu>
      `
    })
    const clicker = BUI.Component.create<BUI.Button>(() => {
      return BUI.html`
        <bim-button
          icon="pajamas:todo-done"
          tooltip-title="To-Do"
        >
          ${contextMenu}
        </bim-button>
      `
    })
    this.uiElement = clicker

    const panel = BUI.Component.create<BUI.Panel>(() => {
      return BUI.html`
        <bim-panel>
          <bim-panel-section>
            <bim-label>Todo creator</bim-label>
            <bim-text-input placeholder="Enter your todo"></bim-text-input>
            <bim-button label="Create todo"></bim-button>
          </bim-panel-section>
        </bim-panel>
      `
    })
    this.todoPanel = panel
  }

  get() {
    return this.uiElement
  }
}