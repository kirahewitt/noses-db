import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { ResetPasswordFormObject } from '../_supporting_classes/ResetPasswordFormObject';

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


  /**
   * @param formBuilder : syntactic sugar for form building
   * @param apiService : injected service which will allow us to submit our password change request.
   */
  constructor(private formBuilder : FormBuilder, private apiService: FlaskBackendService) { 
    this.resetPassFormObj = new ResetPasswordFormObject();
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
    });
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
