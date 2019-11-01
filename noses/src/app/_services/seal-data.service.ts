import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


/**
 * This angular service provides components of this angular web application with information
 * about a singular seal.
 */
@Injectable({
  providedIn: 'root'
})
export class SealDataService {

  private seal = new BehaviorSubject('default message'); // messageSOurce = seal
  public currentSeal = this.seal.asObservable(); // currentMessage = currentSeal

  constructor() { }

  changeMessage(nextSeal: string) {
    this.seal.next(nextSeal)
  }
}
