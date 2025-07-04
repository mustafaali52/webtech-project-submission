# 🏥 Hospital Management System

A full-stack, role-based hospital management web application built with **ASP.NET Core Web API** and **Angular**. The system enables admins and users to manage doctors, patients, and appointments with secure authentication and clean modular design.

---

## 🚀 Tech Stack

### Backend (.NET 7 / .NET 8)
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- AutoMapper
- JWT Bearer Authentication
- Role-based Authorization

### Frontend (Angular 15+)
- Angular CLI
- Bootstrap 5 (UI)
- Angular Router & Guards
- HTTP Interceptors
- LocalStorage Token Handling

---

## 👥 User Roles & Permissions

| Module                   | Admin | User |
|--------------------------|:-----:|:----:|
| View Doctors             | ✅    | ✅   |
| Add/Edit/Delete Doctors  | ✅    | ❌   |
| View Patients            | ✅    | ✅   |
| Add/Edit/Delete Patients | ✅    | ❌   |
| View Appointments        | ✅    | ✅   |
| Create Appointments      | ✅    | ❌   |
| Edit/Delete Appointments | ✅    | ❌   |

---

## 🧩 Project Structure

### Backend
```
📁 HospitalManagementSystem
│
├── HospitalManagementSystem.sln
├── backend-structure.txt
├── Program.cs
│
├── 📁 HospitalManagement.API
│   ├── HospitalManagement.API.csproj
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── HospitalManagement.API.http
│   ├── 📁 Controllers
│   │   ├── AppointmentsController.cs
│   │   ├── AuthController.cs
│   │   ├── DoctorsController.cs
│   │   └── PatientsController.cs
│   └── 📁 Middleware
│       └── GlobalExceptionHandler.cs
│
├── 📁 HospitalManagement.Application
│   ├── HospitalManagement.Application.csproj
│   ├── Class1.cs
│   ├── 📁 DTOs
│   │   ├── AppointmentDto.cs
│   │   ├── AuthDtos.cs
│   │   ├── DoctorDto.cs
│   │   └── PatientDtos.cs
│   ├── 📁 Interfaces
│   │   ├── IAppointmentService.cs
│   │   ├── IDoctorService.cs
│   │   └── IPatientService.cs
│   ├── 📁 Mapping
│   │   └── MappingProfile.cs
│   ├── 📁 Services
│   │   ├── AppointmentService.cs
│   │   ├── AuthService.cs
│   │   ├── DoctorService.cs
│   │   └── PatientService.cs
│   └── 📁 Validators
│       ├── AppointmentValidators.cs
│       ├── DoctorValidators.cs
│       └── PatientValidators.cs
│
├── 📁 HospitalManagement.Domain
│   ├── HospitalManagement.Domain.csproj
│   ├── Class1.cs
│   ├── 📁 DTOs
│   │   └── TokenDto.cs
│   ├── 📁 Entities
│   │   ├── Appointment.cs
│   │   ├── Doctor.cs
│   │   ├── Patient.cs
│   │   └── User.cs
│   ├── 📁 Exceptions
│   │   ├── AppointmentValidationException.cs
│   │   └── EntityNotFoundException.cs
│   └── 📁 Interfaces
│       ├── IApplicationDbContext.cs
│       ├── IAppointmentService.cs
│       ├── IAuthService.cs
│       ├── IDoctorService.cs
│       └── IPatientService.cs
│
├── 📁 HospitalManagement.Infrastructure
│   ├── HospitalManagement.Infrastructure.csproj
│   ├── appsettings.json
│   ├── Class1.cs
│   ├── HospitalDbContextFactory.cs
│   ├── 📁 Migrations
│   │   ├── 20250604182600_InitialCreate.cs
│   │   ├── 20250604220155_AddDoctorEntity.cs
│   │   ├── 20250604220259_UpdateAppointmentWithDoctor.cs
│   │   ├── HospitalDbContextModelSnapshot.cs
│   │   └── 📁 ApplicationDb
│   │       ├── 20250612135908_AddUserTable.cs
│   │       └── ApplicationDbContextModelSnapshot.cs
│   └── 📁 Persistence
│       ├── ApplicationDbContext.cs
│       └── ApplicationDbContextFactory.cs

```

