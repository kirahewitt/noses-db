import { Component, OnInit } from '@angular/core';
import { AuthService } from "../_services/auth.service";
import { PasswordHasherService } from '../_services/password-hasher.service';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { sqlUser_full } from '../_supporting_classes/sqlUser';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  
  constructor(public authService: AuthService, public passwordHasher: PasswordHasherService, public apiService: FlaskBackendService) { }

  ngOnInit() { }

  public signOutClicked() {
    this.authService.SignOut();
  }


  public signInClicked(username, password) {

    console.log("User is attempting to sign in.");
    // console.log("Result of hashing the password: ");
    // console.log(this.passwordHasher.hashPassword(password));      

    this.authService.SignIn(username, password);
  
    let emailAsJson = '{"email": "' + username + '"}';


    let userSource_obs = this.apiService.getUser_obs(emailAsJson);
    userSource_obs.subscribe(retval => {
      console.log("THIS SHOULD BE DOING SOMETHING");
      console.log("Result of getting user with password: ");
      console.log(JSON.stringify(retval));
    });

    let loginAuthenticator_obs = this.apiService.getLoginAuthenticator(username, password);
    loginAuthenticator_obs.subscribe(retval => {
      
      let betterval = JSON.stringify(retval);

      if (retval.toString() != "Incorrect Password") {
        console.log("PASSWORD IS CORRECT!!!");
        console.log(betterval.toString());
      }
      else {
        console.log("PASSWORD IS WRONG!!!");
      }
    });

  }
}
