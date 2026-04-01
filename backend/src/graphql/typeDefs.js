// GraphQL schema definitions (SDL format)

const typeDefs = `

  # ================= ENTITY TYPES =================

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  # ================= RESPONSE TYPES =================

  # Returned after signup/login
  type AuthPayload {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  # Returned for single employee operations
  type EmployeePayload {
    success: Boolean!
    message: String!
    employee: Employee
  }

  # Returned when multiple employees are fetched
  type EmployeesPayload {
    success: Boolean!
    message: String!
    employees: [Employee!]!
  }

  # ================= INPUT TYPES =================

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  # Required fields for creating employee
  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  # Optional fields for updating employee
  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  # ================= ROOT OPERATIONS =================

  type Query {

    # Login (as required in assignment)
    login(input: LoginInput!): AuthPayload

    # Employee queries
    getAllEmployees: EmployeesPayload
    searchEmployeeByEid(eid: ID!): EmployeePayload
    searchEmployeeByDesignationOrDepartment(
      designation: String
      department: String
    ): EmployeesPayload
  }

  type Mutation {

    # User registration
    signup(input: SignupInput!): AuthPayload

    # Employee operations
    addEmployee(input: EmployeeInput!): EmployeePayload
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): EmployeePayload
    deleteEmployeeByEid(eid: ID!): EmployeePayload
  }
`;

module.exports = { typeDefs };
