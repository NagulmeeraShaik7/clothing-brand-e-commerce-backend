# Setup & Deployment Guide

Complete guide for setting up and deploying the Clothing E-Commerce Backend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

---

## Prerequisites

### System Requirements

- **OS**: Windows, macOS, or Linux
- **Node.js**: v16.x or higher
- **npm**: v7.x or higher
- **MongoDB**: v5.0 or higher (cloud or local)

### Required Software

1. **Node.js & npm**
   ```bash
   # Check installation
   node --version
   npm --version
   ```

2. **MongoDB**
   - Option A: Local MongoDB installation
   - Option B: MongoDB Atlas (cloud) - Recommended

3. **Git**
   ```bash
   git --version
   ```

4. **Text Editor/IDE**
   - Visual Studio Code (recommended)
   - Other IDEs compatible with Node.js

---

## Local Development Setup

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/NagulmeeraShaik7/clothing-brand-e-commerce-backend.git
cd Clothing-E-commerce-App/backend
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# Or using yarn
yarn install
```

**Expected Output**:
```
npm notice
npm warn deprecated ...
added XXX packages, and audited XXX packages in XXs
```

### Step 3: Environment Configuration

Create `.env` file in the `backend/` directory:

```bash
# Copy example (if available)
cp .env.example .env

# Or create new file
# Windows PowerShell
New-Item -Path ".env" -ItemType "file"

# macOS/Linux
touch .env
```

**Edit `.env` with your configuration** (see [Configuration](#configuration))

### Step 4: Verify Installation

```bash
# Test Node installation
node -e "console.log('Node.js is working')"

# Test npm installation
npm -v

# Test MongoDB connection (after configuration)
npm start
```

---

## Configuration

### Environment Variables

Create or update `.env` file with these variables:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# DATABASE CONFIGURATION
# ============================================
# Option 1: Local MongoDB
MONGO_URI=mongodb://localhost:27017/clothing_ecom

# Option 2: MongoDB Atlas (Cloud)
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/clothing_ecom?retryWrites=true&w=majority

# ============================================
# AUTHENTICATION CONFIGURATION
# ============================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h

# ============================================
# EMAIL CONFIGURATION (SMTP)
# ============================================
# Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_not_regular_password
FROM_EMAIL=noreply@clothingbrand.com

# ============================================
# FRONTEND CONFIGURATION
# ============================================
FRONTEND_URL=http://localhost:4000

# ============================================
# LOGGING CONFIGURATION
# ============================================
LOG_LEVEL=debug
```

### Configuration Details

#### JWT_SECRET

Generate a strong secret key:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Requirements**:
- Minimum 32 characters
- Random and unique
- Never commit to repository
- Different for each environment

#### Email Configuration

**Using Gmail SMTP**:

1. Enable 2-factor authentication on your Google account
2. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Copy the generated password
   - Paste in `EMAIL_PASS` (16 characters with spaces removed)

**Using Other Email Providers**:

```env
# Outlook/Hotmail
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587

# SendGrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxx

# Mailgun
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
```

#### MongoDB Configuration

**Local MongoDB**:
```env
MONGO_URI=mongodb://localhost:27017/clothing_ecom
```

**MongoDB Atlas (Recommended)**:

1. Create free account at: https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Create database user with password
4. Whitelist your IP address
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/clothing_ecom?retryWrites=true&w=majority
   ```

---

## Running the Application

### Development Mode

```bash
# Start the server
npm start

# Expected output
Connected to MongoDB
Server running on port 3000
```

### Development with Auto-Reload

For development with automatic restart on file changes:

```bash
# Install nodemon globally
npm install -g nodemon

# Or locally
npm install --save-dev nodemon

# Run with nodemon
npx nodemon src/index.js

# Or add to package.json scripts
# "dev": "nodemon src/index.js"
npm run dev
```

### Accessing the Application

Once running, access:

- **Main API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Docs (Swagger)**: http://localhost:3000/api-docs
- **Auth Endpoints**: http://localhost:3000/api/auth
- **Products Endpoints**: http://localhost:3000/api/products
- **Cart Endpoints**: http://localhost:3000/api/cart
- **Orders Endpoints**: http://localhost:3000/api/orders

### Testing an Endpoint

```bash
# Using curl
curl http://localhost:3000/health

# Using PowerShell
Invoke-WebRequest http://localhost:3000/health

# Expected response
{"ok":true}
```

---

## Database Setup

### Local MongoDB Setup

#### Windows

1. **Download MongoDB Community**:
   - Visit: https://www.mongodb.com/try/download/community
   - Download Windows MSI Installer

2. **Install**:
   - Run installer
   - Choose "Install MongoDB as a Service"
   - Default installation: `C:\Program Files\MongoDB\Server\7.0`

3. **Verify Installation**:
   ```bash
   mongod --version
   mongo --version
   ```

4. **Start MongoDB Service**:
   ```bash
   # Start the MongoDB service
   net start MongoDB
   
   # Or run directly
   mongod
   ```

#### macOS

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
mongo --version
```

