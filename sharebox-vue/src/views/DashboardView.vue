<template>
    <div class="dashboard-container relative overflow-hidden">
      <!-- Animated Particles Background -->
      <Particles id="tsparticles" class="absolute inset-0 -z-10" :options="particlesOptions" />
  
      <!-- Profile Avatar -->
      <div class="profile-avatar">
        <div class="avatar-wrapper" @click="toggleProfileMenu">
          <div class="avatar-letters">KK</div>
        </div>
        <transition name="fade">
          <div v-if="showProfileMenu" class="avatar-dropdown">
            <button @click="logout" class="btn small">Logout</button>
            <button @click="goToSettings" class="btn small mt-1">Settings</button>
          </div>
        </transition>
      </div>
  
      <div class="upload-card animate__animated animate__fadeInUp">
        <!-- Animated Typing Header -->
        <VueTypedJs :strings="['Welcome to ShareBox', 'Upload and share securely']" type-speed="70" back-speed="50" loop>
          <h1 class="animated-typed text-3xl font-bold mb-2 text-blue-400"></h1>
        </VueTypedJs>
  
        <!-- Animated Welcome Text -->
        <transition name="fade">
          <p class="text-gray-400 mb-6">Welcome back, Kiril! Let's manage your files securely.</p>
        </transition>
  
        <!-- Upload Title -->
        <h1 class="title">📤 Upload to <span class="brand">ShareBox</span></h1>
        <p class="subtitle">Drag & drop or browse your files</p>
  
        <!-- File Upload -->
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
  
        <!-- Actions -->
        <div class="file-actions">
          <button class="btn">📋 View All Files</button>
          <button class="btn secondary">🔗 Copy Link</button>
        </div>
  
        <!-- Mini Analytics -->
        <div class="analytics-cards grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div class="glass-card">
            <p class="text-sm text-gray-400">Total Files</p>
            <h3 class="text-xl font-bold">{{ uploadedFiles.length }}</h3>
          </div>
          <div class="glass-card">
            <p class="text-sm text-gray-400">Total Uploads</p>
            <h3 class="text-xl font-bold">{{ uploadedFiles.length }}</h3>
          </div>
          <div class="glass-card">
            <p class="text-sm text-gray-400">Total Size</p>
            <h3 class="text-xl font-bold">{{ totalSize }}</h3>
          </div>
        </div>
  
        <!-- File List -->
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
  import VueTypedJs from 'vue-typed-js'
  import Particles from 'vue3-particles'
  
  // FilePond styles
  import 'filepond/dist/filepond.min.css'
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
  
  // FilePond plugins
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  
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
  
  const totalSize = computed(() => {
    const totalBytes = uploadedFiles.value.reduce((acc, file) => {
      const match = file.size.match(/[[\d\.]+]/)
      return acc + (match ? parseFloat(match[0]) : 0)
    }, 0)
    return formatBytes(totalBytes)
  })
  
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
  
  function goToSettings() {
    // placeholder for settings navigation
    console.log('Navigate to settings')
  }
  
  const showProfileMenu = ref(false)
  function toggleProfileMenu() {
    showProfileMenu.value = !showProfileMenu.value
  }
  
  const particlesOptions = {
    background: { color: { value: '#121212' } },
    fpsLimit: 60,
    interactivity: {
      events: { onClick: { enable: true, mode: 'push' }, onHover: { enable: true, mode: 'repulse' }, resize: true },
      modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: '#90cdf4' },
      links: { color: '#90cdf4', distance: 150, enable: true, opacity: 0.5, width: 1 },
      collisions: { enable: true },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 2, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.5 },
      shape: { type: ['circle', 'triangle', 'square'] },
      size: { value: { min: 1, max: 5 }, animation: { enable: true, speed: 5, minimumValue: 1, sync: false } },
      rotate: { value: 0, direction: 'random', animation: { enable: true, speed: 5, sync: false } },
    },
    detectRetina: true,
  } },
    fpsLimit: 60,
    interactivity: {
      events: { onClick: { enable: true, mode: 'push' }, onHover: { enable: true, mode: 'repulse' }, resize: true },
      modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: '#90cdf4' },
      links: { color: '#90cdf4', distance: 150, enable: true, opacity: 0.5, width: 1 },
      collisions: { enable: true },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 2, straight: false },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  }
  </script>
  
  <style scoped>
  @import 'animate.css';
  
  .profile-avatar {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
  }
  
  .avatar-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    background-color: #90cdf4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    color: #1a1a1a;
    user-select: none;
  }
  
  .avatar-dropdown {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  /* Rest of your existing styles below */
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
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
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
  
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .fade-enter-to,
  .fade-leave-from {
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
  
  
  .glass-card {
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-radius: 1rem;
    text-align: center;
    color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  </style>
  