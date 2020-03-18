import { Injectable } from '@angular/core';
import { DossierViewStructure, DossierViewStructure_compiledData } from '../_supporting_classes/DossierViewStructure';
import { BehaviorSubject } from 'rxjs';
import { FlaskBackendService } from './flask-backend.service';
import { SqlSealDossier } from '../_supporting_classes/SqlSealDossier';
import { SqlObservation } from '../_supporting_classes/SqlObservation';
import { SqlTag } from '../_supporting_classes/SqlTag';


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

  private identifyingObservation: SqlObservation;
  public identifyingObservation_updateStream : BehaviorSubject<SqlObservation>;

  private mostRecentObservation: SqlObservation;
  public mostRecentObservation_updateStream : BehaviorSubject<SqlObservation>;




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

    this.identifyingObservation = new SqlObservation;
    this.identifyingObservation_updateStream = new BehaviorSubject<SqlObservation>(this.identifyingObservation);

    this.mostRecentObservation = new SqlObservation;
    this.mostRecentObservation_updateStream = new BehaviorSubject<SqlObservation>(this.mostRecentObservation);
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


  /**
   * 
   */
  public getUniqueTagListDatastream() {
    return this.uniqueTagList_updateStream;
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
  public getMostRecentObservation_Observable() {
    return this.mostRecentObservation_updateStream;
  }


  /**
   * This method populates the attribute dossierViewStructure when it receives from an external caller a SealId.
   * After it finishes populating the dossierViewStructure, it calls the next method of the updatestream, providing the
   * dossierViewStructure as a parameter. This passes the current state of the dossierViewStructure onto the update stream,
   * ensuring that all subscribers to the update stream receive the latest copy of the data after the next() call is triggered.
   */
  public populateViaSealId(givenSealId: number) {

    let sealTuple_observable = this.apiService.getSeal_bySealId(givenSealId);
    sealTuple_observable.subscribe( (resp : SqlSealDossier) => {
      
      // update the local private object
      this.dossierViewStructure.dossierId = resp.sealId;
      this.dossierViewStructure.identifyingObservationId = resp.identifyingObservationId;
      this.dossierViewStructure.sex = resp.sex;

      // signal pass the new state of the object to the datastream and all the subscribers
      this.dossierViewStructure_updateStream.next(this.dossierViewStructure);
    });


    let uniqueTagsForSeal_observable = this.apiService.getTags_bySealId(givenSealId);
    uniqueTagsForSeal_observable.subscribe( (tagList : SqlTag[]) => {

      // print the observations to make sure it actually worked
      console.log("RETRIEVED tags FOR SEAL ID: " + givenSealId.toString());
      console.log(tagList);

      this.uniqueTagList = tagList;
      this.uniqueTagList_updateStream.next(this.uniqueTagList);
    });


    let identifyingObservation_observable = this.apiService.getIdentifyingObservation_bySealId(givenSealId);
    identifyingObservation_observable.subscribe( (IDingObs : SqlObservation) => {
      this.identifyingObservation = IDingObs;
      this.identifyingObservation_updateStream.next(this.identifyingObservation);
    });


  }


}
