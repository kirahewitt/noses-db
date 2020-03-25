import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { Observations } from  '../_supporting_classes/Observations';
import { MatTableModule, MatTableDataSource, MatPaginator, MatSelect, MatProgressSpinner, } from '@angular/material';
import { FormControl } from '@angular/forms';
import { AuthService } from "../_services/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { SealDataService } from "../_services/seal-data.service";
import { Router } from "@angular/router";
import { AdminService } from "../_services/admin.service";
import { SelectFilterType } from "./filter-type-selector"

@Component({
  selector: 'app-all-observations',
  templateUrl: './all-observations.component.html',
  styleUrls: ['./all-observations.component.scss']
})
export class AllObservationsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  filters: string[] = [];

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
  isAdmin=false;
  notReady = true;
  displayedColumns: any;
  admin: any;

  yearControl = new FormControl('');
  partialControl = new FormControl('');
  filterTypeControl = new FormControl('');

  filterss = [{name:"Breeding Season", value:"2019"}, {name:"Tag", value:"T3456"}];


  /**
   * 
   * @param apiService 
   * @param authService 
   * @param afAuth 
   * @param sealData 
   * @param adminStatus 
   * @param router 
   */
  constructor(private apiService: FlaskBackendService,
              public authService: AuthService,
              public afAuth: AngularFireAuth,
              private sealData: SealDataService,
              private adminStatus: AdminService,
              public router: Router) { }




  /**
   * 
   */
  ngOnInit() {

    this.apiService.readObs().subscribe( (observations: any) => {
      if(this.isAdmin) {
        this.displayedColumns = ['ObservationID', 'Tags', 'Marks', 'Sex', 'Age Class', 'Comments', 'viewSeal' ];
        this.notReady = false;
      } else {
        this.displayedColumns = ['ObservationID', 'Tags', 'Marks', 'Sex', 'Age Class', 'Comments', 'viewSeal'];
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
        this.setAdmin();
        // console.log(this.userData)
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });

  }

  public objectToCSV(data: any) {
    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));
    // console.log(csvRows);

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = String(row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      // console.log(values.join(','));
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  public download(data: any) {
    const blob = new Blob([data], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'seals.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  public getPartialTag() {
    console.log(this.partialControl.value);
    var part = {'part': this.partialControl.value};
    console.log(JSON.stringify(part));
    this.apiService.getPartials(JSON.stringify(part)).then(matches => {
          this.runSealQuery(matches);
        });

    // need to get the query and then runSealQuery(queryData)
  }

  public downloadCSV() {
    console.log("in download");
    var data = this.dataSource.filteredData;
    var csvObj = this.objectToCSV(data);
    this.download(csvObj);
  }

  public runSealQuery(obs: any) {
    this.dataSource = new MatTableDataSource(<any> obs);
    console.log(this.dataSource.data[0]);
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      this.filterTag1 = String(data.T1).toLowerCase();
      this.filterTag2 = String(data.T2).toLowerCase();
      this.filterMark1 = String(data.Mark).toLowerCase();
      return this.filterTag1.includes(filter) || this.filterTag2.includes(filter) || this.filterMark1.includes(filter);
    };

  }

  public facetSetup(obs: any) {

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

  public selectDate(event: any) {
    this.filterYear = String(event.value);
    console.log(this.filterYear);
  }

  public selectGender(event: any) {
    this.filterGender = String(event.value);
    console.log(this.filterGender);
  }

  public selectAge(event: any) {
    this.filterAge = String(event.value);
    console.log(this.filterAge)
  }

  public filterObs() {
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
    //     console.log("here");
    //   return String(elem.Sex) == this.filterGender;
    //   });
    // }
    this.runSealQuery(tempObs);

  }

  public resetObs() {
    this.selectedYear = undefined;
    this.selectedYear = undefined;
    this.runSealQuery(this.observations);
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public selectSeal(row) {
    this.sealData.setCurrentSealState(row);
    this.router.navigate(["seal-page"]);
  }

  public setAdmin() {
    var getAdStatus = JSON.stringify({'email': this.userData.email});
    this.apiService.getAdminStatus(getAdStatus).then(msg => {
      this.admin = msg
      this.admin = this.admin[0].isAdmin;
      this.adminStatus.updatePermissionLevel(this.admin);
      this.setPriveleges();
    });
  }

  public setPriveleges() {
    if(this.admin == 3) {
      this.isAdmin = true;
    } else if(this.admin == 2) {
      this.isAdmin = true;
    }
    else {
      this.isAdmin = false;
    }
  }

  public deleteSeal(row) {
    this.obsID = { 'obsID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
    console.log('about to call delete');

    this.apiService.deleteObs(JSON.stringify(this.obsID)).subscribe(() => this.apiService.readObs());
  }
}
