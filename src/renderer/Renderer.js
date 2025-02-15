import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = null;
    this.scene = null;
  }

  initialize() {
    // Initialize engine
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);

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
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 20;

    // Add light
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

    // Create a cube
    const cube = MeshBuilder.CreateBox("cube", { size: 2 }, this.scene);
    cube.position = Vector3.Zero();

    // Start render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Handle window resize
    window.addEventListener("resize", this.onResize);
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
