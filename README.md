# 🩺 Jivika AI — Revolutionizing Healthcare with AI & Automation 🚀  

**Jivika AI** is an end-to-end, AI-powered healthcare assistant that leverages advanced **Generative AI**, **Deep Learning**, and **Automation** to make medical support smarter, faster, and more accessible.  

Built with ❤️ by Saumya Sood, Vishwas Pahwa, Kyan Mahajan, and Vaidik Kathal.  

🎥 **Demo Video:** [https://lnkd.in/eNbuNBzX](https://lnkd.in/eNbuNBzX)  
🌐 **Live Frontend:** [https://jivika.pearl99z.tech](https://jivika.pearl99z.tech)  
💻 **GitHub Repository:** [https://lnkd.in/e8DCY9hu](https://lnkd.in/e8DCY9hu)

---

## 🧭 Table of Contents
1. Overview  
2. Key Features 
3. Architecture 
4. Tech Stack 
5. System Modules  
6. Installation & Setup  
7. Environment Configuration 
8. Usage Guide 
9. Deployment
10. Contributing
11. Team & Credits
12. Vision 
13. License

---

## 🩻 Overview

**Jivika AI** integrates Artificial Intelligence and Automation to offer intelligent diagnostics, real-time clinical support, and seamless interaction between patients and healthcare providers.  
It combines **Generative AI chat**, **computer vision diagnostics**, and **real-world integrations** such as hospital discovery and health news feeds into a single cohesive platform.

> ⚡ *Our mission is to bridge the gap between patients and doctors through secure, intelligent, and accessible AI-driven healthcare.*

---

## 💡 Key Features

### 💬 AI Chatbot
- Built with **LangGraph**, **LangSmith**, **FastAPI**, and **PostgreSQL**  
- Offers context-aware, persistent conversations  
- Provides clinical assistance and health-related recommendations

### 🧠 ML-Powered Diagnostics
Deep learning modules built with **PyTorch** and **Scikit-learn**:
- 🧩 **Brain & Lung X-ray Analyzer**  
- 🩹 **Wound Type Detector**  
- ❤️ **Heart Health Predictor**  
- 🖼️ **X-ray/Image Classifier** – automatically detects the type of medical scan  
- ➕ Includes **4 non-ML diagnostic checks** for rapid assessments  

### 🌍 Real-World Integration
- 🏥 **Hospital Finder** using **Google Maps** + **OpenStreetMap APIs**  
- 📰 **Live Health Updates** powered by the **GNews API**

### 👩‍⚕️ Dual-Role Access
- **Doctors**: Manage profiles, appointments, and patient data  
- **Patients**: Book appointments, view doctors, and manage health information  

### 🔐 Secure Authentication
- **Google OAuth 2.0**  
- **OTP-based Login**  
- **Password Reset & Recovery**

---


## 🏗️ Architecture

Frontend (Next.js + TailwindCSS + shadcn/ui)
↓
Backend (Spring Boot + GraphQL APIs)
↓
GenAI Layer (LangGraph + LangSmith + FastAPI)
↓
Database (PostgreSQL)
↓
Machine Learning Services (PyTorch + ResNet + ViT + Grad-CAM)

yaml
Copy code

**Deployment:** Dockerized microservices architecture with CI/CD pipelines.

---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | Next.js, TailwindCSS, shadcn/ui |
| **Backend** | Spring Boot (GraphQL APIs), Java 17 |
| **GenAI Layer** | LangGraph, LangSmith, FastAPI |
| **Database** | PostgreSQL |
| **Machine Learning** | PyTorch, Scikit-learn, ResNet, ViT, Grad-CAM |
| **DevOps** | Docker, CI/CD Pipelines |
| **Integrations** | Google Maps API, OpenStreetMap API, GNews API, OAuth 2.0 |

---

## 🧩 System Modules

| Module | Description |
|---------|-------------|
| **Authentication Service** | Handles OAuth, OTP login, JWT-based session management |
| **Chat Service (GenAI)** | LangGraph workflow orchestrator for medical Q&A |
| **Diagnostic Service** | Deep learning models for image-based disease detection |
| **Hospital Finder** | Real-time hospital discovery via geolocation APIs |
| **Health News Feed** | Curated, real-time medical updates using GNews API |
| **Doctor/Patient Portal** | Role-specific dashboards, appointment booking & management |

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Marcella2706/Pearl.git
cd jivika-ai
2️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs at http://localhost:3000

3️⃣ Backend Setup
bash
Copy code
cd backend
./mvnw spring-boot:run
Backend runs at http://localhost:2706

4️⃣ GenAI Layer (FastAPI)
bash
Copy code
cd genai
pip install -r requirements.txt
source venv/bin/activate
uvicorn main:app --reload
FastAPI server runs at http://localhost:8000

🔧 Environment Configuration
Create a .env file in each module root:

Frontend
.env.local

NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_GENAI_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<YOUR_KEY>
NEXT_PUBLIC_GNEWS_API_KEY=<YOUR_KEY>

Backend
.env

SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/jivika
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<PASSWORD>
JWT_SECRET=<YOUR_SECRET>

GenAI
.env

LANGGRAPH_API_KEY=<KEY>
LANGSMITH_API_KEY=<KEY>
POSTGRES_URL=postgresql://user:pass@localhost:5432/jivika

🧭 Usage Guide
Sign Up or Login using Google OAuth or OTP authentication
Access Your Dashboard (Doctor or Patient view)
Chat with the AI Assistant for clinical help and health information
Upload X-ray or Wound Images to receive AI-based diagnostic predictions
Find Nearby Hospitals using integrated map services
Stay Updated with live health news and alerts

🚀 Deployment
Frontend: Deploy via Vercel or Netlify
Backend: Deploy Spring Boot on Render, AWS Elastic Beanstalk, or Railway
GenAI + ML Services: Deploy as Dockerized microservices on AWS ECS or GCP Cloud Run
Database: Managed PostgreSQL via Supabase, Neon, or RDS

For Docker:
bash
Copy code
docker-compose up --build

🤝 Contributing
We welcome contributions from the community!

Fork the repository
Create a new branch
Commit your changes
Open a Pull Request

Ensure adherence to coding standards and documentation practices.



