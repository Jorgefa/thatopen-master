import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
import * as OBCF from "@thatopen/components-front"
import { FragmentIdMap, FragmentsGroup } from "@thatopen/fragments"

type QtoResult = {[setName: string]: {[qtoName: string]: number}}

// const sum = {
//   Qto_WallBaseQuantities: {
//     volume: 20,
//     area: 30
//   }
// }

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "3b5e8cea-9983-4bf6-b120-51152985b22d"
  enabled = true
  onDisposed: OBC.Event<any>
  private _qtoResult: QtoResult = {}

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(SimpleQTO.uuid, this)
  }

  async setup() {
    const highlighter = this.components.get(OBCF.Highlighter)
    highlighter.events.select.onHighlight.add((fragmentIdMap) => {
      this.sumQuantities(fragmentIdMap)
    })
    highlighter.events.select.onClear.add((fragmentIdMap) => {
      this.resetQuantities()
    })
  }

  resetQuantities() {
    this._qtoResult = {}
  }

  async sumQuantities(fragmentIdMap: FragmentIdMap) {
    console.time("QTO")
    const fragmentManager = this.components.get(OBC.FragmentsManager)
    for (const fragmentID in fragmentIdMap) {
      const fragment = fragmentManager.list.get(fragmentID)
      const model = fragment?.mesh.parent
      if (!(model instanceof FragmentsGroup && model.hasProperties)) { continue }
      await OBC.IfcPropertiesUtils.getRelationMap(
        model,
        WEBIFC.IFCRELDEFINESBYPROPERTIES,
        async (setID, relatedIDs) => {
          console.log(setID, relatedIDs)
          const set = await model.getProperties(setID)
          const expressIDs = fragmentIdMap[fragmentID]
          const workingIDs = relatedIDs.filter(id => expressIDs.has(id))
          const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, setID)
          if (set?.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) { return }
          if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
          OBC.IfcPropertiesUtils.getQsetQuantities(
            model,
            setID,
            async (qtoID) => {
              const { name: qtoName } = await OBC.IfcPropertiesUtils.getEntityName(model, qtoID)
              if (!qtoName) { return }
              if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
            }
          )
        }
      )
    }

    console.log(this._qtoResult)
    console.timeEnd("QTO")
  }

  async sumQuantitiesV2(fragmentIdMap: FragmentIdMap) {
    console.time("QTO 2")
    const fragmentManager = this.components.get(OBC.FragmentsManager)
    const indexer = this.components.get(OBC.IfcRelationsIndexer)
    for (const fragmentID in fragmentIdMap) {
      const fragment = fragmentManager.list.get(fragmentID)
      const model = fragment?.mesh.parent
      if (!(model instanceof FragmentsGroup && model.hasProperties)) { continue }
      const expressIDs = fragmentIdMap[fragmentID]
      console.log(expressIDs)
      for (const id of expressIDs) {
        const psets = indexer.getEntityRelations(model, id, "IsDefinedBy")
        if (psets) {
          for (const expressId of psets) {
            const prop = await model.getProperties(expressId)
            // console.log(prop)
            const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, expressId)
            if(prop && prop.type === WEBIFC.IFCELEMENTQUANTITY && setName) {
              if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
              console.log(prop)
              // const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, expressId)
              const data = await OBC.IfcPropertiesUtils.getQsetQuantities(
                model,
                expressId,
                async (qtoId) => {
                  const prop1 = await model.getProperties(qtoId)
                  // console.log(prop1)
                  const { name: qtoName } = await OBC.IfcPropertiesUtils.getEntityName(model, qtoId)
                  const { value } = await OBC.IfcPropertiesUtils.getQuantityValue(model, qtoId)
                  if (!qtoName || !value) { return }
                  if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
                  // const { value } = await OBC.IfcPropertiesUtils.getQuantityValue(model, qtoId)
                  this._qtoResult[setName][qtoName] += value
                }
              )
            }
          }
        }
      }
    }

    console.log(this._qtoResult)
    console.timeEnd("QTO 2")
  }

  async dispose() {
    this.resetQuantities()
  }
}