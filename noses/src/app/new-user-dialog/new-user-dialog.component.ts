import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { User_Observer_Obj, user_forCreateNewUser_byAdmin } from '../_supporting_classes/sqlUser';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';


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
 * 
 */
@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss']
})
export class NewUserDialogComponent implements OnInit {

  public form : FormGroup; // need an object to hold the form object
  public newUser : user_forCreateNewUser_byAdmin; // need an object to fill the form
  public passwordErrorStateMatcher : PasswordErrorStateMatcher;
  public userLevelNames: string[]
  public userLevelIndices: number[];
  public accountValidityStatusNames: string[];
  public accountValidityStatusIndices: number[];


  /**
   * 
   * @param formBuilder 
   * @param apiService 
   * @param dialogRef 
   * @param injectedData 
   */
  constructor(private formBuilder : FormBuilder, private apiService: FlaskBackendService, public dialogRef: MatDialogRef<EditUserDialogComponent>) {
    this.newUser = new user_forCreateNewUser_byAdmin();
    this.passwordErrorStateMatcher = new PasswordErrorStateMatcher();

    this.userLevelNames = ["Awaiting Account Approval", "Citizen Scientist", "Field Leader", "Admin"];
    this.userLevelIndices = [0, 1, 2, 3];
    
    this.accountValidityStatusNames = ["Account Disabled", "Account Enabled"];
    this.accountValidityStatusIndices = [0, 1];
  }


  /**
   * 
   */
  public ngOnInit() {
    this.form = this.formBuilder.group({
      firstName : [this.newUser.firstName, Validators.required],
      lastName : [this.newUser.lastName, Validators.required],
      email : [this.newUser.email, Validators.required],
      password         : [this.newUser.password,        Validators.required],
      passwordConfirm  : [this.newUser.passwordConfirm, Validators.required],
      isAdmin  : [this.newUser.isAdmin, Validators.required],
      affiliation  : [this.newUser.affiliation, []]
    },
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
   * Note this interesting syntax... We've defined this using the same structure as other callback functions
   * Very similar to the syntax we use when interacting with subscriptions.
   */
  public hasError = (controlName: string, errorName: string) => {
      return this.form.controls[controlName].hasError(errorName);
  }


  /**
   * Closes the form and returns the value of the form as its current state.
   */
  public save() {
    console.log(this.form.value)
    // let formObj: user_forCreateNewUser_byAdmin = this.form.value;
    // var newUserForReturn: user_forCreateNewUser_byAdmin = new user_forCreateNewUser_byAdmin();
    
    // // these fields were part of the form
    // newUserForReturn.firstName = formObj.firstName;
    // newUserForReturn.lastName = formObj.lastName;
    // newUserForReturn.email = formObj.email;
    // newUserForReturn.isAdmin = formObj.isAdmin;
    // newUserForReturn.affiliation = formObj.affiliation;


    this.dialogRef.close(this.form.value);
  }


  /**
   * gets the initials of the user based on the first and last name, in case these
   * fields were edited.
   */
  public updateInitials(fName: string, lName: string) {
    var result: string = "";
    
    if (fName.length > 0) {
      result += fName[0];
    }

    if (lName.length > 0) {
      result += lName[0];
    }

    return result;
  }


  /**
   * Returns the name of the rank for the number provided.
   * @param numericRank : A numeric representation of a NOSES rank.
   */
  public getRankName_FromNumber(numericRank: number): string {
    if (numericRank < 0 || numericRank > 3) {
      return "Invalid Rank";
    }
    else {
      return this.userLevelNames[numericRank];
    }
  }


  /**
   * 
   */
  onNoClick(): void {
    console.log("Inside OnNoClick()");
    console.log(this.form.value);
    this.dialogRef.close();
  }
}
