# NestJS Auth & Products API

This project demonstrates a basic authentication system (JWT-based) and a product management module using NestJS, TypeORM, Mysql, and role-based access control.

## Features

- **User Registration** with hashed passwords
- **User Login** returning a JWT
- **Role-Based Access** (admin vs. user)
- **CRUD** operations for products
- **Swagger** documentation
- **Jest** unit tests with coverage

## Getting Started

### Prerequisites

- Node.js >= 14
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TariqAyman/udtn-task
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start:dev
   ```
4. The API will be available at `http://localhost:3000`  
   Swagger docs at `http://localhost:3000/api-doc`

### Testing

```bash
npm run test
# or for coverage
npm run test:cov
```

### API Endpoints

1. **Auth**
   - `POST /auth/register` – Register a new user
   - `POST /auth/login` – Login and retrieve a JWT
2. **Products**
   - `POST /products` (Admin only) – Create a new product
   - `GET /products` – Get all products
   - `GET /products/:id` – Get product by ID
   - `PUT /products/:id` (Admin only) – Update product
   - `DELETE /products/:id` (Admin only) – Delete product

### Role-Based Access

- **Admin** can perform all operations on products.
- **User** can only view products (cannot create, update or delete).

### Technologies Used

- **NestJS** (v9+)
- **TypeORM** with **mysql**
- **JWT** (via `@nestjs/jwt`)
- **Passport**
- **class-validator** & **class-transformer**
- **Swagger** for API docs
- **Jest** for unit tests
