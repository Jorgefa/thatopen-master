import * as OBC from "@thatopen/components"
import * as BUI from "@thatopen/ui"
import { SimpleQTO } from "../index"

type QtoResult = {[setName: string]: {[qtoName: string]: number}}

export interface QTOUIState {
  components: OBC.Components
}

export const createQTOPanel = (state: QTOUIState) => {
  const { components } = state
  const simpleQTO = components.get(SimpleQTO)
  
  // Create a table to display QTO results
  const qtoTable = BUI.Component.create<BUI.Table>(() => {
    return BUI.html`<bim-table></bim-table>`
  })

  // Create summary cards for totals
  const totalAreaCard = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
      <bim-panel style="min-width: 150px;">
        <bim-panel-section label="Total Area" fixed>
          <bim-label id="total-area-value" style="font-size: 1.5rem; font-weight: bold; color: var(--bim-ui_accent-base);">0 m²</bim-label>
        </bim-panel-section>
      </bim-panel>
    `
  })

  const totalVolumeCard = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
      <bim-panel style="min-width: 150px;">
        <bim-panel-section label="Total Volume" fixed>
          <bim-label id="total-volume-value" style="font-size: 1.5rem; font-weight: bold; color: var(--bim-ui_accent-base);">0 m³</bim-label>
        </bim-panel-section>
      </bim-panel>
    `
  })

  const totalLengthCard = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
      <bim-panel style="min-width: 150px;">
        <bim-panel-section label="Total Length" fixed>
          <bim-label id="total-length-value" style="font-size: 1.5rem; font-weight: bold; color: var(--bim-ui_accent-base);">0 m</bim-label>
        </bim-panel-section>
      </bim-panel>
    `
  })

  const countCard = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
      <bim-panel style="min-width: 150px;">
        <bim-panel-section label="Element Count" fixed>
          <bim-label id="element-count-value" style="font-size: 1.5rem; font-weight: bold; color: var(--bim-ui_accent-base);">0</bim-label>
        </bim-panel-section>
      </bim-panel>
    `
  })

  // Export button
  const exportButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button 
        icon="material-symbols:download"
        label="Export QTO"
        @click=${() => simpleQTO.exportToJSON()}
      ></bim-button>
    `
  })

  // Clear button
  const clearButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button 
        icon="material-symbols:clear"
        label="Clear Results"
        @click=${() => {
          simpleQTO.resetQuantities()
          updateQTODisplay({})
        }}
      ></bim-button>
    `
  })

  const updateQTODisplay = (qtoResult: QtoResult) => {
    // Update table data
    const tableData: any[] = []
    let totalArea = 0
    let totalVolume = 0
    let totalLength = 0
    let elementCount = 0

    for (const setName in qtoResult) {
      for (const qtoName in qtoResult[setName]) {
        const value = qtoResult[setName][qtoName]
        const unit = getUnit(qtoName)
        
        tableData.push({
          data: {
            "Quantity Set": setName,
            "Quantity Name": qtoName,
            "Value": value.toFixed(2),
            "Unit": unit
          }
        })

        // Accumulate totals based on quantity type
        if (qtoName.toLowerCase().includes('area')) {
          totalArea += value
        } else if (qtoName.toLowerCase().includes('volume')) {
          totalVolume += value
        } else if (qtoName.toLowerCase().includes('length') || qtoName.toLowerCase().includes('perimeter')) {
          totalLength += value
        } else if (qtoName.toLowerCase().includes('count')) {
          elementCount += value
        }
      }
    }

    qtoTable.data = tableData

    // Update summary cards
    const totalAreaElement = document.getElementById('total-area-value')
    const totalVolumeElement = document.getElementById('total-volume-value')
    const totalLengthElement = document.getElementById('total-length-value')
    const elementCountElement = document.getElementById('element-count-value')

    if (totalAreaElement) totalAreaElement.textContent = `${totalArea.toFixed(2)} m²`
    if (totalVolumeElement) totalVolumeElement.textContent = `${totalVolume.toFixed(2)} m³`
    if (totalLengthElement) totalLengthElement.textContent = `${totalLength.toFixed(2)} m`
    if (elementCountElement) elementCountElement.textContent = elementCount.toString()
  }

  const getUnit = (qtoName: string): string => {
    const name = qtoName.toLowerCase()
    if (name.includes('area')) return 'm²'
    if (name.includes('volume')) return 'm³'
    if (name.includes('length') || name.includes('perimeter') || name.includes('width') || name.includes('height')) return 'm'
    if (name.includes('count')) return 'pcs'
    return 'units'
  }

  // Main QTO panel
  const qtoPanel = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
      <bim-panel>
        <bim-panel-section label="Quantity Take-Off Results" fixed>
          <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
            ${totalAreaCard}
            ${totalVolumeCard}
            ${totalLengthCard}
            ${countCard}
          </div>
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            ${clearButton}
            ${exportButton}
          </div>
          ${qtoTable}
        </bim-panel-section>
      </bim-panel>
    `
  })

  return {
    panel: qtoPanel,
    updateDisplay: updateQTODisplay
  }
}