### Frontend
```
📁 HMS-Frontend
│
├── .editorconfig
├── .gitignore
├── angular.json
├── frontend_structure.txt
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
│
├── 📁 .angular
├── 📁 .vscode
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
│
├── 📁 node_modules
│   └── .package-lock.json
│
└── 📁 src
    ├── favicon.ico
    ├── index.html
    ├── main.ts
    ├── styles.scss
    │
    └── 📁 app
        ├── app-routing.module.ts
        ├── app.component.html
        ├── app.component.scss
        ├── app.component.spec.ts
        ├── app.component.ts
        ├── app.module.ts
        │
        ├── 📁 appointment
        │   ├── appointment-routing.module.ts
        │   ├── appointment.module.ts
        │   ├── appointment.service.spec.ts
        │   ├── appointment.service.ts
        │   ├── 📁 appointment-form
        │   │   ├── appointment-form.component.html
        │   │   ├── appointment-form.component.scss
        │   │   └── appointment-form.component.ts
        │   └── 📁 appointment-list
        │       ├── appointment-list.component.html
        │       ├── appointment-list.component.scss
        │       └── appointment-list.component.ts
        │
        ├── 📁 auth
        │   ├── auth.service.spec.ts
        │   ├── auth.service.ts
        │   ├── 📁 login
        │   │   ├── login.component.html
        │   │   ├── login.component.scss
        │   │   ├── login.component.spec.ts
        │   │   └── login.component.ts
        │   └── 📁 register
        │       ├── register.component.html
        │       ├── register.component.scss
        │       ├── register.component.spec.ts
        │       └── register.component.ts
        │
        ├── 📁 dashboard
        │   ├── dashboard.component.html
        │   ├── dashboard.component.scss
        │   └── dashboard.component.ts
        │
        ├── 📁 doctor
        │   ├── doctor-routing.module.ts
        │   ├── doctor.module.ts
        │   ├── doctor.service.ts
        │   ├── 📁 doctor-form
        │   │   ├── doctor-form.component.html
        │   │   ├── doctor-form.component.scss
        │   │   └── doctor-form.component.ts
        │   └── 📁 doctor-list
        │       ├── doctor-list.component.html
        │       ├── doctor-list.component.scss
        │       └── doctor-list.component.ts
        │
        ├── 📁 patient
        │   ├── patient-routing.module.ts
        │   ├── patient.module.ts
        │   ├── patient.service.ts
        │   ├── 📁 patient-form
        │   │   ├── patient-form.component.html
        │   │   ├── patient-form.component.scss
        │   │   └── patient-form.component.ts
        │   └── 📁 patient-list
        │       ├── patient-list.component.html
        │       ├── patient-list.component.scss
        │       └── patient-list.component.ts
        │
        ├── 📁 shared
        │   ├── 📁 guards
        │   │   ├── auth.guard.ts
        │   │   ├── role.guard.spec.ts
        │   │   └── role.guard.ts
        │   ├── 📁 interceptors
        │   │   └── auth.interceptor.ts
        │   └── 📁 services
        │       └── token.service.ts
        │
        └── 📁 unauthorized
            ├── unauthorized.component.html
            ├── unauthorized.component.scss
            ├── unauthorized.component.spec.ts
            └── unauthorized.component.ts

    └── 📁 assets
        └── .gitkeep
```

---

## ⚙️ How to Run the Project

### Backend (.NET)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hospital-management-api.git
   cd hospital-management-api
   ```

2. Configure database:
   - Set your SQL Server connection string in `appsettings.json`

3. Apply migrations:
   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```
   Default API URL: `http://localhost:5230`

---

### Frontend (Angular)

1. Navigate to frontend directory:
   ```bash
   cd hms-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run Angular app:
   ```bash
   ng serve
   ```
   Open browser at: [http://localhost:4200](http://localhost:4200)

---

## 🔐 Authentication & Authorization

- Users and Admins can **register/login** using the `/register` and `/login` endpoints.
- JWT token is stored in `localStorage` and attached to each request via an **auth interceptor**.
- Route access is protected using **AuthGuard** and **RoleGuard**.
- Unauthorized users are redirected to `/unauthorized`.

---

## ✨ Features

- ✅ Register/Login with JWT
- ✅ Role-based access (Admin/User)
- ✅ Manage Doctors & Patients (Admin only)
- ✅ Book Appointments (Admin)
- ✅ View Appointments (All roles)
- ✅ Protected Routes using Angular Guards
- ✅ Modular Angular Structure (lazy loaded)
- ✅ Responsive Bootstrap UI

---

## 🔍 Sample API Endpoints

- `POST /api/Auth/register` — Register user/admin  
- `POST /api/Auth/login` — Get JWT token  
- `GET /api/Doctors` — Get all doctors  
- `POST /api/Appointments` — Book appointment  
- `GET /api/Appointments/patient/{id}` — Appointments by patient

---

## 🛡️ Security Notes

- All API routes are secured using `[Authorize]` and `[Authorize(Roles = "...")]` decorators.
- Tokens are required for all protected routes and are validated via middleware.
- Angular guards prevent route access on UI level.

---

## 🧪 Future Enhancements

- Add pagination & filters to lists  
- Doctor module login & dashboard  
- Appointment reminders/notifications  
- Export reports (PDF/Excel)  
- Audit logs for actions

---

## 📝 Developer Setup

Make sure you have:
- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js 18+](https://nodejs.org)
- [Angular CLI](https://angular.io/cli)
- SQL Server or SQLite

---

## 🧾 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgements

Thanks to all open-source contributors, Angular, Microsoft .NET teams, and Bootstrap creators.

---

## 📫 Contact

For queries or contributions:  
**Talal Yousuf** — [talalyousuf23@gmail.com](talalyousuf23@gmail.com)  
GitHub: [@talal2323](https://github.com/talal2323)