export class ResetPasswordFormObject {

  public email? : string;
  public oldPassword? : string;
  public newPassword? : string;
  public newPasswordConfirm? : string;
  
  constructor() {
    this.email = "";
    this.oldPassword = "";
    this.newPassword = "";
    this.newPasswordConfirm = "";
  }
  
}