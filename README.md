# LearnTech

A modern, full-stack platform for exploring Generative AI concepts, curated videos, and student project submissions. Built with Flask, MongoDB, React, and Tailwind CSS.

---

## 🚀 Features
- Curated concept and project videos (YouTube integration)
- Student project submission with admin moderation
- AI-powered video summarization (Gemini API)
- Responsive, accessible, and modern UI
- Admin panel for project approvals and management
- Secure token-based admin access
- Modular, scalable backend structure

---

## 🏗️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python, Flask, Flask-CORS, Gunicorn
- **Database:** MongoDB (Atlas recommended)
- **AI/ML:** Google Gemini API, YouTube Transcript API
- **Validation:** Marshmallow
- **Deployment:** Render (backend), Vercel/Netlify (frontend)

---

## 📦 Monorepo Structure
```
genai-hub/
  client/   # React + Vite frontend
  server/   # Flask backend
```

---

## ⚡ Quick Start

### 1. Clone the Repo
```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd genai-hub
```

### 2. Setup Backend
```sh
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Fill in your secrets
flask run  # For development
# For production: gunicorn 'app:create_app()'
```

### 3. Setup Frontend
```sh
cd ../client
npm install
cp .env.example .env  # Fill in your API URL
npm run dev           # For development
npm run build         # For production
```


