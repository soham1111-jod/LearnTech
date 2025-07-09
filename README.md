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

---

## 🌐 Deployment
- **Backend:** Deploy to [Render](https://render.com/) or [Railway](https://railway.app/)
  - Start command: `gunicorn 'app:create_app()'`
  - Set environment variables in the dashboard
  - Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud DB
  - Set up a [Scheduled Job](https://render.com/docs/scheduled-jobs) for `flask ingest_and_summarize`
- **Frontend:** Deploy to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
  - Connect your repo, set build command: `npm run build`, output: `dist/`
  - Set `VITE_API_URL` in environment variables

---

## 🛡️ Environment Variables
### Backend (`server/.env.example`)
```
MONGO_URI=your-mongodb-uri
ADMIN_TOKEN=your-admin-token
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```
### Frontend (`client/.env.example`)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🧪 Testing
- **Frontend:**
  ```sh
  npm run lint
  npm run build
  ```
- **Backend:**
  ```sh
  python -m unittest discover
  ```

---

## 📄 License
This project is for educational purposes. For commercial use of any fonts or third-party assets, please obtain the appropriate licenses.

---

## 👤 Author
- Soham Chafale
- [LinkedIn](https://www.linkedin.com/in/soham-chafale/)
- [GitHub](https://github.com/soham1111-jod)
