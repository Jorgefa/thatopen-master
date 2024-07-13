import React from "react"
import * as BUI from "@thatopen/ui"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bim-grid': any;
    }
  }
}

const bimTable = BUI.Component.create<BUI.Table>(() => {
  const onTableCreated = (element?: Element) => {
    if (!element) return;
    const table = element as BUI.Table;
    table.data = [
      {
        data: {
          name: "John Doe",
          task: "Create Work Orders",
          role: "Engineer",
        },
      },
      {
        data: {
          name: "Jane Doe",
          task: "Review Work Orders",
          role: "Manager",
        },
      },
    ]
  }

  return BUI.html `
    <bim-table ${BUI.ref(onTableCreated)}></bim-table>
  `
})

const contentPanel = BUI.Component.create<BUI.Panel>(() => {
  return BUI.html `
    <bim-panel style="border-radius: 0px">
      <bim-panel-section label="Tasks">
        ${bimTable}
      </bim-panel-section>
    </bim-panel> 
  `;
})

const footerPanel = BUI.Component.create<BUI.Component>(() => {
  const labelStyles = {
    "color": "#ffffff",
  }
  return BUI.html `
    <div style="display: flex; justify-content: center;">
      <bim-label style=${BUI.styleMap(labelStyles)}>Copyright of That Contruction Company</bim-label>
    </div>
  `;
})

const sidebarPanel = BUI.Component.create<BUI.Component>(() => {
  return BUI.html `
    <div style="padding: 4px">
      <bim-button label="Click Me"></bim-button>
      <bim-button label="Export"></bim-button>
    </div>
  `;
})

export const gridLayout: BUI.Layouts = {
  primary: {
    template: `
      "header header header" 40px
      "contentPanel contentPanel sidebarPanel" 1fr
      "footerPanel footerPanel footerPanel" 40px
      / 1fr 1fr 60px
    `,
    elements: {
      header: (() => {
        const inputBox = BUI.Component.create<BUI.TextInput>(() => {
          return BUI.html `
            <bim-text-input style="padding: 8px" placeholder="Search"></bim-text-input>
          `
        })
        return inputBox;
      })(),
      sidebarPanel,
      contentPanel,
      footerPanel,
    },
  }
}

export function UsersPage() {

  React.useEffect (() => {
    BUI.Manager.init()

    const grid = document.getElementById("bimGrid") as BUI.Grid
    grid.layouts = gridLayout
    grid.layout = "primary"
  })
  
  return (
    <div>
      <bim-grid id="bimGrid"></bim-grid>
    </div>
  )
}