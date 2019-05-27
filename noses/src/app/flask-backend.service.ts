import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observations } from  './Observations';
import { SimpleUser } from './simpleUser';
import { Observable, of } from  'rxjs';

@Injectable({
  providedIn: 'root'
})


export class FlaskBackendService {
  constructor(private httpClient: HttpClient) {}
  FLASK_API_SERVER = "http://localhost:5000";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  readObs(): Observable<Observations[]>{
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/users` );
  }

  addUser(user: string): Observable<string>{
    console.log(user)
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/add`, user, this.httpOptions);
  }

  /** DELETE: delete the user from the server */
  deleteObs(obs: string) {
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/delete`, obs, this.httpOptions);
  }


}
