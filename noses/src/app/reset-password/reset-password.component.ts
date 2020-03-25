import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
      email: [this.resetPassFormObj.email, []],
      oldPassword: [this.resetPassFormObj.oldPassword, []],
      newPassword: [this.resetPassFormObj.newPassword, []],
      newPasswordConfirm: [this.resetPassFormObj.newPasswordConfirm, []]
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

}
