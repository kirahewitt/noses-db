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


/**
 * 
 */
@Component({
  selector: 'app-seal-page',
  templateUrl: './seal-page.component.html',
  styleUrls: ['./seal-page.component.scss']
})
export class SealPageComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  public seal: any;
  public sealRow: Observations;
  public jseal: any;
  public dataSource: any;
  public datas: any;
  public displayedColumns: string[] = ['ObservationID', 'AgeClass', 'sex', 'date', 'SLOCode','Comments',  'Edit', 'actions'];
  public show: any = false;

  public sealForm = new FormGroup({
    ageClass: new FormControl(''),
    sex: new FormControl(''),
    date: new FormControl(''),
    slo: new FormControl(''),
    comments: new FormControl('')
  });


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
  
  


  /**
   * Constructor injects the necessary services into this component.
   * @param sealDataService 
   * @param apiService 
   * @param dossierHelperService 
   */
  constructor(private sealDataService: SealDataService, private apiService: FlaskBackendService, private dossierHelperService : DossierViewHelperService) { 
    this.sealDossier_main = new DossierViewStructure();
  }


  /**
   * Initializes the local attributes of this class by calling the initSubscriptions method.
   */
  ngOnInit() {
    this.initSubscriptions();
  }


  /**
   * Subscribes to relevant datastreams.
   */
  private initSubscriptions() {


    // original subscription for seal information
    this.sealDataService.currentSeal_observable.subscribe(currentSeal  => {

      this.seal = currentSeal;
      this.jseal = JSON.stringify(currentSeal);

      this.datas = this.apiService.getSeal(this.jseal).then(msg => {
        this.dataSource = new MatTableDataSource(<any> msg.Observations);
        this.seal.Sex = msg.Sex;
        this.seal.AgeClass = msg.AgeClass;
        this.seal.Marks = msg.Marks;
        this.seal.Tags = msg.Tags;
        this.seal.BreedingSeason = msg.BreedingSeason;
        this.seal.LastSeen = msg.LastSeen;
        this.dataSource.paginator = this.paginator;
      });
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
   * Receives a Javascript Date object and converts it to a string of the form MM/DD/YYYY
   */
  public convertDateObjToDateString(dateObj : Date) : string {
      let result : string = "";
      var d = new Date(dateObj);

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


  /**
   * this function needs to be rewritten to use BehaviorSubjects/Observables properly. 
   * I'm pretty sure async/await isn't necessary.
   * DO NOT CHANGE THIS RIGHT NOW
   */
  async onSubmit() {

    if(this.sealForm.value.ageClass != "") {

      var json_sealIdentifier = JSON.stringify({'obsID': this.sealRow.ObservationID, 'age': this.sealForm.value.ageClass});
      
      await this.apiService.updateAgeClass(json_sealIdentifier).subscribe(() => {

        this.apiService.readObs();

        this.sealDataService.currentSeal_observable.subscribe(subscription_response => {
          this.seal = subscription_response;
          this.jseal = JSON.stringify(subscription_response);

          // this.obsID = { 'SealID': row['ObservationID'], 'tag1': row['TagNumber1'], 'Mark': row['MarkID']};
          this.datas = this.apiService.getSeal(this.jseal);

          this.datas.then(msg => {
            this.dataSource = new MatTableDataSource(<any> msg);
            this.sealForm.reset();
            this.show = false;
          });

        });
      });

    }
  }


  /**
   * 
   */
  toggleForm() {
    console.log(this.show);
  }

}
