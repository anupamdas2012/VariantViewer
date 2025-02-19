import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  AssetsManager,
  Tools,
  MeshBuilder,
  FilesInput,
} from "@babylonjs/core";
export * from "@babylonjs/loaders/glTF";
import { GLTF2Export } from "@babylonjs/serializers";
import { Inspector } from "@babylonjs/inspector";

import { MaterialsVariants } from "./MaterialsVariants";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = null;
    this.scene = null;
    this.assetsManager = null;
    this.materialsVariants = null;
    this.rootNode = null;
  }

  initialize() {
    // Initialize engine
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);

    this.assetsManager = new AssetsManager(this.scene);
    // Add camera
    const camera = new ArcRotateCamera(
      "camera",
      0,
      Math.PI / 3,
      10,
      Vector3.Zero(),
      this.scene
    );
    camera.attachControl(this.canvas, true);
    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 2;
    camera.alpha = 1.5;

    // Add light
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

    // DEBUG: Create a cube
    // const cube = MeshBuilder.CreateBox("cube", { size: 2 }, this.scene);
    // cube.position = Vector3.Zero();

    // Start render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Handle window resize
    window.addEventListener("resize", this.onResize);
  }

  saveAsGltf() {
    const exportDisabledNodes = false;
    const exportCameras = false;
    const exportLights = false;
    const exportSkybox = false;

    // Create export options
    const exportOptions = {
      shouldExportNode: (node) => {
        // Skip disabled nodes
        if (!exportDisabledNodes && !node.isEnabled()) {
          return false;
        }

        // Skip cameras
        if (
          !exportCameras &&
          node.getClassName().toLowerCase().includes("camera")
        ) {
          return false;
        }

        // Skip lights
        if (
          !exportLights &&
          node.getClassName().toLowerCase().includes("light")
        ) {
          return false;
        }

        // Skip skybox (assuming it's a mesh with specific naming convention)
        if (
          !exportSkybox &&
          node.name &&
          node.name.toLowerCase().includes("skybox")
        ) {
          return false;
        }

        return true;
      },
    };

    GLTF2Export.GLBAsync(this.scene, "exportedGLB", exportOptions).then(
      (gltf) => {
        gltf.downloadFiles();
      }
    );
    // const saveProm = new Promise((resolve, reject) => {
    //   GLTF2Export.GLBAsync(this.scene, "exportedGLB", exportOptions)
    //     .then((glb) => resolve(glb))
    //     .catch((error) => reject(error));
    // });
  }
  async updateModels(colors) {
    console.log("updating materials");
    this.materialsVariants.updateMaterialColors(colors);
  }

  applyMaterialVariant(variantName) {
    if (!this.scene || !this.materialsVariants) {
      return false;
    }

    const root = this.materialsVariants.root;
    if (!root || !root._internalMetadata || !root._internalMetadata.gltf) {
      return false;
    }

    const variantsMetadata =
      root._internalMetadata.gltf["KHR_materials_variants"];
    if (!variantsMetadata || !variantsMetadata.variants) {
      return false;
    }

    // Apply the selected variant
    const variantData = variantsMetadata.variants[variantName];
    if (variantData) {
      variantData.forEach((item) => {
        item.mesh.material = item.material;
      });

      // Store last selected
      variantsMetadata.lastSelected = variantName;
      return true;
    }

    return false;
  }

  getMaterialVariants() {
    if (!this.scene || !this.materialsVariants) {
      return [];
    }

    // Extract variant names from materialsVariants
    const root = this.materialsVariants.root;
    if (!root || !root._internalMetadata || !root._internalMetadata.gltf) {
      return [];
    }

    const variantsMetadata =
      root._internalMetadata.gltf["KHR_materials_variants"];
    if (!variantsMetadata || !variantsMetadata.variants) {
      return [];
    }

    // Return array of variant names
    return Object.keys(variantsMetadata.variants);
  }

  async loadDemo() {
    const assetContainer = await loadAssetContainerAsync(
      "https://raw.githubusercontent.com/anupamdas2012/assets/32e24b482b458f84dee5863326b98a5a95baecc3/SimpleBox.glb",
      this.scene,
      {
        pluginOptions: {},
      }
    );
    assetContainer.addAllToScene();
    if (this.rootNode) {
      this.rootNode.dispose(false, true);
    }
    if (this.materialsVariants) {
      this.materialsVariants.dispose();
    }
    this.rootNode = assetContainer.rootNodes[0];
    this.materialsVariants = new MaterialsVariants(this.scene, this.rootNode);
  }

  async setupVariants() {}
  loadGLB(file) {
    return new Promise((resolve, reject) => {
      try {
        let filename = file.name;
        let blob = new Blob([event.target.files[0]]);
        console.log(file.size);
        FilesInput.FilesToLoad[filename.toLowerCase()] = blob;

        const task = this.assetsManager.addMeshTask(
          filename,
          "",
          "file:",
          filename
        );
        task.onSuccess = (task) => {
          if (this.rootNode) {
            this.rootNode.dispose(false, true);
          }
          if (this.varaints) {
            this.varaints.dispose();
          }
          this.rootNode = task.loadedMeshes[0];
          this.materialsVariants = new MaterialsVariants(
            this.scene,
            this.rootNode
          );
          this.materialsVariants.updateVariantMetadata();
          //Inspector.Show(this.scene, {});
          // Resolve with true on success
          resolve(true);
        };
        this.assetsManager.load();
      } catch (error) {
        console.error("Exception in loadGLB:", error);
        resolve(false); // Resolve with false on exception
      }
    });
  }
  // called on window resize
  onResize = () => {
    if (this.engine) {
      this.engine.resize();
    }
  };

  // called on dispose
  dispose() {
    window.removeEventListener("resize", this.onResize);
    if (this.engine) {
      this.engine.dispose();
    }
  }
}
