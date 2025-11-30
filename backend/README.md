# Clothing E-Commerce Backend API

A RESTful API backend for a clothing e-commerce platform built with Node.js, Express, and MongoDB. The API provides authentication, product catalog, shopping cart, and order management functionalities.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)

---

## Overview

This backend application manages all server-side logic for a clothing e-commerce platform, including:

- **User Authentication & Authorization** - Register and login with JWT tokens
- **Product Catalog** - Browse products with filtering, search, and pagination
- **Shopping Cart** - Support for both authenticated users and guest checkouts
- **Order Management** - Checkout process and order history
- **Email Notifications** - Order confirmation emails

The API follows a clean architecture pattern with:
- **Controllers** - Handle HTTP requests/responses
- **Usecases** - Business logic layer
- **Repositories** - Database access layer
- **Models** - MongoDB schema definitions

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express** | ^4.21.2 | Web framework |
| **MongoDB** | Latest | Database |
| **Mongoose** | ^9.0.0 | ODM (Object Data Mapper) |
| **JWT** | ^9.0.2 | Authentication tokens |
| **Bcrypt** | ^6.0.0 | Password hashing |
| **Nodemailer** | ^7.0.11 | Email sending |
| **Swagger** | ^6.2.8 | API documentation |
| **Morgan** | ^1.10.1 | HTTP request logging |
| **CORS** | ^2.8.5 | Cross-origin requests |
| **Cookie Parser** | ^1.4.7 | Cookie handling |

---

## Project Structure

```
backend/
├── src/
│   ├── index.js                          # Main application entry point
│   ├── apps/                              # Feature modules
│   │   ├── auth/                         # Authentication module
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.js
│   │   │   ├── models/
│   │   │   │   └── auth.model.js
│   │   │   ├── repositories/
│   │   │   │   └── auth.repository.js
│   │   │   ├── routes/
│   │   │   │   └── auth.route.js
│   │   │   └── usecases/
│   │   │       └── auth.usecase.js
│   │   ├── products/                     # Product catalog module
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── usecases/
│   │   ├── cart/                         # Shopping cart module
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── usecases/
│   │   └── orders/                       # Order management module
│   │       ├── controllers/
│   │       ├── models/
│   │       ├── repositories/
│   │       ├── routes/
│   │       └── usecases/
│   ├── infrastructures/
│   │   └── config/
│   │       └── swagger.config.js         # Swagger/OpenAPI configuration
│   ├── middlewares/
│   │   ├── auth.middleware.js            # Authentication middleware
│   │   └── error.middleware.js           # Global error handler
│   ├── utils/
│   │   ├── pagination.utils.js           # Pagination utilities
│   │   └── search.utils.js               # Search/text matching utilities
│   └── seeders/
│       ├── products.seed.js              # Product seed data
│       └── runSeed.js                    # Seed runner script
├── .env                                  # Environment variables
├── .gitignore                            # Git ignore rules
├── package.json                          # Dependencies and scripts
└── postman_collection.json               # Postman API collection

```

---

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Environment Setup](#environment-setup))

4. **Run the application**
   ```bash
   npm start
   ```

---

## Environment Setup

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing-brand?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FROM_EMAIL=no-reply@clothingbrand.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:4000
```

### Notes on Configuration:

- **JWT_SECRET**: Use a strong, random string (min 32 characters recommended)
- **EMAIL_PASS**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password
- **MONGO_URI**: Update with your MongoDB connection string
- **FRONTEND_URL**: Set to your frontend application URL for CORS configuration

---

## Running the Application

### Development Mode

```bash
npm start
```

The server will run on `http://localhost:3000` (or the PORT specified in `.env`)

### Available Scripts

- `npm start` - Start the server
- `npm run seed` - Run database seeders (currently incomplete)

### Server Output

Upon successful startup, you should see:

```
Connected to MongoDB
Server running on port 3000
```

The API documentation is available at: `http://localhost:3000/api-docs`

---

## API Documentation

### Interactive Documentation

Swagger UI is automatically generated and available at:

```
http://localhost:3000/api-docs
```

This provides an interactive interface to test all API endpoints.

### Base URL

```
http://localhost:3000/api
```

### Health Check

```
GET /health
```

Returns `{ ok: true }` to verify the server is running.

---

## Architecture

### Design Pattern: Clean Architecture with Layered Approach

```
Request Flow:
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Request                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
                    ┌─────────────┐
                    │  Middleware │ (Auth, CORS, Error handling)
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │ Controller  │ (Handle HTTP I/O)
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │   Usecase   │ (Business Logic)
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │ Repository  │ (Database Access)
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │   Database  │ (MongoDB)
                    └─────────────┘
```

### Layer Responsibilities

1. **Controller Layer**
   - Receives HTTP requests
   - Validates input format
   - Calls usecase methods
   - Formats and sends responses

2. **Usecase Layer**
   - Contains business logic
   - Validates business rules
   - Coordinates repository calls
   - Handles application errors

3. **Repository Layer**
   - Handles all database operations
   - Abstracts MongoDB queries
   - Implements CRUD operations
   - Database error handling

4. **Model Layer**
   - Defines MongoDB schemas
   - Sets up indexes
   - Implements hooks (pre-save, etc.)

---

## Database Models

### User Model

**Collection**: `users`

```javascript
{
  _id: ObjectId,
  name: String (indexed),
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  role: Enum ["Admin", "Member"] (default: "Member"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**: name, email, text search on name & email

**Methods**:
- `comparePassword(candidate)` - Verify password against hash

---

### Product Model

**Collection**: `products`

```javascript
{
  _id: ObjectId,
  name: String (indexed),
  description: String,
  price: Number (indexed),
  image: String (optional),
  category: Enum ["Men", "Women", "Kids"] (indexed),
  sizes: [String] (values: "S", "M", "L", "XL"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**: name, description, price, category, text search

---

### Cart Model

**Collection**: `carts`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: "User", nullable, indexed),
  cartToken: String (nullable, indexed) - for guest carts,
  items: [{
    product: ObjectId (ref: "Product"),
    size: Enum ["S", "M", "L", "XL"],
    quantity: Number (min: 1)
  }],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**: user, cartToken

**Features**:
- Supports both authenticated users (via user ID) and guests (via cartToken)
- Each item tracks product, selected size, and quantity

---

### Order Model

**Collection**: `orders`

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: "User", required, indexed),
  items: [{
    product: ObjectId (ref: "Product"),
    name: String,
    price: Number,
    size: String,
    quantity: Number
  }],
  total: Number (required),
  status: Enum ["Pending", "Completed", "Cancelled"] (default: "Pending"),
  createdAt: Date (auto, indexed desc),
  updatedAt: Date (auto)
}
```

**Indexes**: user, createdAt (descending)

---

## API Endpoints

### Authentication (`/api/auth`)

#### Register New User

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "Member" (optional, defaults to "Member")
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### User Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Member"
    }
  }
}
```

