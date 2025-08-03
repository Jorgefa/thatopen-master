import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
import * as FRAGS from "@thatopen/fragments"

type QtoResult = {[setName: string]: {[qtoName: string]: number}}

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "3b5e8cea-9983-4bf6-b120-51152985b22d"
  enabled = true
  onDisposed: OBC.Event<any>
  onQuantitiesUpdated = new OBC.Event<QtoResult>()
  private _qtoResult: QtoResult = {}

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(SimpleQTO.uuid, this)
  }

  resetQuantities() {
    this._qtoResult = {}
    // Clear the console log for better debugging
    console.clear()
    console.log("QTO Results Reset")
    this.onQuantitiesUpdated.trigger(this._qtoResult)
  }

  get currentResults(): QtoResult {
    return this._qtoResult
  }

  exportToJSON(fileName: string = "quantities") {
    const json = JSON.stringify(this._qtoResult, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async sumQuantities(fragmentIdMap: FRAGS.FragmentIdMap) {
    console.time("QTO V1")
    console.log("Starting QTO V1 calculation with fragmentIdMap:", fragmentIdMap)
    
    const fragmentManager = this.components.get(OBC.FragmentsManager)
    const modelIdMap = fragmentManager.getModelIdMap(fragmentIdMap)
    
    for (const modelId in modelIdMap) {
      const model = fragmentManager.groups.get(modelId)
      if (!model) continue
      if (!model.hasProperties) { 
        console.log("Model has no properties, skipping...")
        return 
      }
      
      await OBC.IfcPropertiesUtils.getRelationMap(
        model,
        WEBIFC.IFCRELDEFINESBYPROPERTIES,
        async (setID, relatedIDs) => {
          const expressIDs = modelIdMap[modelId]
          const workingIDs = relatedIDs.filter(id => expressIDs.has(id))
          const set = await model.getProperties(setID)
          const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, setID)
          if (set?.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) { return }
          
          console.log(`V1: Processing quantity set: ${setName} with ${workingIDs.length} elements`)
          
          if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
          
          // Add element count for this quantity set
          const elementCountKey = "Element Count"
          if (!(elementCountKey in this._qtoResult[setName])) { 
            this._qtoResult[setName][elementCountKey] = 0 
          }
          this._qtoResult[setName][elementCountKey] += workingIDs.length
          
          await OBC.IfcPropertiesUtils.getQsetQuantities(
            model,
            setID,
            async (qtoID) => {
              const { name: qtoName } = await OBC.IfcPropertiesUtils.getEntityName(model, qtoID)
              const { value } = await OBC.IfcPropertiesUtils.getQuantityValue(model, qtoID)
              if (!qtoName || !value) { return }
              if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
              // Multiply quantity value by the number of working elements that have this quantity
              this._qtoResult[setName][qtoName] += value * workingIDs.length
              console.log(`V1: Added ${value * workingIDs.length} (${value} * ${workingIDs.length}) to ${qtoName} in ${setName}`)
            }
          )
        }
      )
    }
    console.log("V1 Final QTO Results:", this._qtoResult)
    console.timeEnd("QTO V1")
    this.onQuantitiesUpdated.trigger(this._qtoResult)
  }

  async sumQuantitiesV2(fragmentIdMap: FRAGS.FragmentIdMap) {
    console.time("QTO V2")
    console.log("Starting QTO calculation with fragmentIdMap:", fragmentIdMap)
    
    const fragmentManager = this.components.get(OBC.FragmentsManager)
    const modelIdMap = fragmentManager.getModelIdMap(fragmentIdMap)
    
    console.log("ModelIdMap:", modelIdMap)
    
    // Track which elements have been processed for each quantity set to avoid double counting
    const processedElementsPerSet = new Map<string, Set<number>>()
    
    for (const modelId in modelIdMap) {
      const model = fragmentManager.groups.get(modelId)
      if (!model) continue
      if (!model.hasProperties) { 
        console.log("Model has no properties, skipping...")
        return 
      }
      
      const indexer = this.components.get(OBC.IfcRelationsIndexer)
      const expressIDs = modelIdMap[modelId]
      
      console.log(`Processing ${expressIDs.size} elements in model ${modelId}`)
      
      for (const id of expressIDs) {
        // Get element information to understand what type of element we're processing
        try {
          const element = await model.getProperties(id)
          console.log(`Processing element ${id}: ${element?.type || 'Unknown type'}`)
        } catch (e) {
          console.log(`Could not get element properties for ${id}`)
        }
        
        const sets = indexer.getEntityRelations(model, id, "IsDefinedBy")
        if (!sets) {
          console.log(`Element ${id} has no quantity sets`)
          continue
        }
        
        console.log(`Element ${id} has ${sets.length} quantity sets`)
        
        for (const expressID of sets) {
          const set = await model.getProperties(expressID)
          const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, expressID)
          
          console.log(`Checking set ${expressID}: type=${set?.type}, name=${setName}`)
          
          if (set?.type !== WEBIFC.IFCELEMENTQUANTITY || !setName) {
            console.log(`Skipping set ${expressID}: not a quantity set or no name`)
            continue
          }
          
          console.log(`Processing quantity set: ${setName} for element ${id}`)
          
          // Initialize tracking for this set
          if (!processedElementsPerSet.has(setName)) {
            processedElementsPerSet.set(setName, new Set())
          }
          
          // Skip if this element was already processed for this set
          if (processedElementsPerSet.get(setName)!.has(id)) {
            console.log(`Element ${id} already processed for set ${setName}, skipping...`)
            continue
          }
          
          // Mark this element as processed for this set
          processedElementsPerSet.get(setName)!.add(id)
          
          if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
          
          // Add element count for this quantity set
          const elementCountKey = "Element Count"
          if (!(elementCountKey in this._qtoResult[setName])) { 
            this._qtoResult[setName][elementCountKey] = 0 
          }
          this._qtoResult[setName][elementCountKey] += 1
          
          await OBC.IfcPropertiesUtils.getQsetQuantities(
            model,
            expressID,
            async (qtoID) => {
              const { name: qtoName } = await OBC.IfcPropertiesUtils.getEntityName(model, qtoID)
              const { value } = await OBC.IfcPropertiesUtils.getQuantityValue(model, qtoID)
              if (!qtoName || !value) { 
                console.log(`Skipping quantity ${qtoID}: no name or value`)
                return 
              }
              if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
              // Add the quantity value for this single element
              this._qtoResult[setName][qtoName] += value
              console.log(`Added ${value} to ${qtoName} in ${setName} (element ${id})`)
            }
          )
        }
      }
    }
    console.log("Final QTO Results:", this._qtoResult)
    console.timeEnd("QTO V2")
    this.onQuantitiesUpdated.trigger(this._qtoResult)
  }

  async dispose() {
    this.enabled = false
    this.resetQuantities()
  }
}