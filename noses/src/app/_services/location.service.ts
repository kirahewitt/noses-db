import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private url : string = "http://api.ipstack.com/129.65.145.182?access_key=7319f356e6ea4b45bffd81c983ef7fab&format=1";

  public location: String = "right here";
  public locationStream : BehaviorSubject<String>;


  private myTimer;


  constructor() { 
    this.locationStream = new BehaviorSubject<String>(this.location);
    var i = 0;
    this.myTimer = setInterval(() => { 
      this.location = "right here " + i.toString();
      this.locationStream.next(this.location);
      i++;
    }, 5000)
  }
  

  public getLocationStream() {
    return this.locationStream;


  }
}
