import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observations } from  '../_supporting_classes/Observations';
import { sqlUser } from '../_supporting_classes/sqlUser';
import { Observable, of } from  'rxjs';
import { SealDataService } from "./seal-data.service";

@Injectable({
  providedIn: 'root'
})


/**
 * 
 */
export class FlaskBackendService {

  private rows: any;
  private newUsers: any;  
  private FLASK_API_SERVER: string;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  /**
   * @param httpClient gives us access to the get and post methods (get the data asynchronously)
   * @param sealDataService a local reference to the application-wide angular service that keeps track of the currently selected seal.
   */
  constructor(private httpClient: HttpClient, private sealDataService: SealDataService) {
    this.FLASK_API_SERVER = "http://127.0.0.1:5000"
  }


  /**
   * 
   */
  readObs(): Observable<Observations[]>{
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/allseals` );
  }

  readNotApproved(): Observable<Observations[]>{
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/notapproved`);
  }

  addObservations(user: string): Observable<string>{
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/addobservations`, user, this.httpOptions);
  }

  /** DELETE: delete the observation from the server */
  deleteObs(obs: string) {
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/delete`, obs, this.httpOptions);
  }


  // users section
  
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


  // seals sections
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
