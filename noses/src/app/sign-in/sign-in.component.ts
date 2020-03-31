import { Component, OnInit } from '@angular/core';
import { AuthService } from "../_services/auth.service";
import { PasswordHasherService } from '../_services/password-hasher.service';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { sqlUser_full, User_Observer_Obj } from '../_supporting_classes/sqlUser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  
  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;

  constructor(public authService: AuthService, public passwordHasher: PasswordHasherService, public apiService: FlaskBackendService) { }

  /**
   * Subscribes to the observable that maintains a logged in user. Any updates that are made to that
   * user object will be passed immediately along this datastream, and the provided callback function
   * will update the variable 'loggedInUser' whenever that happens.
   * 
   * We do the same for the boolean value maintained by the service, which indicates that the user object
   * is either valid or invalid.
   */
  public ngOnInit() { 
    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
    });

    let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
    currentUserIsValid_datastream.subscribe( (retval : boolean) => {
      this.currentUserIsValid = retval;
    });
  }


  /**
   * 
   */
  public signOutClicked() {
    this.authService.IH_SignOut();
  }


  /**
   * Contacts the necessary services to attempt logging in to the application with a user/password combo.
   * @param username : Username of the user trying to be logged in
   * @param password : Password of the user trying to be logged in
   */
  public signInClicked(username, password) {
    console.log("\n\n signInClicked() ... User is attempting to sign in.");
    this.authService.IH_SignIn(username, password);
  }

}
