# Levresion Platform

A comprehensive e-commerce and delivery platform built with a microservices architecture, featuring product catalog management, order processing, and user authentication.

## 🏗️ Architecture

This project consists of two main backend services:

- **Ms-CatalogueCommande** (Node.js/Express/MongoDB) - Handles boutiques, products, catalogs, and orders
- **Authentication Service** (Spring Boot/MySQL) - Manages user authentication and authorization with JWT

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)

## ✨ Features

### Catalog & Order Management Service
- **Boutique Management**: Create, update, and manage store information with image uploads
- **Product Catalog**: Organize products into catalogs with detailed information
- **Product Management**: CRUD operations for products with Cloudinary image storage
- **Order Processing**: Handle customer orders with delivery tracking
- **Search Functionality**: Search products by name
- **Address Management**: Support for pickup and delivery addresses with coordinates

### Authentication Service
- **User Registration & Login**: Secure authentication with JWT tokens
- **Role-Based Access Control**: Support for multiple user roles (ADMIN, CLIENT, COMMERCANT, LIVREUR)
- **OAuth2 Integration**: Google OAuth2 login support
- **Password Encryption**: BCrypt password hashing
- **Session Management**: Stateless authentication using JWT

## 🛠️ Tech Stack

### Backend - Catalog Service
- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary (Image Storage)
- Multer (File Upload)
- Axios (HTTP Client)
- CORS & Body Parser

### Backend - Auth Service
- Java 17
- Spring Boot 3.4.2
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT (JSON Web Tokens)
- OAuth2 Client
- Lombok
- Maven

## 📦 Prerequisites

- Node.js (v14 or higher)
- Java 17
- MongoDB
- MySQL
- Docker & Docker Compose (optional, for MySQL setup)
- Maven
- Cloudinary account

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Levresion-platform
```

### 2. Setup Catalog & Order Service

```bash
cd backend/Ms-CatalogueCommande
npm install
```

Create a `.env` file:

```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/levresion
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Setup Authentication Service

```bash
cd backend/demo
```

If using Docker for MySQL:

```bash
docker-compose up -d
```

Or configure MySQL manually and update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/demo
spring.datasource.username=root
spring.datasource.password=root
```

Build the project:

```bash
./mvnw clean install
```

## ⚙️ Configuration

### Catalog Service Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5050) |
| `MONGO_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Auth Service Configuration

Update `src/main/resources/application.properties` with your database and OAuth2 credentials.

## 📚 API Documentation

### Catalog & Order Service (Port 5050)

#### Boutiques
- `POST /boutiques` - Create a new boutique (with image upload)
- `GET /boutiques` - Get all boutiques
- `GET /boutiques/:id` - Get boutique by ID
- `GET /boutiques/Commercant/:id` - Get boutiques by merchant ID
- `PUT /boutiques/:id` - Update boutique
- `DELETE /boutiques/:id` - Delete boutique

#### Catalogs
- `GET /boutiques/:boutiqueId/catalogues` - Get all catalogs for a boutique
- `POST /boutiques/:boutiqueId/catalogues` - Add catalog to boutique
- `GET /boutiques/:boutiqueId/catalogues/:catalogueId/produits` - Get products in catalog
- `PUT /boutiques/:boutiqueId/catalogues/:catalogueId` - Update catalog
- `DELETE /boutiques/:boutiqueId/catalogues/:catalogueId` - Delete catalog

#### Products
- `POST /products` - Create a product (with image upload)
- `GET /products` - Get all products
- `GET /products/name?search=` - Search products by name
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Orders
- `POST /commandes` - Create a new order
- `GET /commandes` - Get all orders
- `GET /commandes/:commandeId` - Get order by ID
- `PUT /commandes/:commandeId/status` - Update order status
- `DELETE /commandes/:commandeId` - Delete order

### Authentication Service (Port 8080)

#### Auth Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/authenticate` - Login user
- `GET /api/v1/demo-controller` - Protected endpoint (requires JWT)

#### Registration Request
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Authentication Request
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🏃 Running the Project

### Start Catalog Service

```bash
cd backend/Ms-CatalogueCommande
npm start
```

The service will run on `http://localhost:5050`

### Start Authentication Service

```bash
cd backend/demo
./mvnw spring-boot:run
```

The service will run on `http://localhost:8080`

## 📁 Project Structure

```
Levresion-platform/
├── backend/
│   ├── Ms-CatalogueCommande/           # Catalog & Order Service
│   │   ├── src/
│   │   │   ├── config/                 # Configuration files
│   │   │   ├── controllers/            # Request handlers
│   │   │   ├── models/                 # Mongoose schemas
│   │   │   ├── Routes/                 # API routes
│   │   │   ├── middlewares/            # Custom middleware
│   │   │   └── index.js                # Entry point
│   │   └── package.json
│   │
│   └── demo/                           # Authentication Service
│       ├── src/main/java/com/example/demo/
│       │   ├── Entity/                 # JPA entities
│       │   ├── Repo/                   # Repositories
│       │   ├── auth/                   # Authentication logic
│       │   ├── config/                 # Security & JWT config
│       │   ├── controller/             # REST controllers
│       │   └── DemoApplication.java
│       └── pom.xml
│
└── frontend/                           # Frontend (to be implemented)
```

## 🔐 Security

- JWT tokens expire after 24 hours
- Passwords are encrypted using BCrypt
- CORS enabled for cross-origin requests
- File uploads restricted to images only (max 5MB)
- Stateless session management

## 🗄️ Database Schemas

### MongoDB Collections
- **Boutique**: Store information with catalogs
- **Produit**: Product details with images
- **Commande**: Order information with products and addresses

### MySQL Tables
- **User**: User information with roles and authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

Your team information here

## 📞 Support

For support, email seifislem.benrabah@gmail.com or open an issue in the repository.
