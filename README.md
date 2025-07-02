# BookCart Application

A comprehensive book shopping cart application built with ASP.NET Core 8 using Entity Framework Code First approach.

## Features

### ✅ **Complete Backend API**
- **User Management**: Registration, login, profile management with ASP.NET Identity
- **Role-based Access**: Admin vs Normal User roles with JWT authentication
- **Book Management (Admin Only)**: Complete CRUD operations for books
- **Category Management**: Book categorization system
- **Shopping Cart**: Add, update, remove items from cart with quantity
- **Order Management**: Place orders, view order history, admin order management
- **Stock Management**: Automatic stock reduction on order placement
- **Security Features**: Password hashing, JWT tokens, role-based authorization

### Database Schema
- **Books**: Book information with categories
- **Categories**: Book categories
- **Users**: User profiles
- **Cart & CartItems**: Shopping cart functionality
- **Orders & OrderItems**: Order management

## Technology Stack

- **Framework**: ASP.NET Core 8
- **Database**: SQL Server with Entity Framework Core
- **Architecture**: Code First approach
- **API Documentation**: Swagger/OpenAPI
- **ORM**: Entity Framework Core 8

## Getting Started

### Prerequisites
- .NET 8 SDK
- SQL Server (LocalDB is sufficient for development)

### Installation

1. Clone the repository
2. Restore packages:
   ```bash
   dotnet restore
   ```

3. Update the database:
   ```bash
   dotnet ef database update
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

5. Open your browser and navigate to:
   - API: `http://localhost:5000`
   - Swagger UI: `http://localhost:5000/swagger`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Authenticated)
- `PUT /api/auth/profile` - Update user profile (Authenticated)
- `POST /api/auth/change-password` - Change password (Authenticated)
- `POST /api/auth/create-admin` - Create admin user (Admin only)
- `GET /api/auth/users` - Get all users (Admin only)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/category/{categoryId}` - Get books by category
- `GET /api/books/search?searchTerm={term}` - Search books
- `POST /api/books` - Create new book (Admin only)
- `PUT /api/books/{id}` - Update book (Admin only)
- `DELETE /api/books/{id}` - Delete book (Admin only)

### Categories
- `GET /api/categories` - Get all categories

### Cart (Authenticated)
- `GET /api/cart/user/{userId}` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/{cartItemId}` - Update cart item quantity
- `DELETE /api/cart/item/{cartItemId}` - Remove item from cart
- `DELETE /api/cart/user/{userId}/clear` - Clear user's cart

### Orders (Authenticated)
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/my-orders` - Get current user's orders
- `GET /api/orders/user/{userId}` - Get user orders (Admin or own orders)
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/{id}/status` - Update order status (Admin only)
- `POST /api/orders/{id}/cancel` - Cancel order
- `GET /api/orders/summary` - Get order summary (Admin only)
- `GET /api/orders/status/{status}` - Get orders by status (Admin only)

## Database Configuration

The application uses SQL Server LocalDB by default. You can modify the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookCartDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

## Sample Data & Default Users

The application includes seed data with:
- **5 categories**: Fiction, Non-Fiction, Science, Technology, Biography
- **3 sample books**: The Great Gatsby, To Kill a Mockingbird, Clean Code
- **2 legacy users**: John Doe, Jane Smith (for backward compatibility)
- **Default Admin User**:
  - Email: `admin@bookcart.com`
  - Password: `Admin@123`
  - Role: Admin

## Project Structure

```
BookCart/
├── Controllers/          # API Controllers
├── Data/                # DbContext and database configuration
├── DTOs/                # Data Transfer Objects
├── Models/              # Entity models
├── Services/            # Business logic layer
├── Migrations/          # Entity Framework migrations
├── Program.cs           # Application entry point
├── appsettings.json     # Configuration
└── BookCart.csproj      # Project file
```

## Next Steps

This backend is ready for frontend integration. You can now:

1. Build a React/Angular/Vue.js frontend
2. Add authentication and authorization
3. Implement payment processing
4. Add email notifications
5. Implement advanced search and filtering
6. Add product reviews and ratings

## Development Notes

- The application uses soft delete for books (IsActive flag)
- All prices are stored as decimal(18,2)
- Cart items automatically calculate total prices
- Foreign key relationships are properly configured
- CORS is enabled for frontend integration
