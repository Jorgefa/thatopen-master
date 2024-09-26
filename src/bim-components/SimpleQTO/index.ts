import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
import * as FRAGS from "@thatopen/fragments"

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "3b5e8cea-9983-4bf6-b120-51152985b22d"
  enabled = true
  onDisposed: OBC.Event<any>

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(SimpleQTO.uuid, this)
  }

  async sumQuantities(fragmentIdMap: FRAGS.FragmentIdMap) {
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
          // console.log(setID)
          // console.log(await model.getProperties(setID))
          const set = await model.getProperties(setID)
          if (set?.type !== WEBIFC.IFCELEMENTQUANTITY) { return }
          console.log(set)
        }
      )
    }
  }

  async dispose() {}
}