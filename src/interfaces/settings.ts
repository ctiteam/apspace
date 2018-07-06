export enum Role {
  Student  = 1 << 0,
  Lecturer = 1 << 1,
  Admin    = 1 << 2,
}

export interface Settings {
  role: Role;
  intake: string;
}
