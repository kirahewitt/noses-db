import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';



/**
 * This is a class which contains an EXAMPLE of using an angular service.
 * 
 * It is intended to be a service which gets the location of the computer running
 *  this application by calling a rest service.
 * 
 * Currently this angular service is not fully implemented. Instead of doing an
 * http get request on the service, 
 */
@Injectable({
  providedIn: 'root'
})
export class NumberCounterService {

  private url : string;
  private myTimer: NodeJS.Timer;
  public currentNumber : BehaviorSubject<String>;
  

  /**
   * Initializes this angular service class's attributes. Starts the timer that increments the counter every 5 seconds.
   */
  constructor() { 
    this.url = "http://api.ipstack.com/129.65.145.182?access_key=7319f356e6ea4b45bffd81c983ef7fab&format=1";
    this.currentNumber = new BehaviorSubject<String>("right here");

    var i = 0;
    this.myTimer = setInterval(() => { 
      this.currentNumber.next("right here " + i.toString());
      i++;
    }, 5000)
  }
  

  /**
   * Returns a reference to the data stream cont
   */
  public getLocationStream() {
    return this.currentNumber;
  }


  /**
   * Kills the timer when this service is ended.
   */
  public ngOnDestroy() {
    clearInterval(this.myTimer);
  }
}
