import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
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

  async sumQuantities(fragmentIdMap: FragmentIdMap) {
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
                  if (!qtoName) { return }
                  if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
                }
              )
            }
          }
        }
      }
    }

    console.log(this._qtoResult)
  }

  async dispose() {}
}