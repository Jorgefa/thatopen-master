import React from "react"
import * as BUI from "@thatopen/ui"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bim-button': any;
      'bim-grid': any;
    }
  }
}

export const gridLayout: BUI.Layouts = {
  primary: {
    template: `
      "header header header" 40px
      "sidebar content content" 1fr
      "footer footer footer" 40px
      / 60px 1fr 1fr
    `,
    elements: {
      header: (() => {
        const header = document.createElement("div");
        header.style.backgroundColor = "#641b1b66";
        return header;
      })(),
      sidebar: (() => {
        const sidebar = document.createElement("div");
        sidebar.style.backgroundColor = "#1b641b66";
        return sidebar;
      })(),
      content: (() => {
        const content = document.createElement("div");
        content.style.backgroundColor = "#7D7D7D66";
        return content;
      })(),
      footer: (() => {
        const footer = document.createElement("div");
        footer.style.backgroundColor = "#ff440066";
        return footer;
      })(),
    }
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