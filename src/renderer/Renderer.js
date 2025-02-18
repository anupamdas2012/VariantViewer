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

import { Inspector } from "@babylonjs/inspector";

import { MaterialsVariants } from "./MaterialsVariants";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = null;
    this.scene = null;
    this.assetsManager = null;
    this.varaints = null;
    this.rootNode = null;
  }

  initialize() {
    // Initialize engine
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    Inspector.Show(this.scene, {});

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

  async updateModels(colors) {
    console.log("updating materials");
    this.varaints.updateMaterialColors(colors);
  }

  async loadGLB(file) {
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
      this.varaints = new MaterialsVariants(this.scene, this.rootNode);
    };

    this.assetsManager.load();
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