#### Linux (Ubuntu)

```bash
# Import public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
```

### MongoDB Atlas Setup (Recommended)

1. **Create Account**:
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up with email

2. **Create Organization & Project**:
   - Create new organization
   - Create new project

3. **Create Cluster**:
   - Click "Build a Database"
   - Choose free tier (M0)
   - Select region closest to you
   - Click "Create"

4. **Create Database User**:
   - Go to Database Access
   - Add Database User
   - Set Username and Password
   - Grant admin access (for development)

5. **Whitelist IP**:
   - Go to Network Access
   - Add IP Address
   - For development: Allow 0.0.0.0/0 (not secure)
   - For production: Whitelist specific IPs

6. **Get Connection String**:
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Select "Node.js" driver
   - Copy connection string
   - Replace `<password>` with your database user password

### Database Collections

Collections are automatically created when data is inserted. For manual setup:

```bash
# Connect to MongoDB
mongo

# Use database
use clothing_ecom

# Create collections with schema validation
db.createCollection("users")
db.createCollection("products")
db.createCollection("carts")
db.createCollection("orders")

# Create indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.products.createIndex({ "name": "text", "description": "text" })
db.carts.createIndex({ "user": 1 })
db.carts.createIndex({ "cartToken": 1 })
db.orders.createIndex({ "user": 1 })
db.orders.createIndex({ "createdAt": -1 })
```

### Database Seeding (Optional)

Seed initial product data:

```bash
# Run seed script
npm run seed

# Or directly
node src/seeders/runSeed.js
```

---

## Testing

### Manual Testing with cURL

```bash
# Test server health
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Get products
curl http://localhost:3000/api/products

# Get single product
curl http://localhost:3000/api/products/product_id_here
```

### Testing with Postman

1. **Import Collection**:
   - Open Postman
   - Import: `postman_collection.json`

2. **Setup Environment**:
   - Create new environment
   - Set `baseURL`: `http://localhost:3000/api`
   - Set `token`: (leave empty, will be populated after login)

3. **Test Endpoints**:
   - Start with auth endpoints
   - Get JWT token from login
   - Use token in subsequent requests

### Testing with Swagger UI

1. Navigate to: http://localhost:3000/api-docs
2. Interactive documentation and testing
3. Try out endpoints directly in browser

### Automated Testing

Currently no automated tests implemented. Future enhancement:

```bash
# Install testing framework
npm install --save-dev jest supertest

# Create test file
# tests/auth.test.js

# Run tests
npm test
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Update `.env` for production
- [ ] Change `JWT_SECRET` to strong value
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Configure MongoDB Atlas with production settings
- [ ] Set up SSL/HTTPS certificate
- [ ] Configure domain name and DNS
- [ ] Set up monitoring and logging
- [ ] Configure automated backups
- [ ] Set up CI/CD pipeline
- [ ] Performance testing completed
- [ ] Security audit completed

### Production Environment Variables

```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Strong JWT Secret (generate new one)
JWT_SECRET=<generate-new-strong-secret-64-chars>

# Production MongoDB Atlas
MONGO_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/clothing_ecom

# Production Frontend
FRONTEND_URL=https://yourdomain.com

# Production Email
EMAIL_USER=production-email@yourdomain.com
EMAIL_PASS=<strong-app-password>

# Logging
LOG_LEVEL=warn
```

### Deployment Platforms

#### Option 1: Heroku

```bash
# 1. Install Heroku CLI
# From: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
heroku config:set MONGO_URI=<your-mongodb-uri>

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs --tail
```

#### Option 2: AWS EC2

```bash
# 1. Launch EC2 instance (Ubuntu)

# 2. SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# 3. Update system
sudo apt-get update && sudo apt-get upgrade -y

# 4. Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 5. Clone repository
git clone https://github.com/your-repo.git
cd Clothing-E-commerce-App/backend

# 6. Install dependencies
npm install

# 7. Create .env file
sudo nano .env

# 8. Install PM2 for process management
sudo npm install -g pm2

# 9. Start application
pm2 start src/index.js --name "ecommerce-api"
pm2 startup
pm2 save

# 10. Configure Nginx reverse proxy
sudo apt-get install -y nginx
# Configure Nginx config file...

# 11. Setup SSL with Certbot
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certbot --nginx -d yourdomain.com
```

#### Option 3: Railway / Render / Vercel

For simple deployments, these platforms offer:
- Automatic deployments from GitHub
- Free HTTPS
- Environment variable management
- Database hosting

1. Connect GitHub repository
2. Set environment variables
3. Deploy with one click

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "src/index.js"]
```