**Cookie Set**: `token` (httpOnly, maxAge: 1 hour)

---

### Products (`/api/products`)

#### List Products with Filters & Pagination

```
GET /api/products?page=1&limit=10&search=shirt&category=Men&minPrice=20&maxPrice=100
```

**Query Parameters**:
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 10, max: 100) - Items per page
- `search` (string) - Search by name or description (case-insensitive)
- `category` (string) - Filter by category: "Men", "Women", "Kids"
- `size` (string) - Filter by size: "S", "M", "L", "XL"
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "name": "Blue Shirt",
        "description": "Cotton blue shirt",
        "price": 49.99,
        "image": "url/to/image.jpg",
        "category": "Men",
        "sizes": ["M", "L", "XL"],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "meta": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

---

#### Get Product by ID

```
GET /api/products/:id
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Blue Shirt",
    "description": "Cotton blue shirt",
    "price": 49.99,
    "image": "url/to/image.jpg",
    "category": "Men",
    "sizes": ["M", "L", "XL"],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Shopping Cart (`/api/cart`)

All cart endpoints require authentication (optional for guests).

#### Get Current Cart

```
GET /api/cart
Headers:
  Authorization: Bearer <token>  (for authenticated users)
  x-cart-token: <guest_token>    (for guests)
Cookie:
  cartToken: <guest_token>       (alternative for guests)
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user": null,
    "cartToken": "uuid-1234-5678-9abc",
    "items": [
      {
        "_id": "item_id",
        "product": {
          "_id": "product_id",
          "name": "Blue Shirt",
          "price": 49.99
        },
        "size": "M",
        "quantity": 2
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Note**: When a guest accesses the cart, a `cartToken` cookie is automatically set (30 days expiration).

---

#### Add Item to Cart

```
POST /api/cart/add
Content-Type: application/json
Headers:
  Authorization: Bearer <token>  (for users)
  x-cart-token: <guest_token>    (for guests)

{
  "productId": "product_id",
  "size": "M",
  "quantity": 2
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "items": [
      {
        "_id": "item_id",
        "product": "product_id",
        "size": "M",
        "quantity": 2
      }
    ]
  }
}
```

---

#### Update Item Quantity

```
PUT /api/cart/update
Content-Type: application/json
Headers:
  Authorization: Bearer <token>

{
  "itemId": "item_id",
  "quantity": 5
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": { /* updated cart */ }
}
```

---

#### Remove Item from Cart

```
POST /api/cart/remove
Content-Type: application/json
Headers:
  Authorization: Bearer <token>

{
  "itemId": "item_id"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": { /* updated cart */ }
}
```

---

#### Clear Cart

```
POST /api/cart/clear
Headers:
  Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "items": []
  }
}
```

---

### Orders (`/api/orders`)

All order endpoints require authentication.

#### Checkout (Create Order)

```
POST /api/orders/checkout
Headers:
  Authorization: Bearer <token>  (required)
Content-Type: application/json

{
  "shipping": {
    "address": "123 Main St, City, State 12345"
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user": "user_id",
    "items": [
      {
        "product": "product_id",
        "name": "Blue Shirt",
        "price": 49.99,
        "size": "M",
        "quantity": 2
      }
    ],
    "total": 99.98,
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Side Effects**:
- Order confirmation email sent to user
- User's cart is cleared after successful checkout

---

#### List User's Orders

```
GET /api/orders
Headers:
  Authorization: Bearer <token>  (required)
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "user": "user_id",
      "items": [ /* ... */ ],
      "total": 99.98,
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Authentication

### JWT Implementation

- **Algorithm**: HS256
- **Token Location**: HTTP-only cookie or Authorization header
- **Expiration**: 1 hour (configurable via `JWT_EXPIRES_IN`)
- **Storage**: Secure HTTP-only cookies for web browsers

### Login Flow

1. User submits email and password
2. Backend validates credentials
3. JWT token is generated with user ID
4. Token is sent in response body AND set as HTTP-only cookie
5. Subsequent requests include token in:
   - `Authorization: Bearer <token>` header, OR
   - `token` cookie

### Middleware Functions

#### `authenticate(req, res, next)`
- Optional authentication
- Verifies JWT token if present
- Sets `req.user` if valid, otherwise `req.user = null`
- Always calls `next()` - request proceeds as guest if no valid token

#### `requireAuth(req, res, next)`
- Required authentication
- Throws 401 error if `req.user` is not set
- Used on protected endpoints (checkout, orders)

#### `authorize(roles = [])`
- Role-based authorization
- Returns middleware function
- Checks if user's role is in allowed list
- Throws 403 error if user lacks required role

### Guest Cart Authentication

Guests can add items to their cart without logging in:

1. Guest makes request to cart endpoints
2. If no `cartToken` cookie/header exists, a new UUID is generated
3. `cartToken` is returned and set as a cookie
4. Subsequent requests must include same `cartToken`
5. Carts persist by `cartToken` instead of user ID

When a guest logs in, their guest cart remains separate until explicitly migrated (optional feature).

---

## Error Handling

### Global Error Handler Middleware

All errors are caught by `errorHandler` middleware and formatted consistently:

**Error Response Format**:
```json
{
  "success": false,
  "message": "Error description"
}
```

**HTTP Status Codes**:
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Examples

#### Missing Authentication
```json
{
  "success": false,
  "message": "Authentication required"
}
```

#### Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### Product Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### Logging

- HTTP requests logged using Morgan in development mode
- Errors logged to console with full stack trace
- Email sending errors logged but don't block response

---

## Utilities

### Pagination Utility

Located in `utils/pagination.utils.js`

```javascript
getPagination(query)
// Returns: { page, limit, skip }
// - page: validated page number (minimum 1)
// - limit: validated limit (1-100, default 10)
// - skip: calculated offset for database query

getMeta(total, page, limit)
// Returns: { total, page, limit, totalPages }
// Used to construct pagination metadata in responses
```

### Search Utility

Located in `utils/search.utils.js`

```javascript
buildTextSearch(query, fields)
// Builds MongoDB text search query
// - query: query object containing 'search' property
// - fields: array of field names to search in
// Returns MongoDB $or filter for case-insensitive regex search
// Example: buildTextSearch({ search: 'shirt' }, ['name', 'description'])
```

---

## Deployment Considerations

### Production Checklist

- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Configure MongoDB Atlas with IP whitelisting
- [ ] Set `NODE_ENV=production`
- [ ] Use production email credentials
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure CORS for production domain only
- [ ] Set up monitoring and error tracking
- [ ] Configure database backups
- [ ] Use environment-specific `.env` files

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://prod_user:password@prod-cluster.mongodb.net/clothing-brand
JWT_SECRET=very-long-random-string-at-least-32-characters
FRONTEND_URL=https://yourdomain.com
```

---

## Common Issues & Troubleshooting

### MongoDB Connection Error
**Issue**: "MongoDB connection error"
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure network access is allowed

### JWT Token Invalid
**Issue**: 401 Unauthorized
- Token may be expired (1 hour default)
- Check `JWT_SECRET` matches between encode/decode
- Verify token format in Authorization header

### CORS Issues
**Issue**: Request blocked by CORS policy
- Update `FRONTEND_URL` in `.env`
- Ensure frontend and backend URLs match

### Cart Not Persisting (Guests)
**Issue**: Cart clears after page refresh
- Ensure browser accepts cookies
- Check `cartToken` cookie is being set
- Verify `sameSite` cookie policy settings

---

## Future Enhancements

- [ ] Admin panel for product management
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Order tracking and shipping integration
- [ ] User profile and preferences
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Promotional codes and discounts
- [ ] Inventory management
- [ ] Admin analytics dashboard
- [ ] 2FA authentication

---

## Contributing

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit changes (`git commit -am 'Add your feature'`)
3. Push to branch (`git push origin feature/your-feature`)
4. Create Pull Request

---

## License

ISC

---



**Production API Docs**: https://clothing-brand-e-commerce-backend.onrender.com/api-docs 
