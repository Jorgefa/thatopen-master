import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
import * as OBCF from "@thatopen/components-front"
import * as FRAGS from "@thatopen/fragments"

export class SimpleQTO extends OBC.Component implements OBC.Disposable {
  static uuid = "3b5e8cea-9983-4bf6-b120-51152985b22d"
  enabled = true
  onDisposed: OBC.Event<any>

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
      // console.log(fragment)
      const model = fragment?.mesh.parent
      if (!(model instanceof FRAGS.FragmentsGroup && model.hasProperties)) { continue }
      console.log(model.getLocalProperties())
    }
  }

  async dispose() {}
}