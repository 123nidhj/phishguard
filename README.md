<div align="center">

# 🛡️ PhishGuard
### Advanced AI-Powered Phishing Protection Suite

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-green?style=for-the-badge&logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100-teal?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)

*Protecting students and professionals from cyber threats with cutting-edge AI technology*

[🚀 Live Demo](https://phishguard-demo.vercel.app) • [📖 Documentation](docs/) • [🐛 Report Bug](issues/) • [💡 Feature Request](issues/)

</div>

---

## 🌟 **What is PhishGuard?**

PhishGuard is a comprehensive cybersecurity platform designed specifically for **students and educational institutions**. Using advanced AI and machine learning, we provide real-time protection against phishing emails, malicious links, and sophisticated scams targeting the academic community.

### ✨ **Key Features**

🔗 **Smart Link Scanner** - AI-powered URL analysis with real-time threat detection  
📧 **Email Security** - Advanced phishing email detection and filtering  
📄 **Document Analysis** - Scan PDFs and documents for malicious content  
🎓 **Educational Hub** - Interactive cybersecurity courses and awareness training  
💬 **Expert Chat Support** - Real-time Q&A with cybersecurity professionals  
📊 **University Dashboard** - Institution-wide security analytics and reporting  
🏆 **Gamified Learning** - Points, badges, and achievements for security education  

---

## 🎯 **Problem We Solve**

| Challenge | PhishGuard Solution |
|-----------|-------------------|
| 📈 **Rising Cyber Threats** | AI-powered real-time detection |
| 🎓 **Vulnerable Student Population** | Targeted educational content |
| 🏫 **Inadequate Campus Security** | Comprehensive institutional dashboards |
| 💰 **Financial Scams** | Specialized internship/job scam detection |
| 📱 **Mobile Vulnerabilities** | Cross-platform protection |

---

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Firebase Account
- Git

### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/Hari-hara7/PhishGuard.git
cd PhishGuard
```

### 2️⃣ **Frontend Setup (Next.js)**
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Add your Firebase config to .env.local

# Start development server
npm run dev
```

### 3️⃣ **Backend Setup (Python/FastAPI)**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train AI models
python train/train_email_model.py
python train/train_link_model.py
python train/train_doc_model.py

# Start API server
python -m uvicorn app.main:app --reload
```

### 4️⃣ **Access Application**
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Document Scanner**: http://localhost:8000/scan/doc

---

## 🏗️ **Architecture**

```mermaid

%%{init: {"theme":"dark"}}%%
graph TB
    style A fill:#222,color:#fff
    style B fill:#222,color:#fff
    style C fill:#222,color:#fff
    style D fill:#222,color:#fff
    style E fill:#222,color:#fff
    style F fill:#222,color:#fff
    style G fill:#222,color:#fff
    style H fill:#222,color:#fff
    style I fill:#222,color:#fff
    style J fill:#222,color:#fff
    style K fill:#222,color:#fff
    style L fill:#222,color:#fff

    A[🌐 Next.js Frontend] --> B[🔥 Firebase Auth]
    A --> C[🗄️ Firestore Database]
    A --> D[🤖 FastAPI Backend]
    A --> L[🧩 Chrome Extension]

    L --> B
    L --> C

    D --> E[📧 Email Scanner]
    D --> F[🔗 Link Analyzer] 
    D --> G[📄 Document Scanner]

    E --> H[🧠 AI/ML Models]
    F --> H
    G --> H

    I[👨‍🎓 Students] --> A
    J[👨‍🏫 Educators] --> A
    K[🏛️ Universities] --> A
    I --> L
    J --> L
    K --> L
```

### **Tech Stack**

#### **Frontend**
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom design system
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Deployment**: Vercel

#### **Backend**
- **API**: FastAPI (Python)
- **ML/AI**: scikit-learn, TensorFlow
- **Models**: Email classification, URL analysis, Document scanning
- **Security**: JWT tokens, rate limiting

---

## 💰 **Revenue Model**

### 📊 **Pricing Tiers**

| Plan | Price | Target | Features |
|------|-------|--------|----------|
| 🆓 **Free** | ₹0/forever | Students | Link scanning, Email protection, Browser extension |
| 🚀 **Pro** | ₹299/month | Individuals | Everything in Free + AI document scanning, Custom alerts |
| 🏢 **Enterprise** | ₹2,999/year | Universities | Institution dashboards, Analytics, API access |

### 💡 **Revenue Streams**

1. **🔹 Freemium Model** - Free core features → Premium upgrades
2. **🔹 University Subscriptions** - Institutional dashboards and analytics  
3. **🔹 API Integration** - Career platform integrations (Internshala, LinkedIn)
4. **🔹 Partnerships** - Cybersecurity company collaborations

---

## 📚 **Features Deep Dive**

### 🛡️ **AI-Powered Protection**
- **Real-time Scanning**: Instant analysis of URLs, emails, and documents
- **Machine Learning**: Continuously improving threat detection
- **Pattern Recognition**: Identifies sophisticated phishing attempts
- **Behavioral Analysis**: Detects anomalous patterns and social engineering

### 🎓 **Educational Platform**
- **Interactive Courses**: 12+ cybersecurity modules with quizzes
- **Gamification**: Points, badges, and leaderboards
- **Expert Support**: Live chat with security professionals
- **Knowledge Base**: Comprehensive security articles and guides

### 🏛️ **University Dashboard**
- **Campus-wide Analytics**: Real-time threat monitoring
- **Student Protection**: Bulk deployment and management
- **Incident Response**: Automated alerts and reporting
- **Policy Management**: Custom security rules and guidelines

---

## 🎯 **Use Cases**

### 👨‍🎓 **For Students**
- Protect against internship/job scams
- Learn cybersecurity fundamentals
- Get expert guidance on suspicious emails
- Secure browsing on campus networks

### 👨‍🏫 **For Educators**
- Integrate security awareness into curriculum
- Monitor student digital safety
- Access teaching resources and materials
- Track learning progress and engagement

### 🏛️ **For Universities**
- Deploy campus-wide protection
- Monitor institution-wide threats
- Generate compliance reports
- Educate entire student body

---

## 🔧 **API Endpoints**

### **Link Scanner**
```http
POST /scan/link
Content-Type: application/json

{
  "url": "https://suspicious-link.com",
  "user_id": "student123"
}
```

### **Email Analysis**
```http
POST /scan/email
Content-Type: application/json

{
  "sender": "recruiter@company.com",
  "subject": "Job Opportunity",
  "content": "Email content here..."
}
```

### **Document Scanner**
```http
POST /scan/doc
Content-Type: multipart/form-data

file: document.pdf
user_id: student123
```

---

## 🤝 **Contributing**

We welcome contributions from the community! 

### **Development Setup**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Contribution Guidelines**
- Follow TypeScript/Python best practices
- Add tests for new features
- Update documentation
- Ensure accessibility compliance

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Firebase** for authentication and database services
- **Vercel** for hosting and deployment
- **FastAPI** for the robust backend framework
- **Tailwind CSS** for the beautiful UI components
- **Open Source Community** for inspiration and resources
  
  ## 🙏 **Excel sheet**
---
https://excalidraw.com/#room=126d80d0306f25a0d279,AN6iAVsNa5ft1YKGiZR_CA
<div align="center">

### 🌟 **Star us on GitHub if this project helped you!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/PhishGuard?style=social)](https://github.com/yourusername/PhishGuard/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/PhishGuard?style=social)](https://github.com/yourusername/PhishGuard/network)

**Made with ❤️ for student cybersecurity**

[Website](https://phishguard.com) • [Twitter](https://twitter.com/phishguard) • [LinkedIn](https://linkedin.com/company/phishguard)

</div>
