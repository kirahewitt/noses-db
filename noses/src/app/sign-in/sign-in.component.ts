import { Component, OnInit } from '@angular/core';
import { AuthService } from "../_services/auth.service";
import { PasswordHasherService } from '../_services/password-hasher.service';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { sqlUser_full } from '../_supporting_classes/sqlUser';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  
  constructor(public authService: AuthService, public passwordHasher: PasswordHasherService, public apiService: FlaskBackendService) { }

  ngOnInit() { }


  /**
   * 
   */
  public signOutClicked() {
    this.authService.SignOut();
  }


  /**
   * 
   * @param username : Username of the user trying to be logged in
   * @param password : Password of the user trying to be logged in
   */
  public signInClicked(username, password) {
    let emailAsJson = '{"email": "' + username + '"}';

    console.log("\n\n signInClicked() ... User is attempting to sign in.");

    // - Google FireBase/FireStore login
    // this.authService.SignIn(username, password);
  
    // - Get Entire User
    let userSource_obs = this.apiService.getUser_obs(emailAsJson);
    userSource_obs.subscribe(retval => {
      console.log("Result of getting user with password: ");
      console.log(JSON.stringify(retval));
    });

    // - Login Via 'apiService'
    let loginAuthenticator_obs = this.apiService.getLoginAuthenticator(username, password);
    loginAuthenticator_obs.subscribe(this.loginAuthenticator_obs_next, this.loginAuthenticator_obs_error);

  }


  /**
   * This method serves as the callback for 'next:' paramater of the subscribe function.
   * @param retval 
   */
  public loginAuthenticator_obs_next(retval : sqlUser_full[]) {
    let betterval = JSON.stringify(retval);

    if (retval.toString() != "Incorrect Password") {
      console.log("PASSWORD IS CORRECT!!!");
      console.log(betterval.toString());

      console.log(retval.toString())
    }
    else {
      console.log("PASSWORD IS WRONG!!!");
    }
  }


  /**
   * his method serves as the callback for 'error:' paramater of the subscribe function.
   * @param error 
   */
  public loginAuthenticator_obs_error(error : HttpErrorResponse) {
    console.log("\n\n\n\n\n\nENTERED ERROR CALBACK OF LOGIN AUTHENTICATOR");
  
    console.log("\nOutputting 'error' without forcing a type");
    console.log(error);

    console.log("\nChecking the type of 'error' without forcing a type");
    console.log(typeof(error));
  }
}
