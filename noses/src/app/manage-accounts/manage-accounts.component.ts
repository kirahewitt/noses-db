import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { Sql_User_Profile_Pic } from '../_supporting_classes/SqlProfilePic';





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
  public displayedColumns: string[] = ['profilePicture', 'Fullname', 'Affiliation', 'isAdmin', 'email', 'editUser', 'remUser' ];
  public show: boolean = false;
  public addUser_promise: any;

  // objects for fixed manage-accounts
  public userList_forDisplay_FULL: User_Observer_Obj[];
  public userList_forDisplay_activeAccounts: User_Observer_Obj[];
  public userList_forDisplay_accountsAwaitingApproval: User_Observer_Obj[];

  public dataSource_forDisplay_activeAccounts: MatTableDataSource<User_Observer_Obj>;
  public dataSource_forDisplay_accountsAwaitingApproval: MatTableDataSource<User_Observer_Obj>;

  public columns_forDisplay: string[];
  public userLevelNames: string[];

  public selectedUserObsObj: User_Observer_Obj;

  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;
  public isAdmin:boolean;
  public isAtLeastFieldLeader:boolean;

  public userProfilePicList: Sql_User_Profile_Pic[];


  /**
   * @param apiService : A reference to the rest API
   * @param authService : Reference to the service responsible for authorizing a user
   * @param afAuth : Reference to the angular service for Firebase.
   * @param dialogMaterialService : Reference to the MatDialog service, which simplifies creating angular material 
   * dialogue popups
   */
  constructor(private apiService: FlaskBackendService, public manageAccountsService: ManageAccountsService, public authService: AuthService, public afAuth: AngularFireAuth, public dialogMaterialService: MatDialog) { 
    let tempUser: User_Observer_Obj = new User_Observer_Obj();
    this.columns_forDisplay = Object.getOwnPropertyNames(tempUser);
    this.userLevelNames = ["Awaiting Account Approval", "Citizen Scientist", "Field Leader", "Admin"];

    // set up the table for an empty list of users
    this.userList_forDisplay_FULL = [];
    this.userList_forDisplay_activeAccounts = [];
    this.userList_forDisplay_accountsAwaitingApproval = [];
    this.dataSource_forDisplay_activeAccounts = new MatTableDataSource<User_Observer_Obj>(this.userList_forDisplay_activeAccounts);
    
    

    this.selectedUserObsObj = new User_Observer_Obj();
    this.isAtLeastFieldLeader = false;
    this.isAdmin = false;

    this.userProfilePicList = [];
  }


  /**
   *  Sets up the subscriptions for ansynchronous data this component is dependent upon. 
   */
  public ngOnInit() {

    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
      this.updatePrivelege();
    });

    let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
    currentUserIsValid_datastream.subscribe( (retval : boolean) => {
      this.currentUserIsValid = retval;
      this.updatePrivelege();
    });

    let userList_bs = this.manageAccountsService.getUserObserverList_datastream();
    userList_bs.subscribe( (response : User_Observer_Obj[]) => {
        console.log("Received Data in Angular Component from Subscription: ");
        console.log(response);

        // initialize the local variables.
        this.userList_forDisplay_FULL = response;


        this.constructActiveInactiveLists(this.userList_forDisplay_FULL);

        this.dataSource_forDisplay_activeAccounts.data = this.userList_forDisplay_activeAccounts;
        this.dataSource_forDisplay_activeAccounts.paginator = this.paginator;
    });


    let userProfilePicList_bs = this.manageAccountsService.getUserProfileImageList_datastream();
    userProfilePicList_bs.subscribe( (response: Sql_User_Profile_Pic[]) => {
      this.userProfilePicList = response;
    });


  }


  /**
   * Constructs two new lists from the list containing all the user objects.
   * The first list consists of active user accounts, while the second will containg
   * only user accounts which have been requested and are awaiting approval by an admin.
   * @param userList : list of all the user tuples in the DB (with the exception of those which have been "deleted")
   */
  public constructActiveInactiveLists(userList: User_Observer_Obj[]) {
    var activeList: User_Observer_Obj[] = [];
    var inactiveList: User_Observer_Obj[] = [];

    for (let user of userList) {
      if (user.isVerifiedByAdmin == 1) {
        activeList.push(user)
      }
      else {
        inactiveList.push(user);
      }
    }

    this.userList_forDisplay_activeAccounts = activeList;
    this.userList_forDisplay_accountsAwaitingApproval = inactiveList;
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
    dialogConfig.data = { masterObj: this.selectedUserObsObj, editPermissions: true };

    // create a reference to the dialog
    const dialogRef = this.dialogMaterialService.open(EditUserDialogComponent, dialogConfig);
     
    // set up a subcription to receive any modified data from the dialog after it is closed
    dialogRef.afterClosed().subscribe(result => {
      
      if (result != undefined) {
        console.log("Resulting object we receive from the edit dialog");
        console.log(result);

        console.log("Now sending the combined user observer object to the DB")

        this.manageAccountsService.updateUserObserverTuplePair(result.user);
        if (result.newPassword != "") {
          this.manageAccountsService.updateUserPassword(result.user["email"], result.newPassword);
        }
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
        this.dataSource_forDisplay_activeAccounts = new MatTableDataSource<User_Observer_Obj>(msg);
      });
  }


  /** */
  public removeUser_viaObservable(userObsObj: User_Observer_Obj) {
    console.log("HERE IS THE ROW");
    console.log(userObsObj);

    this.manageAccountsService.removeUser(userObsObj);

    let usersAfterRemoval_obs: Observable<User_Observer_Obj[]> = this.apiService.removeUserHavingEmail(JSON.stringify(userObsObj));
    usersAfterRemoval_obs.subscribe((updatedUsers : User_Observer_Obj[]) => {
      this.userList_forDisplay_FULL = updatedUsers;

      this.constructActiveInactiveLists(this.userList_forDisplay_FULL);

      this.dataSource_forDisplay_activeAccounts = new MatTableDataSource<User_Observer_Obj>(this.userList_forDisplay_activeAccounts);
    });
  }


  /**
   * Looks through the list of profile pictures that we received from the service. If we find a match,
   * we return that image data. If we don't find any matches in the list, we return the generic profile image.
   * @param userId the user id
   */
  public getImageFor(userId: number) {
    
    console.log("Here's the list of Profile pic objects");
    console.log(this.userProfilePicList);

    if (this.userList_forDisplay_FULL.length > 0 && this.userProfilePicList.length > 0) {
      
      console.log("GET IMAGE FOR STARTED. LOOKING FOR userid: " + userId.toString())

      for (let pic of this.userProfilePicList) {
        if (pic.userId == userId) {
          return pic.pictureData;
        }
        
      }

      return "assets/userimg.png";

    }
  }


  /**
   * 
   */
  updatePrivelege() {
    if (this.currentUserIsValid == false) {
      this.isAdmin = false;
      this.isAtLeastFieldLeader = false;
    }
    else {
      if (this.loggedInUser.isAdmin == 3) {
        this.isAdmin = true;
        this.isAtLeastFieldLeader = true;
      } 
      else if(this.loggedInUser.isAdmin == 2) {
        this.isAdmin = false;
        this.isAtLeastFieldLeader = true;
      } 
      else  {
        this.isAdmin = false;
        this.isAtLeastFieldLeader = false;
      }
    }
  }

}
