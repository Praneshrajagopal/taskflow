# TaskFlow

A full-stack employee task management application built with React, Node.js, Express, and MongoDB.

TaskFlow helps users create, manage, track, filter, update, and delete tasks through a clean and responsive dashboard.

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Personal task management
- Create new tasks
- View task details
- Edit existing tasks
- Delete tasks with confirmation dialog
- Task status management
- Task priority management
- Due date management
- Search tasks
- Filter tasks by status
- Filter tasks by priority
- Sort tasks by different fields
- Pagination
- Task statistics dashboard
- Recent tasks dashboard
- Responsive UI
- Loading states
- Form validation
- Error handling
- MongoDB database integration

##  Technologies Used

### Frontend

- React
- Vite
- React Router
- Axios
- CSS Modules

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Development Tools

- Git
- GitHub
- VS Code
- MongoDB Atlas

## Project Demo

Watch the complete TaskFlow project demonstration on Loom:

[Watch the TaskFlow Demo](https://www.loom.com/share/e37fe86726e145d1af37ed01e0c50395)

##  Project Structure

employee-task-management/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── TaskCard/
│   │   ├── TaskForm/
│   │   ├── TaskFilters/
│   │   ├── Loading/
│   │   └── DeleteConfirmDialog/
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Signup/
│   │   ├── Dashboard/
│   │   ├── Tasks/
│   │   ├── TaskDetails/
│   │   ├── CreateTask/
│   │   └── EditTask/
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── server.js
│
├── docs/
│   └── API.md
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
