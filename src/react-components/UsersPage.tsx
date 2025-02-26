import React from "react"
import * as BUI from "@thatopen/ui"

export function UsersPage() {
  const userTable = BUI.Component.create<BUI.Table>(() => {
    const onTableCreated = (element?: Element) => {
      if (!element) return;
      const table = element as BUI.Table;
      table.data = [
        {
          data: {
            Name: "John Doe",
            Task: "Create Work Orders",
            Role: "Engineer",
          },
        },
        {
          data: {
            Name: "Jane Doe",
            Task: "Review Work Orders",
            Role: "Manager",
          },
        },
        {
          data: {
            Name: "Antonio",
            Task: "Review PRs",
            Role: "Developer",
          },
        },
        {
          data: {
            Name: "Juan",
            Task: "Create PRs",
            Role: "Engineer",
          },
        },
        {
          data: {
            Name: "Vishwajeet",
            Task: "Content",
            Role: "Developer",
          },
        }
      ]
    }
  
    return BUI.html `
      <bim-table ${BUI.ref(onTableCreated)}></bim-table>
    `
  })
  
  const content = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html `
      <bim-panel style="border-radius: 0px">
        <bim-panel-section label="Tasks">
          ${userTable}
        </bim-panel-section>
      </bim-panel> 
    `;
  })
  
  const sidebar = BUI.Component.create<BUI.Component>(() => {
    const buttonStyles = {
      "height": "50px",
    }
  
    return BUI.html `
      <div style="padding: 4px">
        <bim-button 
          style=${BUI.styleMap(buttonStyles)} 
          icon="material-symbols:print-sharp"
          @click=${() => {
            console.log(userTable.value)
          }}
        ></bim-button>
        <bim-button 
          style=${BUI.styleMap(buttonStyles)} 
          icon="uil:file-export"
          @click=${() => {
            const csvData = userTable.csv
            const blob = new Blob([csvData], { type: "text/csv" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "users.csv"
            a.click()
          }}
        ></bim-button>
      </div>
    `;
  })

  const footer = BUI.Component.create<BUI.Component>(() => {
    return BUI.html `
      <div style="display: flex; justify-content: center;">
        <bim-label>Copyright of That Contruction Company</bim-label>
      </div>
    `;
  })

  const gridLayout: BUI.Layouts = {
    primary: {
      template: `
        "header header" 40px
        "content sidebar" 1fr
        "footer footer" 40px
        / 1fr 60px
      `,
      elements: {
        header: (() => {
          const inputBox = BUI.Component.create<BUI.TextInput>(() => {
            return BUI.html `
              <bim-text-input style="padding: 8px" placeholder="Search Users"></bim-text-input>
            `
          })
          inputBox.addEventListener("input", () => {
            userTable.queryString = inputBox.value
          })
          return inputBox
        })(),
        sidebar,
        content,
        footer,
      }
    }
  }

  React.useEffect (() => {
    const grid = document.getElementById("bimGrid") as BUI.Grid
    grid.layouts = gridLayout
    grid.layout = "primary"
  }, [])
  
  return (
    <div>
      <bim-grid id="bimGrid"></bim-grid>
    </div>
  )
}