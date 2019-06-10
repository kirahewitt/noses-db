import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminStatus = new BehaviorSubject(0); // messageSOurce = seal
  currentStatus = this.adminStatus.asObservable(); // currentMessage = currentSeal

  constructor() { }

  changeMessage(nextAdmin: number) {
    this.adminStatus.next(nextAdmin);
  }
}
