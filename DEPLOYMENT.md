# Deployment Guide

This guide explains how to deploy the **Sweet Shop Management System** for production usage.

## Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

---

## Option 1: Run Locally in Production Mode

You can run the full application (Backend + Frontend) as a single service on your local machine.

### 1. Build the Frontend
Navigate to the frontend folder, install dependencies, and build the React app.

```bash
cd frontend
npm install
npm run build
```
*This creates a `dist` folder with the optimized static files.*

### 2. Build the Backend
Navigate to the backend folder, install dependencies, and compile the TypeScript code.

```bash
cd ../backend
npm install
npm run build
```
*This creates a `dist` folder with the compiled JavaScript server code.*

### 3. Configure Environment
Ensure your `.env` file in the `backend` directory is set up correctly.

```env
PORT=3000
SECRET_KEY=your_secret_key
DATABASE_URL="file:./dev.db" 
```
*Note: For a real production deployment, consider using a PostgreSQL database URL instead of SQLite.*

### 4. Start the Application
Run the production server.

```bash
# From the backend directory
npm start
```

The application will be available at: **http://localhost:3000**
*The backend is now configured to serve the frontend static files automatically.*

---

## Option 2: Cloud Deployment (Recommended)

To make your app accessible on the internet, you can deploy it to cloud platforms.

### Backend (Render / Railway)
1. Push your code to a GitHub repository.
2. Connect your repo to **Render** or **Railway**.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to `npm install && npm run build`.
5. Set the **Start Command** to `npm start`.
6. Add your Environment Variables (`SECRET_KEY`, `DATABASE_URL`).

   **Recommended Values:**

   - **`SECRET_KEY`**:
     *   *Value*: `my-super-secret-key-123` (or any random text you like).
     *   *Purpose*: Used to secure user logins.

   - **`DATABASE_URL`**:
     *   *Option A (Easiest - SQLite)*: `file:/opt/render/project/src/backend/dev.db`
         *   *Warning*: Your data (users/sweets) will be **deleted** every time you deploy.
         *   *Start Command Update*: You must change your Start Command to: `npx prisma migrate dev && npm start`.
     
     *   *Option B (Best - PostgreSQL)*:
         1.  On Render Dashboard, click **New +** -> **PostgreSQL**.
         2.  Name it `sweet-shop-db`, click **Create Database**.
         3.  Copy the **"Internal Database URL"** (starts with `postgres://...`).
         4.  Paste that URL as the value for `DATABASE_URL` in your Web Service.

### Frontend (Vercel / Netlify)
*If you prefer to host the frontend separately:*
1. Connect your repo to **Vercel** or **Netlify**.
2. Set the **Root Directory** to `frontend`.
3. Set the **Build Command** to `npm run build`.
4. Set the **Output Directory** to `dist`.
5. You will need to update the frontend's API base URL to point to your deployed backend URL.
