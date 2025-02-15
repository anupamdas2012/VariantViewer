<template>
  <div class="viewer-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <h2>Model Viewer</h2>
      <div class="upload-section">
        <label for="modelUpload" class="upload-button">
          Upload File
        </label>
        <input
          type="file"
          id="modelUpload"
          @change="handleFileUpload"
          class="file-input"
        >
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
    const renderCanvas = ref(null)
    const currentModel = ref(null)
    let renderer = null

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return
      currentModel.value = file.name
    }
    
    // create renderer
    onMounted(() => {
      renderer = new Renderer(renderCanvas.value)
      renderer.initialize()
    })
    
    onUnmounted(() => {
      if (renderer) {
        renderer.dispose()
      }
    })

    
    return {
      currentModel,
      handleFileUpload,
      renderCanvas
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
  background-color: #42b983;
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

.model-info {
  padding: 10px;
  background-color: #34495e;
  border-radius: 4px;
}

.content {
  text-align: center;
  color: #2c3e50;
}
</style>../renderer/Renderer