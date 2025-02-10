import React from "react"
import * as BUI from "@thatopen/ui"

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "bim-grid": any
        }
    }
}

export function UsersPage() {

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
                    const header = document.createElement("div");
                    header.style.backgroundColor = "lightblue";
                    return header;
                })(),
                sidebar: (() => {
                    const sidebar = document.createElement("div");
                    sidebar.style.backgroundColor = "white";
                    return sidebar;
                })(),
                content: (() => {
                    const content = document.createElement("div");
                    content.style.backgroundColor = "darkgray";
                    return content;
                })(),
                footer: (() => {
                    const footer = document.createElement("div");
                    footer.style.backgroundColor = "gray";
                    return footer;
                })(),
            }
        }
    }
    React.useEffect(() => {
        BUI.Manager.init()
        const grid = document.getElementById("bimGrid") as BUI.Grid
        grid.layouts = gridLayout
        grid.layout = "primary"
    },[])

    return (
    <div>
        <bim-grid id="bimGrid"></bim-grid>
    </div>
    )
}   