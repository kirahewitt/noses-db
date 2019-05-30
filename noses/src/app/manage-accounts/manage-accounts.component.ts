import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { MatTableModule, MatTableDataSource, MatPaginator } from '@angular/material';
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

// ***** sql User ***** //
//   LoginID: string;
//   Fullname: string;
//   isAdmin: number;
//   Affiliation: string;
//   email: string;


  constructor(private apiService: FlaskBackendService,
              public authService: AuthService,
              public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem("user"));
    console.log(USER_DATA);
    this.dataSource = new MatTableDataSource<sqlUser>(USER_DATA);
    this.dataSource.paginator = this.paginator;


  }

}











