# COMP3133 – Assignment 1 (Employee Management System) – GraphQL API  
**Student Name:** Mansi  
**Student ID:** 101512083  

Backend application built using **Node.js, Express, GraphQL, MongoDB (Mongoose)** with optional **JWT auth** and **Cloudinary** employee photo upload.

---

## Tech Stack
- Node.js + Express
- GraphQL (single endpoint)
- MongoDB Atlas + Mongoose
- JWT Authentication (Bearer token)
- Cloudinary (employee photo storage)
- express-validator (basic request validation)

---

## Features Implemented (Required APIs)

### Auth
- **Signup (Mutation)** → create user account (password stored encrypted)
- **Login (Query)** → login with username OR email + password, returns JWT

### Employees (JWT Protected)
- **Get All Employees (Query)**
- **Add New Employee (Mutation)**  
  - Supports employee photo upload to Cloudinary (base64 data URI)
- **Search Employee by eid (Query)**
- **Search by designation OR department (Query)**
- **Update Employee by eid (Mutation)**
- **Delete Employee by eid (Mutation)**

---

## Project Setup

### 1) Install Dependencies
```bash
npm install


2) Create .env file (root folder)
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<dbName>?appName=<appName>

JWT_SECRET=comp3133_secret_key
JWT_EXPIRES_IN=1d

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

3) Start the Server
npm run dev


Server runs at:

http://localhost:3000/graphql

How Authentication Works (JWT)

After login, copy the token and send it in request headers:

Header

{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}


All employee operations require this token.

Cloudinary Photo Upload (Employee Photo)

Field: employee_photo

Supported values:

Base64 Data URI (uploads to Cloudinary automatically)

Example starts with: data:image/png;base64,...

Existing URL string

If you pass a normal URL, it is stored as-is.

Uploads go to folder:

comp3133_employees

✅ You do NOT need to manually create this folder in Cloudinary.
Cloudinary creates it automatically after first upload.

GraphQL Testing
Option A: Postman

Method: POST

URL: http://localhost:3000/graphql

Body → raw → JSON:

{
  "query": "YOUR_QUERY_HERE",
  "variables": {}
}

Option B: GraphiQL / Playground (if enabled)

Open:

http://localhost:3000/graphql

Sample Queries / Mutations
1) Signup (Mutation)
{
  "query": "mutation($input: SignupInput!){ signup(input:$input){ success message token user{_id username email} } }",
  "variables": {
    "input": {
      "username": "mansi_user",
      "email": "mansi_user@gmail.com",
      "password": "password123"
    }
  }
}

2) Login (Query)
{
  "query": "query($input: LoginInput!){ login(input:$input){ success message token user{_id username email} } }",
  "variables": {
    "input": {
      "usernameOrEmail": "mansi_user",
      "password": "password123"
    }
  }
}

3) Add Employee (Mutation)
{
  "query": "mutation($input: EmployeeInput!){ addEmployee(input:$input){ success message employee{_id first_name last_name email designation department salary date_of_joining employee_photo} } }",
  "variables": {
    "input": {
      "first_name": "User2",
      "last_name": "Dev",
      "email": "user2.dev@gmail.com",
      "gender": "Male",
      "designation": "Developer",
      "salary": 4500,
      "date_of_joining": "2024-01-01",
      "department": "IT",
      "employee_photo": "data:image/png;base64,PUT_BASE64_HERE"
    }
  }
}

4) Get All Employees (Query)
{
  "query": "query{ getAllEmployees{ success message employees{ _id first_name last_name email designation department } } }"
}

5) Search Employee by eid (Query)
{
  "query": "query($eid: ID!){ searchEmployeeByEid(eid:$eid){ success message employee{ _id first_name last_name email } } }",
  "variables": { "eid": "PUT_EMPLOYEE_ID_HERE" }
}

6) Search by designation or department (Query)
{
  "query": "query($designation:String,$department:String){ searchEmployeeByDesignationOrDepartment(designation:$designation, department:$department){ success message employees{ _id first_name designation department } } }",
  "variables": { "department": "IT" }
}

7) Update Employee by eid (Mutation)
{
  "query": "mutation($eid: ID!, $input: EmployeeUpdateInput!){ updateEmployeeByEid(eid:$eid, input:$input){ success message employee{ _id first_name last_name salary department } } }",
  "variables": {
    "eid": "PUT_EMPLOYEE_ID_HERE",
    "input": {
      "salary": 6000,
      "department": "Engineering"
    }
  }
}

8) Delete Employee by eid (Mutation)
{
  "query": "mutation($eid: ID!){ deleteEmployeeByEid(eid:$eid){ success message employee{ _id email } } }",
  "variables": { "eid": "PUT_EMPLOYEE_ID_HERE" }
}

Validation & Error Handling

Required fields checked for employee creation

Salary must be >= 1000

Gender must be: Male | Female | Other

Duplicate emails rejected (MongoDB unique constraint)

JWT required for employee APIs