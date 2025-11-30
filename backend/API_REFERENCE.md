# API Reference Guide

Complete endpoint reference for the Clothing E-Commerce Backend API.

## Table of Contents

- [Base URL & Headers](#base-url--headers)
- [Authentication Endpoints](#authentication-endpoints)
- [Product Endpoints](#product-endpoints)
- [Cart Endpoints](#cart-endpoints)
- [Order Endpoints](#order-endpoints)
- [Response Formats](#response-formats)
- [HTTP Status Codes](#http-status-codes)

---

## Base URL & Headers

### Base URL
```
http://localhost:3000/api
```

### Common Headers

```
Content-Type: application/json
Accept: application/json
```

### Authentication Headers

For authenticated requests, include one of:

```
Authorization: Bearer <JWT_TOKEN>
```

OR

```
Cookie: token=<JWT_TOKEN>
```

### For Guest Cart

```
x-cart-token: <GUEST_CART_TOKEN>
```

OR

```
Cookie: cartToken=<GUEST_CART_TOKEN>
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "Member"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Field Requirements:**
- `name`: String, required, 1-100 characters
- `email`: String, required, valid email format, unique
- `password`: String, required, minimum 6 characters
- `role`: String, optional, either "Admin" or "Member" (default: "Member")

---

### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTMyMzQwMCwiZXhwIjoxNzA1MzI3MDAwfQ.GH5c5j8k9l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Member"
    }
  }
}
```

**Cookie Set:**
```
Set-Cookie: token=<JWT_TOKEN>; HttpOnly; Max-Age=3600; Path=/
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Product Endpoints

### GET /products

List all products with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `page` | integer | 1 | No | Page number for pagination |
| `limit` | integer | 10 | No | Items per page (max 100) |
| `search` | string | - | No | Search products by name/description |
| `category` | string | - | No | Filter by category (Men/Women/Kids) |
| `size` | string | - | No | Filter by size (S/M/L/XL) |
| `minPrice` | number | - | No | Minimum price filter |
| `maxPrice` | number | - | No | Maximum price filter |

**Example Requests:**

```
GET /products
GET /products?page=2&limit=20
GET /products?search=shirt&category=Men
GET /products?category=Women&minPrice=25&maxPrice=75
GET /products?size=M&sort=price&order=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Cotton Blue Shirt",
        "description": "Premium quality cotton blue shirt perfect for casual wear",
        "price": 49.99,
        "image": "https://cdn.example.com/shirt-blue.jpg",
        "category": "Men",
        "sizes": ["S", "M", "L", "XL"],
        "createdAt": "2024-01-10T08:15:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Denim Jacket",
        "description": "Classic denim jacket for all seasons",
        "price": 89.99,
        "image": "https://cdn.example.com/jacket-denim.jpg",
        "category": "Men",
        "sizes": ["M", "L", "XL"],
        "createdAt": "2024-01-12T09:20:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "meta": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### GET /products/:id

Get detailed information about a specific product.

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB product ID |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Cotton Blue Shirt",
    "description": "Premium quality cotton blue shirt perfect for casual wear",
    "price": 49.99,
    "image": "https://cdn.example.com/shirt-blue.jpg",
    "category": "Men",
    "sizes": ["S", "M", "L", "XL"],
    "createdAt": "2024-01-10T08:15:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## Cart Endpoints

All cart endpoints support both authenticated users and guests.

### GET /cart

Retrieve the current shopping cart.

**Headers:**
```
Authorization: Bearer <TOKEN>  (for authenticated users)
x-cart-token: <CART_TOKEN>     (for guests)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "user": "507f1f77bcf86cd799439011",
    "cartToken": "550e8400-e29b-41d4-a716-446655440000",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439021",
        "product": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Cotton Blue Shirt",
          "price": 49.99
        },
        "size": "M",
        "quantity": 2
      },
      {
        "_id": "507f1f77bcf86cd799439022",
        "product": {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Denim Jacket",
          "price": 89.99
        },
        "size": "L",
        "quantity": 1
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

**Guest Cart Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "user": null,
    "cartToken": "550e8400-e29b-41d4-a716-446655440000",
    "items": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Note:** If guest cart doesn't exist, a new one is created and cartToken is set as cookie.

---

### POST /cart/add

Add an item to the shopping cart.

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439012",
  "size": "M",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439021",
        "product": "507f1f77bcf86cd799439012",
        "size": "M",
        "quantity": 2
      }
    ],
    "updatedAt": "2024-01-15T11:50:00Z"
  }
}
```

**Field Requirements:**
- `productId`: String, required, valid MongoDB ID
- `size`: String, required, one of: S, M, L, XL
- `quantity`: Integer, required, minimum 1

**Error Response (400):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### PUT /cart/update

Update the quantity of an item in the cart.

**Request Body:**
```json
{
  "itemId": "507f1f77bcf86cd799439021",
  "quantity": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439021",
        "product": "507f1f77bcf86cd799439012",
        "size": "M",
        "quantity": 5
      }
    ],
    "updatedAt": "2024-01-15T11:55:00Z"
  }
}
```

**Field Requirements:**
- `itemId`: String, required, valid cart item ID
- `quantity`: Integer, required, minimum 1, maximum 999

**Error Response (404):**
```json
{
  "success": false,
  "message": "Cart item not found"
}
```

---

### POST /cart/remove

Remove an item from the shopping cart.

**Request Body:**
```json
{
  "itemId": "507f1f77bcf86cd799439021"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "items": [],
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

**Field Requirements:**
- `itemId`: String, required, valid cart item ID

**Error Response (404):**
```json
{
  "success": false,
  "message": "Cart item not found"
}
```

---

### POST /cart/clear

Clear all items from the shopping cart.

**Request Body:** (empty)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "items": [],
    "updatedAt": "2024-01-15T12:05:00Z"
  }
}
```

**Required Authentication:**
- User must be authenticated (JWT token required)

---

## Order Endpoints

All order endpoints require authentication.

### POST /orders/checkout

Create a new order from the current cart.

**Required Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "shipping": {
    "address": "123 Main Street, New York, NY 10001"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "user": "507f1f77bcf86cd799439011",
    "items": [
      {
        "product": "507f1f77bcf86cd799439012",
        "name": "Cotton Blue Shirt",
        "price": 49.99,
        "size": "M",
        "quantity": 2
      },
      {
        "product": "507f1f77bcf86cd799439013",
        "name": "Denim Jacket",
        "price": 89.99,
        "size": "L",
        "quantity": 1
      }
    ],
    "total": 189.97,
    "status": "Pending",
    "createdAt": "2024-01-15T12:10:00Z",
    "updatedAt": "2024-01-15T12:10:00Z"
  }
}
```

**Side Effects:**
- Order confirmation email sent to user
- User's cart is cleared
- Order status set to "Pending"

**Error Responses:**

```json
// 401: Authentication required
{
  "success": false,
  "message": "Authentication required"
}
```

```json
// 400: Empty cart
{
  "success": false,
  "message": "Cart is empty"
}
```

```json
// 500: Email sending failed (order still created)
{
  "success": false,
  "message": "Order created but confirmation email could not be sent"
}
```

---

### GET /orders

Retrieve all orders for the authenticated user.

**Required Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (Pending, Completed, Cancelled) |
| `sort` | string | Sort field (default: createdAt) |
| `order` | string | Sort order (asc/desc, default: desc) |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "user": "507f1f77bcf86cd799439011",
      "items": [
        {
          "product": "507f1f77bcf86cd799439012",
          "name": "Cotton Blue Shirt",
          "price": 49.99,
          "size": "M",
          "quantity": 2
        }
      ],
      "total": 99.98,
      "status": "Pending",
      "createdAt": "2024-01-15T12:10:00Z",
      "updatedAt": "2024-01-15T12:10:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439031",
      "user": "507f1f77bcf86cd799439011",
      "items": [
        {
          "product": "507f1f77bcf86cd799439013",
          "name": "Denim Jacket",
          "price": 89.99,
          "size": "L",
          "quantity": 1
        }
      ],
      "total": 89.99,
      "status": "Completed",
      "createdAt": "2024-01-14T10:20:00Z",
      "updatedAt": "2024-01-15T08:30:00Z"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## Response Formats

### Success Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": { /* Response payload */ }
}
```

### Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Pagination Metadata

When applicable, responses include metadata:

```json
{
  "success": true,
  "data": {
    "items": [ /* ... */ ],
    "meta": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

## HTTP Status Codes

| Code | Status | Usage |
|------|--------|-------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request creating resource |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Authentication required or invalid token |
| 403 | Forbidden | User lacks required permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate email) |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting & Throttling

Currently not implemented. Future versions may include:
- Rate limiting per IP address
- Request throttling
- API key authentication

---

## Pagination Details

### Default Values

- Page: 1
- Limit: 10 items per page
- Maximum limit: 100 items per page

### Calculating Total Pages

```
totalPages = Math.ceil(total / limit)
```

### Navigating Pages

```
Page 1: /products?page=1&limit=10
Page 2: /products?page=2&limit=10
Page 3: /products?page=3&limit=10
```

---

## Examples

### Example 1: User Registration & Login

**Step 1: Register**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }'
```

**Step 2: Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }'
```

---

### Example 2: Guest Cart Workflow

**Step 1: Get Cart (creates guest cart)**
```bash
curl http://localhost:3000/api/cart
```

**Step 2: Add Product**
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "x-cart-token: <cartToken>" \
  -d '{
    "productId": "507f1f77bcf86cd799439012",
    "size": "M",
    "quantity": 2
  }'
```

---

### Example 3: Authenticated User Checkout

**Step 1: Get Cart**
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Step 2: Checkout**
```bash
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{ "shipping": { "address": "123 Main St, NYC" } }'
```

**Step 3: View Orders**
```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Testing with Postman

A Postman collection is available in `postman_collection.json`:

1. Import the collection in Postman
2. Set `baseURL` variable to `http://localhost:3000/api`
3. Create environment variable for JWT token after login
4. Use pre-saved requests to test endpoints

---

## API Versioning

Current version: **v1** (implied in `/api/` prefix)

Future versions may use `/api/v2/`, `/api/v3/`, etc.

---

## Support & Documentation

- **Interactive Docs**: http://localhost:3000/api-docs (Swagger UI)
- **Main Documentation**: See README.md
- **Architecture**: See ARCHITECTURE.md
