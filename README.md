# 🧹 SWEEP - Student Work Experience and Engagement Platform

> **🚀 DEPLOYED AND LIVE:** https://sweep-lake.vercel.app/

A comprehensive platform connecting employers with students seeking real-world work experience. Employers can delegate company tasks to motivated students, while students earn SWEEP tokens as validation for their resumes and potential monetary compensation.

---

## 🌟 Features

### For Students

- 📋 **Task Discovery** - Browse available tasks from verified employers
- 🏆 **SWEEP Tokens** - Earn tokens as resume-worthy validation
- 💰 **Compensation** - Potential monetary rewards for completed tasks
- 📈 **Experience Building** - Gain practical work experience in your field

### For Employers

- 👥 **Student Network** - Access to motivated student talent pool
- 📊 **Task Management** - Create, assign, and track task progress
- ⚡ **Efficient Delegation** - Offload suitable tasks to students
- 🎯 **Quality Control** - Review and approve completed work

---

## 🚀 **LIVE DEPLOYMENT**

### 🔐 **Quick Access Credentials**

#### Student Account

```
📧 Email: student@sweep.com
🔑 Password: Student123!
```

#### Employer Account

```
📧 Email: employer@sweep.com
🔑 Password: Employer123!
```

---

## 🛠️ **Technology Stack**

### Backend (.NET)

- **Framework:** ASP.NET Core
- **Database:** SQL Server / Entity Framework Core
- **Authentication:** JWT Tokens
- **API:** RESTful Web API

### Frontend (React)

- **Framework:** React 19.1.0
- **Build Tool:** Vite 6.3.5
- **Routing:** React Router DOM 7.6.1
- **State Management:** Zustand 5.0.5
- **Styling:** Tailwind CSS 4.1.8
- **Authentication:** Clerk (5.31.8)
- **Icons:** Heroicons & Lucide React
- **Language:** TypeScript

---

## 📁 **Project Structure**

```
SWEEP/
├── SweepBE/              # Backend (.NET Core)
│   ├── Controllers/      # API Controllers
│   ├── Models/          # Data Models
│   ├── Services/        # Business Logic
│   └── Sweep.sln        # Solution File
└── SweepFE/             # Frontend (React)
    ├── src/
    │   ├── components/  # React Components
    │   ├── pages/       # Page Components
    │   └── services/    # API Services
    └── package.json
```

---

## 💻 **Local Development**

### Prerequisites

- **.NET 6.0+** SDK
- **Node.js 16+** and npm
- **SQL Server** (LocalDB or Express)

### Backend Setup

```bash
cd SweepBE
dotnet restore
dotnet run
```

### Frontend Setup

```bash
cd SweepFE
npm install
npm start
```

---

## 🧪 **Testing the Platform**

1. **Visit the deployed frontend URL**
2. **Login with provided credentials:**
   - Use student account to browse and apply for tasks
   - Use employer account to create and manage tasks
3. **Explore key features:**
   - Task creation and assignment
   - SWEEP token system
   - User dashboard and profiles

---

## 🔑 **Key Functionalities**

### Student Features

- ✅ User registration and profile setup
- ✅ Browse available tasks by category/skill
- ✅ Apply for tasks with cover letters
- ✅ Track task progress and submissions
- ✅ View earned SWEEP tokens
- ✅ Download completion certificates

### Employer Features

- ✅ Company profile creation
- ✅ Task posting with requirements
- ✅ Student application review
- ✅ Task assignment and monitoring
- ✅ Payment processing (if applicable)
- ✅ Performance rating system

---

## 👥 **Team**

**Group 10**

- Backend Development: .NET Core, Entity Framework
- Frontend Development: React.js, Modern UI/UX
- Database Design: Relational database with proper normalization
- Deployment: Cloud hosting with CI/CD pipeline

---

## 📧 **Contact**

For any questions or issues regarding the platform:

- Create an issue in this repository
- Contact the development team through university channels

---

## 📄 **License**

This project is developed for educational purposes as part of Web Technology coursework.

---

**👉 Ready to experience SWEEP? Visit the live deployment and login with the provided credentials!**
