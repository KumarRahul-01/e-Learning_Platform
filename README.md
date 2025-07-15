# e-Learning Platform

This is a full-stack e-Learning platform built with Node.js, Express, EJS, and Vite/React. It allows administrators to create and manage courses, and users to browse and enroll in courses.

## Credentials

- Admin/server:
  - Email: admin@gmail.com
  - Password: 123456
- User/client:

  - Email: rahul@yopmail.com
  - Password: 123456

## Swagger Documentation

http://localhost:7007/api-docs

## Postman Collection

https://web.postman.co/workspace/My-Workspace~d6f54bd0-6a28-4817-888a-ff1512f4793b/collection/39641434-47ebaa89-d10f-4eec-a12a-78033c109ea4?action=share&source=copy-link&creator=39641434

## Project Structure

```
e-Learning_Platform/
├── Client/        # Frontend (Vite + React)
│   ├── public/    # Static assets
│   └── src/       # React source code
├── Server/        # Backend (Node.js + Express)
│   ├── app/       # Controllers, models, routes, middleware
│   ├── public/    # Static files (CSS, JS, images)
│   └── views/     # EJS templates for server-rendered pages
├── README.md
```

## Features

- Admin dashboard for course management (create, edit, delete)
- User authentication and authorization
- Responsive UI with Bootstrap 4 and material-ui
- RESTful API endpoints for client-server communication
- EJS templates for server-side rendered admin pages
- React frontend for user-facing features

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Backend Setup

1. Navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`.
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `Client` directory:
   ```bash
   cd Client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

- Access the admin dashboard at `/admin` (server-rendered EJS pages).
- Access the user-facing frontend at `/` (React app).
- Manage courses, categories, and users from the dashboard.

## Folder Details

- **Server/app/**: Contains controllers, models, routes, and middleware for the backend.
- **Server/views/**: EJS templates for admin pages.
- **Client/src/**: React components and pages for the frontend.
- **Server/public/** & **Client/public/**: Static assets (CSS, JS, images).

---
