import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminStatus: BehaviorSubject<Number> = new BehaviorSubject(0); // messageSOurce = seal
  public currentStatus: Observable<Number> = this.adminStatus.asObservable(); // currentMessage = currentSeal

  constructor() { }

  changeMessage(nextAdmin: number) {
    this.adminStatus.next(nextAdmin);
  }
}
