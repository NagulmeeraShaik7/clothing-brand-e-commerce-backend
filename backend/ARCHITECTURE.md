# Architecture & Design Patterns

Detailed documentation of the backend architecture, design patterns, and code organization.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Layered Architecture](#layered-architecture)
- [Design Patterns Used](#design-patterns-used)
- [Module Structure](#module-structure)
- [Request Flow](#request-flow)
- [Dependency Injection](#dependency-injection)
- [Error Handling Strategy](#error-handling-strategy)
- [Database Design](#database-design)
- [Security Considerations](#security-considerations)
- [Best Practices](#best-practices)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                       │
│                  (Web, Mobile, Desktop)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ↓
        ┌────────────────────────────────────────────┐
        │         Express Application                │
        │     ┌──────────────────────────────────┐   │
        │     │   CORS & Request Middleware      │   │
        │     │   Morgan (Logging)               │   │
        │     │   Cookie Parser                  │   │
        │     └──────────────────────────────────┘   │
        │                    │                        │
        │                    ↓                        │
        │     ┌──────────────────────────────────┐   │
        │     │     Router & Route Handlers       │   │
        │     │  - auth.route.js                 │   │
        │     │  - product.route.js              │   │
        │     │  - cart.route.js                 │   │
        │     │  - order.route.js                │   │
        │     └──────────────────────────────────┘   │
        │                    │                        │
        │                    ↓                        │
        │     ┌──────────────────────────────────┐   │
        │     │     Authentication Middleware     │   │
        │     │  - JWT verification              │   │
        │     │  - Guest cart tokens             │   │
        │     └──────────────────────────────────┘   │
        │                    │                        │
        │                    ↓                        │
        │   ┌─────────────────────────────────────┐  │
        │   │     CONTROLLERS (Request Handlers)   │  │
        │   │  - AuthController                   │  │
        │   │  - ProductController                │  │
        │   │  - CartController                   │  │
        │   │  - OrderController                  │  │
        │   └─────────────────────────────────────┘  │
        │                    │                        │
        │                    ↓                        │
        │   ┌─────────────────────────────────────┐  │
        │   │     USECASES (Business Logic)       │  │
        │   │  - AuthUsecase                      │  │
        │   │  - ProductUsecase                   │  │
        │   │  - CartUsecase                      │  │
        │   │  - OrderUsecase                     │  │
        │   └─────────────────────────────────────┘  │
        │                    │                        │
        │                    ↓                        │
        │   ┌─────────────────────────────────────┐  │
        │   │   REPOSITORIES (Data Access)        │  │
        │   │  - AuthRepository                   │  │
        │   │  - ProductRepository                │  │
        │   │  - CartRepository                   │  │
        │   │  - OrderRepository                  │  │
        │   └─────────────────────────────────────┘  │
        │                    │                        │
        │                    ↓                        │
        │   ┌─────────────────────────────────────┐  │
        │   │     MONGOOSE MODELS (ODM Layer)     │  │
        │   │  - User Model                       │  │
        │   │  - Product Model                    │  │
        │   │  - Cart Model                       │  │
        │   │  - Order Model                      │  │
        │   └─────────────────────────────────────┘  │
        └────────────────────┬─────────────────────┘
                             │
                             ↓
        ┌────────────────────────────────────────────┐
        │            MongoDB Database                │
        │   ┌──────────────────────────────────┐     │
        │   │   Collections:                    │     │
        │   │  - users                          │     │
        │   │  - products                       │     │
        │   │  - carts                          │     │
        │   │  - orders                         │     │
        │   └──────────────────────────────────┘     │
        └────────────────────────────────────────────┘
```

---

## Layered Architecture

### Layer Responsibilities

#### 1. **Presentation Layer (Routes & Controllers)**

**Responsibility**: Handle HTTP protocol and request/response formatting

**Components**:
- Routes (e.g., `auth.route.js`) - Define HTTP endpoints
- Controllers (e.g., `auth.controller.js`) - Process HTTP requests

**Characteristics**:
- Minimal business logic
- Input validation (basic format checking)
- Response formatting and status codes
- Error delegation to middleware

**Example Flow**:
```
HTTP Request
    ↓
Route Matcher
    ↓
Controller Method
    ↓
Usecase Call
    ↓
Response Formatting
    ↓
HTTP Response
```

#### 2. **Business Logic Layer (Usecases)**

**Responsibility**: Implement core application logic and business rules

**Components**:
- Usecase classes (e.g., `auth.usecase.js`) - Orchestrate business workflows

**Characteristics**:
- Complex business logic
- Validation of business rules
- Coordinate multiple repository calls
- Handle transactions (when needed)
- Technology-agnostic

**Example**:
```javascript
async checkout({ user, cartToken }) {
  // 1. Get user's cart
  const cart = await this.repository.getCart(user, cartToken);
  
  // 2. Validate cart (business rule)
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }
  
  // 3. Calculate totals
  const total = this.calculateTotal(cart.items);
  
  // 4. Create order
  const order = await this.repository.createOrder({
    user, items: cart.items, total
  });
  
  // 5. Clear cart (side effect)
  await this.repository.clearCart(user, cartToken);
  
  // 6. Send email
  await this.sendConfirmationEmail(user, order);
  
  return order;
}
```

#### 3. **Data Access Layer (Repositories)**

**Responsibility**: Abstract database operations

**Components**:
- Repository classes (e.g., `auth.repository.js`) - Database queries and operations

**Characteristics**:
- Pure database queries
- No business logic
- Error handling (database errors)
- Query optimization
- Reusable database operations

**Example**:
```javascript
async findByEmail(email) {
  try {
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    });
    return user;
  } catch (err) {
    throw new Error(`Database error: ${err.message}`);
  }
}
```

#### 4. **Data Model Layer (Mongoose Models)**

**Responsibility**: Define data structure and persistence

**Components**:
- Mongoose schemas (e.g., `auth.model.js`) - Database schemas and hooks

**Characteristics**:
- Schema definitions
- Field validations
- Indexes for performance
- Pre/post hooks for data transformation
- Instance methods

**Example**:
```javascript
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};
```

---

## Design Patterns Used

### 1. **MVC (Model-View-Controller)**

**Implementation**: Express routes and controllers

- **Model**: Mongoose schemas (data layer)
- **View**: JSON responses (handled by controllers)
- **Controller**: Controller classes handling requests

**Benefit**: Clear separation of concerns

---

### 2. **Repository Pattern**

**Implementation**: Repository classes abstract database operations

```javascript
// Controller doesn't know about database
const user = await authUsecase.register(userData);

// Usecase delegates to repository
const savedUser = await authRepository.create(userData);

// Repository knows about database
User.create(userData);
```

**Benefit**:
- Easy to swap database implementation
- Centralized query logic
- Improved testability

---

### 3. **Dependency Injection**

**Implementation**: Constructor injection in routes

```javascript
// Route creates instances with dependencies
const authRepo = new AuthRepository();
const authUsecase = new AuthUsecase(authRepo);
const authController = new AuthController(authUsecase);

router.post("/login", authController.login);
```

**Benefit**:
- Loose coupling
- Easy to test with mocks
- Flexible configuration

---

### 4. **Middleware Pattern**

**Implementation**: Express middleware functions

```javascript
// Authentication middleware
export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authRepo.findById(payload.id);
    req.user = user;
    next();
  } catch (err) {
    req.user = null;
    next(); // Continue as guest
  }
}
```

**Used for**:
- Authentication/Authorization
- Error handling
- Logging
- Request parsing

---

### 5. **Factory Pattern**

**Implementation**: Route files create instances

```javascript
// Route factory creates complete dependency chain
const repo = new ProductRepository();
const usecase = new ProductUsecase(repo);
const controller = new ProductController(usecase);

router.get("/", controller.list);
```

**Benefit**: Encapsulates complex object creation

---

### 6. **Service Layer Pattern**

**Implementation**: Usecases act as services

- Encapsulates business logic
- Provides cohesive interface
- Handles complex workflows
- Manages transactions

---

## Module Structure

### Anatomy of a Feature Module

Each feature (auth, products, cart, orders) follows the same structure:

```
feature/
├── controllers/
│   └── feature.controller.js       # HTTP request handlers
├── models/
│   └── feature.model.js            # Mongoose schema
├── repositories/
│   └── feature.repository.js       # Database access
├── routes/
│   └── feature.route.js            # HTTP routes
└── usecases/
    └── feature.usecase.js          # Business logic
```

### Module Interaction

```
┌─────────────────┐
│  route.js       │  Defines endpoints and wires up dependencies
└────────┬────────┘
         │ Uses
         ↓
┌─────────────────┐
│  controller.js  │  Handles HTTP requests
└────────┬────────┘
         │ Calls
         ↓
┌─────────────────┐
│  usecase.js     │  Implements business logic
└────────┬────────┘
         │ Delegates to
         ↓
┌─────────────────┐
│ repository.js   │  Accesses database
└────────┬────────┘
         │ Uses
         ↓
┌─────────────────┐
│  model.js       │  Defines data structure
└─────────────────┘
```

### Example: Auth Module

**auth.route.js** - Entry point
```javascript
const authRepo = new AuthRepository();
const authUsecase = new AuthUsecase(authRepo);
const authController = new AuthController(authUsecase);

router.post("/register", authController.register);
router.post("/login", authController.login);
```

**auth.controller.js** - HTTP handler
```javascript
register = async (req, res, next) => {
  const result = await this.authUsecase.register(req.body);
  res.status(201).json({ success: true, data: result });
};
```

**auth.usecase.js** - Business logic
```javascript
async register({ name, email, password }) {
  // Check if user exists
  const existing = await this.repository.findByEmail(email);
  if (existing) throw new Error("Email already registered");
  
  // Create user
  return this.repository.create({ name, email, password });
}
```

**auth.repository.js** - Database access
```javascript
async create(userData) {
  const user = new User(userData);
  return user.save();
}
```

**auth.model.js** - Data definition
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"], default: "Member" }
});

userSchema.pre("save", async function() {
  this.password = await bcrypt.hash(this.password, 10);
});
```

---

## Request Flow

### Complete Request Flow: Login

```
1. CLIENT SENDS REQUEST
   POST /api/auth/login
   { "email": "user@example.com", "password": "pass123" }
        ↓

2. EXPRESS ROUTE MATCHING
   router.post("/login", authController.login)
        ↓

3. MIDDLEWARE CHAIN
   - express.json() - Parses JSON body
   - cookieParser() - Parses cookies
   - morgan() - Logs request
        ↓

4. CONTROLLER (auth.controller.js)
   login = async (req, res, next) => {
     try {
       const result = await this.authUsecase.login(req.body);
       res.cookie("token", result.token, { httpOnly: true });
       res.json({ success: true, data: result });
     } catch (err) {
       next(err);  // Pass to error handler
     }
   }
        ↓

5. USECASE (auth.usecase.js)
   async login({ email, password }) {
     // 1. Find user by email
     const user = await this.repository.findByEmail(email);
     if (!user) throw new Error("Invalid credentials");
     
     // 2. Compare password
     const isValid = await user.comparePassword(password);
     if (!isValid) throw new Error("Invalid credentials");
     
     // 3. Generate JWT token
     const token = jwt.sign({ id: user._id }, JWT_SECRET);
     
     return { token, user };
   }
        ↓

6. REPOSITORY (auth.repository.js)
   async findByEmail(email) {
     return User.findOne({ email: email.toLowerCase() });
   }
        ↓

7. DATABASE QUERY
   MongoDB: users.findOne({ email: "user@example.com" })
        ↓

8. DATABASE RETURNS USER DOCUMENT
        ↓

9. REPOSITORY RETURNS USER TO USECASE
        ↓

10. USECASE PROCESSES AND RETURNS TO CONTROLLER
        ↓

11. CONTROLLER SETS COOKIE AND SENDS RESPONSE
    Set-Cookie: token=jwt_token; HttpOnly
    { "success": true, "data": { "token": "...", "user": {...} } }
        ↓

12. CLIENT RECEIVES RESPONSE
    Token stored in cookie and returned in response
```

### Error Flow

```
Any Layer Throws Error
        ↓
Caught by Controller try/catch
        ↓
next(err) - Pass to error middleware
        ↓
Error Middleware Formats Response
        ↓
{ "success": false, "message": "Error description" }
        ↓
HTTP Status Code (400, 401, 500, etc.)
        ↓
Client Receives Error Response
```

---

## Dependency Injection

### Current Implementation: Manual DI

Routes file manually creates and wires dependencies:

```javascript
// Route file performs DI
const repo = new ProductRepository();           // Depends on nothing
const usecase = new ProductUsecase(repo);      // Depends on repo
const controller = new ProductController(usecase); // Depends on usecase

router.get("/", controller.list);
```

**Advantages**:
- Simple and explicit
- No external dependencies
- Easy to understand

**Disadvantages**:
- Boilerplate code in each route
- Testing requires manual mocking
- Not scalable for large projects

### Future: Container-Based DI

For larger applications, consider:

```javascript
// Using a DI container (e.g., Awilix)
const container = createContainer();

container.register({
  productRepository: asClass(ProductRepository).singleton(),
  productUsecase: asClass(ProductUsecase).singleton(),
  productController: asClass(ProductController).singleton()
});

const controller = container.resolve('productController');
```

---

## Error Handling Strategy

### Error Types

#### 1. **Validation Errors** (400 Bad Request)
- Invalid input format
- Missing required fields
- Type mismatches

#### 2. **Authentication Errors** (401 Unauthorized)
- Invalid credentials
- Expired token
- Missing token

#### 3. **Authorization Errors** (403 Forbidden)
- Insufficient permissions
- User lacks required role

#### 4. **Not Found Errors** (404 Not Found)
- Resource doesn't exist
- User tries to access non-existent entity

#### 5. **Conflict Errors** (409 Conflict)
- Duplicate unique field (e.g., email)
- State conflict

#### 6. **Server Errors** (500 Internal Server Error)
- Unexpected exceptions
- Database connection issues
- External API failures

### Error Handling Flow

```
Error Thrown in Layer
    ↓
    ├─ Controller Layer
    │  └─ Caught by try/catch
    │     └─ next(err)
    │
    ├─ Usecase Layer
    │  └─ Caught by controller try/catch
    │     └─ next(err)
    │
    └─ Repository Layer
       └─ Caught by usecase try/catch
          └─ next(err)
    ↓
Error Middleware (errorHandler)
    ├─ Log error to console
    ├─ Extract status code (or default 500)
    ├─ Extract message
    ↓
Response
{
  "success": false,
  "message": "Error description"
}
Status: <status_code>
```

### Creating Custom Errors

```javascript
// In any layer
const error = new Error("User not found");
error.status = 404;
throw error;

// Or with custom error class
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.name = "ValidationError";
  }
}
```

---

## Database Design

### Schema Relationships

```
┌──────────────┐
│    Users     │
│              │
│ _id (PK)     │
│ name         │
│ email (UQ)   │
│ password     │
│ role         │
└──────────────┘
     │ 1
     │ Has Many
     │
     ├─────────────────────────────┬─────────────────────────────┐
     │                             │                             │
     ↓ 1..Many                     ↓ 1..Many                     ↓ 1..Many
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│   Carts      │           │    Orders    │           │              │
│              │           │              │           │              │
│ _id (PK)     │           │ _id (PK)     │           │              │
│ user (FK)    │           │ user (FK)    │           │              │
│ cartToken    │           │ total        │           │              │
│ items []     │           │ status       │           │              │
│              │           │ items []     │           │              │
└──────────────┘           └──────────────┘           └──────────────┘
     │                           │
     │ Many                       │ Many
     │ References                 │ References
     │                            │
     └────────────┬───────────────┘
                  │
                  ↓ Many (Embedded)
           ┌──────────────┐
           │   Products   │
           │              │
           │ _id (PK)     │
           │ name         │
           │ price        │
           │ category     │
           │ sizes        │
           └──────────────┘
```

### Indexing Strategy

```
Collection: users
  Indexes:
    - _id (auto)
    - email (unique) - for login lookups
    - name (text) - for search
    - createdAt - for sorting

Collection: products
  Indexes:
    - _id (auto)
    - name (text) - for search
    - description (text) - for search
    - price - for range queries
    - category - for filtering
    - createdAt - for sorting

Collection: carts
  Indexes:
    - _id (auto)
    - user (sparse) - for authenticated users
    - cartToken (sparse) - for guests

Collection: orders
  Indexes:
    - _id (auto)
    - user - for user queries
    - createdAt (desc) - for recent orders
```

### Query Performance Considerations

1. **Text Search**
   - Uses MongoDB text indexes
   - Enables full-text search on name and description

2. **Filtering**
   - Direct field matching for category, sizes, status
   - Range queries for price (minPrice, maxPrice)

3. **Pagination**
   - Skip and limit for efficient pagination
   - Avoids loading entire dataset

4. **Sorting**
   - Sort by price, date, popularity
   - Uses indexes for efficiency

---

## Security Considerations

### 1. **Password Security**

```javascript
// Pre-save hook hashes password
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare method verifies password
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};
```

**Implementation Details**:
- Bcrypt with 10 salt rounds
- Password never stored in plain text
- Salting prevents rainbow table attacks

### 2. **JWT Token Security**

```javascript
// Token generation
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN // 1 hour
});

// Token verification
const payload = jwt.verify(token, process.env.JWT_SECRET);
```

**Configuration**:
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production
- Short expiration time (1 hour)
- Strong secret key

### 3. **CORS Protection**

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || false,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
```

**Protection Against**:
- Cross-origin request forgery
- Unauthorized cross-domain access
- Cookie theft

### 4. **Input Validation**

- Controller layer validates format
- Usecase layer validates business rules
- MongoDB schema validation
- Type checking

### 5. **SQL Injection Prevention**

- Using MongoDB (NoSQL) reduces SQL injection risk
- Mongoose provides query building
- Parameterized queries

### 6. **Email Verification** (Not Implemented)

Future enhancement:
- Send confirmation email after registration
- Verify email address before activation
- Prevent bot registrations

---

## Best Practices

### 1. **Single Responsibility Principle**

Each class/file has one responsibility:

```javascript
// ✅ Good: Repository only handles database
class AuthRepository {
  async create(userData) { /* DB operation */ }
  async findByEmail(email) { /* DB operation */ }
}

// ❌ Bad: Repository doing business logic
class AuthRepository {
  async register(userData) {
    // Validation logic shouldn't be here
    // Email checking shouldn't be here
    // Password hashing shouldn't be here
  }
}
```

### 2. **Dependency Injection**

```javascript
// ✅ Good: Dependencies injected
class AuthController {
  constructor(authUsecase) {
    this.authUsecase = authUsecase;
  }
}

// ❌ Bad: Hard-coded dependencies
class AuthController {
  constructor() {
    this.authUsecase = new AuthUsecase();
  }
}
```

### 3. **Error Handling**

```javascript
// ✅ Good: Explicit error handling
try {
  const user = await authUsecase.login(credentials);
  res.json({ success: true, data: user });
} catch (err) {
  next(err);
}

// ❌ Bad: Silent failures
const user = await authUsecase.login(credentials);
if (user) res.json(user);
```

### 4. **Async/Await Over Callbacks**

```javascript
// ✅ Good: Async/await
async function checkout() {
  const cart = await getCart();
  const order = await createOrder(cart);
  return order;
}

// ❌ Bad: Callback hell
function checkout(callback) {
  getCart(function(cart) {
    createOrder(cart, function(order) {
      callback(order);
    });
  });
}
```

### 5. **Environment Variables**

```javascript
// ✅ Good: Use environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ❌ Bad: Hard-coded values
const PORT = 5000;
const MONGO_URI = "mongodb+srv://user:pass@cluster...";
```

### 6. **Input Validation**

```javascript
// ✅ Good: Validate in controller
if (!email || !password) {
  return res.status(400).json({ message: "Missing fields" });
}

// ❌ Bad: No validation
const user = await authUsecase.login(req.body);
```

### 7. **Logging**

```javascript
// ✅ Good: Log important events
console.log("User registered:", user.email);
console.error("Database error:", err.message);

// ❌ Bad: No logging
const user = await User.create(userData);
```

---

## Summary

The backend uses a **clean layered architecture** with clear separation of concerns:

1. **Routes/Controllers** - HTTP handling
2. **Usecases** - Business logic
3. **Repositories** - Data access
4. **Models** - Data definition

This design ensures:
- ✅ Code maintainability
- ✅ Easy testing
- ✅ Clear responsibilities
- ✅ Scalability
- ✅ Reusability
- ✅ Flexibility for changes

Each layer can be modified independently without affecting others, making the codebase robust and professional.
