<template>
    <div class="dashboard-container">
      <button class="btn logout-btn" @click="logout">Logout</button>
  
      <div class="theme-toggle">
        <label class="switch">
          <input type="checkbox" v-model="isDark" @change="toggleTheme" />
          <span class="slider"></span>
        </label>
        <span>{{ isDark ? 'Dark' : 'Light' }} Mode</span>
      </div>
  
      <div class="upload-card animate__animated animate__fadeInUp">
        <h1 class="title">📤 Upload to <span class="brand">ShareBox</span></h1>
        <p class="subtitle">Drag & drop or browse your files</p>
  
        <file-pond
          name="file"
          ref="pond"
          :allow-multiple="true"
          accepted-file-types="image/*,application/pdf"
          label-idle='📁 <b>Drop files here</b> or <span class="browse">browse</span>'
          :server="serverConfig"
          :credits="false"
          @processfile="handleFileUpload"
        />
  
        <div v-if="uploadProgress > 0" class="progress-bar">
          <div class="progress" :style="{ width: uploadProgress + '%' }"></div>
        </div>
  
        <div class="file-actions">
          <button class="btn" @click="fetchFiles">📋 View All Files</button>
        </div>
  
        <div class="file-list">
          <h2 class="file-list-title">📂 Uploaded Files</h2>
          <transition-group name="fade" tag="ul">
            <li v-for="file in uploadedFiles" :key="file.name" class="file-item">
              <div class="file-info">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.size }}</span>
              </div>
              <div class="file-buttons">
                <a :href="file.url" class="btn small" download>📥 Download</a>
                <button class="btn small secondary" @click="copyLink(file.url)">🔗 Copy</button>
              </div>
            </li>
          </transition-group>
        </div>
      </div>
  
      <div v-if="snackbar.visible" class="snackbar">{{ snackbar.message }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watchEffect, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import vueFilePond from 'vue-filepond'
  import 'filepond/dist/filepond.min.css'
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import axios from 'axios'
  
  const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,
    FilePondPluginImagePreview
  )
  
  const router = useRouter()
  const token = ref(localStorage.getItem('authToken') || '')
  watchEffect(() => {
    token.value = localStorage.getItem('authToken') || ''
  })
  
  const backendUrl = 'https://backend-lively-sunset-2159.fly.dev'
  const uploadedFiles = ref([])
  const uploadProgress = ref(0)
  const isDark = ref(true)
  const snackbar = ref({ visible: false, message: '' })
  
  const serverConfig = computed(() => ({
    process: {
      url: `${backendUrl}/upload`,
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      withCredentials: false,
      timeout: 7000,
      onload: (res) => {
        showSnackbar('Upload successful')
        fetchFiles()
        return res
      },
      onerror: () => showSnackbar('Upload error'),
      ondata: (formData) => formData,
      onprogress: (e) => {
        if (e.lengthComputable) uploadProgress.value = (e.loaded / e.total) * 100
      },
    },
  }))
  
  function handleFileUpload(error, file) {
    if (error) return
    uploadProgress.value = 0
  }
  
  function fetchFiles() {
    axios.get(`${backendUrl}/files`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    .then(res => {
      uploadedFiles.value = res.data.files.map(f => ({
        name: f.name,
        size: formatBytes(f.size),
        url: `${backendUrl}/uploads/${encodeURIComponent(f.name)}`,
      }))
    })
    .catch(() => showSnackbar('Failed to fetch files'))
  }
  
  onMounted(() => {
    fetchFiles()
  })
  
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      showSnackbar('Link copied to clipboard!')
    } catch {
      showSnackbar('Failed to copy link.')
    }
  }
  
  function showSnackbar(message) {
    snackbar.value.message = message
    snackbar.value.visible = true
    setTimeout(() => (snackbar.value.visible = false), 3000)
  }
  
  function logout() {
    localStorage.removeItem('authToken')
    router.push('/')
  }
  
  function toggleTheme() {
    document.body.classList.toggle('light-theme', !isDark.value)
  }
  </script>
  
  <style scoped>
  @import 'animate.css';
  
  .dashboard-container {
    min-height: 100vh;
    background: linear-gradient(145deg, #1c1c1e, #121212);
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  
  .logout-btn {
    align-self: flex-end;
    background-color: #e53e3e;
    color: white;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-weight: bold;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;
  }
  
  .logout-btn:hover {
    background-color: #9b2c2c;
  }
  
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 18px; width: 18px;
    left: 3px; bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #3182ce;
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
  
  .snackbar {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: #2d3748;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 9999;
  }
  
  .progress-bar {
    width: 100%;
    background-color: #333;
    height: 8px;
    border-radius: 6px;
    margin-top: 1rem;
    overflow: hidden;
  }
  
  .progress {
    background-color: #90cdf4;
    height: 100%;
    transition: width 0.3s ease;
  }
  </style>
  