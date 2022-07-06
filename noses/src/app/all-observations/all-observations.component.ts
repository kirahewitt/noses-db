import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { Observations } from '../_supporting_classes/Observations';
import { MatTableModule, MatTableDataSource, MatPaginator, MatSelect, MatProgressSpinner, } from '@angular/material';
import { FormControl } from '@angular/forms';
import { AuthService } from "../_services/auth.service";
import { MdbTableDirective } from 'angular-bootstrap-md';
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { SealDataService } from "../_services/seal-data.service";
import { Router } from "@angular/router";
import { AdminService } from "../_services/admin.service";
import { DossierViewHelperService } from '../_services/dossier-view-helper.service';
import { element } from 'protractor';

@Component({
  selector: 'app-all-observations',
  templateUrl: './all-observations.component.html',
  styleUrls: ['./all-observations.component.scss']
})
export class AllObservationsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

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
  isAdmin = false;
  notReady = true;
  displayedColumns: any;
  admin: any;

  yearControl = new FormControl('');
  partialControl = new FormControl('');
  filterTypeControl = new FormControl('');

  filterss = [{ name: "Breeding Season", value: "2019" }, { name: "Tag", value: "T3456" }];

  @ViewChild(MdbTableDirective, { static: true })
  public mdbTable: MdbTableDirective;
  public elements: any = [];
  public headElements = ['Date', 'Age Class', 'Sex', 'Tags', 'Marks', 'View Seal'];
  public searchText: string = '';
  public previous: string;
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
    private dossierHelperService: DossierViewHelperService,
    public router: Router) { }




  /**
   * 
   */
  ngOnInit() {

    this.apiService.readObs().subscribe((observations: any) => {
      if (this.isAdmin) {
        this.displayedColumns = ['Date', 'Age Class', 'Sex', 'Tags', 'Marks', 'viewSeal'];
        this.notReady = false;
      } else {
        this.displayedColumns = ['Date', 'Age Class', 'Sex', 'Tags', 'Marks', 'viewSeal'];
        this.notReady = false;
      }
      this.observations = observations;
      console.log("Observation size: " + this.observations.length);
      this.elements = observations;
      observations.forEach((element, ind) => {
        this.elements[ind].Tags = element.Tags.join(', ');
        this.elements[ind].Marks = element.Marks.join(', ');

      });
      console.log(this.elements);
      this.mdbTable.setDataSource(this.elements);
      this.previous = this.mdbTable.getDataSource();
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
    const blob = new Blob([data], { type: 'text/csv' });
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
    var part = { 'part': this.partialControl.value };
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
    this.dataSource = new MatTableDataSource(<any>obs);
    console.log(this.dataSource.data[0]);
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
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

    this.uniqDates = uniq.filter(function (elem, index, self) {
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

    if (this.filterYear != "Any") {
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
    let selectedSealdId: number = row['SealID'];
    this.dossierHelperService.populateViaSealId(selectedSealdId);

    this.sealData.setCurrentSealState(row);
    this.router.navigate(["seal-page"]);
  }

  public setAdmin() {
    var getAdStatus = JSON.stringify({ 'email': this.userData.email });
    this.apiService.getAdminStatus(getAdStatus).then(msg => {
      this.admin = msg
      this.admin = this.admin[0].isAdmin;
      this.adminStatus.updatePermissionLevel(this.admin);
      this.setPriveleges();
    });
  }

  public setPriveleges() {
    if (this.admin == 3) {
      this.isAdmin = true;
    } else if (this.admin == 2) {
      this.isAdmin = true;
    }
    else {
      this.isAdmin = false;
    }
  }

  /**
 * Receives a Javascript Date object and converts it to a string of the form MM/DD/YYYY
 */
  public convertDateObjToDateString(dateObj: Date): string {
    let result: string = "";

    if (dateObj == null) {
      return result;
    }

    // Date will be off by one day without this step
    var temp = new Date(dateObj);
    var d = new Date(temp.getTime() + Math.abs(temp.getTimezoneOffset() * 60000));

    console.log("\n\n WE ARE INSIDE THE CONVERSION FUNCTION \n\n");
    result += (d.getMonth() + 1).toString() + "/" + (d.getDate()).toString() + "/" + d.getFullYear().toString();
    return result;
  }

  public deleteObs(row) {
    // this.obsID = { 'obsID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
    console.log(row);
    var obsID = { 'obsID': row.ObservationID };
    console.log('about to call delete');

    this.apiService.deleteObs(JSON.stringify(obsID)).subscribe(() => this.apiService.readObs());
  }

  public matchRuleShort(str, rule) {
    var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    var returnVal = new RegExp("^" + rule.split("_").map(escapeRegex).join(".+") + "$").test(str);
    return returnVal
  }

  public searchItems() {
    const prev = this.mdbTable.getDataSource();
    console.log("Search text: " + this.searchText);

    if (this.searchText.indexOf('_') >= 0) {
      var results = [];
      for (var obs of this.observations) {
        if (this.matchRuleShort(obs['Marks'], this.searchText) || this.matchRuleShort(obs['Tags'], this.searchText)) {
          console.log(obs);
          results.push(obs);
        }
      }
      this.elements = results;
    } else {

      if (!this.searchText) {
        this.mdbTable.setDataSource(this.previous);
        this.elements = this.mdbTable.getDataSource();
      }
      if (this.searchText) {
        this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['AgeClass', 'Sex', 'Tags', 'Marks']);
        this.mdbTable.setDataSource(prev);
      }
    }
  }
}
