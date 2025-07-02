# 🚀 BookCart Frontend - Quick Start Guide

## 📋 Prerequisites
- ✅ Node.js (v16 or higher) - **INSTALLED**
- ✅ npm (comes with Node.js)
- ✅ Backend API running on `http://localhost:5000`

## 🛠️ Setup Instructions

### Option 1: Automatic Setup (Recommended)

#### For Windows:
```bash
cd bookcart-frontend
setup.bat
```

#### For Linux/Mac:
```bash
cd bookcart-frontend
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Navigate to project directory:**
   ```bash
   cd bookcart-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Angular Material and additional packages:**
   ```bash
   npm install @angular/material @angular/cdk @angular/animations @auth0/angular-jwt --force
   ```

4. **Install Angular CLI globally:**
   ```bash
   npm install -g @angular/cli
   ```

## 🚀 Running the Application

1. **Start the development server:**
   ```bash
   ng serve
   ```

2. **Open your browser:**
   Navigate to `http://localhost:4200`

3. **Ensure backend is running:**
   Backend should be accessible at `http://localhost:5000`

## 🎯 Testing the Application

### Test User Accounts:
- **Admin User:**
  - Email: `admin@bookcart.com`
  - Password: `Admin@123`

- **Regular User:**
  - Email: `john.doe@example.com`
  - Password: `User@123`

### Test Flow:
1. **Browse Books** (No login required)
2. **Register/Login** 
3. **Add books to cart**
4. **Manage cart items**
5. **Admin: Manage books and users**

## 🔧 Available Commands

```bash
# Start development server
ng serve

# Build for production
ng build --prod

# Run tests
ng test

# Run linting
ng lint

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name
```

## 🌐 Application URLs

- **Frontend:** `http://localhost:4200`
- **Backend API:** `http://localhost:5000`

## 📱 Features to Test

### 🔐 Authentication:
- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Management
- ✅ Role-based Access

### 📚 Books:
- ✅ Browse all books
- ✅ Search books
- ✅ Filter by category
- ✅ Admin: Add/Edit/Delete books

### 🛒 Shopping Cart:
- ✅ Add books to cart
- ✅ Update quantities
- ✅ Remove items
- ✅ Clear cart

### 👤 User Management:
- ✅ User profile
- ✅ Admin: View all users

## 🐛 Troubleshooting

### Common Issues:

1. **Port 4200 already in use:**
   ```bash
   ng serve --port 4201
   ```

2. **Backend connection error:**
   - Ensure backend is running on port 5000
   - Check CORS settings in backend

3. **Module not found errors:**
   ```bash
   npm install
   ```

4. **Angular CLI not found:**
   ```bash
   npm install -g @angular/cli
   ```

## 📊 Project Structure

```
bookcart-frontend/
├── src/
│   ├── app/
│   │   ├── auth/              # Login, Register
│   │   ├── books/             # Book List, Add Book
│   │   ├── cart/              # Shopping Cart
│   │   ├── orders/            # Order Management
│   │   ├── admin/             # Admin Panel
│   │   └── shared/            # Services, Guards, Components
│   ├── styles.css             # Global Styles
│   └── index.html             # Main HTML
├── package.json               # Dependencies
├── angular.json               # Angular Configuration
└── README.md                  # Documentation
```

## 🎉 Success Indicators

✅ **Frontend running:** `http://localhost:4200` loads successfully
✅ **Backend connected:** Books load on homepage
✅ **Authentication working:** Can login/register
✅ **Cart functional:** Can add/remove items
✅ **Admin access:** Admin can manage books/users

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify backend is running and accessible
3. Ensure all dependencies are installed
4. Check network connectivity

## 🚀 Ready to Go!

Your BookCart Angular frontend is ready! Start with the setup script and enjoy your complete e-commerce application! 📚🛒
