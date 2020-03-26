import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { sqlUser_full, user_forCreateNewUser } from '../_supporting_classes/sqlUser';
import { FlaskBackendService } from '../_services/flask-backend.service';


/**
 * This class manages two objects
 *   (1) for representing the html template's form
 *   (2) for representing the current state of the data in the form
 * 
 */
@Component({
  selector: 'app-request-account',
  templateUrl: './request-account.component.html',
  styleUrls: ['./request-account.component.scss']
})
export class RequestAccountComponent implements OnInit {


  public form : FormGroup; // need an object to hold the form object
  public newUser : user_forCreateNewUser; // need an object to fill the form
  

  /**
   * Initializes the new user object to a blank user.
   * @param formBuilder : syntactic sugar for making forms
   */
  constructor(private formBuilder : FormBuilder, private apiService: FlaskBackendService ) { 
    this.newUser = new user_forCreateNewUser();
  }


  /**
   * Connects the user object to the form so if changes are made to the form, 
   * the values in the newUser object will be automatically updated.
   */
  public ngOnInit() {
    this.form = this.formBuilder.group({
      //                 [<initial value>,              <validator methods>]
      firstName        : [this.newUser.firstName,       Validators.required],
      lastName         : [this.newUser.lastName,        Validators.required],
      email            : [this.newUser.email,           Validators.required],
      password         : [this.newUser.password,        Validators.required],
      passwordConfirm  : [this.newUser.passwordConfirm, Validators.required]
    });
  }


  /**
   * Function which ultimately calls an angular service to send the new proposed user tuple to the DB.
   */
  public submitUserAccountRequest() {
    console.log("submitNewUserAccount()... Angular Component.");
    console.log("...submitting the object:");
    console.log(this.form.value);

    let userData: user_forCreateNewUser = this.form.value;
    // let userAccount_json = JSON.stringify(userData);
    // console.log("submitNewUserAccount()... json string: ");
    // console.log(userAccount_json);

    let submitUser_obs = this.apiService.submitUserAccountRequest(userData);
    submitUser_obs.subscribe( () => {
      // in here we can do the routing.
      console.log("Request Account component has received confirmation that adding the user is complete!")
    });
  }

  /**
   * Note this interesting syntax... We've defined this using the same structure as other callback functions
   * Very similar to the syntax we use when interacting with subscriptions.
   */
  public hasError = (controlName: string, errorName: string) => {
      return this.form.controls[controlName].hasError(errorName);
  }

}
