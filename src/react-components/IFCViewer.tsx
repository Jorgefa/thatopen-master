import * as React from "react";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";

export function IFCViewer() {
  let components: OBC.Components

  const setViewer = () => {
    components = new OBC.Components()
  
    const worlds = components.get(OBC.Worlds)

    const world = worlds.create<
      OBC.SimpleScene,
      OBC.SimpleCamera,
      OBC.SimpleRenderer
    >()

    const sceneComponent = new OBC.SimpleScene(components)
    world.scene = sceneComponent
    world.scene.setup()

    const viewerContainer = document.getElementById("viewer-container") as HTMLElement
    const rendererComponent = new OBC.SimpleRenderer(components, viewerContainer)
    world.renderer = rendererComponent

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
    world.camera = cameraComponent
    
    components.init()

    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0)
    world.camera.updateAspect()

    const ifcLoader = new OBC.IfcLoader(components)
    ifcLoader.setup()

    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.onFragmentsLoaded.add((model) => {
      world.scene.three.add(model)
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

  const setUI = () => {
    const viewerContainer = document.getElementById("viewer-container") as HTMLElement
    if (!viewerContainer) return

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html`
        <bim-grid floating style="padding: 20px;"></bim-grid>
      `
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
    }
    floatingGrid.layout = "main"

    viewerContainer.appendChild(floatingGrid)
  }

  React.useEffect(() => {
    setViewer()
    setUI()

    return () => {
      // if (viewer) {
      //   viewer.dispose()
      // } 
      const viewerContainer = document.getElementById("viewer-container")
      if (viewerContainer) {
        viewerContainer.innerHTML = ""
      }
    }
  }, [])

  return (
    <bim-viewport
      id="viewer-container"
    />
  )
}