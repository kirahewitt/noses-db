import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { MatTableModule, MatTableDataSource, MatPaginator, MatSelect, MatDialog, MatDialogRef, MatTooltip, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { sqlUser, User_Observer_Obj } from '../_supporting_classes/sqlUser';
import { AuthService } from "../_services/auth.service";



/**
 * 
 */
@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {

  public form : FormGroup; // need an object to hold the form object
  public editedUser : User_Observer_Obj; // need an object to fill the form
  public userLevelNames: string[]

  /**
   * Constructor for this Angular Component. 
   * @param dialogRef 
   * @param injectedData 
   * @param apiService 
   */
  constructor(private formBuilder : FormBuilder, 
      private apiService: FlaskBackendService, 
      public dialogRef: MatDialogRef<EditUserDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public injectedData) 
  {
    this.editedUser = new User_Observer_Obj();

    // save the injected data as an actual object whose type i know
    this.editedUser = injectedData.masterObj; 
    console.log("Current value of the user after overwriting with the injectedData...");
    console.log(this.editedUser);

    this.userLevelNames = ["Awaiting Account Approval", "Citizen Scientist", "Field Leader", "Admin"];
  }


  /**
   * Connects the user object to the form so if changes are made to the form, 
   * the values in the newUser object will be automatically updated.
   */
  public ngOnInit() {
    this.form = this.formBuilder.group({
      userId  : [this.editedUser.userId, Validators.required],
      username  : [this.editedUser.username, Validators.required],
      initials  : [this.editedUser.initials, Validators.required],
      isAdmin  : [this.editedUser.isAdmin, Validators.required],
      affiliation  : [this.editedUser.affiliation, Validators.required],
      email : [this.editedUser.email, Validators.required],
      obsId : [this.editedUser.obsId, Validators.required],
      isVerifiedByAdmin : [this.editedUser, Validators.required],
      firstName : [this.editedUser.firstName, Validators.required],
      lastName : [this.editedUser.lastName, Validators.required],
    });
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
    this.dialogRef.close(this.form.value);
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
    // this.data = undefined;
    this.dialogRef.close();
  }

}
