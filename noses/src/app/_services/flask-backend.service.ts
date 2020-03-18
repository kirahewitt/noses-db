import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observations } from  '../_supporting_classes/Observations';
import { sqlUser, sqlUser_full } from '../_supporting_classes/sqlUser';
import { Observable, of } from  'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SealDataService } from "./seal-data.service";
import { Seal } from '../_supporting_classes/Seal';
import { SqlSealDossier } from '../_supporting_classes/SqlSealDossier';
import { SqlObservation } from '../_supporting_classes/SqlObservation';
import { SqlTag } from '../_supporting_classes/SqlTag';


/**
 * 
 */
@Injectable({
  providedIn: 'root'
})
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
  public readObs(): Observable<Observations[]> {
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/allobservations` );
  }

  public readSeals(): Observable<Seal[]>{
    return this.httpClient.get<Seal[]>(`${this.FLASK_API_SERVER}/allseals` );
  }

  public readNotApproved(): Observable<Observations[]>{
    return this.httpClient.get<Observations[]>(`${this.FLASK_API_SERVER}/notapproved`);
  }

  public addObservations(user: string): Observable<string>{
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/addobservations`, user, this.httpOptions);
  }

  /** 
   * DELETE: delete the observation from the server 
   */
  public deleteObs(obs: string) {
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/delete`, obs, this.httpOptions);
  }

  

  // users section
  
  /**
   * 
   * @param obs 
   */
  async addUser(obs: string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/adduser`;

    await this.httpClient.post<string>(flask_endpoint, obs, this.httpOptions).toPromise()
      .then(data => {
        this.newUsers = data;
      });

    return this.newUsers;
  }


  /**
   * 
   */
  public getUsers(): Observable<sqlUser[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/adduser`;
    return this.httpClient.get<sqlUser[]>(flask_endpoint);
  }


  /**
   * Gets the entire user tuple associated with the provided email.
   * @param userEmail : the email of a user.
   */
  public getUser_obs(userEmail: string): Observable<sqlUser_full[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getuser`;
    return this.httpClient.post<any>(flask_endpoint, userEmail, this.httpOptions);
    // return this.httpClient.get<string>(flask_endpoint, userEmail, this.httpOptions);

  }

  /**
   * Gives us access to methods in the flask api that allow us to authenticate a user via an 
   * Observable. The observable will produce true if the authentication is successful, false otherwise.
   * @param email 
   * @param password 
   */
  public getLoginAuthenticator(email: string, password: string): Observable<sqlUser_full[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getloginauthenticator`;
    let inputAsJsonString = '{"email" : "' + email    + '", "password" : "' + password + '"}';
    // let tempPassVar =       '{"email" : "' + username + '"}';
    return this.httpClient.post<any>(flask_endpoint, inputAsJsonString, this.httpOptions);
  }


  /**
   * This function is going to return an Observable of SqlSealDossier. 
   * 
   * Since the Flask API returns information in JSON form, we have to pass the JSON through a
   * callback function that will map the response of the Flask API to the desired typescript object.
   * 
   * This is accomplished by using pipe on the observable and the rxjs map operator to map the JSON
   * to a new object, in this case, a SqlSealDossier object. 
   * @param sealId 
   */
  public getSeal_bySealId(sealId: number) : Observable<SqlSealDossier> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getseal-with-sealid`;

    let obs = this.httpClient
      .post(flask_endpoint, sealId, this.httpOptions)
      .pipe(
        map(jsonResponse => {
          var newSealDossier : SqlSealDossier = new SqlSealDossier();
          let jr = jsonResponse[0];

          newSealDossier.sealId = jr["SealID"];
          newSealDossier.identifyingObservationId = jr["ObservationID"];
          newSealDossier.sex = jr["Sex"];

          return newSealDossier;
        })
      );

    return obs;
  }


  /** 
   * 
   */
  public getObservations_bySealId(sealId:number) : Observable<SqlObservation[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getobservations-with-sealid`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions)
      .pipe(
        map( (jsonResponse : any) => {
          var observationList : SqlObservation[] = [];

          for (let json_obs of jsonResponse) {
            var tempSqlObs : SqlObservation = new SqlObservation();

            tempSqlObs.ObservationID = json_obs['ObservationID'];
            tempSqlObs.ObserverID = json_obs['ObserverID'];
            tempSqlObs.Sex = json_obs['Sex'];
            tempSqlObs.Date = json_obs['Date'];
            tempSqlObs.MoltPercent = json_obs['MoltPercent'];
            tempSqlObs.Comments = json_obs['Comments'];
            tempSqlObs.AgeClass = json_obs['AgeClass'];
            tempSqlObs.Year = json_obs['Year'];
            tempSqlObs.SLOCode = json_obs['SLOCode'];
            tempSqlObs.isApproved = json_obs['isApproved'];
            tempSqlObs.LastSeenPup = json_obs['LastSeenPup'];
            tempSqlObs.FirstSeenWeaner = json_obs['FirstSeenWeaner'];
            tempSqlObs.WeanDateRange = json_obs['WeanDateRange'];
            tempSqlObs.EnteredInAno = json_obs['EnteredInAno'];
            tempSqlObs.isProcedure = json_obs['isProcedure'];
            tempSqlObs.isDeprecated = json_obs['isDeprecated'];

            observationList.push(tempSqlObs);
          }

          return observationList;
        })
      );
    return obs;
  }



  /** 
   * 
   */
  public getIdentifyingObservation_bySealId(sealId:number) : Observable<SqlObservation> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/get-IDing-observations-with-sealid`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions)
      .pipe(
        map( (jsonResponse : any) => {
          var sqlobs = new SqlObservation();

          let json_obs = jsonResponse['0'];
          
          sqlobs.ObservationID = json_obs['ObservationID'];
          sqlobs.ObserverID = json_obs['ObserverID'];
          sqlobs.Sex = json_obs['Sex'];
          sqlobs.Date = json_obs['Date'];
          sqlobs.MoltPercent = json_obs['MoltPercent'];
          sqlobs.Comments = json_obs['Comments'];
          sqlobs.AgeClass = json_obs['AgeClass'];
          sqlobs.Year = json_obs['Year'];
          sqlobs.SLOCode = json_obs['SLOCode'];
          sqlobs.isApproved = json_obs['isApproved'];
          sqlobs.LastSeenPup = json_obs['LastSeenPup'];
          sqlobs.FirstSeenWeaner = json_obs['FirstSeenWeaner'];
          sqlobs.WeanDateRange = json_obs['WeanDateRange'];
          sqlobs.EnteredInAno = json_obs['EnteredInAno'];
          sqlobs.isProcedure = json_obs['isProcedure'];
          sqlobs.isDeprecated = json_obs['isDeprecated'];

          return sqlobs;
        })
      );
    return obs;
  }



  public getMostRecentObservation_bySealId(sealId:number) : Observable<SqlObservation> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/get-most-recent-observation-with-sealid`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions)
      .pipe(
        map( (jsonResponse : any) => {
          var sqlobs = new SqlObservation();

          let json_obs = jsonResponse['0'];
          
          sqlobs.ObservationID = json_obs['ObservationID'];
          sqlobs.ObserverID = json_obs['ObserverID'];
          sqlobs.Sex = json_obs['Sex'];
          sqlobs.Date = json_obs['Date'];
          sqlobs.MoltPercent = json_obs['MoltPercent'];
          sqlobs.Comments = json_obs['Comments'];
          sqlobs.AgeClass = json_obs['AgeClass'];
          sqlobs.Year = json_obs['Year'];
          sqlobs.SLOCode = json_obs['SLOCode'];
          sqlobs.isApproved = json_obs['isApproved'];
          sqlobs.LastSeenPup = json_obs['LastSeenPup'];
          sqlobs.FirstSeenWeaner = json_obs['FirstSeenWeaner'];
          sqlobs.WeanDateRange = json_obs['WeanDateRange'];
          sqlobs.EnteredInAno = json_obs['EnteredInAno'];
          sqlobs.isProcedure = json_obs['isProcedure'];
          sqlobs.isDeprecated = json_obs['isDeprecated'];

          return sqlobs;
        })
      );
    return obs;
  }



  /** 
   * 
   */
  public getTags_bySealId(sealId:number) : Observable<SqlTag[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/gettags-with-sealid`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions)
      .pipe(
        map( (jsonResponse : any) => {
          var tagList : SqlTag[] = [];

          for (let json_tag of jsonResponse) {
            var tag : SqlTag = new SqlTag();

            tag.TagColor = json_tag['TagColor'];
            tag.TagDate = json_tag['TagDate'];
            tag.TagNumber = json_tag['TagNumber'];
            tag.TagPosition = json_tag['TagPosition'];
            tag.TagSeal = json_tag['TagSeal'];
            tag.isLost = json_tag['isLost'];
            
            tagList.push(tag);
          }

          return tagList;
        })
      );
    return obs;
  }



  /**
   * This function returns a promise to get some data.
   * In this case, the data it will retrieve is the value of a particular user's permission level,
   *  which is a single attribute in the Users entity set.
   * @param email : a value passed to the flask server that can be used to uniquely identify the user
   * whose permission level we want to retrieve.
   */
  async getAdminStatus(email: string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getadminuser`;

    await this.httpClient.post<string>(flask_endpoint, email, this.httpOptions).toPromise()
      .then(data => {
        this.rows = data;
      });

    return this.rows;
  }


  /**
   * Still trying to figure out what this method needs to look like.
   * @param email : The email of the user who is attempting to log in
   * @param password : The password of the user who is attempting to log in
   */
  async attemptLogin(email: string, password: string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/attemptLogin`;

    var serverResponse;
    const emailPass = {email, password};

    await this.httpClient.post<string>(flask_endpoint, emailPass, this.httpOptions).toPromise()
      .then(data => {
        console.log("RESULT RECEIVED FROM FLASK AFTER CALLING 'attemptLogin':");
        console.log(data);
        serverResponse = data;
      });

    return serverResponse;
  }


  async removeUser(user: string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/removeuser`;

    console.log(user );
    await this.httpClient.post<string>(flask_endpoint, user, this.httpOptions).toPromise()
      .then(data => {
        this.rows = data;
      });

    return this.rows;
  }


  async updateUser(user: string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/updateuser`;

    console.log(user);
    await this.httpClient.post<string>(flask_endpoint, user, this.httpOptions).toPromise()
      .then(data => {
        this.rows = data;
      });

    return this.rows;
  }


  async getPartials(part: string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/partials`;

    await this.httpClient.post<string>(flask_endpoint, part, this.httpOptions).toPromise()
      .then(data => {
        this.rows = data
      });

    return this.rows
  }


  /**
   * 
   * @param obs A string representation of the JSON idenifier for a seal {}
   */
  async getSeal(obs: string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getseal`;

    await this.httpClient.post<string>(flask_endpoint, obs, this.httpOptions).toPromise()
      .then(data => {
        this.rows = data
      });

    return this.rows
  }


  /**
   * 
   * @param obs 
   */
  public updateAgeClass(obs: string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/updateAgeClass`;

    console.log(obs);
    return this.httpClient.post<string>(flask_endpoint, obs, this.httpOptions);
  }


}
