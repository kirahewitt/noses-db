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
  public username? : string;
  public password? : string;
  public passwordConfirm? : string;
  
  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.username = "";
    this.password = "";
    this.passwordConfirm = "";
  }
}

export class user_forCreateNewUser_byAdmin {
  public firstName? : string;
  public lastName? : string;
  public email? : string;
  public username? : string;
  public password? : string;
  public passwordConfirm? : string;
  public isAdmin: number;
  public affiliation: string;
  
  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.username = "";
    this.password = "";
    this.passwordConfirm = "";
    this.isAdmin = -1;
    this.affiliation = "";
  }
}


/**
 * Needed to create a version of the userObject which Components
 * could receive from the flask API which did not include security
 * compromising fields of the user object.
 * 
 * Specifically we're just omitting the password.
 * This object will be produced by the angular service 'flask-backend.service' 
 *  after piping a json representation of user data through a map operator which 
 *  produces this type of object. 
 */
export class User_Observer_Obj {

  // fields for the Users entity set
  public userId: number;
  public username: string;
  public initials: string;
  public isAdmin: number;
  public affiliation: string;
  public email: string;
  public obsId: number;
  public isVerifiedByAdmin: number;

  // fields for the Observers entity set
  public firstName: string;
  public lastName: string;


  constructor() {
    this.userId = -1;
    this.username = "";
    this.initials = "";
    this.isAdmin = -1;
    this.affiliation = "";
    this.email = "";
    this.obsId = -1;
    this.isVerifiedByAdmin = -1;
    this.firstName = "";
    this.lastName = "";
  }
}




export interface sqlObserver_full {
  ObsID : number;
  FirstName : string;
  LastName : string;
}