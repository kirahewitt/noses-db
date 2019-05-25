import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observations } from  './Observations';
import { Observable } from  'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlaskBackendService {
  constructor(private httpClient: HttpClient) {}
  FLASK_API_SERVER = "http://127.0.0.1:5000";

  readUsers(): Observable<Observations[]>{
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/users`);
  }

}
