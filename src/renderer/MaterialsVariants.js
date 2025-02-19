import { Color3, PBRMaterial } from "@babylonjs/core";

const NAME = "KHR_materials_variants";

export class MaterialsVariants {
  constructor(scene, root) {
    this.materials = [];
    this.root = root;
    for (let i = 0; i < 3; i++) {
      var pbr = new PBRMaterial("ColorMat" + i, scene);
      pbr.albedoColor = new Color3(1.0, 1.0, 1.0);
      pbr.metallic = 0;
      pbr.roughness = 1.0;
      this.materials.push(pbr);
    }
  }

  // creates and/or updates variant metadata. This is metadata lives on the root node (named __root__)
  // and contains the variants and the mappings.
  updateVariantMetadata() {
    const babylonMesh = this.root.getChildren()[0];

    const metadata = this.root
      ? (this.root._internalMetadata = this.root._internalMetadata || {})
      : {};
    const gltf = (metadata.gltf = metadata.gltf || {});
    const extensionMetadata = (gltf[NAME] = gltf[NAME] || {
      lastSelected: null,
      original: [],
      variants: {},
    });

    // Store the original material.
    extensionMetadata.original.push({
      mesh: babylonMesh,
      material: babylonMesh.material,
    });
    for (let i = 0; i < 3; i++) {
      const variantName = this.materials[i].name;
      extensionMetadata.variants[variantName] =
        extensionMetadata.variants[variantName] || [];
      extensionMetadata.variants[variantName].push({
        mesh: babylonMesh,
        material: this.materials[i],
      });
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