Build and run:

```bash
# Build image
docker build -t clothing-ecommerce-api:1.0 .

# Run container
docker run -d \
  --name ecommerce-api \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGO_URI=<your-uri> \
  -e JWT_SECRET=<your-secret> \
  clothing-ecommerce-api:1.0
```

### SSL/HTTPS Setup

#### Using Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check status
sudo systemctl status certbot.timer
```

### Performance Optimization

1. **Enable Gzip Compression**:
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Implement Caching Headers**:
   ```javascript
   app.use((req, res, next) => {
     res.set('Cache-Control', 'public, max-age=300');
     next();
   });
   ```

3. **Database Query Optimization**:
   - Use appropriate indexes
   - Implement pagination
   - Limit returned fields

4. **Rate Limiting**:
   ```bash
   npm install express-rate-limit
   ```

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Error

**Error**: `MongoDB connection error`

**Solutions**:
```bash
# 1. Verify MongoDB is running
mongod --version

# 2. Check connection string
echo $MONGO_URI

# 3. Test connection manually
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI);"

# 4. Check IP whitelist (MongoDB Atlas)
# - Go to MongoDB Atlas
# - Network Access
# - Whitelist your IP

# 5. Verify database user credentials
# - Check username and password
# - Verify special characters are URL-encoded
```

#### JWT Token Errors

**Error**: `JsonWebTokenError: invalid token`

**Solutions**:
```bash
# 1. Verify JWT_SECRET is same in .env
echo $JWT_SECRET

# 2. Check token expiration
# Token expires after JWT_EXPIRES_IN time (default 1 hour)

# 3. Verify token format
# Should be: Authorization: Bearer <token>
# Not: Authorization: <token>

# 4. Check token hasn't been modified
```

#### Email Not Sending

**Error**: `Email sending failed`

**Solutions**:
```bash
# 1. Verify SMTP credentials
# - Check EMAIL_USER and EMAIL_PASS
# - For Gmail, use App Password not regular password

# 2. Enable less secure app access
# - Gmail: https://myaccount.google.com/lesssecureapps

# 3. Check firewall/network
# - Port 587 might be blocked
# - Try port 465 for SMTP
```

#### Port Already in Use

**Error**: `listen EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Windows PowerShell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in .env
PORT=3001
```

#### CORS Issues

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions**:
```bash
# 1. Verify FRONTEND_URL in .env
echo $FRONTEND_URL

# 2. Ensure frontend URL matches request origin
# Frontend: http://localhost:4000
# FRONTEND_URL: http://localhost:4000

# 3. For development, allow all origins temporarily
# app.use(cors());

# 4. Verify credentials flag in fetch
// fetch(..., { credentials: 'include' })
```

### Debugging

Enable verbose logging:

```javascript
// In index.js, before starting server
process.env.DEBUG = '*';

// For MongoDB queries
mongoose.set('debug', true);

// For JWT debugging
jwt.verify(token, secret, { algorithms: ['HS256'] });
```

---

## Maintenance

### Regular Tasks

#### Daily
- Monitor error logs
- Check database performance
- Verify email notifications are working

#### Weekly
- Review user feedback
- Check security advisories
- Test backup restoration

#### Monthly
- Update dependencies
- Security audit
- Performance analysis
- Database optimization

### Backup Strategy

```bash
# Backup MongoDB Atlas
# - Enable automatic backups (default)
# - Download backup snapshots regularly

# Manual backup
mongodump --uri "mongodb+srv://..." --out ./backup

# Restore backup
mongorestore --uri "mongodb+srv://..." ./backup
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest

# Security audit
npm audit

# Fix security vulnerabilities
npm audit fix
```

### Monitoring

Recommended tools:
- **Error Tracking**: Sentry.io
- **Performance**: New Relic, DataDog
- **Logging**: Loggly, Papertrail
- **Uptime**: Uptime Robot, Pingdom

---

## Summary

### Quick Start
```bash
# 1. Clone and install
git clone <repo>
cd backend
npm install

# 2. Configure
cp .env.example .env
# Edit .env with your settings

# 3. Run
npm start

# 4. Access
# http://localhost:3000/api-docs
```

### Deployment Checklist
- [ ] Setup MongoDB
- [ ] Configure environment variables
- [ ] Run application
- [ ] Test endpoints
- [ ] Setup monitoring
- [ ] Enable SSL
- [ ] Setup backups
- [ ] Configure CI/CD

---

## Support

For issues, refer to:
- **README.md** - General documentation
- **API_REFERENCE.md** - Endpoint documentation
- **ARCHITECTURE.md** - Design patterns
- **MongoDB Documentation**: https://docs.mongodb.com
- **Express Documentation**: https://expressjs.com
- **Mongoose Documentation**: https://mongoosejs.com
