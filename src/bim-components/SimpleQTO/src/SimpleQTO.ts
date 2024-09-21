import * as OBC from "@thatopen/components"
import { FragmentIdMap } from "@thatopen/fragments"

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "3b5e8cea-9983-4bf6-b120-51152985b22d"
  enabled = true
  onDisposed: OBC.Event<any>

  constructor(components: OBC.Components) {
    super(components)
    this.components.add(SimpleQTO.uuid, this)
  }

  sumQuantities(fragmentIdMap: FragmentIdMap) {
    const fragmentManager = this.components.get(OBC.FragmentsManager)
    for (const fragmentID in fragmentIdMap) {
      const fragment = fragmentManager.list.get(fragmentID)
      console.log(fragment)
    }
  }

  async dispose() {}
}