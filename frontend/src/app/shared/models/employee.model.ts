export interface Employee {
  _id?: string;
  eid?: string;
  first_name: string;
  last_name: string;
  email: string;
  designation: string;
  department: string;
  salary: number;
  date_of_joining: string;
  employee_photo?: string;
}