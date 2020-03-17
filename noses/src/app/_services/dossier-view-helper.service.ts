import { Injectable } from '@angular/core';
import { DossierViewStructure } from '../_supporting_classes/DossierViewStructure';
import { BehaviorSubject } from 'rxjs';
import { FlaskBackendService } from './flask-backend.service';
import { SqlSealDossier } from '../_supporting_classes/SqlSealDossier';


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


  /**
   * Initializes the DossierViewStructure to a blank object.(All attributes set to null)
   * @param apiService A reference to the Angular Service that communicates with our Flask REST API.
   */
  constructor(private apiService: FlaskBackendService) { 
    this.dossierViewStructure = new DossierViewStructure();
    this.dossierViewStructure_updateStream = new BehaviorSubject<DossierViewStructure>(this.dossierViewStructure);
  }


  /**
   * This is a getter for the dossierViewStructure_updateStream
   */
  public getDossierDatastream() {
    return this.dossierViewStructure_updateStream;
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
  }


}
