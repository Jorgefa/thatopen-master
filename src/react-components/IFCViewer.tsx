import * as React from "react";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import { FragmentsGroup } from "@thatopen/fragments";

export function IFCViewer() {
  let fragmentModel: FragmentsGroup | undefined
  const components: OBC.Components = new OBC.Components()

  const [classificationsTree, updateClassificationsTree] = CUI.tables.classificationTree(
  {
    components,
    classifications: [],
  });

  const setViewer = () => {
  
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

    world.renderer.postproduction.enabled = true

    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0)
    world.camera.updateAspect()

    world.renderer.postproduction.enabled = true

    const ifcLoader = components.get(OBC.IfcLoader)
    ifcLoader.setup()

    const cullers = components.get(OBC.Cullers)
    const culler = cullers.create(world)

    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.onFragmentsLoaded.add(async (model) => {
      world.scene.three.add(model)

      if (model.hasProperties) {
        await processModel(model)
      }

      for (const fragment of model.items) {
        culler.add(fragment.mesh)
      }
      culler.needsUpdate = true

      fragmentModel = model
    })

    const highlighter = components.get(OBCF.Highlighter);
    highlighter.setup({ world })
    highlighter.zoomToSelection = true;

    viewerContainer.addEventListener("resize", () => {
      rendererComponent.resize()
      cameraComponent.updateAspect()
    })

    world.camera.controls.addEventListener("controlend", () => {
      culler.needsUpdate = true
    })
  }

  const processModel = async (model: FragmentsGroup) => {
    const indexer = components.get(OBC.IfcRelationsIndexer)
    await indexer.process(model)

    const classifier = components.get(OBC.Classifier)
    await classifier.bySpatialStructure(model)
    classifier.byEntity(model)
    
    console.log(classifier.list)

    const classifications = [
      { system: "entities", label: "Entities" },
      { system: "spatialStructures", label: "Spatial Containers" }
    ]
    if (updateClassificationsTree) {
      updateClassificationsTree({classifications})
    }
  }

  const onPopertyExport = async () => {
    if (!fragmentModel) return
    const exported = fragmentModel.getLocalProperties()
    const serialized = JSON.stringify(exported);
    const file = new File([new Blob([serialized])], "properties.json");
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.download = "properties.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
  }

  const onPropertyImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", async () => {
      const json = reader.result
      if (!json) { return }
      const properties = JSON.parse(json as string)
      if (!fragmentModel) return
      fragmentModel.setLocalProperties(properties)
      await processModel(fragmentModel)
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0])
    })
    input.click()
  }

  const onFragmentExport = () => {
    const fragmentsManager = components.get(OBC.FragmentsManager)
    
    if (!fragmentModel) return
    const fragmentsBinary = fragmentsManager.export(fragmentModel)
    const blob = new Blob([fragmentsBinary])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fragmentModel.name}.frag`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onFragmentImport = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.frag'
    const reader = new FileReader()
    reader.addEventListener("load", async () => {
      const binary = reader.result
      if (!(binary instanceof ArrayBuffer)) { return }
      const fragmentsBinary = new Uint8Array(binary)
      const fragmentsManager = components.get(OBC.FragmentsManager)
      fragmentsManager.load(fragmentsBinary)
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsArrayBuffer(filesList[0])
    })
    input.click()
  }

  const onFragmentDispose = () => {
    const fragmentsManager = components.get(OBC.FragmentsManager)
    if (!fragmentModel) return
    fragmentsManager.disposeGroup(fragmentModel)
    fragmentModel = undefined

    const highlighter = components.get(OBC.IfcRelationsIndexer)
    console.log(highlighter)
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
            ${classificationsTree}
          </bim-panel-section>
        </bim-panel>
      `;
    })
    
    const onWorldsUpdate = () => {
      if (!floatingGrid) return
      floatingGrid.layout = "world"
    }

    const worldPanel = BUI.Component.create<BUI.Panel>(() => {
      const [worldsTable] = CUI.tables.worldsConfiguration({ components });

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        worldsTable.queryString = input.value
      }

      return BUI.html`
        <bim-panel>
          <bim-panel-section name="world" label="World Information" icon="tabler:brush" fixed>
            <bim-text-input @input=${search} placeholder="Search..."></bim-text-input>
            ${worldsTable}
          </bim-panel-section>
        </bim-panel>  
      `
    })

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components });
      loadIfcBtn.tooltipTitle = "Load IFC"
      loadIfcBtn.label = ""

      return BUI.html`
        <bim-toolbar style="justify-self: center;">
          <bim-toolbar-section label="App">
            <bim-button 
              tooltip-title="World" 
              icon="tabler:brush" 
              @click=${onWorldsUpdate}
            ></bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="Import">
            ${loadIfcBtn}
          </bim-toolbar-section>
          <bim-toolbar-section label="Fragments">
            <bim-button 
              tooltip-title="Import"
              icon="mdi:cube-scan" 
              @click=${onFragmentImport}
            ></bim-button>
            <bim-button 
              tooltip-title="Export"
              icon="tabler:package-export"
              @click=${onFragmentExport}
            ></bim-button>
            <bim-button
              tooltip-title="Dispose"
              icon="tabler:trash"
              @click=${onFragmentDispose}
            ></bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="Selection">
            <bim-button 
              tooltip-title="Visibility" 
              icon="tabler:square-toggle" 
              @click=${onToggleVisibility}
            ></bim-button>
            <bim-button
              tooltip-title="Isolate"
              icon="prime:filter-fill"
              @click=${onIsolate}
            ></bim-button>
            <bim-button
              tooltip-title="Show All"
              icon="tabler:eye-filled"
              @click=${onShowAll}
            ></bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="Property">
            <bim-button
              tooltip-title="Show"
              icon="material-symbols:list"
              @click=${onShowProperties}
            ></bim-button>
            <bim-button
              tooltip-title="Import"
              icon="clarity:import-line"
              @click=${onPropertyImport}
            ></bim-button>
            <bim-button
              tooltip-title="Export"
              icon="clarity:export-line"
              @click=${onPopertyExport}
            ></bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="Groups">
            <bim-button
              tooltip-title="Classifier"
              icon="tabler:eye-filled"
              @click=${onClassifier}
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
      world: {
        template: `
          "empty worldPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
        `,
        elements: { 
          toolbar,
          worldPanel 
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
      }
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