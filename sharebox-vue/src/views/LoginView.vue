<template>
    <div class="auth-page">
      <div class="auth-card animate__animated animate__fadeInUp">
        <h1 class="title">Welcome to <span class="brand">ShareBox</span></h1>
        <p class="subtitle">Created by Kiril Kirilov</p>
  
        <div class="form-group">
          <label for="email">📧 Email</label>
          <div class="input-wrapper">
            <input id="email" v-model="email" type="email" placeholder="Enter your email" />
          </div>
        </div>
  
        <div class="form-group">
          <label for="password">🔑 Password</label>
          <div class="input-wrapper">
            <input id="password" v-model="password" type="password" placeholder="Enter your password" />
          </div>
        </div>
  
        <button class="login-btn" @click="login">Login</button>
  
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
  
        <p class="alt">
          Don’t have an account?
          <router-link to="/register">Register</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const errorMsg = ref('')
  
  const backendUrl = 'https://backend-lively-sunset-2159.fly.dev'  // <-- Your deployed backend URL
  
  async function login() {
    console.log('Login started')
    errorMsg.value = ''
    if (!email.value || !password.value) {
      errorMsg.value = 'Please enter both email and password.'
      return
    }
  
    try {
      const response = await axios.post(`${backendUrl}/login`, {
        username: email.value,
        password: password.value,
      })
      const token = response.data.token
      console.log('Token from server:', token)
      localStorage.setItem('authToken', token)
      console.log('Token saved:', localStorage.getItem('authToken'))
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
      errorMsg.value = error.response?.data?.msg || 'Login failed'
    }
  }
  </script>
  
  <style scoped>
  @import 'animate.css';
  
  .auth-page {
    background: linear-gradient(to right, #1f1f1f, #2b2b2b);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .auth-card {
    background: #2d2d2d;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    width: 100%;
    max-width: 420px;
    font-family: 'Segoe UI', sans-serif;
    color: #f5f5f5;
  }
  
  .title {
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
    text-align: center;
    color: #f0f0f0;
  }
  
  .subtitle {
    font-size: 0.85rem;
    text-align: center;
    color: #888;
    margin-bottom: 2rem;
  }
  
  .brand {
    color: #90cdf4;
    font-weight: 600;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    font-size: 0.85rem;
    color: #ccc;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  .input-wrapper {
    display: flex;
    align-items: center;
    background-color: #1a1a1a;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 0 12px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  .input-wrapper:hover {
    border-color: #90cdf4;
  }
  
  .input-wrapper:focus-within {
    border-color: #90cdf4;
    box-shadow: 0 0 0 2px rgba(144, 205, 244, 0.3);
  }
  
  input {
    flex: 1;
    padding: 12px 0;
    background: transparent;
    border: none;
    color: #d0d5dc;
    font-size: 1rem;
  }
  
  input::placeholder {
    color: #777;
  }
  
  input:focus {
    outline: none;
    color: #e2e8f0;
  }
  
  .login-btn {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    background-color: #3182ce;
    color: white;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .login-btn:hover {
    background-color: #2c5282;
  }
  
  .alt {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
  }
  
  a {
    color: #90cdf4;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  .error-msg {
    color: #f56565;
    margin-top: 1rem;
    text-align: center;
  }
  </style>
