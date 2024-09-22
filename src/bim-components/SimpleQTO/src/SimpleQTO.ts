import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
import { FragmentIdMap, FragmentsGroup } from "@thatopen/fragments"

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "3b5e8cea-9983-4bf6-b120-51152985b22d"
  enabled = true
  onDisposed: OBC.Event<any>

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(SimpleQTO.uuid, this)
  }

  setup() {

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
            if(!prop) return
            if(prop.type === WEBIFC.IFCELEMENTQUANTITY) {
              console.log(prop)
            }
          }
        }
      }
    }
  }

  async dispose() {}
}