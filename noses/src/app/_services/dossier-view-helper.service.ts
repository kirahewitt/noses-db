import { Injectable } from '@angular/core';
import { DossierViewStructure, DossierViewStructure_compiledData } from '../_supporting_classes/DossierViewStructure';
import { BehaviorSubject } from 'rxjs';
import { FlaskBackendService } from './flask-backend.service';
import { SqlSealDossier } from '../_supporting_classes/SqlSealDossier';
import { SqlObservation } from '../_supporting_classes/SqlObservation';
import { SqlTag } from '../_supporting_classes/SqlTag';
import { SqlMark } from '../_supporting_classes/SqlMark';
import { SqlMeasurement } from '../_supporting_classes/SqlMeasurement';


/**
 * The purpose of this class is to compile all the information that the DossierViewComponent needs
 * in one place. Getting all this data will involve data across multiple entity sets and in the case
 * of the Observations entity set, many many tuples.
 * 
 * From ES "Seals"
 *     - Sex
 * 
 * From ES "Observations" , it wants all observations for that seal 
 * 
 * 
 * NOTE: The user IS NOT intended to receive the value of the dossier by directly accessing the dossierViewStructure.
 * Instead the user must rely on the public attribute "dossierViewStructure_updateStream". Every time this service
 * gets new information to add to the dossierViewStructure, it will update dossierViewStructure and place the new
 * state upon the update stream. A component which is subscribed to this update stream is guaranteed to receive 
 * any and all changes made to this object as this service queries multiple endpoints on the rest service to populate
 * this object.
 * 
 * Components which want to get the value of the dossierViewStructure should ONLY get it by subscribing to the update stream and
 * using the new value in 'next', one of the callback functions of subscribe.
 */
@Injectable({
  providedIn: 'root'
})
export class DossierViewHelperService {

  private dossierViewStructure: DossierViewStructure;
  public dossierViewStructure_updateStream : BehaviorSubject<DossierViewStructure>;

  private dossierViewStructure_c: DossierViewStructure_compiledData;
  public dossierViewStructure_c_updateStream : BehaviorSubject<DossierViewStructure_compiledData>;

  private uniqueTagList: SqlTag[];
  public uniqueTagList_updateStream : BehaviorSubject<SqlTag[]>;


  private uniqueMesList: SqlMeasurement[];
  public uniqueMesList_updateStream : BehaviorSubject<SqlMeasurement[]>;
  
  private uniqueMarkList: SqlMark[];
  public uniqueMarkList_updateStream : BehaviorSubject<SqlMark[]>;

  private identifyingObservation: SqlObservation;
  public identifyingObservation_updateStream : BehaviorSubject<SqlObservation>;

  private mostRecentObservation: SqlObservation;
  public mostRecentObservation_updateStream : BehaviorSubject<SqlObservation>;

  private newestObs_forAgeClass: SqlObservation;
  public newestObs_forAgeClass_updateStream : BehaviorSubject<SqlObservation>;


  private observationList: SqlObservation[];
  public observationList_updateStream : BehaviorSubject<SqlObservation[]>;

  


  /**
   * Initializes the DossierViewStructure to a blank object.(All attributes set to null)
   * @param apiService A reference to the Angular Service that communicates with our Flask REST API.
   */
  constructor(private apiService: FlaskBackendService) { 

    this.dossierViewStructure = new DossierViewStructure();
    this.dossierViewStructure_updateStream = new BehaviorSubject<DossierViewStructure>(this.dossierViewStructure);

    this.dossierViewStructure_c = new DossierViewStructure_compiledData();
    this.dossierViewStructure_c_updateStream = new BehaviorSubject<DossierViewStructure_compiledData>(this.dossierViewStructure_c);

    this.uniqueTagList = [];
    this.uniqueTagList_updateStream = new BehaviorSubject<SqlTag[]>(this.uniqueTagList);

    this.uniqueMarkList = [];
    this.uniqueMarkList_updateStream = new BehaviorSubject<SqlMark[]>(this.uniqueMarkList);

    this.uniqueMesList = [];
    this.uniqueMesList_updateStream = new BehaviorSubject<SqlMeasurement[]>(this.uniqueMesList);

    this.identifyingObservation = new SqlObservation;
    this.identifyingObservation_updateStream = new BehaviorSubject<SqlObservation>(this.identifyingObservation);

    this.mostRecentObservation = new SqlObservation;
    this.mostRecentObservation_updateStream = new BehaviorSubject<SqlObservation>(this.mostRecentObservation);

    this.newestObs_forAgeClass = new SqlObservation;
    this.newestObs_forAgeClass_updateStream = new BehaviorSubject<SqlObservation>(this.newestObs_forAgeClass);

    this.observationList = [];
    this.observationList_updateStream = new BehaviorSubject<SqlObservation[]>(this.observationList);
  }


  /**
   * This is a getter for the dossierViewStructure_updateStream
   */
  public getDossierDatastream() {
    return this.dossierViewStructure_updateStream;
  }


  /**
   * 
   */
  public getDossierCompiledDatastream() {
    return this.dossierViewStructure_c_updateStream;
  }

