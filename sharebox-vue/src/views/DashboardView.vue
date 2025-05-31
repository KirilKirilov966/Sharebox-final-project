<template>
    <div class="dashboard-container">
      <button class="btn logout-btn" @click="logout">Logout</button>
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
  
        <div class="file-actions">
          <button class="btn">📋 View All Files</button>
          <button class="btn secondary">🔗 Copy Link</button>
        </div>
  
        <div v-if="uploadedFiles.length" class="file-list">
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
      <footer class="footer">
        <hr class="footer-separator" />
        <p>Created by <strong>Kiril Kirilov</strong> — 2025</p>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import vueFilePond from 'vue-filepond'
  
  // FilePond styles
  import 'filepond/dist/filepond.min.css'
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
  
  // FilePond plugins
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  
  // Initialize FilePond with plugins
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
  
  const serverConfig = computed(() => ({
    process: {
      url: `${backendUrl}/upload`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      withCredentials: false,
      timeout: 7000,
      onload: (res) => console.log('Uploaded:', res),
      onerror: (err) => console.error('Upload error:', err),
    },
  }))
  
  const uploadedFiles = ref([])
  
  function handleFileUpload(error, file) {
    if (error) {
      console.error('Error during file upload:', error)
      return
    }
    uploadedFiles.value.unshift({
      name: file.file.name,
      size: formatBytes(file.file.size),
      url: `${backendUrl}/uploads/${encodeURIComponent(file.file.name)}`,
    })
  }
  
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
      alert('Link copied to clipboard!')
    } catch {
      alert('Failed to copy link.')
    }
  }
  
  function logout() {
    localStorage.removeItem('authToken')
    router.push('/')
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
  
  .upload-card {
    background-color: #1a1a1a;
    padding: 2rem;
    border-radius: 1.5rem;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    width: 100%;
    max-width: 600px;
    text-align: center;
  }
  
  .title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .brand {
    color: #90cdf4;
  }
  
  .subtitle {
    color: #888;
    margin-bottom: 2rem;
  }
  
  .browse {
    color: #90cdf4;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .filepond--label {
    color: #cbd5e0 !important;
  }
  
  .file-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    background-color: #90cdf4;
    color: #1a1a1a;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .btn.secondary {
    background-color: transparent;
    border: 1px solid #90cdf4;
    color: #90cdf4;
  }
  
  .btn:hover {
    background-color: #63b3ed;
  }
  
  .file-list {
    margin-top: 2rem;
    text-align: left;
  }
  
  .file-list-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #cbd5e0;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s ease;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .fade-enter-to, .fade-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  
  .file-item {
    display: flex;
    justify-content: space-between;
    background-color: #2a2a2a;
    padding: 1rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    align-items: center;
  }
  
  .file-info {
    display: flex;
    flex-direction: column;
  }
  
  .file-name {
    font-weight: bold;
    color: #e2e8f0;
  }
  
  .file-size {
    font-size: 0.85rem;
    color: #a0aec0;
  }
  
  .file-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn.small {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 0.4rem;
  }
  
  .footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #2d3748;
    color: #a0aec0;
    font-size: 0.85rem;
    text-align: center;
    width: 100%;
    max-width: 600px;
  }
  </style>
  