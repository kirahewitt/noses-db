import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { MatTableModule,
        MatTableDataSource,
        MatPaginator,
        MatSelect,
        MatDialog,
        MatDialogRef,
        MatTooltip,
        MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { FlaskBackendService } from '../flask-backend.service';
import { sqlUser } from '../sqlUser';
import { AuthService } from "../auth.service";
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

export interface DialogData {
  loginID: string;
  fullname: string;
  password: string;
  isAdmin: number;
  affiliation: string;
  email: string;
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
  isAdmin: number;
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
    //console.log(this.loggedInUser);
    // this.dataSource = new MatTableDataSource<sqlUser>(USER_DATA);

     this.apiService.getUsers().subscribe((users: any)=>{
      this.users = users;
      this.dataSource = new MatTableDataSource<sqlUser>(users);
      this.dataSource.paginator = this.paginator;
    });

  }

  getMoreInformation(): string {
   return '3 = Admin \n2 = Can add/approve observations\n1 = Needs approval';
   }

   removeUser(row: any) {
    console.log(row);
    this.apiService.removeUser(JSON.stringify(row)).then(msg => {
        this.dataSource = new MatTableDataSource(<any> msg);
      });

   }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '650px',
      data: {loginid: this.loginID, fullname: this.animal, password: this.password,
              isAdmin: this.isAdmin, affiliation: this.affiliation, email: this.email},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result !== undefined) {
        console.log(result);
        this.add_user = this.apiService.addUser(JSON.stringify(result));
        this.add_user.then(users => {
          if(users == "1") {
            alert("user not created, duplicate username or email");
          } else {
            this.dataSource = new MatTableDataSource(<any> users);
            this.authService.SignUp(result.email, result.password);
          }

        });
      }
      // **** unable to create an account and NOT sign in with it...
      // https://stackoverflow.com/questions/37730712/how-to-just-create-an-user-in-firebase-3-and-do-not-authenticate-it

    });
  }

  openEditUserDialog(row: any): void {
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











