import { Color3, PBRMaterial } from "@babylonjs/core";

export class MaterialsVariants {
  constructor(scene, rootNode) {
    this.materials = [];
    this.rootNode = rootNode;
    for (let i = 0; i < 3; i++) {
      var pbr = new PBRMaterial("ColorMat", scene);
      pbr.albedoColor = new Color3(1.0, 1.0, 1.0);
      pbr.metallic = 0;
      pbr.roughness = 1.0;
      this.materials.push(pbr);
    }
  }

  dispose() {
    for (let i = 0; i < 3; i++) {
      this.materials[i].dispose(true, true);
    }
  }

  updateMaterialColors(colors) {
    // Convert hex colors to BabylonJS Color
    this.materials[0].albedoColor = Color3.FromHexString(colors.color1);
    this.materials[1].albedoColor = Color3.FromHexString(colors.color2);
    this.materials[2].albedoColor = Color3.FromHexString(colors.color3);
  }
}
