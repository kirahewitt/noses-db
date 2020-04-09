import { Component, Inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { MatTableModule, MatTableDataSource, MatPaginator, MatSelect, MatDialog, MatDialogRef, MatTooltip, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { sqlUser, User_Observer_Obj, user_forCreateNewUser_byAdmin } from '../_supporting_classes/sqlUser';
import { AuthService } from "../_services/auth.service";
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { NewUserDialogComponent } from '../new-user-dialog/new-user-dialog.component';
import { Observable } from 'rxjs';
import { ManageAccountsService } from '../_services/manage-accounts.service';





/**
 * Interface to simplify holding onto the dialog data
 */
export interface DialogData {
  loginID: string;
  fullname: string;
  password: string;
  isAdmin: number;
  affiliation: string;
  email: string;
}



export class User_Observer_Obj_v2 {

  // fields for the Users entity set
  public userId: number;
  public username: string;
  public initials: string;
  public isAdmin: number;
  public affiliation: string;
  public email: string;
  public obsId: number;
  public isVerifiedByAdmin: number;
  public firstName: string;
  public lastName: string;
  public oldPassword? : string;
  public newPassword? : string;
  public newPasswordConfirm? : string;

  // fields for the Observers entity set

  constructor() {
    this.userId = -1;
    this.username = "";
    this.initials = "";
    this.isAdmin = -1;
    this.affiliation = "";
    this.email = "";
    this.obsId = -1;
    this.isVerifiedByAdmin = -1;
    this.firstName = "";
    this.lastName = "";
    this.oldPassword = "";
    this.newPassword = "";
    this.newPasswordConfirm = "";
  }
}




/**
 * ---------------------------------------------------------------------------------------------------------
 * COMPONENT - ManageAccountsComponent
 * ---------------------------------------------------------------------------------------------------------
 * 
 * ***** sql User ***** //
 *   LoginID: string;
 *   Fullname: string;
 *   isAdmin: number;
 *   Affiliation: string;
 *   email: string;
 * *********************
 * 
 */
@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.scss']
})
export class ManageAccountsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public users: sqlUser[];
  public userData: any;
  public displayedColumns: string[] = ['Fullname', 'Affiliation', 'isAdmin', 'email', 'editUser', 'remUser' ];
  public show: boolean = false;
  public addUser_promise: any;

  // objects for fixed manage-accounts
  public userList_forDisplay: User_Observer_Obj[];
  public dataSource_forDisplay: MatTableDataSource<User_Observer_Obj>;
  public columns_forDisplay: string[];
  public userLevelNames: string[];

  public selectedUserObsObj: User_Observer_Obj;


  /**
   * @param apiService : A reference to the rest API
   * @param authService : Reference to the service responsible for authorizing a user
   * @param afAuth : Reference to the angular service for Firebase.
   * @param dialogMaterialService : Reference to the MatDialog service, which simplifies creating angular material 
   * dialogue popups
   */
  constructor(private apiService: FlaskBackendService, public manageAccountsService: ManageAccountsService, public authService: AuthService, public afAuth: AngularFireAuth, public dialogMaterialService: MatDialog, public changeDetectorRef: ChangeDetectorRef) { 
    let tempUser: User_Observer_Obj = new User_Observer_Obj();
    this.columns_forDisplay = Object.getOwnPropertyNames(tempUser);
    this.userLevelNames = ["Awaiting Account Approval", "Citizen Scientist", "Field Leader", "Admin"];

    // set up the table for an empty list of users
    this.userList_forDisplay = [];
    this.dataSource_forDisplay = new MatTableDataSource<User_Observer_Obj>(this.userList_forDisplay);
    

    this.selectedUserObsObj = new User_Observer_Obj();
  }


  /**
   *  Sets up the subscriptions for ansynchronous data this component is dependent upon. 
   */
  public ngOnInit() {
    let userList_bs = this.manageAccountsService.getUserObserverList_datastream();
    userList_bs.subscribe( (response : User_Observer_Obj[]) => {
        console.log("Received Data in Angular Component from Subscription: ");
        console.log(response);

        // initialize the local variables.
        this.userList_forDisplay = response;
        this.dataSource_forDisplay.data = this.userList_forDisplay;
        this.dataSource_forDisplay.paginator = this.paginator;
    });
  }


  /**
   * Causes a dialog to appear that contains a form, which is used to edit the records uploaded
   *  to the browser, validated and corrected, and sent to the DB.
   * @param userObsObj : An object containing all the main fields of the User.
   */
  public openEditUserDialog(userObsObj: User_Observer_Obj): void {
    event.preventDefault();

    //initialize the selectedUserObsObj w/ the input variable
    this.selectedUserObsObj.userId = userObsObj.userId;
    this.selectedUserObsObj.username = userObsObj.username;
    this.selectedUserObsObj.initials = userObsObj.initials;
    this.selectedUserObsObj.isAdmin = userObsObj.isAdmin;
    this.selectedUserObsObj.affiliation = userObsObj.affiliation;
    this.selectedUserObsObj.email = userObsObj.email;
    this.selectedUserObsObj.obsId = userObsObj.obsId;
    this.selectedUserObsObj.isVerifiedByAdmin = userObsObj.isVerifiedByAdmin;
    this.selectedUserObsObj.firstName = userObsObj.firstName;
    this.selectedUserObsObj.lastName = userObsObj.lastName;

    // establish the settings for our dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    
    // establish the data that will be passed to the dialog
    dialogConfig.data = { masterObj: this.selectedUserObsObj };

    // create a reference to the dialog
    const dialogRef = this.dialogMaterialService.open(EditUserDialogComponent, dialogConfig);
     
    // set up a subcription to receive any modified data from the dialog after it is closed
    dialogRef.afterClosed().subscribe( (result: User_Observer_Obj) => {
      
      if (result != undefined) {
        console.log("Resulting object we receive from the edit dialog");
        console.log(result);

        console.log("Now sending the combined user observer object to the DB")

        this.manageAccountsService.updateUserObserverTuplePair(result);
      }
    });
  }


  /**
   * 
   */
  public openAddUserDialog(): void {
    event.preventDefault();

    // establish the settings for our dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    
    // // establish the data that will be passed to the dialog
    // dialogConfig.data = null;

    // create a reference to the dialog
    const dialogRef = this.dialogMaterialService.open(NewUserDialogComponent, dialogConfig);
     
    // set up a subcription to receive any modified data from the dialog after it is closed
    dialogRef.afterClosed().subscribe( (result: user_forCreateNewUser_byAdmin) => {
      
      if (result != undefined) {
        console.log("Resulting object we receive from the edit dialog");
        console.log(result);

        console.log("Now sending the combined user observer object to the DB")

        this.manageAccountsService.addNewUser(result);
      }
    });
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
   * Shouldn't consider this to be just a delete. It's really a delete and a refresh, 
   * so it needs to update the dataSource.
   * @param row 
   */
  public removeUser(row: any) {
    console.log(row);

    this.apiService.removeUser(JSON.stringify(row)).then(msg => {
        // this.dataSource_forDisplay = new MatTableDataSource(<any> msg);
        this.dataSource_forDisplay = new MatTableDataSource<User_Observer_Obj>(msg);
      });
  }


  /** */
  public removeUser_viaObservable(userObsObj: User_Observer_Obj) {
    console.log("HERE IS THE ROW");
    console.log(userObsObj);

    this.manageAccountsService.removeUser(userObsObj);

    let usersAfterRemoval_obs: Observable<User_Observer_Obj[]> = this.apiService.removeUserHavingEmail(JSON.stringify(userObsObj));
    usersAfterRemoval_obs.subscribe((updatedUsers : User_Observer_Obj[]) => {
      this.userList_forDisplay = updatedUsers;
      this.dataSource_forDisplay = new MatTableDataSource<User_Observer_Obj>(updatedUsers);
    });
  }


}
