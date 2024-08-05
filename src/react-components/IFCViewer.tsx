import * as React from "react";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import { FragmentsGroup } from "@thatopen/fragments";

export function IFCViewer() {
  let fragmentModel: FragmentsGroup | undefined
  let components: OBC.Components

  const [classes, setClasses] = React.useState<any>([])

  const setViewer = () => {
    components = new OBC.Components()
  
    const worlds = components.get(OBC.Worlds)

    const world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBCF.PostproductionRenderer
    >()

    const sceneComponent = new OBC.SimpleScene(components)
    world.scene = sceneComponent
    world.scene.setup()

    const viewerContainer = document.getElementById("viewer-container") as HTMLElement
    const rendererComponent = new OBCF.PostproductionRenderer(components, viewerContainer)
    world.renderer = rendererComponent

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
    world.camera = cameraComponent
    
    components.init()

    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0)
    world.camera.updateAspect()

    const ifcLoader = components.get(OBC.IfcLoader)
    ifcLoader.setup()

    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.onFragmentsLoaded.add(async (model) => {
      
      world.scene.three.add(model)

      const indexer = components.get(OBC.IfcRelationsIndexer)
      await indexer.process(model)

      const classifier = components.get(OBC.Classifier)
      classifier.byEntity(model)
      classifier.byIfcRel(model, WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE, "storeys")
      classifier.byModel(model.uuid, model)

      fragmentModel = model

      const cc = [1, 0, 0]
      setClasses(cc)
    })

    const highlighter = components.get(OBCF.Highlighter);
    highlighter.setup({ world })
    highlighter.zoomToSelection = true;

    viewerContainer.addEventListener("resize", () => {
      rendererComponent.resize()
      cameraComponent.updateAspect()
    })
  }

  const onToggleVisibility = () => {
    const highlighter = components.get(OBCF.Highlighter)
    const fragments = components.get(OBC.FragmentsManager)

    const selection = highlighter.selection.select
    if (Object.keys(selection).length === 0) return;
    for (const fragmentID in selection) {  
      const fragment = fragments.list.get(fragmentID)
      const expressIDs = selection[fragmentID]
      for (const id of expressIDs) {
        if (!fragment) continue
        const isHidden = fragment.hiddenItems.has(id)
        if (isHidden) {
          fragment.setVisibility(true, [id])
        } else {
          fragment.setVisibility(false, [id])
        }
      }
    }
  }

  const onIsolate = () => {
    const highlighter = components.get(OBCF.Highlighter)
    const hider = components.get(OBC.Hider)
    const selection = highlighter.selection.select
    hider.isolate(selection)
  };

  const onShowAll = () => {
    const hider = components.get(OBC.Hider)
    hider.set(true)
  }

  const onShowProperties = async () => {
    if (!fragmentModel) return

    const indexer = components.get(OBC.IfcRelationsIndexer)
    const highlighter = components.get(OBCF.Highlighter)
    const selection = highlighter.selection.select
    for (const fragmentID in selection) {
      const expressIDs = selection[fragmentID]
      for (const id of expressIDs) {
        const psets = indexer.getEntityRelations(fragmentModel, id, "IsDefinedBy")

        if (psets) {
          for (const expressId of psets) {
            const prop = await fragmentModel.getProperties(expressId)
            console.log(prop)
          }
        }
      }
    }
  }

  const onClassifier = () => {
    const floatingGrid = document.querySelector("bim-grid") as BUI.Grid
    if (!floatingGrid) return
    if (floatingGrid.layout !== "classifier") {
      floatingGrid.layout = "classifier"
    } else {
      floatingGrid.layout = "main"
    }
  }

  const setUI = () => {
    const viewerContainer = document.getElementById("viewer-container") as HTMLElement
    if (!viewerContainer) return

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html`
        <bim-grid floating style="padding: 20px;"></bim-grid>
      `
    })

    const elementPropertyPanel = BUI.Component.create<BUI.Panel>(() => {
      const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
        components,
        fragmentIdMap: {},
      });

      const highlighter = components.get(OBCF.Highlighter)
      highlighter.events.select.onHighlight.add((fragmentIdMap) => {
        if (!floatingGrid) return
        floatingGrid.layout = "second"
        updatePropsTable({ fragmentIdMap })
        propsTable.expanded = false
      })

      highlighter.events.select.onClear.add(() => {
        updatePropsTable({ fragmentIdMap: {} })
        if (!floatingGrid) return
        floatingGrid.layout = "main"
      })

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        propsTable.queryString = input.value
      }

      return BUI.html`
        <bim-panel>
          <bim-panel-section name="property" label="Property Information" icon="solar:document-bold" fixed>
            <bim-text-input @input=${search} placeholder="Search..."></bim-text-input>
            ${propsTable}
          </bim-panel-section>
        </bim-panel>  
      `;
    })

    const classifierPanel = BUI.Component.create<BUI.Panel>(() => {
      return BUI.html`
        <bim-panel>
          <bim-panel-section 
            name="classifier" 
            label="Classifier" 
            icon="solar:document-bold" 
            fixed
          >
            <span>Classes: ${classes}</span>
          </bim-panel-section>
        </bim-panel>
      `;
    })

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components });
      return BUI.html`
        <bim-toolbar style="justify-self: center;">
          <bim-toolbar-section label="Import">
            ${loadIfcBtn}
          </bim-toolbar-section>
          <bim-toolbar-section label="Selection">
            <bim-button 
              label="Visibility" 
              icon="tabler:square-toggle" 
              @click=${onToggleVisibility}
            ></bim-button>
            <bim-button
              label="Isolate"
              icon="prime:filter-fill"
              @click=${onIsolate}
            ></bim-button>
            <bim-button
              label="Show All"
              icon="tabler:eye-filled"
              @click=${onShowAll}
            ></bim-button>
            <bim-button
              label="Classifier"
              icon="tabler:eye-filled"
              @click=${onClassifier}
            ></bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="Property">
            <bim-button
              label="Show"
              icon="material-symbols:list"
              @click=${onShowProperties}
            ></bim-button>
          </bim-toolbar-section>
        </bim-toolbar>
      `
    })

    floatingGrid.layouts = {
      main: {
        template: `
          "empty" 1fr
          "toolbar" auto
          /1fr
        `,
        elements: { toolbar },
      },
      second: {
        template: `
          "empty elementPropertyPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
        `,
        elements: { 
          toolbar,
          elementPropertyPanel
        },
      },
      classifier: {
        template: `
          "empty classifierPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
        `,
        elements: { 
          toolbar,
          classifierPanel
        },
      },
    }
    floatingGrid.layout = "main"

    viewerContainer.appendChild(floatingGrid)
  }

  React.useEffect(() => {
    setViewer()
    setUI()

    return () => {
      if (components) {
        components.dispose()
      }
      const viewerContainer = document.getElementById("viewer-container")
      if (viewerContainer) {
        viewerContainer.innerHTML = ""
      }
      if (fragmentModel) {
        fragmentModel.dispose()
        fragmentModel = undefined
      }
    }
  }, [])

  return (
    <bim-viewport
      id="viewer-container"
    />
  )
}