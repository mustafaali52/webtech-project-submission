# 🎉 Event Management System

An end-to-end **Event Management System** web application built using **.NET Core (backend)** and **Angular 19 (frontend)** with **JWT-based Role Authentication**.

---

## 🛠️ Tech Stack

### Backend (.NET Core)
- ASP.NET Core Web API
- Entity Framework Core (EF Core)
- JWT Authentication & Role-based Authorization
- Runs on `http://localhost:4712`

### Frontend (Angular 19)
- Angular CLI 19
- Angular Material UI Components
- Auth Guards for route protection
- Runs on `http://localhost:4200`

---

## 🚀 Features

- 🔐 JWT Authentication with Role-Based Access (Admin, Organizer, Attendee)
- 🧑‍💼 Admin can manage users, roles, and event types
- 📅 Organizers can create, update, delete their events
- 🙋 Attendees can view and register for events
- 📊 Dashboards tailored to each role
- 🔎 Event filtering, search, and responsive UI

---

## 📁 Project Structure

### Backend (.NET API)
\`\`\`
/EventManagement.API
│
├── Controllers/
├── Models/
├── DTOs/
├── Services/
├── Middleware/
├── Authentication/
└── Program.cs
\`\`\`

### Frontend (Angular)
\`\`\`
/event-management-frontend
│
├── src/
│   ├── app/
│   │   ├── auth/           # login/register components
│   │   ├── guards/         # AuthGuards for routes
│   │   ├── components/     # reusable UI components
│   │   ├── dashboard/      # role-specific dashboards
│   │   └── services/       # API communication
│   └── environments/
└── angular.json
\`\`\`

---

## ⚙️ Getting Started

### 📌 Prerequisites
- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js v18+](https://nodejs.org/)
- Angular CLI 16+
- SQL Server or SQLite

---

### 🔧 Backend Setup

\`\`\`bash
cd EventManagement.API
dotnet restore
dotnet ef database update
dotnet run
\`\`\`

API runs at: [http://localhost:4712](http://localhost:4712)

Swagger: [http://localhost:4712/swagger](http://localhost:4712/swagger)

---

### 🌐 Frontend Setup

\`\`\`bash
cd event-management-frontend
npm install
ng serve
\`\`\`

App runs at: [http://localhost:4200](http://localhost:4200)

---

## 🔐 Authentication Flow

1. User logs in via Angular frontend
2. Backend issues a **JWT token** with role claim
3. Token is stored in \`localStorage\`
4. Token added to API requests by Angular HTTP Interceptor
5. Auth Guards restrict access based on roles

---

## 🌍 Environment Configuration

### Backend - \`appsettings.Development.json\`

\`\`\`json
"Jwt": {
  "Key": "YourSuperSecretKeyHere",
  "Issuer": "http://localhost:4712",
  "Audience": "http://localhost:4200"
}
\`\`\`

### Frontend - \`environment.ts\`

\`\`\`ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4712/api'
};
\`\`\`

---

## 🤝 Contributing

Feel free to fork the repo, raise issues, and submit pull requests.

---
