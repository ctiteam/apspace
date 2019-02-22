/* tslint:disable:no-bitwise */
export enum Role {
  Student = 1 << 0,
  Lecturer = 1 << 1,
  Admin = 1 << 2,
}

export interface Settings {
  role: Role;
  /* bus tracking */
  tripFrom: string;
  tripTo: string;
  /* timetable */
  intake: string;
  /* exam schedule */
  examIntake: string;
  /* contact number */
  contactNo: string;
}
