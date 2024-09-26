import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
import * as FRAGS from "@thatopen/fragments"

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

  resetQuantities() {
    this._qtoResult = {}
  }

  async sumQuantities(fragmentIdMap: FRAGS.FragmentIdMap) {
    console.time("QTO")
    const fragmentManager = this.components.get(OBC.FragmentsManager)
    const modelIdMap = fragmentManager.getModelIdMap(fragmentIdMap)
    for (const modelId in modelIdMap) {
      const model = fragmentManager.groups.get(modelId)
      if (!model) continue
      if (!model.hasProperties) { return }
      await OBC.IfcPropertiesUtils.getRelationMap(
        model,
        WEBIFC.IFCRELDEFINESBYPROPERTIES,
        async (setID, relatedIDs) => {
          const expressIDs = modelIdMap[modelId]
          const workingIDs = relatedIDs.filter(id => expressIDs.has(id))
          const set = await model.getProperties(setID)
          const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, setID)
          if (set?.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) { return }
          if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
          await OBC.IfcPropertiesUtils.getQsetQuantities(
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

  async dispose() {}
}