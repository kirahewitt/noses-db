import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { FlaskBackendService } from '../flask-backend.service';
import { Observations } from  '../Observations';
import { MatTableModule, MatTableDataSource, MatPaginator, MatSelect, MatProgressSpinner, } from '@angular/material';
import {FormControl } from '@angular/forms';
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
  uniqDates: any = [];
  uniqAgeClass: any = ["SA", "W", "P", "Any"]; // when I get the data I will change this
  uniqGender: any = ["M", "F ", "Any"]; // when I get the data I will change this

  filterSealsBy: any;
  filterYear: String;
  filterAge: String;
  filterGender: String;

  selectedYear: any;

  filterTag1: any;
  filterTag2: any;
  filterMark1: any;
  isAdmin=true;
  notReady = true;
  displayedColumns: any;



  yearControl = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private apiService: FlaskBackendService,
              public authService: AuthService,
              public afAuth: AngularFireAuth,
              private sealData: SealDataService,
              public router: Router) { }

  ngOnInit() {

    this.apiService.readObs().subscribe((observations: any)=>{
      if(this.isAdmin) {
        this.displayedColumns = ['ObservationID', 'TagNumber1', 'TagNumber2', 'Mark', 'Year',  'viewSeal', 'actions' ];
        this.notReady = false;
      } else {
        this.displayedColumns = ['ObservationID', 'TagNumber1', 'TagNumber2', 'Mark', 'Year',  'viewSeal'];
        this.notReady = false;
      }
      this.observations = observations;
      this.runSealQuery(observations);
      this.facetSetup(observations);
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

  runSealQuery(obs: any) {
    this.dataSource = new MatTableDataSource(<any> obs);
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      this.filterTag1 = String(data.TagNumber1).toLowerCase();
      this.filterTag2 = String(data.TagNumber2).toLowerCase();
      this.filterMark1 = String(data.Mark).toLowerCase();
      return this.filterTag1.includes(filter) || this.filterTag2.includes(filter) || this.filterMark1.includes(filter);
    };

  }

  facetSetup(obs: any) {

    // get uniq dates
    var uniq: string[] = []
    for (var i in obs) {
     uniq[i] = obs[i].Year
    }

    this.uniqDates = uniq.filter(function(elem, index, self) {
    return index === self.indexOf(elem);
    });

    // **** use this for changing how to filter seals...probably need a reset button as well

    this.uniqDates = this.uniqDates.filter((x): x is string => x !== null);
    this.uniqDates.push("Any");
  }

  selectDate(event: any) {
    this.filterYear = String(event.value);
    console.log(this.filterYear);
  }

  selectGender(event: any) {
    this.filterGender = String(event.value);
    console.log(this.filterGender);
  }

  selectAge(event: any) {
    this.filterAge = String(event.value);
    console.log(this.filterAge)
  }

  filterObs() {
    var tempObs = this.observations;

    if(this.filterYear != "Any") {
      tempObs = tempObs.filter(elem => String(elem.Year) == this.filterYear);

    }

    // **** ADD THESE WHEN YOU GET THE QUERY INFO **********/
    // if(this.filterAge != "Any") {
    //   tempObs = tempObs.filter(function(elem, index, self) {
    //   return String(elem.AgeClass) == this.filterAge;
    //   });
    // }

    // if(this.filterGender != "Any") {
    //   tempObs = tempObs.filter(function(elem, index, self) {
    //   return String(elem.Sex) == this.filterGender;
    //   });
    // }
    this.runSealQuery(tempObs);

  }

  resetObs() {
    this.selectedYear = undefined;
    this.runSealQuery(this.observations);
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
