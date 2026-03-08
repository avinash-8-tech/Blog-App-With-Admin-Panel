# Blog App With Admin Panel

A full-stack **Blog Platform** built using modern web technologies.  
This project includes a **fully responsive website for users** and a **mobile admin panel** that allows administrators to manage users and blog posts directly from their mobile devices.

The platform enables users to create and interact with blogs, while administrators can monitor and manage the entire system through a dedicated mobile application.

---

# 🚀 Tech Stack

### Website

- Next.js
- Tailwind CSS
- Shadcn UI
- Better Auth
- Drizzle ORM
- React Hook Form
- Zod
- Zustand

### Admin Panel (Mobile App)

- React Native
- Expo
- React Navigation
- Axios
- Zustand

### Backend

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- Drizzle ORM

### Database

- PostgreSQL managed using **pgAdmin**

---

# 🔐 Authentication

Authentication for the website is implemented using **Better Auth**, which provides a secure and reliable authentication system.

### Features

- User Signup
- User Login
- Secure session handling
- Authentication-protected routes

This ensures that only authenticated users can access protected features of the platform.

---

# 🌐 Website Features

The website is a **fully responsive blog platform** where users can read blogs, publish their own content, and interact with posts.

### User Features

- User authentication (Signup / Login)
- Create and publish blog posts
- Edit and delete their own posts
- Like blog posts
- Save blog posts
- Saved posts appear in the user profile
- Search blogs by keywords
- User profile with personal blog posts
- Fully responsive UI
- Dark Mode / Light Mode support

Users can easily manage their own content while discovering and engaging with blogs created by other users.

---

# 📱 Admin Panel (Mobile App)

The admin panel is built using **React Native**, enabling administrators to manage the platform directly from a mobile device.

### Admin Features

- Admin authentication (Login / Signup)
- Create new admin accounts
- View all users
- View how many posts each user has created
- Search users
- Search posts
- Delete any user from the platform
- When a user is deleted, all of their posts are automatically deleted
- Delete a specific post of any user
- Admin logout functionality
- Dark Mode / Light Mode support

This mobile admin panel provides administrators with full control over users and content on the platform.

---

# 🗂 Project Structure

```
Blog-App-With-Admin-Panel
│
├── blog-app
│   └── Next.js Website
│
├── blog-adminpanel
│   ├── backend
│   │   └── Node.js + Express API
│   │
│   └── frontend
│       └── React Native Admin App
│
└── Database
    └── PostgreSQL (pgAdmin)
```

---

# ⚙️ Installation Guide

Follow the steps below to run the project locally.

---

# 1️⃣ Clone the Repository

```
git clone https://github.com/avinash-8-tech/Blog-App-With-Admin-Panel.git
```

```
cd Blog-App-With-Admin-Panel
```

---

# 2️⃣ Setup PostgreSQL Database

1. Install PostgreSQL
2. Open pgAdmin
3. Create a new database
4. Add your database connection string inside the `.env` file

Example:

```
DATABASE_URL=postgresql://username:password@localhost:5432/blogdb
```

---

# 🌐 Running the Website (Next.js)

Navigate to the website folder:

```
cd blog-app
```

Install dependencies:

```
npm install
```

Run database migrations:

```
npx drizzle-kit generate
npx drizzle-kit migrate
```

Start the development server:

```
npm run dev
```

The website will run at:

```
http://localhost:3000
```

---

# ⚙️ Running the Backend API

Navigate to the backend folder:

```
cd blog-adminpanel/backend
```

Install dependencies:

```
npm install
```

Start the backend server:

```
npm run dev
```

---

# 📱 Running the Admin Panel (React Native App)

Navigate to the admin frontend folder:

```
cd blog-adminpanel/frontend
```

Install dependencies:

```
npm install
```

Start Expo development server:

```
npm run web
```

Run on Android emulator:

```
npm run android
```

You can run the mobile application using:

- Android Emulator
- iOS Simulator
- Expo Go mobile app

---

# 📊 Database

The project uses **PostgreSQL** as the primary database and it is managed using **pgAdmin**.

Database schema and queries are handled using **Drizzle ORM**, which provides a modern and type-safe way to interact with PostgreSQL.

---

# 📌 Key Highlights

- Full Stack Blog Platform
- Mobile Admin Panel
- Secure Authentication with Better Auth
- Blog Like & Save System
- Blog Search Feature
- Admin User Management
- Admin Post Management
- User & Post Search in Admin Panel
- Dark / Light Mode Support
- PostgreSQL Database
- Drizzle ORM
- Fully Responsive UI

---

# 📜 License

This project is licensed under the MIT License.
