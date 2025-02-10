import React from "react"
import * as BUI from "@thatopen/ui"
import { element } from "three/examples/jsm/nodes/Nodes.js"

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "bim-grid": any
        }
    }
}

export function UsersPage() {
    const userTable = BUI.Component.create<BUI.Table>(() => {
        const onTableCreated = (element?: Element) => {
            const table = element as BUI.Table
            table.data = [
                {
                    data: {
                        Name: "John Doe",
                        Task: "Create a new project",
                        Role: "Engineer",
                    }
                },
                {
                    data: {
                        Name: "Jorge",
                        Task: "Do a new project",
                        Role: "Architect",
                    }
                },
                {
                    data: {
                        Name: "Juan",
                        Task: "Publish a new project",
                        Role: "Architect",
                    }
                }
            ]
        }
        return BUI.html`
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
        `
    })

    const sidebar = BUI.Component.create<BUI.Component>(() => {
        const buttonStyles = {
            "height": "50px",
        }
        return BUI.html `
        <div style="padding: 4px">
            <bim-button
                style=${BUI.styleMap(buttonStyles)}
                icon= "pepicons-print:printer"
                @click=${() => {console.log(userTable.value)}}>
            </bim-button>
            <bim-button
                style=${BUI.styleMap(buttonStyles)}
                icon= "material-symbols-light:download-sharp"
                @click=${() => {
                    const csvData = userTable.csv
                    const blob = new Blob([csvData], {type: "text/csv"})
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "users.csv"
                    a.click()
                }}>
            </bim-button>
        </div>
        `
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
                    const header = document.createElement("div");
                    header.style.backgroundColor = "lightblue";
                    return header;
                })(),
                sidebar,
                content,
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