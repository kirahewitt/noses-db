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
  Password: string;
  Initials: string;
  isAdmin: number;
  Affiliation: string;
  Email: string;
  ObsID: number;
  HashedPassword: string;
}