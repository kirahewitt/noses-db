import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { MatTableModule,
        MatTableDataSource,
        MatPaginator,
        MatSelect,
        MatDialog,
        MatDialogRef,
        MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { FlaskBackendService } from '../flask-backend.service';
import { sqlUser } from '../sqlUser';
import { AuthService } from "../auth.service";


const USER_DATA: sqlUser[] = [
  {LoginID: 1, Fullname: 'Raquel Bonilla', isAdmin: 1, Affiliation: 'Developer', email: 'raquelb.2014@gmail.com'},
  {LoginID: 2, Fullname: 'Lewanite', isAdmin: 1, Affiliation: 'CalPoly', email: 'l1@gmail.com'},
  {LoginID: 3, Fullname: 'Lewanite1', isAdmin: 0, Affiliation: 'CalPoly', email: 'l2@gmail.com'},
  {LoginID: 4, Fullname: 'Lewanite2', isAdmin: 0, Affiliation: 'CalPoly', email: 'l3@gmail.com'},
  {LoginID: 5, Fullname: 'CitSci', isAdmin: 0, Affiliation: 'Citizen Scientist', email: 'cs1@gmail.com'},
];

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.scss']
})
export class ManageAccountsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  users: sqlUser[];
  dataSource: any;
  userData: any;
  loggedInUser: any;
  displayedColumns: string[] = ['Fullname', 'Affiliation', 'isAdmin', 'email', 'editUser', 'remUser' ];
  show: boolean = false;
  add_user: any;

  animal: string;
  name: string;

  loginID: string;
  fullname: string;
  password: string;
  isAdmin: boolean;
  affiliation: string;
  email: string;

// ***** sql User ***** //
//   LoginID: string;
//   Fullname: string;
//   isAdmin: number;
//   Affiliation: string;
//   email: string;

  constructor(private apiService: FlaskBackendService,
              public authService: AuthService,
              public afAuth: AngularFireAuth,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));
    console.log(this.loggedInUser);
    this.dataSource = new MatTableDataSource<sqlUser>(USER_DATA);
    this.dataSource.paginator = this.paginator;

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '650px',
      data: {loginid: this.loginID, fullname: this.animal, password: this.password,
              isAdmin: this.isAdmin, affiliation: this.affiliation, email: this.email},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      // this.afAuth.authState.subscribe((authState) => { authState.delete(); });
      if(result !== undefined) {
        this.add_user = this.apiService.addUser(JSON.stringify(result));
        this.add_user.then(users => {
          this.dataSource = new MatTableDataSource(<any> users);
          console.log(users);
        });
      }


      //this.authService.SignUp("rockib13@gmail.com", "password");

      // **** unable to create an account and NOT sign in with it...
      // https://stackoverflow.com/questions/37730712/how-to-just-create-an-user-in-firebase-3-and-do-not-authenticate-it

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

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiService: FlaskBackendService) {}

  onNoClick(): void {
    this.data = undefined;
    this.dialogRef.close();
  }



}











