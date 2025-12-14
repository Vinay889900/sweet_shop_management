# 🍬 Sweet Shop Management System

A full-stack modern web application for managing a sweet shop's inventory, sales, and operations. Built with **React**, **Node.js**, **Express**, **Prisma**, and **PostgreSQL/SQLite**.

🔗 **Live Demo**: [https://sweet-shop-management-j9l4.onrender.com](https://sweet-shop-management-j9l4.onrender.com)

---

## ✨ Features

### 🛍️ User Features
*   **Browse Catalog**: View delicious sweets with high-quality images.
*   **Category Filtering**: Filter sweets by type (Chocolate, Gummies, Bakery, etc.).
*   **Search**: Real-time search by name.
*   **Shopping Cart**: Add items, adjust quantities, and checkout.
*   **Authentication**: Secure Register and Login (JWT-based).

### 👨‍💼 Admin Features
*   **Dashboard**: Comprehensive overview of inventory.
*   **Inventory Management**:
    *   **Add Sweets**: Create new products with images.
    *   **Edit Sweets**: Update prices, stock, and descriptions.
    *   **Delete Sweets**: Remove discontinued items.
*   **Role-Based Access**: Protected admin routes using JWT middleware.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Vanilla CSS (Glassmorphism Design), Axios.
*   **Backend**: Node.js, Express, TypeScript.
*   **Database**: SQLite (Local) / PostgreSQL (Optional Production), Managed via Prisma ORM.
*   **Authentication**: JSON Web Tokens (JWT), Bcrypt for password hashing.
*   **Deployment**: Render (Cloud Hosting).

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### 1. Clone the Repository
```bash
git clone https://github.com/Vinay889900/sweet_shop_management.git
cd sweet_shop_management
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create database and run migrations
npx prisma migrate dev --name init
# Seed the database with initial products and admin user
npm start
```
*   The server runs on `http://localhost:3000`.
*   **Default Admin**: `admin@example.com` / `password123`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*   The frontend runs on `http://localhost:5173`.

---

## ☁️ Deployment (Render)

This project is configured for seamless deployment on Render.

1.  **Connect GitHub**: Select your repo on Render.
2.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `cd ../frontend && npm install && npm run build && cd ../backend && tsc`
    *   **Start Command**: `node seed.js && node dist/server.js`
3.  **Environment Variables**:
    *   `SECRET_KEY`: (Any random string)
    *   `DATABASE_URL`: `file:./dev.db` (for simple setups) or a PostgreSQL URL.

---

## 🤖 AI Usage & Co-authorship

This project was developed with the assistance of AI tools.

*   **Tools**: Google Gemini, ChatGPT, Google Antigravity
*   **Usage**: scaffolding code, generating test cases, designing CSS themes, and debugging deployment configuration.
*   **Policy**: All AI-assisted commits include the `Co-authored-by: Google Gemini <AI@users.noreply.github.com>` trailer in the commit message.

---

## 🧪 Testing

Run duplicate verification tests:
```bash
cd backend
npm test
```

---

*Developed by Vinay Kumar*
