import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees() {
    return this.apollo.watchQuery<any>({
      query: gql`
        query GetAllEmployees {
          getAllEmployees {
            success
            message
            employees {
              _id
              first_name
              last_name
              email
              designation
              department
              salary
              date_of_joining
              employee_photo
            }
          }
        }
      `,
      fetchPolicy: 'network-only'
    }).valueChanges;
  }

  addEmployee(input: any) {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation AddEmployee($input: EmployeeInput!) {
          addEmployee(input: $input) {
            success
            message
            employee {
              first_name
              last_name
              email
              designation
              department
              salary
              date_of_joining
              employee_photo
            }
          }
        }
      `,
      variables: { input }
    });
  }

getEmployeeById(eid: string) {
  return this.apollo.query<any>({
    query: gql`
      query SearchEmployeeByEid($eid: ID!) {
        searchEmployeeByEid(eid: $eid) {
          success
          message
          employee {
            _id
            first_name
            last_name
            email
            gender
            designation
            department
            salary
            date_of_joining
            employee_photo
          }
        }
      }
    `,
    variables: { eid },
    fetchPolicy: 'no-cache'
  });
}

updateEmployee(eid: string, input: any) {
  return this.apollo.mutate<any>({
    mutation: gql`
      mutation UpdateEmployeeByEid($eid: ID!, $input: EmployeeUpdateInput!) {
        updateEmployeeByEid(eid: $eid, input: $input) {
          success
          message
          employee {
            _id
            first_name
            last_name
            email
            gender
            designation
            department
            salary
            date_of_joining
            employee_photo
          }
        }
      }
    `,
    variables: { eid, input }
  });
}
deleteEmployee(eid: string) {
  return this.apollo.mutate<any>({
    mutation: gql`
      mutation DeleteEmployeeByEid($eid: ID!) {
        deleteEmployeeByEid(eid: $eid) {
          success
          message
          employee {
            _id
            first_name
            last_name
          }
        }
      }
    `,
    variables: { eid }
  });
}

searchEmployees(designation?: string, department?: string) {
  return this.apollo.query<any>({
    query: gql`
      query SearchEmployeeByDesignationOrDepartment($designation: String, $department: String) {
        searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
          success
          message
          employees {
            _id
            first_name
            last_name
            email
            gender
            designation
            department
            salary
            date_of_joining
            employee_photo
          }
        }
      }
    `,
    variables: {
      designation: designation || null,
      department: department || null
    },
    fetchPolicy: 'no-cache'
  });
}


}