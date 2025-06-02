

ShareBox is a  modern file-sharing web application built with Vue 3 (frontend) and Python Flask (backend). It allows users to securely upload files, view uploaded items, and retrieve download links — all within a clean and responsive interface.

 Live Demo

Frontend: [https://sharebox.kirilkirilov.net](https://sharebox.kirilkirilov.net)  
Backend API: [https://backend-lively-sunset-2159.fly.dev](https://backend-lively-sunset-2159.fly.dev)

---

# Tech Stack

- **Frontend**: Vue 3 + FilePond + TailwindCSS + Animate.css
- **Backend**: Flask (Python) + Flask-CORS
- **Hosting**: 
  - Vercel (Frontend)
  - Fly.io (Backend)
- Authentication: JWT (JSON Web Tokens)
- File Upload UI: FilePond with drag-and-drop support

---

# Features

-  Token-based user authentication
-  Upload multiple files (PDFs, images)
-  Download and share file links
-  View uploaded file names and sizes
-  Copy-to-clipboard support for links
-  Light/Dark mode (planned)
-  File upload progress bar (planned)
-  Clean responsive UI with animations

---

# Setup Instructions

 1. Clone the repository

bash
git clone https://github.com/KirilKirilov966/Sharebox-final-project.git
cd Sharebox-final-project

# Backend Setup

bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py


Runs on: http://localhost:5000

# Frontend Setup

bash
cd sharebox-vue
npm install
npm run dev


Runs on: http://localhost:5173

---

# Deployment

# Frontend (Vercel)

- Connected to GitHub for automatic deployments
- Deployed under custom domain sharebox.kirilkirilov.net

# Backend (Fly.io)

- Dockerized and deployed using Fly.io CLI
- Auto-start and auto-stop enabled via `fly.toml`

toml
[vm]
auto_start_machines = true
auto_stop_machines = "timeout"


---

# File Structure

# Project Structure: Sharebox-final-project



---

# Concepts Demonstrated

- Vue 3 single-file components
- FilePond integration with drag-and-drop UI
- Secure API token handling via JWT
- CORS handling in cross-origin file uploads
- Cloud-native deployment on Vercel and Fly.io

---

# Author

Created with by Kiril Kirilov  
GitHub: (https://github.com/KirilKirilov966)  
Year: 2025

---

# Roadmap

- Remove static demo files - Done
- Add footer with credits - Done
- File upload progress bar 
- Dark/light mode toggle
- Snackbar copy notifications
