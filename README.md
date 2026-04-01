🚀 Employee Management System (COMP 3133 Assignment 2)
👤 Student Information
Name: Mansi 
Student ID: 101512083
Course: COMP 3133 – Full Stack Development II
📌 Project Overview

This is a full-stack Employee Management System built using:

Frontend: Angular
Backend: Node.js + Express + GraphQL
Database: MongoDB Atlas
Deployment:
Frontend → Vercel
Backend → Render

The application allows users to manage employees with full CRUD functionality and authentication.

🛠️ Technologies Used
Frontend
Angular 21
Apollo Angular (GraphQL Client)
Bootstrap 5
TypeScript
Backend
Node.js
Express.js
GraphQL (Apollo Server)
JWT Authentication
Database
MongoDB Atlas
Mongoose
Other Tools
Postman (API testing)
GitHub (version control)
Cloudinary (image upload)
🔐 Features
Authentication
User Registration
User Login
JWT Token-based Authentication
Protected Routes
Employee Management
➕ Add Employee
📄 View All Employees
🔍 View Employee by ID
✏️ Update Employee
❌ Delete Employee
Search & Filtering
Search employees by:
Designation
Department
Image Upload
Upload employee profile images using Cloudinary
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/SaKsHaTGaRg/101516778_COMP3133_assig2.git
cd 101516778_COMP3133_assig2
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Run backend:

npm start
3️⃣ Frontend Setup
cd frontend
npm install
ng serve

Open:

http://localhost:4200
🔗 API (GraphQL)
Endpoint:
http://localhost:3000/graphql
Sample Queries
Get Employees
query {
  getEmployees {
    _id
    first_name
    last_name
    email
    designation
    department
  }
}
Add Employee
mutation {
  addEmployee(input: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    designation: "Developer",
    department: "IT"
  }) {
    _id
    first_name
  }
}
📁 Project Structure
/backend
  ├── models
  ├── resolvers
  ├── schema
  ├── middleware
  └── server.js

/frontend
  ├── src/app
  │    ├── components
  │    ├── services
  │    └── graphql
  └── angular.json
🚀 Deployment
Backend (Render)
Connected GitHub repo
Start command:
node server.js
Frontend (Vercel)
Root Directory: frontend
Build Command:
npm run build
Output Directory:
dist/frontend/browser
🧪 Testing
Backend tested using Postman & GraphQL Playground
Frontend tested via browser UI
All CRUD operations verified
⚠️ Notes
CORS enabled for frontend deployment
JWT stored in browser (localStorage)
No persistent sessions required
📸 Screenshots (Include in submission)
MongoDB Atlas collections
GraphQL queries & mutations
Angular UI (all features)
Login / Register pages
Search functionality

This project demonstrates a complete full-stack application using modern technologies including Angular, GraphQL, and MongoDB, with deployment on cloud platforms.