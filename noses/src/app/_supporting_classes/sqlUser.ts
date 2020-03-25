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

export class user_forCreateNewUser {
  public firstName? : string;
  public lastName? : string;
  public email? : string;
  public password? : string;
  public passwordConfirm? : string;
  
  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.passwordConfirm = "";
  }
}

export interface sqlObserver_full {
  ObsID : number;
  FirstName : string;
  LastName : string;
}