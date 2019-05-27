import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { FlaskBackendService } from '../flask-backend.service';
import { Observations } from  '../Observations';
import { MatTableModule, MatTableDataSource, MatPaginator } from '@angular/material';
import { AuthService } from "../auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userData: any;
  observations: Observations[];
  dataSource: any;
  obsID: any;
  tag1: string;
  mark1: string;
  displayedColumns: string[] = ['ObservationID', 'TagNumber1', 'TagNumber2', 'Mark', 'Year', 'actions' ];
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private apiService: FlaskBackendService,
              public authService: AuthService,
              public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.apiService.readObs().subscribe((observations: any)=>{
      this.observations = observations;
      this.dataSource = new MatTableDataSource(<any> observations);
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);
    });
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
        // console.log(this.userData)
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectRow(row) {
    console.log(row['ObservationID']);
    this.obsID = { 'obsID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
    console.log(JSON.stringify(this.obsID));

    this.apiService.deleteObs(JSON.stringify(this.obsID)).subscribe(() => this.apiService.readObs());

 }
}
