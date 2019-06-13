import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observations } from  './Observations';
import { SimpleUser } from './simpleUser';
import { sqlUser } from './sqlUser';
import { Observable, of } from  'rxjs';
import { SealDataService } from "./seal-data.service";

@Injectable({
  providedIn: 'root'
})


export class FlaskBackendService {
  constructor(private httpClient: HttpClient,
              private sealData: SealDataService) {}
  FLASK_API_SERVER = "http://localhost:5000";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  rows: any;
  newUsers: any;

  readObs(): Observable<Observations[]>{
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/allseals` );
  }

  readNotApproved(): Observable<Observations[]>{
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/notapproved`);
  }



  addSeals(user: string): Observable<string>{
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/addseals`, user, this.httpOptions);
  }

  /** DELETE: delete the user from the server */
  deleteObs(obs: string) {
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/delete`, obs, this.httpOptions);
  }

  async addUser(obs: string) {
    await this.httpClient.post<string>(`${this.FLASK_API_SERVER}/adduser`, obs, this.httpOptions).toPromise().then(data => {
      this.newUsers = data;
    });

    return this.newUsers;
  }

  getUsers(): Observable<sqlUser[]>{
    return this.httpClient.get<sqlUser[]>(`${this.FLASK_API_SERVER}/adduser`);
  }

  async getAdminStatus(email: string) {
    await this.httpClient.post<string>(`${this.FLASK_API_SERVER}/getadminuser`, email, this.httpOptions).toPromise().then(data => {
      this.rows = data
    });
    return this.rows;
  }

  async removeUser(user: string) {
    console.log(user );
    await this.httpClient.post<string>(`${this.FLASK_API_SERVER}/removeuser`, user, this.httpOptions).toPromise().then(data => {
      this.rows = data;
    });
    return this.rows;
  }

  async updateUser(user: string) {
    console.log(user );
    await this.httpClient.post<string>(`${this.FLASK_API_SERVER}/updateuser`, user, this.httpOptions).toPromise().then(data => {
      this.rows = data
    });
    return this.rows
  }

  async getPartials(part: string) {
    await this.httpClient.post<string>(`${this.FLASK_API_SERVER}/partials`, part, this.httpOptions).toPromise().then(data => {
      this.rows = data
    });
    return this.rows
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
