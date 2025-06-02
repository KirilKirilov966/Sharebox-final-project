# ShareBox

**ShareBox** is a modern file-sharing web application built with **Vue 3 (frontend)** and **Python Flask (backend)**. It allows users to securely upload files, view uploaded items, and retrieve download links — all within a clean and responsive interface.

---

## 🚀 Live Demo

- **Frontend**: [https://sharebox.kirilkirilov.net](https://sharebox.kirilkirilov.net)  
- **Backend API**: [https://backend-lively-sunset-2159.fly.dev](https://backend-lively-sunset-2159.fly.dev)

---

## 🛠 Tech Stack

- **Frontend**: Vue 3 + FilePond + TailwindCSS + Animate.css  
- **Backend**: Flask (Python) + Flask-CORS  

### Hosting
- **Frontend**: Vercel  
- **Backend**: Fly.io  

### Other Technologies
- **Authentication**: JWT (JSON Web Tokens)  
- **File Upload UI**: FilePond with drag-and-drop support  

---

## ✨ Features

- 🔐 Token-based user authentication  
- 📁 Upload multiple files (PDFs, images)  
- 🔗 Download and share file links  
- 📄 View uploaded file names and sizes  
- 📋 Copy-to-clipboard support for links  
- 🌗 Light/Dark mode *(planned)*  
- 📶 File upload progress bar *(planned)*  
- 💅 Clean, responsive UI with animations  

---

## 🧰 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/KirilKirilov966/Sharebox-final-project.git
cd Sharebox-final-project
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
cd sharebox-vue
npm install
npm run dev
📦 Deployment
Frontend (Vercel)
Connected to GitHub for automatic deployments

Deployed under custom domain: sharebox.kirilkirilov.net

Backend (Fly.io)
Dockerized and deployed using Fly.io CLI

Auto-start and auto-stop enabled via fly.toml
[vm]
auto_start_machines = true
auto_stop_machines = "timeout"

Sharebox-final-project/
├── backend/
│   ├── app.py                # Main API logic (Flask backend)
│   └── uploads/              # Directory for uploaded files
├── sharebox-vue/             # Vue 3 frontend
│   ├── src/
│   │   ├── views/
│   │   │   ├── DashboardView.vue
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   └── App.vue
│   └── index.html
├── fly.toml                  # Fly.io configuration for backend deployment
└── README.md

Concepts Demonstrated
Vue 3 single-file components

FilePond integration with drag-and-drop UI

Secure API token handling via JWT

CORS handling in cross-origin file uploads

Cloud-native deployment on Vercel and Fly.io

👤 Author
Created with ❤️ by Kiril Kirilov
GitHub: @KirilKirilov966
Year: 2025

🗺 Roadmap
✅ Remove static demo files

✅ Add footer with credits

⏳ File upload progress bar

⏳ Dark/light mode toggle

⏳ Snackbar copy notifications
