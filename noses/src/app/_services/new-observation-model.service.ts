import { Injectable } from '@angular/core';
import { ObservationRecord } from '../_supporting_classes/observation-hierarchical-class/ObservationRecord';
import {FallibleAttribute} from "../_supporting_classes/observation-hierarchical-class/FallibleAttribute";
import {ObservedMark} from "../_supporting_classes/observation-hierarchical-class/ObservedMark";
import {ObservedTag} from "../_supporting_classes/observation-hierarchical-class/ObservedTag";
import {MeasuredValue} from "../_supporting_classes/observation-hierarchical-class/MeasuredValue"
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/**
 * This class is responsible to keeping track of the state of a new observation being created.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class NewObservationModelService {

  private obsRec : ObservationRecord;
  private obsRec_updateStream : BehaviorSubject<ObservationRecord>;

  constructor() { 
    // set the model to a blank new object
    this.obsRec = new ObservationRecord();

    // connect the model to the update stream
    this.obsRec_updateStream = new BehaviorSubject<ObservationRecord>(this.obsRec);
  }


  /**
   * Provides to the caller an update stream
   */
  public getObservationRecordUpdateStream() {
    return this.obsRec_updateStream;
  }

  public overwriteObservation(source : ObservationRecord) {
    this.obsRec = source;
  }

}
