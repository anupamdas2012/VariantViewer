<template>
  <div class="viewer-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="upload-section">
        <label for="modelUpload" class="upload-button">
          Upload Model
        </label>
        <input
          type="file"
          id="modelUpload"
          accept=".glb"
          @change="handleFileUpload"
          class="file-input"
        >
      </div>

      <!-- Color Input Section -->
      <div class="color-section">
        <h3>Variants</h3>
        <div class="color-input">
          <label for="color1">Color 1:</label>
          <input
            type="text"
            id="color1"
            v-model="colors.color1"
            placeholder="#FFFFFF"
          />
        </div>
        
        <div class="color-input">
          <label for="color2">Color 2:</label>
          <input
            type="text"
            id="color2"
            v-model="colors.color2"
            placeholder="#FFFFFF"
          />
        </div>
        
        <div class="color-input">
          <label for="color3">Color 3:</label>
          <input
            type="text"
            id="color3"
            v-model="colors.color3"
            placeholder="#FFFFFF"
          />
        </div>
        <button 
          @click="handleUpdateModel" 
          class="upload-button"
        >
          Update Variants
        </button>
      </div>
      <!-- Material Variants Dropdown -->
      <div class="variants-section" v-if="materialVariants.length > 0">
        <h3>Material Variants</h3>
        <div class="variant-selector">
          <label for="variantSelect">Select Variant:</label>
          <select 
            id="variantSelect" 
            v-model="selectedVariant"
            @change="applyVariant"
            class="variant-dropdown"
          >
            <option 
              v-for="variant in materialVariants" 
              :key="variant" 
              :value="variant"
            >
              {{ variant }}
            </option>
          </select>
        </div>
      </div>
      <div class="action-buttons">
        <button 
          @click="saveAsGltf" 
          class="upload-button"
        >
          Save as GLTF
        </button>
      </div>
      <div v-if="currentModel" class="model-info">
        <p>Current Model: {{ currentModel }}</p>
      </div>
    </div>
    <!-- 3D Viewer -->
    <div class="content-container">
      <canvas ref="renderCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { Renderer } from '../renderer/Renderer'

export default defineComponent({
  name: 'ModelViewer',
  setup() {
    const renderCanvas = ref(null);
    const currentModel = ref(null);
    const colors = ref({
      color1: '#eb4034',
      color2: '#02f713',
      color3: '#0a16fa'
    });
    const materialVariants = ref([]);
    const selectedVariant = ref('');

    let renderer = null;

    const handleUpdateModel = async () => {
      renderer.updateModels({
        color1: colors.value.color1,
        color2: colors.value.color2,
        color3: colors.value.color3
        });
    }

    const handleFileUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return;
      const success = await renderer.loadGLB(file);
      if(success)
      {
        const variants = renderer.getMaterialVariants();  
        if (variants && variants.length > 0) {
          materialVariants.value = variants;
          selectedVariant.value = variants[0]; // Select first by default
        } else {
          materialVariants.value = [];
          selectedVariant.value = '';
        }
      }
    }
    const applyVariant = () => {
      if (selectedVariant.value && renderer) {
        renderer.applyMaterialVariant(selectedVariant.value);
      }
    }

    const saveAsGltf = async () => {
      renderer.saveAsGltf();
    }

    // create renderer
    onMounted(() => {
      renderer = new Renderer(renderCanvas.value);
      renderer.initialize();
    })
    
    onUnmounted(() => {
      if (renderer) {
        renderer.dispose();
      }
    })

    
    return {
      currentModel,
      handleFileUpload,
      handleUpdateModel,
      renderCanvas,
      colors,
      saveAsGltf,
      materialVariants,
      selectedVariant,
      applyVariant
    }
  }
})
</script>

<style scoped>
.viewer-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-container {
  flex: 1;
  position: relative;
}

.content-container canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
  outline: none;
}   

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-button {
  background-color: #638680;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #3aa876;
}

.file-input {
  display: none;
}
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-info {
  padding: 10px;
  background-color: #34495e;
  border-radius: 4px;
}

.content {
  text-align: center;
  color: #2c3e50;
}

/* Color section styles */
.color-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #34495e;
  padding: 15px;
  border-radius: 4px;
}

.color-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  border-bottom: 1px solid #498168;
  padding-bottom: 5px;
}

.color-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Variant selector styles */
.variants-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #34495e;
  padding: 15px;
  border-radius: 4px;
}

.variants-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  border-bottom: 1px solid #42b983;
  padding-bottom: 5px;
}

.variant-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.variant-dropdown {
  background-color: #2c3e50;
  color: white;
  border: 1px solid #42b983;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  cursor: pointer;
}

.variant-dropdown:focus {
  outline: none;
  border-color: #3aa876;
}

</style>../renderer/Renderer