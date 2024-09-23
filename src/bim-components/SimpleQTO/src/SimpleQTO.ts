import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
import * as OBCF from "@thatopen/components-front"
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

  setup() {
    const highlighter = this.components.get(OBCF.Highlighter)
    highlighter.events.select.onHighlight.add(async (fragmentIdMap) => {
      await this.sumQuantities(fragmentIdMap)
    })
  }

  async sumQuantities(fragmentIdMap: FRAGS.FragmentIdMap) {
    const fragmentManager = this.components.get(OBC.FragmentsManager)
    for (const fragmentID in fragmentIdMap) {
      const fragment = fragmentManager.list.get(fragmentID)
      const model = fragment?.mesh.parent
      if (!(model instanceof FRAGS.FragmentsGroup && model.hasProperties)) { continue }
      await OBC.IfcPropertiesUtils.getRelationMap(
        model,
        WEBIFC.IFCRELDEFINESBYPROPERTIES,
        async (setID, relatedIDs) => {
          const set = await model.getProperties(setID)
          const expressIDs = fragmentIdMap[fragmentID]
          const workingIDs = relatedIDs.filter(id => expressIDs.has(id))
          const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, setID)
          if (set?.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) {return}
          // const expressIDs = fragmentIdMap[fragmentID]
          // const workingIDs = relatedIDs.filter(id => expressIDs.has(id))
          // if (workingIDs.length === 0) {return}
          // const { name: setName } = await OBC.IfcPropertiesUtils.getEntityName(model, setID)
          if (!(setName in this._qtoResult)) { this._qtoResult[setName] = {} }
          await OBC.IfcPropertiesUtils.getQsetQuantities(
            model,
            setID,
            async (qtoID) => {
              // console.log(await model.getProperties(qtoID))
              const { name: qtoName } = await OBC.IfcPropertiesUtils.getEntityName(model, qtoID)
              if (!qtoName) { return }
              if (!(qtoName in this._qtoResult[setName])) { this._qtoResult[setName][qtoName] = 0 }
            }
          )
        }
      )
    }

    console.log(this._qtoResult)
  }

  async dispose() {}
}