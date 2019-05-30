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
import { SealDataService } from "../seal-data.service";
import { Router } from "@angular/router";

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

  filterTag1: any;
  filterTag2: any;
  filterMark1: any;
  displayedColumns: string[] = ['ObservationID', 'TagNumber1', 'TagNumber2', 'Mark', 'Year',  'viewSeal', 'actions' ];


  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private apiService: FlaskBackendService,
              public authService: AuthService,
              public afAuth: AngularFireAuth,
              private sealData: SealDataService,
              public router: Router) { }

  ngOnInit() {
    this.apiService.readObs().subscribe((observations: any)=>{
      this.observations = observations;
      this.dataSource = new MatTableDataSource(<any> observations);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        this.filterTag1 = String(data.TagNumber1).toLowerCase();
        this.filterTag2 = String(data.TagNumber2).toLowerCase();
        this.filterMark1 = String(data.Mark).toLowerCase();
        return this.filterTag1.includes(filter) || this.filterTag2.includes(filter) || this.filterMark1.includes(filter);
      };
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

  selectSeal(row) {
    this.sealData.changeMessage(row);
    this.router.navigate(["seal-page"]);


  }

  deleteSeal(row) {
    this.obsID = { 'obsID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
    console.log('about to call delete');

    this.apiService.deleteObs(JSON.stringify(this.obsID)).subscribe(() => this.apiService.readObs());

 }
}