  public getUniqueMesListDatastream() {
    return this.uniqueMesList_updateStream;
  }
  /**
   * 
   */
  public getUniqueTagListDatastream() {
    return this.uniqueTagList_updateStream;
  }


  /**
   * 
   */
  public getUniqueMarkListDatastream() {
    return this.uniqueMarkList_updateStream;
  }


  /**
   * 
   */
  public getIdentifyingObservationDatastream() {
    return this.identifyingObservation_updateStream;
  }


  /**
   * 
   */
  public getMostRecentObservationDatastream() {
    return this.mostRecentObservation_updateStream;
  }


  /**
   * 
   */
  public getNewestObservationForAgeClassDatastream() {
    return this.newestObs_forAgeClass_updateStream;
  }


  /**
   * 
   */
  public getObservationListDatastream() {
    return this.observationList_updateStream;
  }


  /**
   * This method populates the attribute dossierViewStructure when it receives from an external caller a SealId.
   * After it finishes populating the dossierViewStructure, it calls the next method of the updatestream, providing the
   * dossierViewStructure as a parameter. This passes the current state of the dossierViewStructure onto the update stream,
   * ensuring that all subscribers to the update stream receive the latest copy of the data after the next() call is triggered.
   */
  public populateViaSealId(givenSealId: number) {
    console.log("here")
  

    // get all the observations for this seal
    let allObsList_obs = this.apiService.getAll_Observations_bySealId(givenSealId);
    allObsList_obs.subscribe( (obsList : SqlObservation[]) => {
      this.observationList = obsList;
      this.observationList_updateStream.next(this.observationList);

      console.log("\nCurrent Value of: observationList");
      console.log(this.observationList);
    });


    // get information on the desired Seals tuple
    let sealTuple_observable = this.apiService.getSeal_bySealId(givenSealId);
    sealTuple_observable.subscribe( (resp : SqlSealDossier) => {
      this.dossierViewStructure.dossierId = resp.sealId;
      this.dossierViewStructure.identifyingObservationId = resp.identifyingObservationId;
      this.dossierViewStructure.sex = resp.sex;
      this.dossierViewStructure_updateStream.next(this.dossierViewStructure);

      // console.log("\nCurrent Value of: dossierViewStructure");
      // console.log(this.dossierViewStructure);
    });
    


    // get all the tags for this seal
    let uniqueTagsForSeal_observable = this.apiService.getAll_Tags_bySealId(givenSealId);
    uniqueTagsForSeal_observable.subscribe( (tagList : SqlTag[]) => {
      this.uniqueTagList = tagList;
      this.uniqueTagList_updateStream.next(this.uniqueTagList);

      // console.log("\nCurrent Value of: uniqueTagList");
      // console.log(this.uniqueTagList);
    });

    let uniqueMesForSeal = this.apiService.getAll_Measurements_bySealId(givenSealId);
    console.log(uniqueMesForSeal);
    uniqueMesForSeal.subscribe( (mesList : SqlMeasurement[]) => {
      this.uniqueMesList = mesList;
      this.uniqueMesList_updateStream.next(this.uniqueMesList);

      // console.log("\nCurrent Value of: uniqueTagList");
      // console.log(this.uniqueTagList);
    });

    // get all the unique marks for this seal
    let uniqueMarksForSeal_obs = this.apiService.getAll_Marks_bySealId(givenSealId);
    uniqueMarksForSeal_obs.subscribe( (markList : SqlMark[]) => {
      this.uniqueMarkList = markList;
      this.uniqueMarkList_updateStream.next(this.uniqueMarkList);

      // console.log("\nCurrent Value of: uniqueMarkList");
      // console.log(this.uniqueMarkList);
    });


    // identifying observation
    let IDingObservation_obs = this.apiService.get_identifyingObservation_bySealId(givenSealId);
    IDingObservation_obs.subscribe( (IDingObs : SqlObservation) => {
      this.identifyingObservation = IDingObs;
      this.identifyingObservation_updateStream.next(this.identifyingObservation);

      // console.log("\nCurrent Value of: identifyingObservation");
      // console.log(this.identifyingObservation);
    });


    // get the age class from the last valid, approved observation FOR DATE
    let mostRecentObs_forDate_obs = this.apiService.get_mostRecentObservation_bySealId(givenSealId);
    mostRecentObs_forDate_obs.subscribe( (obs : SqlObservation) => {
      this.mostRecentObservation = obs;
      this.mostRecentObservation_updateStream.next(this.mostRecentObservation);

      // console.log("\nCurrent Value of: mostRecentObservation");
      // console.log(this.mostRecentObservation);
    });

    // get the age class from the last valid, approved observation FOR AGE CLASS
    let newestObs_forAgeClass_obs = this.apiService.get_newestObservation_forAgeClass_bySealId(givenSealId);
    newestObs_forAgeClass_obs.subscribe( (obs : SqlObservation) => {
      this.newestObs_forAgeClass = obs;
      this.newestObs_forAgeClass_updateStream.next(this.newestObs_forAgeClass);

      // console.log("\nCurrent Value of: newestObs_forAgeClass");
      // console.log(this.newestObs_forAgeClass);
    });


    
    

  }


}
