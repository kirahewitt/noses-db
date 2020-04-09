import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { ResetPasswordFormObject } from '../_supporting_classes/ResetPasswordFormObject';
import { ErrorStateMatcher } from '@angular/material';


/**
 * All this class does is provide us access to the isErrorState method via the ErrorStateMatcher
 * interface. We're going to create an instance of this object and ultimately attach it to
 * a form control for which we want to display multi-control-dependent error messages.
 */
export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean
  {
    return (control.invalid || form.invalid);
  }
}



/**
 * 
 */
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public form : FormGroup;
  public resetPassFormObj : ResetPasswordFormObject; 
  public passwordErrorStateMatcher : PasswordErrorStateMatcher; 


  /**
   * @param formBuilder : syntactic sugar for form building
   * @param apiService : injected service which will allow us to submit our password change request.
   */
  constructor(private formBuilder : FormBuilder, private apiService: FlaskBackendService) { 
    this.resetPassFormObj = new ResetPasswordFormObject();
    this.passwordErrorStateMatcher = new PasswordErrorStateMatcher();
  }


  /**
   * 
   */
  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [this.resetPassFormObj.email, Validators.required],
      oldPassword: [this.resetPassFormObj.oldPassword, Validators.required],
      newPassword: [this.resetPassFormObj.newPassword, Validators.required],
      newPasswordConfirm: [this.resetPassFormObj.newPasswordConfirm, Validators.required]
    },
    {validator: this.passwordsMatchValidator});
  }


  /**
   * This validator method determines whether the two form fields 'newPassword' and 'newPasswordConfirm' match.
   * If the two fields match, it returns null.
   * If they do not match, it returns an object consisting of an error name, and a boolean true value,
   * to indicate that the form has violated the requirement of this validity check.
   * @param g 
   */
  public passwordsMatchValidator(g: FormGroup) {
    let p = g.get('newPassword').value;
    let pc = g.get('newPasswordConfirm').value;
    return p === pc ? null : {passwordPairMismatch : true};
  }


  /**
   * 
   */
  public submitChangePasswordRequest() {
    console.log("submitChangePasswordRequest()... Angular Component.");
    console.log("...submitting the object:");
    console.log(this.form.value);

    let userPasswordData: ResetPasswordFormObject = this.form.value;

    let submitUserPasswordData_obs = this.apiService.submitUserPasswordChangeRequest(userPasswordData);
    submitUserPasswordData_obs.subscribe( () => {
      console.log("Reset Password component... Operation Complete");
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
