import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import { TodoCreator } from "./TodoCreator"
import { Priority, TodoInput } from "./base-types"
import { Todo } from "./Todo"

export interface TodoUIState {
  components: OBC.Components
  projectId?: string
}

export const todoTool = (state: TodoUIState) => {
  const { components, projectId } = state
  const todoCreator = components.get(TodoCreator)
  
  const nameInput = document.createElement("bim-text-input")
  nameInput.label = "Name"
  const taskInput = document.createElement("bim-text-input")
  taskInput.label = "Task"

  const priorityInput = BUI.Component.create<BUI.Dropdown>(() => {
    return BUI.html`
      <bim-dropdown label="Priority">
        <bim-option label="Low" checked></bim-option>
        <bim-option label="Medium"></bim-option>
        <bim-option label="High"></bim-option>
      </bim-dropdown>
    `
  })

  const todoModal = BUI.Component.create<HTMLDialogElement>(() => {
    return BUI.html`
      <dialog>
        <bim-panel style="width: 20rem;">
          <bim-panel-section label="To-Do" fixed>
            <bim-label>Create A To-Do For Future</bim-label>
            ${nameInput}
            ${taskInput}
            ${priorityInput}
            <bim-button 
              label="Create todo"
              @click=${async () => {
                const todoValue: TodoInput = {
                  name: nameInput.value,
                  task: taskInput.value,
                  priority: priorityInput.value[0] as Priority
                }
                if (!todoValue.name || !todoValue.task) {
                  alert("Please fill in all required fields")
                  return
                }
                
                try {
                  await todoCreator.addTodo(todoValue, projectId)
                  taskInput.value = ""
                  nameInput.value = ""
                  todoModal.close()
                } catch (error) {
                  console.error("Failed to create todo:", error)
                  alert("Failed to create todo. Please try again.")
                }
              }}
            ></bim-button>
          </bim-panel-section>
        </bim-panel>
      </dialog>
    `
  })
  document.body.appendChild(todoModal)

  const todoButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        @click=${() => todoModal.showModal()}
        icon="pajamas:todo-done"
        tooltip-title="To-Do"
      ></bim-button>
    `
  })

  const onTogglePriority = (event: Event) => {
    const btn = event.target as BUI.Button
    btn.active = !btn.active
    todoCreator.enablePriorityHighlight = btn.active
  }

  const todoPriorityButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button 
        icon="iconoir:fill-color"
        tooltip-title="Show Priority Filter"
        @click=${onTogglePriority}
      ></bim-button>
    `
  })

  todoCreator.onDisposed.add(() => {
    todoButton.remove()
    todoPriorityButton.remove()
    todoModal.remove()
  })

  return [todoButton, todoPriorityButton]
}

export const createEditTodoModal = (todo: Todo, todoCreator: TodoCreator) => {
  const editNameInput = document.createElement("bim-text-input")
  editNameInput.label = "Name"
  editNameInput.value = todo.name
  
  const editTaskInput = document.createElement("bim-text-input")
  editTaskInput.label = "Task"
  editTaskInput.value = todo.task

  const editPriorityInput = BUI.Component.create<BUI.Dropdown>(() => {
    return BUI.html`
      <bim-dropdown label="Priority" value=${todo.priority}>
        <bim-option label="Low" ${todo.priority === "Low" ? "checked" : ""}></bim-option>
        <bim-option label="Medium" ${todo.priority === "Medium" ? "checked" : ""}></bim-option>
        <bim-option label="High" ${todo.priority === "High" ? "checked" : ""}></bim-option>
      </bim-dropdown>
    `
  })

  const editModal = BUI.Component.create<HTMLDialogElement>(() => {
    return BUI.html`
      <dialog>
        <bim-panel style="width: 20rem;">
          <bim-panel-section label="Edit To-Do" fixed>
            <bim-label>Edit Your To-Do</bim-label>
            ${editNameInput}
            ${editTaskInput}
            ${editPriorityInput}
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <bim-button 
                label="Cancel"
                @click=${() => editModal.close()}
              ></bim-button>
              <bim-button 
                label="Update"
                style="background-color: var(--bim-ui_accent-base)"
                @click=${async () => {
                  const updates = {
                    name: editNameInput.value,
                    task: editTaskInput.value,
                    priority: editPriorityInput.value[0] as Priority
                  }
                  
                  if (!updates.name || !updates.task) {
                    alert("Please fill in all required fields")
                    return
                  }
                  
                  try {
                    await todoCreator.updateTodo(todo.id, updates)
                    editModal.close()
                    editModal.remove()
                  } catch (error) {
                    console.error("Failed to update todo:", error)
                    alert("Failed to update todo. Please try again.")
                  }
                }}
              ></bim-button>
            </div>
          </bim-panel-section>
        </bim-panel>
      </dialog>
    `
  })
  
  document.body.appendChild(editModal)
  return editModal
}