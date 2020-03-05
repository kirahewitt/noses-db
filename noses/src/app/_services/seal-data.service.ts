import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


/**
 * This angular service provides components of this angular web application with information
 * about a singular seal. When a user wants to navigate to the page of a particular seal, they
 * store the information about which seal they selected in this class as a String.
 */
@Injectable({
  providedIn: 'root'
})
export class SealDataService {


  private currentSeal_Str: BehaviorSubject<String>;
  public currentSeal_observable: Observable<String>;


  /**
   * Remember behavior subjects are like datastreams. This constructor creates one such datastream,
   *  initialized with the value "default message'
   */
  constructor() {
    this.currentSeal_Str = new BehaviorSubject('default message'); // messageSOurce = seal
    this.currentSeal_observable = this.currentSeal_Str.asObservable();
  }


  /**
   * Returns the current seal 
   */
  public getCurrentSeal() : BehaviorSubject<any> {
    return this.currentSeal_Str;
  }


  /**
   * Updates the message on the seal object by calling the "next" function on the 
   * BehaviorSubject.
   * @param newSealState : A string representation of the new seal.
   */
  setCurrentSealState(newSealState: string) {
    this.currentSeal_Str.next(newSealState);
  }
}
