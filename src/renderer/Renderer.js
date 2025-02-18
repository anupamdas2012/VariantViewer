import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  FilesInput,
  AssetsManager,
  Tools,
  MeshBuilder,
} from "@babylonjs/core";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = null;
    this.scene = null;
    this.assetsManager = null;
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
  async loadGLB(file) {
    // try {
    //   // Clear existing meshes
    //   this.scene.meshes.forEach((mesh) => mesh.dispose());
    //   const dataUrl = await new Promise((resolve) => {
    //     Tools.ReadFileAsDataURL(file, (data) => {
    //       resolve(data);
    //     });
    //   });
    //   var base64_model_content =
    //     "data:base64,Z2xURgIAAAD4CAAAlAUAAEpTT057ImFjY2Vzc29ycyI6W3sibmFtZSI6IjJmdHg0ZnRfMV9wb3NpdGlvbnMiLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MjQsIm1pbiI6Wy0yNCwwLC0xMl0sIm1heCI6WzI0LDIsMTJdLCJ0eXBlIjoiVkVDMyIsImJ1ZmZlclZpZXciOjAsImJ5dGVPZmZzZXQiOjB9LHsibmFtZSI6IjJmdHg0ZnRfMV9ub3JtYWxzIiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjI0LCJtaW4iOlstMSwtMSwtMV0sIm1heCI6WzEsMSwxXSwidHlwZSI6IlZFQzMiLCJidWZmZXJWaWV3IjowLCJieXRlT2Zmc2V0IjoyODh9LHsibmFtZSI6IjJmdHg0ZnRfMV90ZXhjb29yZHMiLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MjQsIm1pbiI6Wy0xLjM0MDcwMDAzMDMyNjg0MzMsLTEuNjgxMzk5OTQxNDQ0Mzk3XSwibWF4IjpbNS4zNjI4MDAxMjEzMDczNzMsMy42ODE0MDAwNjA2NTM2ODY1XSwidHlwZSI6IlZFQzIiLCJidWZmZXJWaWV3IjoxLCJieXRlT2Zmc2V0IjowfSx7Im5hbWUiOiIyZnR4NGZ0XzFfMF9pbmRpY2VzIiwiY29tcG9uZW50VHlwZSI6NTEyMywiY291bnQiOjM2LCJtaW4iOlswXSwibWF4IjpbMjNdLCJ0eXBlIjoiU0NBTEFSIiwiYnVmZmVyVmlldyI6MiwiYnl0ZU9mZnNldCI6MH1dLCJhc3NldCI6eyJnZW5lcmF0b3IiOiJvYmoyZ2x0ZiIsInZlcnNpb24iOiIyLjAifSwiYnVmZmVycyI6W3sibmFtZSI6ImlucHV0IiwiYnl0ZUxlbmd0aCI6ODQwfV0sImJ1ZmZlclZpZXdzIjpbeyJuYW1lIjoiYnVmZmVyVmlld18wIiwiYnVmZmVyIjowLCJieXRlTGVuZ3RoIjo1NzYsImJ5dGVPZmZzZXQiOjAsImJ5dGVTdHJpZGUiOjEyLCJ0YXJnZXQiOjM0OTYyfSx7Im5hbWUiOiJidWZmZXJWaWV3XzEiLCJidWZmZXIiOjAsImJ5dGVMZW5ndGgiOjE5MiwiYnl0ZU9mZnNldCI6NTc2LCJieXRlU3RyaWRlIjo4LCJ0YXJnZXQiOjM0OTYyfSx7Im5hbWUiOiJidWZmZXJWaWV3XzIiLCJidWZmZXIiOjAsImJ5dGVMZW5ndGgiOjcyLCJieXRlT2Zmc2V0Ijo3NjgsInRhcmdldCI6MzQ5NjN9XSwibWF0ZXJpYWxzIjpbeyJuYW1lIjoid2lyZV8xOTExOTExOTEiLCJwYnJNZXRhbGxpY1JvdWdobmVzcyI6eyJiYXNlQ29sb3JGYWN0b3IiOlswLjUsMC41LDAuNSwxXSwibWV0YWxsaWNGYWN0b3IiOjAsInJvdWdobmVzc0ZhY3RvciI6MX0sImVtaXNzaXZlRmFjdG9yIjpbMCwwLDBdLCJhbHBoYU1vZGUiOiJPUEFRVUUiLCJkb3VibGVTaWRlZCI6ZmFsc2V9XSwibWVzaGVzIjpbeyJuYW1lIjoiMmZ0eDRmdF8xIiwicHJpbWl0aXZlcyI6W3siYXR0cmlidXRlcyI6eyJQT1NJVElPTiI6MCwiTk9STUFMIjoxLCJURVhDT09SRF8wIjoyfSwiaW5kaWNlcyI6MywibWF0ZXJpYWwiOjAsIm1vZGUiOjR9XX1dLCJub2RlcyI6W3sibmFtZSI6IjJmdHg0ZnQiLCJtZXNoIjowfV0sInNjZW5lIjowLCJzY2VuZXMiOlt7Im5vZGVzIjpbMF19XX1IAwAAQklOAAAAwMEAAACAAABAQQAAwMEAAABAAABAwQAAwMEAAAAAAABAwQAAwMEAAABAAABAQQAAwMEAAAAAAABAwQAAwEEAAABAAABAwQAAwEEAAAAAAABAwQAAwMEAAABAAABAwQAAwEEAAAAAAABAwQAAwEEAAABAAABAQQAAwEEAAACAAABAQQAAwEEAAABAAABAwQAAwEEAAACAAABAQQAAwMEAAABAAABAQQAAwMEAAACAAABAQQAAwEEAAABAAABAQQAAwEEAAABAAABAQQAAwMEAAABAAABAwQAAwMEAAABAAABAQQAAwEEAAABAAABAwQAAwEEAAACAAABAQQAAwMEAAAAAAABAwQAAwEEAAAAAAABAwQAAwMEAAACAAABAQQAAgL8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAAIAAAIC/AAAAgAAAAIAAAIC/AAAAgAAAAIAAAIC/AAAAgAAAAIAAAIC/AAAAgAAAgD8AAACAAAAAgAAAgD8AAACAAAAAgAAAgD8AAACAAAAAgAAAgD8AAACAAAAAgAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPw+cK0AAAIA/AAAAALTIRj8AAAAAAACAPw+cK0C0yEY/D5yrQAAAgD8AAAAAtMhGPwAAAAAAAIA/D5yrQLTIRj8PnCtAAACAPwAAAIC0yEY/AAAAgAAAgD8PnCtAtMhGPw+cq0AAAIA/AAAAALTIRj8AAAAAAACAPw+cq0C0yEY/D5yrPx04178PnKu/D5xrQA+cqz8PnGtAD5yrvx04178Xt9E4HTjXv7KdK0APnGtAsp0rQB04178Xt9E4D5xrQAAAAQACAAEAAAADAAQABQAGAAUABAAHAAgACQAKAAkACAALAAwADQAOAA0ADAAPABAAEQASABEAEAATABQAFQAWABUAFAAXAA==";
    //   await SceneLoader.AppendAsync("", dataUrl, this.scene);
    //   //   var newtask = this.assetsManager.addMeshTask(
    //   //     "taskName",
    //   //     "",
    //   //     "",
    //   //     base64_model_content
    //   //   );
    //   //   newtask.onSuccess = (task) => {
    //   //     console.log("success");
    //   //   };
    //   //   this.assetsManager.load();
    //   //   var blob = new Blob([file]);
    //   //   FilesInput.FilesToLoad[filename] = blob;
    //   //   this.assetsManager.addMeshTask("meshTask", "", "file:", filename);
    //   //   this.assetsManager.load();
    //   return true;
    // } catch (error) {
    //   console.error("Error loading GLB:", error);
    //   return false;
    // }
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
