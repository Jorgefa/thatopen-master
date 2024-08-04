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
    fragmentsManager.onFragmentsLoaded.add((model) => {
      world.scene.three.add(model);
    });

    const highlighter = components.get(OBCF.Highlighter);
    highlighter.setup({ world });
    highlighter.zoomToSelection = true;

    viewerContainer.addEventListener("resize", () => {
      rendererComponent.resize();
      cameraComponent.updateAspect();
    });
  }

  const setUI = () => {
    const viewerContainer = document.getElementById("viewer-container") as HTMLElement
    if (!viewerContainer) return

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html`
        <bim-grid floating style="padding: 20px;"></bim-grid>
      `;
    });

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components });
      return BUI.html`
        <bim-toolbar style="justify-self: center;">
          <bim-toolbar-section>
            ${loadIfcBtn}
          </bim-toolbar-section>
        </bim-toolbar>
      `;
    });

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
      if (components) {
        components.dispose()
      } 
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