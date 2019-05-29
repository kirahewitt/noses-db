import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observations } from  './Observations';
import { SimpleUser } from './simpleUser';
import { Observable, of } from  'rxjs';
import { SealDataService } from "./seal-data.service";

@Injectable({
  providedIn: 'root'
})


export class FlaskBackendService {
  constructor(private httpClient: HttpClient,
              private sealData: SealDataService) {}
  FLASK_API_SERVER = "http://34.217.54.156:5000";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  rows: any;

  readObs(): Observable<Observations[]>{
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/users` );
  }

  addUser(user: string): Observable<string>{
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/add`, user, this.httpOptions);
  }

  /** DELETE: delete the user from the server */
  deleteObs(obs: string) {
    console.log('calling flask function')
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/delete`, obs, this.httpOptions);
  }

  async getSeal(obs: string) {
    await this.httpClient.post<string>(`${this.FLASK_API_SERVER}/getseal`, obs, this.httpOptions).toPromise().then(data => {
      this.rows = data
    });

    return this.rows
  }

  updateAgeClass(obs: string) {
    console.log(obs);
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/updateAgeClass`, obs, this.httpOptions);
  }


}
