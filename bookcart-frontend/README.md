# BookCart Frontend - Angular Application

A modern, responsive Angular frontend for the BookCart online bookstore application.

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT token-based authentication
- Role-based access control (Admin/User)
- Protected routes with guards

### 📚 Book Management
- Browse and search books
- Filter by categories
- Sort by various criteria
- Admin: Add, edit, delete books

### 🛒 Shopping Cart
- Add books to cart
- Update quantities
- Remove items
- Real-time cart updates

### 👤 User Features
- User profile management
- Order history (coming soon)
- Responsive design for all devices

### 🔧 Admin Features
- User management
- Book inventory management
- Admin dashboard

## 🛠️ Technology Stack

- **Framework**: Angular 17
- **UI Library**: Angular Material
- **Authentication**: JWT with @auth0/angular-jwt
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with guards
- **Styling**: CSS with Material Design

## 📁 Project Structure

```
bookcart-frontend/
├── src/
│   ├── app/
│   │   ├── auth/                    # Authentication components
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── books/                   # Book-related components
│   │   │   ├── book-list/
│   │   │   └── book-add/
│   │   ├── cart/                    # Shopping cart
│   │   ├── orders/                  # Order management
│   │   ├── admin/                   # Admin components
│   │   │   └── user-management/
│   │   ├── shared/                  # Shared components & services
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   └── unauthorized/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
│   ├── styles.css
│   └── index.html
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone or download the project**
   ```bash
   cd bookcart-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional packages**
   ```bash
   npm install @angular/material @angular/cdk @angular/animations @auth0/angular-jwt --force
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🔧 Configuration

### Backend API Configuration
The frontend is configured to connect to the backend API at `http://localhost:5000`. 

To change this, update the API URLs in the service files:
- `src/app/shared/services/auth.service.ts`
- `src/app/shared/services/books.service.ts`
- `src/app/shared/services/cart.service.ts`

### Environment Configuration
For production deployment, create environment files:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## 🎯 Key Components

### Authentication
- **LoginComponent**: User login with email/password
- **RegisterComponent**: New user registration
- **AuthService**: Handles authentication logic
- **AuthGuard**: Protects authenticated routes
- **RoleGuard**: Protects admin routes

### Books
- **BookListComponent**: Display and search books
- **BookAddComponent**: Admin book creation/editing
- **BooksService**: Book-related API calls

### Cart
- **CartComponent**: Shopping cart management
- **CartService**: Cart operations and state management

### Navigation
- **NavbarComponent**: Main navigation with search and user menu

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token received and stored in localStorage
3. AuthInterceptor automatically adds token to API requests
4. Guards protect routes based on authentication/role
5. Token expiration handled automatically

## 🛡️ Security Features

- JWT token-based authentication
- Automatic token refresh handling
- Role-based route protection
- HTTP interceptor for secure API calls
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎨 UI/UX Features

- Material Design components
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback
- Intuitive navigation and user flow

## 🚀 Build and Deployment

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --prod
```

### Serve Production Build
```bash
ng serve --prod
```

## 🧪 Testing

### Run Unit Tests
```bash
ng test
```

### Run End-to-End Tests
```bash
ng e2e
```

## 📦 Available Scripts

- `ng serve` - Start development server
- `ng build` - Build the project
- `ng test` - Run unit tests
- `ng lint` - Run linting
- `ng e2e` - Run end-to-end tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Contact the development team

## 🔄 Future Enhancements

- Order management system
- Payment integration
- Advanced search filters
- Book recommendations
- User reviews and ratings
- Wishlist functionality
- Email notifications
