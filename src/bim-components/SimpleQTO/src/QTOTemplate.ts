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
    console.log("Updating QTO Display with:", qtoResult)
    
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
        
        console.log(`Processing: ${qtoName} = ${value} ${unit}`)
        
        tableData.push({
          data: {
            "Quantity Set": setName,
            "Quantity Name": qtoName,
            "Value": value.toFixed(2),
            "Unit": unit
          }
        })

        // Accumulate totals based on quantity type - improved matching for different IFC elements
        const lowerQtoName = qtoName.toLowerCase()
        const lowerSetName = setName.toLowerCase()
        
        console.log(`Analyzing: Set="${setName}", Quantity="${qtoName}"`)
        
        // Area calculations - handle different IFC area types
        if (lowerQtoName.includes('area') || 
            lowerQtoName.includes('grossarea') || 
            lowerQtoName.includes('netarea') ||
            lowerQtoName.includes('crosssectionarea') ||
            lowerQtoName.includes('grosssidearea') ||
            lowerQtoName.includes('netsidearea') ||
            lowerQtoName.includes('grossfootprintarea') ||
            lowerQtoName.includes('netfootprintarea') ||
            lowerQtoName.includes('grosssurfacearea') ||
            lowerQtoName.includes('netsurfacearea') ||
            lowerQtoName.includes('outersurfacearea')) {
          totalArea += value
          console.log(`Added ${value} to totalArea (${qtoName}), now: ${totalArea}`)
        } 
        // Volume calculations - handle different IFC volume types
        else if (lowerQtoName.includes('volume') || 
                 lowerQtoName.includes('grossvolume') || 
                 lowerQtoName.includes('netvolume')) {
          totalVolume += value
          console.log(`Added ${value} to totalVolume (${qtoName}), now: ${totalVolume}`)
        } 
        // Length calculations - handle different IFC length types
        else if (lowerQtoName.includes('length') || 
                 lowerQtoName.includes('perimeter') || 
                 lowerQtoName.includes('width') || 
                 lowerQtoName.includes('height') ||
                 lowerQtoName.includes('thickness')) {
          totalLength += value
          console.log(`Added ${value} to totalLength (${qtoName}), now: ${totalLength}`)
        } 
        // Count calculations
        else if (lowerQtoName.includes('count') || qtoName === 'Element Count') {
          elementCount += value
          console.log(`Added ${value} to elementCount (${qtoName}), now: ${elementCount}`)
        }
        // Log unmatched quantities for debugging
        else {
          console.log(`Quantity "${qtoName}" in set "${setName}" did not match any category`)
        }
      }
    }

    console.log(`Final totals - Area: ${totalArea}, Volume: ${totalVolume}, Length: ${totalLength}, Count: ${elementCount}`)

    qtoTable.data = tableData

    // Update summary cards with retry mechanism
    const updateUIElements = () => {
      const totalAreaElement = document.getElementById('total-area-value')
      const totalVolumeElement = document.getElementById('total-volume-value')
      const totalLengthElement = document.getElementById('total-length-value')
      const elementCountElement = document.getElementById('element-count-value')

      console.log('Updating UI elements...')
      if (totalAreaElement) {
        totalAreaElement.textContent = `${totalArea.toFixed(2)} m²`
        console.log(`Updated area element to: ${totalArea.toFixed(2)} m²`)
      } else {
        console.warn('total-area-value element not found')
      }
      
      if (totalVolumeElement) {
        totalVolumeElement.textContent = `${totalVolume.toFixed(2)} m³`
        console.log(`Updated volume element to: ${totalVolume.toFixed(2)} m³`)
      } else {
        console.warn('total-volume-value element not found')
      }
      
      if (totalLengthElement) {
        totalLengthElement.textContent = `${totalLength.toFixed(2)} m`
        console.log(`Updated length element to: ${totalLength.toFixed(2)} m`)
      } else {
        console.warn('total-length-value element not found')
      }
      
      if (elementCountElement) {
        elementCountElement.textContent = elementCount.toString()
        console.log(`Updated count element to: ${elementCount}`)
      } else {
        console.warn('element-count-value element not found')
      }
    }

    // Try immediately and with a small delay to ensure DOM is ready
    updateUIElements()
    setTimeout(updateUIElements, 100)
  }

  const getUnit = (qtoName: string): string => {
    const name = qtoName.toLowerCase()
    
    // Area units - handle all IFC area types
    if (name.includes('area') || 
        name.includes('grossarea') || 
        name.includes('netarea') ||
        name.includes('crosssectionarea') ||
        name.includes('grosssidearea') ||
        name.includes('netsidearea') ||
        name.includes('grossfootprintarea') ||
        name.includes('netfootprintarea') ||
        name.includes('grosssurfacearea') ||
        name.includes('netsurfacearea') ||
        name.includes('outersurfacearea')) {
      return 'm²'
    }
    
    // Volume units - handle all IFC volume types
    if (name.includes('volume') || 
        name.includes('grossvolume') || 
        name.includes('netvolume')) {
      return 'm³'
    }
    
    // Length units - handle all IFC length types
    if (name.includes('length') || 
        name.includes('perimeter') || 
        name.includes('width') || 
        name.includes('height') ||
        name.includes('thickness')) {
      return 'm'
    }
    
    // Count units
    if (name.includes('count') || qtoName === 'Element Count') {
      return 'pcs'
    }
    
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
