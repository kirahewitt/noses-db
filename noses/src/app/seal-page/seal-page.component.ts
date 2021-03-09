import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SealDataService } from "../_services/seal-data.service";
import { FlaskBackendService } from '../_services/flask-backend.service';
import { MatTableModule, MatTableDataSource, MatPaginator } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Observations } from '../_supporting_classes/Observations';
import { DossierViewStructure } from '../_supporting_classes/DossierViewStructure';
import { DossierViewHelperService } from '../_services/dossier-view-helper.service';
import { SqlTag } from '../_supporting_classes/SqlTag';
import { SqlObservation } from '../_supporting_classes/SqlObservation';
import { SqlMark } from '../_supporting_classes/SqlMark';
import { User_Observer_Obj } from '../_supporting_classes/sqlUser';
import { AuthService } from '../_services/auth.service';


/**
 * 
 */
@Component({
  selector: 'app-seal-page',
  templateUrl: './seal-page.component.html',
  styleUrls: ['./seal-page.component.scss']
})
export class SealPageComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) sealPagePaginator: MatPaginator;

  public seal: any;
  public sealRow: Observations;
  public jseal: any;
  public dataSource: any;
  public datas: any;
  public displayedColumns: string[];
  public show: any = false;

  // CREATE A NEW LOCAL VARIABLE TO STORE THE SEAL INFORMATION
  public sealDossier_main: DossierViewStructure;
  public observedTagList: SqlTag[];
  public observedMarkList: SqlMark[];
  public identifyingObservation: SqlObservation;
  public newestObservation_forAgeClass: SqlObservation;
  public mostRecentObservation_sealSighting: SqlObservation;
  public tagListDisplayString: string;
  public markListDisplayStringList: string[];
  public markListDisplayString: string;
  public sealSexDisplayString: string;
  public sealAgeClassDisplayString: string;
  public sealMostRecentSightingDisplayString: string;

  public allObservationsList: SqlObservation[];
  public allObservationsList_dataSource: MatTableDataSource<SqlObservation>;

  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;
  public isAdmin:boolean;
  public isAtLeastFieldLeader:boolean;
  
  public sealForm = new FormGroup({
    ageClass: new FormControl(''),
    sex: new FormControl(''),
    date: new FormControl(''),
    slo: new FormControl(''),
    comments: new FormControl('')
  });


  /**
   * Constructor injects the necessary services into this component.
   * @param sealDataService 
   * @param apiService 
   * @param dossierHelperService 
   */
  constructor(private dossierHelperService : DossierViewHelperService, private apiService: FlaskBackendService, public authService: AuthService) { 
    this.allObservationsList = [];
    this.allObservationsList_dataSource = new MatTableDataSource<SqlObservation>(this.allObservationsList);

    this.sealDossier_main = new DossierViewStructure();

    // let tempObservation: SqlObservation = new SqlObservation();
    // this.displayedColumns = Object.getOwnPropertyNames(tempObservation);
    this.displayedColumns = ['AgeClass', 'Sex', 'Date', 'SLOCode', 'Observer', 'Comments', 'LastSeenPup', 'FirstSeenWeaner', 'WeanDateRange', 'EnteredInAno',  'Edit', 'Delete'];


    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
      this.updatePrivelege();
    });

    let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
    currentUserIsValid_datastream.subscribe( (retval : boolean) => {
      this.currentUserIsValid = retval;
      this.updatePrivelege();
    });
  }


  /**
   * Initializes the local attributes of this class by cSqlObservationalling the initSubscriptions method.
   */
  public ngOnInit() {
    let allObservations_bs = this.dossierHelperService.getObservationListDatastream();
    allObservations_bs.subscribe( (retval : SqlObservation[]) => {
      console.log("\nRECEIVED Data in `seal-page.component.ts` SUBSCRIPTION:")
      console.log(retval);

      // initialize the local variables.
      this.allObservationsList = retval;
      this.allObservationsList_dataSource.data = this.allObservationsList;
      this.allObservationsList_dataSource.paginator = this.sealPagePaginator;
    });


    // Subscription via the NEW SERVICE
    let obs_DossierState_stream = this.dossierHelperService.getDossierDatastream();
    obs_DossierState_stream.subscribe((retval : DossierViewStructure) => {
      this.sealDossier_main = retval;
    });


    // Subscription to unique tags via NEW SERVICE
    this.dossierHelperService.getUniqueTagListDatastream().subscribe((retval : SqlTag[]) => {
      this.observedTagList = retval;
      this.tagListDisplayString = "";
      for (let tag of this.observedTagList) {
        this.tagListDisplayString += tag.TagNumber + " "
      }
    });


    // Subscription to unique marks via new service
    this.dossierHelperService.getUniqueMarkListDatastream().subscribe((retval : SqlMark[]) => {
      
      console.log("SUB - Marks for seal Id: retrieved data:");
      console.log(retval);
      
      this.observedMarkList = retval;

      // make nice-ish displays of the marks with years [MARK123 @ 2010]
      this.markListDisplayStringList = [];
      for (let mark of this.observedMarkList) {
        var tempDisplayString = "[" + mark.Mark + " @ " + mark.Year + "]";
        this.markListDisplayStringList.push(tempDisplayString);
      }

      // convert the marks to a single string
      this.markListDisplayString = "";
      for (let displayString of this.markListDisplayStringList) {
        this.markListDisplayString += displayString + " ";
      }

    });


    // Subscription to the Identifying observation
    this.dossierHelperService.getIdentifyingObservationDatastream().subscribe((retval : SqlObservation) => {
      this.identifyingObservation = retval;
      this.sealSexDisplayString = this.identifyingObservation.Sex;
    });


    // Subscription for most recent observation - SIGHTING OF SEAL
    let mostRecentObs_forDate_obs = this.dossierHelperService.getMostRecentObservationDatastream();
    mostRecentObs_forDate_obs.subscribe( (retval : SqlObservation) => {
      console.log("\n\n********RIGHT HERE **********\n\n");
      console.log(retval);
      this.mostRecentObservation_sealSighting = retval;
      let magicalDate : Date = this.mostRecentObservation_sealSighting.Date;
      this.sealMostRecentSightingDisplayString = this.convertDateObjToDateString(magicalDate);
    });


    // Subscription for most recent observation - WHERE AGE CLASS WAS ALSO RECORDED
    let newestObs_forAC_obs = this.dossierHelperService.getNewestObservationForAgeClassDatastream();
    newestObs_forAC_obs.subscribe( (retval : SqlObservation) => {
      this.newestObservation_forAgeClass = retval;
      this.sealAgeClassDisplayString = this.newestObservation_forAgeClass.AgeClass;
    });
  }


  /**
   * 
   */
  updatePrivelege() {
    if (this.currentUserIsValid == false) {
      this.isAdmin = false;
      this.isAtLeastFieldLeader = false;
    }
    else {
      if (this.loggedInUser.isAdmin == 3) {
        this.isAdmin = true;
        this.isAtLeastFieldLeader = true;
      } 
      else if(this.loggedInUser.isAdmin == 2) {
        this.isAdmin = false;
        this.isAtLeastFieldLeader = true;
      } 
      else  {
        this.isAdmin = false;
        this.isAtLeastFieldLeader = false;
      }
    }
  }




  /**
   * Receives a Javascript Date object and converts it to a string of the form MM/DD/YYYY
   */
  public convertDateObjToDateString(dateObj : Date) : string {
      let result : string = "";

      if (dateObj == null) {
        return result;
      }

      // Date will be off by one day without this step
      var temp = new Date(dateObj);
      var d = new Date(temp.getTime() + Math.abs(temp.getTimezoneOffset()*60000));

      console.log("\n\n WE ARE INSIDE THE CONVERSION FUNCTION \n\n");
      result += (d.getMonth() + 1).toString() + "/" + (d.getDate()).toString() + "/" + d.getFullYear().toString();
      return result;
  }


  /**
   * 
   * @param row 
   */
  editObs(row) {
    this.sealRow = row;
    this.show = !this.show;
    if(this.show == true) {
      // implement scroll to bottom
    }
  }

  deleteObs(row) {
    // this.obsID = { 'obsID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
    console.log(row);
    var obsID = { 'obsID': row.ObservationID };
    console.log('about to call delete');

    this.apiService.deleteObs(JSON.stringify(obsID)).subscribe(() => this.apiService.readObs());
 }


  // /**
  //  * this function needs to be rewritten to use BehaviorSubjects/Observables properly. 
  //  * I'm pretty sure async/await isn't necessary.
  //  * DO NOT CHANGE THIS RIGHT NOW
  //  */
  // async onSubmit() {

  //   if(this.sealForm.value.ageClass != "") {

  //     var json_sealIdentifier = JSON.stringify({'obsID': this.sealRow.ObservationID, 'age': this.sealForm.value.ageClass});
      
  //     await this.apiService.updateAgeClass(json_sealIdentifier).subscribe(() => {

  //       this.apiService.readObs();

  //       this.sealDataService.currentSeal_observable.subscribe(subscription_response => {
  //         this.seal = subscription_response;
  //         this.jseal = JSON.stringify(subscription_response);

  //         // this.obsID = { 'SealID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
  //         this.datas = this.apiService.getSeal(this.jseal);

  //         this.datas.then(msg => {
  //           this.dataSource = new MatTableDataSource(<any> msg);
  //           this.sealForm.reset();
  //           this.show = false;
  //         });

  //       });
  //     });

  //   }
  // }


  /**
   * 
   */
  toggleForm() {
    console.log(this.show);
  }

}
