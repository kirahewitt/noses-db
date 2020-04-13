import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { sqlUser_full, user_forCreateNewUser } from '../_supporting_classes/sqlUser';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { ErrorStateMatcher } from '@angular/material';


/**
 * All this class does is provide us access to the isErrorState method via the ErrorStateMatcher
 * interface. We're going to create an instance of this object and ultimately attach it to
 * a form control for which we want to display multi-control-dependent error messages.
 */
export class PasswordErrorStateMatcher implements ErrorStateMatcher {

  /**
   * (A FormControl is a single input field. Think of one input in a mat-form-field)
   * This function allows us to specify that an error state exists for
   * a specific form control, when EITHER:
   *   (1) We have an error at the FormControl level
   *   (2) **We have an error at the FormGroup
   * @param control : the form control for which we may want to display an error state if
   *  we discover there is something wrong at the form level.
   * @param form : a reference to the form which may have an error state.
   */
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm) : boolean {
    return (control.invalid || form.invalid);
  }
}


/**
 * This class manages two objects
 *   (1) for representing the html template's form
 *   (2) for representing the current state of the data in the form
 */
@Component({
  selector: 'app-request-account',
  templateUrl: './request-account.component.html',
  styleUrls: ['./request-account.component.scss']
})
export class RequestAccountComponent implements OnInit {

  public form : FormGroup; // need an object to hold the form object
  public newUser : user_forCreateNewUser; // need an object to fill the form
  public passwordErrorStateMatcher : PasswordErrorStateMatcher; 


  /**
   * Initializes the new user object to a blank user.
   * @param formBuilder : syntactic sugar for making forms
   */
  constructor(private formBuilder : FormBuilder, private apiService: FlaskBackendService ) { 
    this.newUser = new user_forCreateNewUser();
    this.passwordErrorStateMatcher = new PasswordErrorStateMatcher();
  }


  /**
   * Connects the user object to the form so if changes are made to the form, 
   * the values in the newUser object will be automatically updated.
   */
  public ngOnInit() {
    this.form = this.formBuilder.group({
      firstName        : [this.newUser.firstName,       Validators.required],
      lastName         : [this.newUser.lastName,        Validators.required],
      email            : [this.newUser.email,           Validators.required],
      username         : [this.newUser.username,        Validators.required],
      password         : [this.newUser.password,        Validators.required],
      passwordConfirm  : [this.newUser.passwordConfirm, Validators.required]
    }, 
    // validators that act upon multiple fields for their condition go here
    {validator: this.passwordsMatchValidator});
  }


  /**
   * This validator method determines whether the two form fields 'password' and 'passwordConfirm' match.
   * If the two fields match, it returns null.
   * If they do not match, it returns an object consisting of an error name, and a boolean true value,
   * to indicate that the form has violated the requirement of this validity check.
   * @param g 
   */
  public passwordsMatchValidator(g: FormGroup) {
    let p = g.get('password').value;
    let pc = g.get('passwordConfirm').value;
    return p === pc ? null : {passwordPairMismatch : true};
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
