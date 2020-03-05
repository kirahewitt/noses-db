export interface sqlUser {
  LoginID: number;
  Fullname: string;
  isAdmin: number;
  Password: string;
  Affiliation: string;
  email: string;
}

export interface sqlUser_full {
  UserID: number;
  Username: string;
  Password: number;
  Initials: string;
  isAdmin: string;
  Affiliation: string;
  Email: string;
  ObsID: number;
  HashedPassword: string;
}