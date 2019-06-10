import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminStatus = new BehaviorSubject('default message'); // messageSOurce = seal
  currentStatus = this.adminStatus.asObservable(); // currentMessage = currentSeal

  constructor() { }

  changeMessage(nextAdmin: string) {
    this.adminStatus.next(nextAdmin);
    // console.log(this.adminStatus._value);
  }
}
