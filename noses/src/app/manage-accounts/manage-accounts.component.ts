import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { MatTableModule, MatTableDataSource, MatPaginator, MatSelect, MatDialog, MatDialogRef, MatTooltip, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { sqlUser, User_Observer_Obj } from '../_supporting_classes/sqlUser';
import { AuthService } from "../_services/auth.service";
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';




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
  public dataSource: MatTableDataSource<sqlUser>;
  public userData: any;
  public loggedInUser: any;
  public displayedColumns: string[] = ['Fullname', 'Affiliation', 'isAdmin', 'email', 'editUser', 'remUser' ];
  public show: boolean = false;
  public addUser_promise: any;

  public animal: string;
  public name: string;

  public loginID: string;
  public fullname: string;
  public password: string;
  public isAdmin: number;
  public affiliation: string;
  public email: string;

  // objects for fixed manage-accounts
  public userList_forDisplay: User_Observer_Obj[];
  public dataSource_forDisplay: MatTableDataSource<User_Observer_Obj>;
  public columns_forDisplay: string[];
  public userLevelNames: string[];


  /**
   * @param apiService : A reference to the rest API
   * @param authService : Reference to the service responsible for authorizing a user
   * @param afAuth : Reference to the angular service for Firebase.
   * @param dialog : Reference to the MatDialog service, which simplifies creating angular material 
   * dialogue popups
   */
  constructor(private apiService: FlaskBackendService, public authService: AuthService, public afAuth: AngularFireAuth, public dialog: MatDialog) { 

    // OLD
    this.users = [];

    // NEW initialize the objects we need for improved class
    let tempUser: User_Observer_Obj = new User_Observer_Obj();
    this.columns_forDisplay = Object.getOwnPropertyNames(tempUser);
    this.userList_forDisplay = [];
    this.userLevelNames = ["Awaiting Account Approval", "Citizen Scientist", "Field Leader", "Admin"];
  }


  /**
   *  Sets up the subscriptions for ansynchronous data this component is dependent upon. 
   */
  public ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));

    // console.log(this.loggedInUser);
    // this.dataSource = new MatTableDataSource<sqlUser>(USER_DATA);

    // OLD version that doesn't work
    // let allUsers_obs = this.apiService.getUsers();
    // allUsers_obs.subscribe((users: any)=>{
    //   this.users = users;
    //   this.dataSource = new MatTableDataSource<sqlUser>(users);
    //   this.dataSource.paginator = this.paginator;
    // });

    // IMPROVED VERSION
    let userList_obs = this.apiService.getUserList();
    userList_obs.subscribe( (response : User_Observer_Obj[]) => {
      
      // verify that we're actually receiving the right stuff from the DB
      console.log("Received Data in Angular Component from Subscription: ");
      console.log(response);

      // initialize the local variables.
      this.userList_forDisplay = response;
      this.dataSource_forDisplay = new MatTableDataSource<User_Observer_Obj>(response);
      this.dataSource.paginator = this.paginator;
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
   * 
   * @param row 
   */
  public removeUser(row: any) {
    console.log(row);

    this.apiService.removeUser(JSON.stringify(row)).then(msg => {
        this.dataSource = new MatTableDataSource(<any> msg);
      });
  }

  /**
   * Opens a dialogue which allows you to add a new user.
   */
  public openDialog(): void {

    // create a reference to the dialog
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '650px',
      data: { loginid: this.loginID, 
              fullname: this.animal, 
              password: this.password,
              isAdmin: this.isAdmin, 
              affiliation: this.affiliation, 
              email: this.email }
    });

    // subscribe to the result of the closed dialogue to do stuff with the form data
    let dialogResult_obs = dialogRef.afterClosed();
    dialogResult_obs.subscribe(result => {
      
      console.log('The dialog was closed');

      if(result !== undefined) {

        console.log(result);
        let result_json = JSON.stringify(result);


        this.addUser_promise = this.apiService.getPromise_addUser(result_json);

        this.addUser_promise.then(users => {
          
          // No way in hell should we ever just get the number 1 as a string from this asynchronous method. bullshit.
          if (users == "1") {
            alert("user not created, duplicate username or email");
          } 
          else {
            this.dataSource = new MatTableDataSource(<any> users);
            this.authService.SignUp(result.email, result.password);
          }

        });
      }

      // **** unable to create an account and NOT sign in with it...
      // https://stackoverflow.com/questions/37730712/how-to-just-create-an-user-in-firebase-3-and-do-not-authenticate-it

    });
  }



  /**
   * 
   * @param row 
   */
  public openEditUserDialog(row: any): void {

    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: {isAdmin: this.isAdmin},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result !== undefined) {
        var user = { 'isAdmin':result['isAdmin'], 'email': row.email};
        this.apiService.updateUser(JSON.stringify(user)).then(msg => {
          this.dataSource = new MatTableDataSource(<any> msg);
        });
      }
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./manage-accounts.component.scss']
})
export class DialogOverviewExampleDialog {

  selectAdmin = "No";
  userObj: any;

  loginID: string;
  fullname: string;
  password: string;
  isAdmin: boolean;
  affiliation: string;
  email: string;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiService: FlaskBackendService) {}

  onNoClick(): void {
    // this.data = undefined;
    this.dialogRef.close();
  }



}











