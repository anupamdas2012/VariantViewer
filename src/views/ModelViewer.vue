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

    <!-- Main Content Area -->
    <div class="content-container">
      <div v-if="currentModel" class="content">
        <h3>File loaded: {{ currentModel }}</h3>
      </div>
      <div v-else class="content">
        <h3>No file selected</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ModelViewer',
  setup() {
    const currentModel = ref(null)

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return
      currentModel.value = file.name
    }

    return {
      currentModel,
      handleFileUpload
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
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
</style>