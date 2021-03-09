import { Component, OnInit, ViewChild } from '@angular/core';
import { FlaskBackendService } from '../_services/flask-backend.service';
import { Observations } from '../_supporting_classes/Observations';
import { MatTableModule, MatTableDataSource, MatPaginator, MatSelect, MatProgressSpinner, } from '@angular/material';
import { FormControl } from '@angular/forms';
import { AuthService } from "../_services/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
// import { AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import { SealDataService } from "../_services/seal-data.service";
import { Router } from "@angular/router";
import { AdminService } from "../_services/admin.service";
import { DossierViewHelperService } from '../_services/dossier-view-helper.service';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { SqlSealDossier } from '../_supporting_classes/SqlSealDossier';


export interface tableJsonStructure {
  Age
}

/**
 * 
 */
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public userData: any;
  public observations: Observations[];
  public dataSource: any;

  public obsID: any;
  public tag1: string;
  public mark1: string;
  public uniqDates: any = [];
  public uniqAgeClass: any = ["SA", "W", "P", "Any"]; // when I get the data I will change this
  public uniqGender: any = ["M", "F ", "Any"]; // when I get the data I will change this

  public filterSealsBy: any;
  public filterYear: String;
  public filterAge: String;
  public filterGender: String;

  public selectedYear: any;

  public filterTag1: any;
  public filterTag2: any;
  public filterMark1: any;
  public isAdmin = false;
  public notReady = true;
  public displayedColumns: any;
  public admin: any;

  public yearControl = new FormControl('');
  public partialControl = new FormControl('');

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MdbTableDirective, { static: true })
  public mdbTable: MdbTableDirective;
  public elements: any = [];
  public headElements = ['SealID', 'Tags', 'Marks', 'Sex', 'Age Class', 'View Seal'];
  public searchText: string = '';
  public previous: string;

  /**
   * Initializes local attributes of this component class's instance.
   * Provides access to injected Angular Services.
   * @param apiService 
   * @param sealData 
   * @param adminStatus 
   * @param router 
   * @param dossierHelperService 
   */
  constructor(private apiService: FlaskBackendService, private sealData: SealDataService, private adminStatus: AdminService, public router: Router, private dossierHelperService: DossierViewHelperService) {
  }


  /**
   * Responsible for using observables to asynchonously populate the list of SqlSealDossier objects.
   */
  public ngOnInit() {

    // subscribe to the api service which provides the data we'll populate the table with
    let sealsObservable = this.apiService.readSeals();
    sealsObservable.subscribe((observations: any[]) => {

      // initialize elements to be the result of copying every element of the observations into a blank list of Objects
      // this.elements = observations.map(x => Object.assign({}, x));
      this.elements = observations;
      this.observations = observations;

      // observations.forEach((element, ind) => {
      //     this.elements[ind].Tags = element.Tags.filter(this.onlyUnique).join(', ');
      //     this.elements[ind].Marks = element.Marks.filter(this.onlyUnique).join(', ');
      // });

      this.mdbTable.setDataSource(this.elements);

      console.log(this.elements);
      console.log(this.mdbTable.getDataSource());

      this.previous = this.mdbTable.getDataSource();

      if (this.isAdmin) {
        this.displayedColumns = ['SealID', 'TagNumber1', 'Mark', 'Sex', 'Age Class', 'viewSeal'];
        this.notReady = false;
      }
      else {
        this.displayedColumns = ['SealID', 'TagNumber1', 'Mark', 'Sex', 'Age Class', 'viewSeal'];
        this.notReady = false;
      }

      //this.observations = response_observationList;
      //console.log(response_observationList[3])

      //this.runSealQuery(response_observationList);
      //this.facetSetup(response_observationList);
    });


  }


  /**
   * 
   * @param data 
   */
  public objectToCSV(data: any) {
    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = String(row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }


  /**
   * 
   * @param data 
   */
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


  /**
   * 
   */
  public getPartialTag() {

    console.log(this.partialControl.value);
    var part = { 'part': this.partialControl.value };

    console.log(JSON.stringify(part));
    this.apiService.getPartials(JSON.stringify(part))
      .then(matches => {
        this.runSealQuery(matches);
      });

    // need to get the query and then runSealQuery(queryData)
  }


  /**
   * 
   */
  public downloadCSV() {
    console.log("in download");
    var data = this.dataSource.filteredData;
    var csvObj = this.objectToCSV(data);
    this.download(csvObj);
  }


  /**
   * 
   * @param obs 
   */
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


  /**
   * 
   * @param obs 
   */
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


  /**
   * 
   * @param event 
   */
  public selectDate(event: any) {
    this.filterYear = String(event.value);
    console.log(this.filterYear);
  }


  /**
   * 
   * @param event 
   */
  public selectGender(event: any) {
    this.filterGender = String(event.value);
    console.log(this.filterGender);
  }


  /**
   * 
   * @param event 
   */
  public selectAge(event: any) {
    this.filterAge = String(event.value);
    console.log(this.filterAge)
  }


  /**
   * 
   */
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


  /**
   * 
   */
  public resetObs() {
    this.selectedYear = undefined;
    this.selectedYear = undefined;
    this.runSealQuery(this.observations);
  }


  /**
   * 
   * @param filterValue 
   */
  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  /**
   * This function is trigged by the html template when one of the blue elephant seal icons is clicked.
   * The input to this function is a json object representing one row of the table. 
   * @param row : The row in which the blue seal was clicked. These happen to correspond exactly to the sealIds. Json object.
   */
  public selectSeal(row: any) {

    // console.log("---------------------------------");
    // console.log("Entered the 'selectSeal() method!");
    // console.log("DATA RECEIVED AS INPUT TO `selectSeal()`:");
    // console.log(row);

    let selectedSealdId: number = row['SealID'];
    this.dossierHelperService.populateViaSealId(selectedSealdId);

    this.sealData.setCurrentSealState(row);
    this.router.navigate(["seal-page"]);
  }


  /**
   * 
   */
  public setAdmin() {
    var getAdStatus = JSON.stringify({ 'email': this.userData.email });
    this.apiService.getAdminStatus(getAdStatus).then(msg => {
      this.admin = msg
      this.admin = this.admin[0].isAdmin;
      this.adminStatus.updatePermissionLevel(this.admin);
      this.setPriveleges();
    });
  }


  /**
   * 
   */
  public setPriveleges() {
    if (this.admin == 3) {
      this.isAdmin = true;
    }
    else if (this.admin == 2) {
      this.isAdmin = true;
    }
    else {
      this.isAdmin = false;
    }
  }


  /**
   * 
   * @param row 
   */
  public deleteSeal(row) {
    this.obsID = { 'obsID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID'] };
    console.log('about to call delete');

    this.apiService.deleteObs(JSON.stringify(this.obsID)).subscribe(() => this.apiService.readObs());

  }

  public matchRuleShort(str, rule) {
    var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
  }

  public searchItems() {
    const prev = this.mdbTable.getDataSource();
    console.log(this.searchText);

    if (this.searchText.indexOf('*') >= 0) {
      var results = [];
      for (var obs of this.observations) {
        var mark: string = null;
        var tag: string = null;
        if (obs['Marks'] != null) {
          mark = obs['Marks'] as unknown as string;
          mark = mark.substring(1, mark.length-1);
        }
        if (obs['Tags'] != null) {
          tag = obs['Tags'] as unknown as string;
          tag = tag.substring(1, tag.length-1);
        }
        if (this.matchRuleShort(mark, this.searchText) || this.matchRuleShort(tag, this.searchText)) {
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
        this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['Tags', 'Marks', 'Sex', 'AgeClass']);
        this.mdbTable.setDataSource(prev);
      }
    }
  }

  public onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
