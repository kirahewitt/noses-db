import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private currentPermissionLevel: Number;

  private adminStatus_updateStream: BehaviorSubject<Number>; // messageSOurce = seal
  public currentPermissionStatus: Observable<Number>; // currentMessage = currentSeal


  /**
   * Initializes the model and sets up the observable and datastream.
   */
  constructor() {
    this.currentPermissionLevel = new Number(0);
    this.adminStatus_updateStream = new BehaviorSubject(this.currentPermissionLevel);
    this.currentPermissionStatus = this.adminStatus_updateStream.asObservable();
  }


  /**
   * Provides a getter for the update stream. When a component subscribes to this
   *  BehaviorSubject they will be able to react in the subscribe's "next:" callback
   *  function every time the permission level of the logged in user changes.
   */
  public getUpdateStream_currentPermissionLevel() {
    return this.adminStatus_updateStream;
  }


  /**
   * Updates the current permission level of the user according to the new level it
   *  receives. 
   * @param newPermissionLevel 
   */
  updatePermissionLevel(newPermissionLevel: number) {
    this.currentPermissionLevel = newPermissionLevel;
    this.adminStatus_updateStream.next(this.currentPermissionLevel);
  }
}
