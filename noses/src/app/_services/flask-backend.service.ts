import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observations } from  '../_supporting_classes/Observations';
import { sqlUser, sqlUser_full, user_forCreateNewUser, User_Observer_Obj, user_forCreateNewUser_byAdmin } from '../_supporting_classes/sqlUser';
import { Observable, of, throwError } from  'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SealDataService } from "./seal-data.service";
import { Seal } from '../_supporting_classes/Seal';
import { SqlSealDossier } from '../_supporting_classes/SqlSealDossier';
import { SqlObservation } from '../_supporting_classes/SqlObservation';
import { SqlTag } from '../_supporting_classes/SqlTag';
import { SqlMark } from '../_supporting_classes/SqlMark';
import { ResetPasswordFormObject } from '../_supporting_classes/ResetPasswordFormObject';
import { Sql_User_Profile_Pic } from '../_supporting_classes/SqlProfilePic';


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
    this.FLASK_API_SERVER = "http://192.168.0.27:5000"
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(`Flask Backend Service - ${operation} failed. Error Message: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };

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
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/addobservations`, user, this.httpOptions).pipe(catchError(this.alertError));
  }

  /** 
   * DELETE: delete the observation from the server 
   */
  public deleteObs(obs: string) {
    return this.httpClient.post<string>(`${this.FLASK_API_SERVER}/delete`, obs, this.httpOptions);
  }

  public approveAllObs() {
    console.log("Approve all flask-backend");
    return this.httpClient.post<number>(`${this.FLASK_API_SERVER}/approveallobs`, {"id": 1}, this.httpOptions);
  }

  async approveObs(obsId: number) {
    console.log(obsId);
    await this.httpClient.post<number>(`${this.FLASK_API_SERVER}/approveobs`, {"obsId": obsId}, this.httpOptions).toPromise()
      .then(data => {
      obsId = data["obsId"];
    });
    return obsId;
  }
  

  private alertError(error){

    window.alert("Something went wrong. Try Again.")
    return throwError(error);
  }


  // users section
  
  /**
   * 
   * @param obs 
   */
  async getPromise_addUser(obs: string) {
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
    return this.httpClient.post<any>(flask_endpoint, userEmail, this.httpOptions).pipe(
      catchError(this.handleError<sqlUser_full[]>('getUser_obs', []))
    );
  }


  /**
   * Gives us access to methods in the flask api that allow us to authenticate a user via an 
   * Observable. The observable will produce a json object representing a user if the authentication 
   * is successful, otherwise, it will produce an empty json object, or "{}".
   * @param email : email we want to log into
   * @param password : password for the email
   */
  public getLoginAuthenticator_userObserver(username: string, password: string): Observable<User_Observer_Obj> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getloginauthenticator_userObserver`;
    let inputAsJsonString = '{"username" : "' + username    + '", "password" : "' + password + '"}';

    let loginAuth_obs = this.httpClient.post<User_Observer_Obj[]>(flask_endpoint, inputAsJsonString, this.httpOptions)
      .pipe(
        catchError(this.handleError<User_Observer_Obj[]>('getLoginAuthenticator', [])),
        map((retval : any[]) => {
          var userData : User_Observer_Obj = new User_Observer_Obj();

          // log data
          console.log("INSIDE MAP METHOD");
          console.log(retval);
          console.log("ANOTHER");
          console.log(retval[0]);

          // if we got a real object, intialize the data, otherwise, don't
          if (retval.length > 0) {
            userData.firstName = retval[0]['FirstName'];
            userData.lastName = retval[0]['LastName'];
            userData.isVerifiedByAdmin = retval[0]['isVerifiedByAdmin'];
            userData.userId = retval[0]['UserID'];
            userData.username = retval[0]["Username"];
            userData.initials = retval[0]["Initials"];
            userData.isAdmin = retval[0]['isAdmin'];
            userData.affiliation = retval[0]['Affiliation'];
            userData.email = retval[0]['Email'];
            userData.obsId = retval[0]['ObsID'];
          }
          
          return userData;
        })
      );

    return loginAuth_obs;
  }


  
  /**ddddd
   * Provides an observable which returns a user's profile image.
   * 
   * We expect the data stored in the BLOB to be
   * 
   * @param username : The username of the user whose profile image we want to retrieve.
   */
  public getUserProfileImage_obs(username: string): Observable<string> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getUserProfileImage`;

    let inputAsJsonString = '{"username" : "' + username + '"}';

    let userProfileImage_obs = this.httpClient.post<string>(flask_endpoint, inputAsJsonString, this.httpOptions).pipe(
      catchError(this.handleError<any>('getUserProfileImage', [])),
      map( retval => {
        var profileImage : string = "";

        console.log("\n\nAngular Flask Service received user image -- MAP FUNCTION \n\n");
        console.log(retval);

        // console.log("Here's the value of retval's pictureData field:");
        // console.log(retval['pictureData']);

        if (retval && retval != "") {
          profileImage = retval['pictureData'];  
        }

        // console.log("Here's Profile Image after assigning it's value:");
        // console.log(profileImage);

        return profileImage;
      })
    );

    return userProfileImage_obs;
  }

  

  getAll_UserProfileImages_obs() : Observable<Sql_User_Profile_Pic[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getAll_UserProfileImages`;

    let obs = this.httpClient.get<Sql_User_Profile_Pic[]>(flask_endpoint).pipe(
      catchError(this.handleError<any>('getAll_UserProfileImages', [])),
      map( (pictureDataList : any) => {
        var sqlUser_profilePic_list = [];

        console.log("Map function receiving all user images as json");
        console.log(pictureDataList);
        

        for (let pd of pictureDataList) {
          var tempPd: Sql_User_Profile_Pic = new Sql_User_Profile_Pic();

          tempPd.imageId = pd['id'];
          tempPd.userId = pd['UserID'];
          tempPd.pictureData = pd['pictureData'];

          sqlUser_profilePic_list.push(tempPd);
        }

        return sqlUser_profilePic_list;
      })
    );

    return obs;
  }






   

  /**
   * This function just submits a new user profile image to be saved for a particular user.
   * Since it is only sending data and does not expect data back, map rxjs operator is unnecessary.
   * @param userId 
   * @param pictureData 
   * @param caption 
   */
  public saveUserImage_obs(userId: number, pictureData: string, caption:string) {
    let flask_endpoint = `${this.FLASK_API_SERVER}/uploadImage_forUserProfile`;
    
    let inputAsJsonString = '{"userId" : ' + userId.toString() + ', "pictureData" : "' + pictureData + '", "caption" : "' + caption + '"}';

    let obs = this.httpClient.post<string>(flask_endpoint, inputAsJsonString, this.httpOptions).pipe(
      catchError(this.handleError<any>('saveUserImage_obs', [])),
    );

    return obs;
  }




  /**
   * @param userDetails : The specified firstname, lastname, username/email, and password of the user
   */
  public submitUserAccountRequest(userDetails: user_forCreateNewUser) {
    let userDetails_json = JSON.stringify(userDetails);
    let flask_endpoint = `${this.FLASK_API_SERVER}/submit-new-userAccountRequest`;

    let obs = this.httpClient.post(flask_endpoint, userDetails_json, this.httpOptions).pipe(
      catchError(this.handleError<any>('submitNewUserAccountRequest', [])),
    );

    return obs;
  }


  /**
   * @param userDetails : The specified firstname, lastname, username/email, and password of the user
   */
  public submitUserPasswordChangeRequest(userPasswordData: ResetPasswordFormObject) {
    let userPasswordData_json = JSON.stringify(userPasswordData);
    let flask_endpoint = `${this.FLASK_API_SERVER}/submit-userPasswordChangeRequest`;

    let obs = this.httpClient.post(flask_endpoint, userPasswordData_json, this.httpOptions).pipe(
      catchError(this.handleError<any>('submitUserPasswordChangeRequest', [])),
    );

    return obs;
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
        catchError(this.handleError<any>('getSeal_bySealId', [])),
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
   * Retrieves a list of seal dossier Information
   */
  public getSealDossierList(): Observable<SqlSealDossier[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getAll_SealDossier_Data`;

    let obs = this.httpClient.get(flask_endpoint).pipe(
      catchError(this.handleError<any>('getAll_SealDossier_Data', [])),
      map( jsonResponse => {
        var sealDossierList : SqlSealDossier[] = [];

        for (let json_dossier of jsonResponse) {
          var tempDossier: SqlSealDossier = new SqlSealDossier();
          tempDossier.sealId = json_dossier['SealID'];
          tempDossier.identifyingObservationId = json_dossier['ObservationID'];
          tempDossier.sex = json_dossier['Sex'];
          tempDossier.isDeprecated = json_dossier['isDeprecated'];
          //tempDossier.uniqueMarkYearList = json_dossier['markYearList'];
          // tempDossier.uniqueTagList = json_dossier['uniqueTagList'];
          // tempDossier.ageClass = json_dossier['AgeClass'];
          
          
          // tempDossier.lastSeen = json_dossier['LastSeen'];
          


          sealDossierList.push(tempDossier);
        }

        return sealDossierList;
      })
    );

    return obs;
  }


  /**
   * This is the endpoint that is responsible for "deleting a user" 
   * We don't actually delete the user, we are just making the user inactive.
   */
  public removeUserHavingEmail(jsonUsrObsObj:any): Observable<User_Observer_Obj[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/removeUserHavingEmail`;

    
    let obs = this.httpClient.post(flask_endpoint, jsonUsrObsObj, this.httpOptions).pipe(
      catchError(this.handleError<any>('getObservations_bySealId', [])),
      map(jsonResponse => {
        var userObjList : User_Observer_Obj[] = [];

        console.log("removeUserHavingEMail -- PROCESSING response from DB")

        for (let json_user of jsonResponse) {
          var tempUser : User_Observer_Obj = new User_Observer_Obj();
          tempUser.firstName = json_user['FirstName'];
          tempUser.lastName = json_user['LastName'];
          tempUser.isVerifiedByAdmin = json_user['isVerifiedByAdmin'];
          tempUser.userId = json_user['UserID'];
          tempUser.username = json_user["Username"];
          tempUser.initials = json_user["Initials"];
          tempUser.isAdmin = json_user['isAdmin'];
          tempUser.affiliation = json_user['Affiliation'];
          tempUser.email = json_user['Email'];
          tempUser.obsId = json_user['ObsID'];
          userObjList.push(tempUser);
        }

        return userObjList;
      })
    );
    return obs;
  }

   /**
   * New version of the get users api call. 
   */
  public getAll_UserObservers(): Observable<User_Observer_Obj[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getAll_UserObserver_Data`;

    let obs = this.httpClient.get(flask_endpoint).pipe(
      catchError(this.handleError<any>('getAll_UserObserver_Data', [])),
      map((jsonResponse : any) => {
        var userObjList : User_Observer_Obj[] = [];

        for (let json_user of jsonResponse) {
          var tempUser : User_Observer_Obj = new User_Observer_Obj();
          tempUser.firstName = json_user['FirstName'];
          tempUser.lastName = json_user['LastName'];
          tempUser.isVerifiedByAdmin = json_user['isVerifiedByAdmin'];
          tempUser.userId = json_user['UserID'];
          tempUser.username = json_user["Username"];
          tempUser.initials = json_user["Initials"];
          tempUser.isAdmin = json_user['isAdmin'];
          tempUser.affiliation = json_user['Affiliation'];
          tempUser.email = json_user['Email'];
          tempUser.obsId = json_user['ObsID'];
          userObjList.push(tempUser);
        }

        return userObjList;
      })
    );

    return obs;
  }


  /** 
   * 
   */
  public getAll_Observations_bySealId(sealId:number) : Observable<SqlObservation[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/getobservations-with-sealid`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('getObservations_bySealId', [])),
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
  public get_identifyingObservation_bySealId(sealId:number) : Observable<SqlObservation> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/get-IDing-observations-with-sealid`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('getIdentifyingObservation_bySealId', [])),
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
   * @param sealId 
   */
  public get_mostRecentObservation_bySealId(sealId : number) : Observable<SqlObservation> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/get-most-recent-observation-with-sealid`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions).pipe(
      catchError(this.handleError<any>('getMostRecentObservation_bySealId', [])),
      map( (jsonResponse : any) => {

        console.log("\n\n\n\n");
        console.log("FlaskBackendService - MOST RECENT for DATE");
        console.log("JSON: ");
        console.log(jsonResponse);

        let json_obs = jsonResponse['0'];
        console.log("FlaskBackendService - MOST RECENT for DATE");
        console.log("JSON['0']: ");
        console.log(json_obs);

        var sqlobs = new SqlObservation();
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

        console.log("FlaskBackendService - MOST RECENT for DATE");
        console.log("sqlobs: ");
        console.log(sqlobs);
        
        return sqlobs;
      })
    );
    return obs;
  }



  /**
   * 
   * @param sealId 
   */
  public get_newestObservation_forAgeClass_bySealId(sealId : number) : Observable<SqlObservation> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/get_newest_obs_with_sealID_ageClass`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions).pipe(
      catchError(this.handleError<any>('getNewestObservation_forAgeClass_bySealId', [])),
      map( (jsonResponse : any) => {
        let json_obs = jsonResponse['0'];

        var sqlobs = new SqlObservation();
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
  public getAll_Tags_bySealId(sealId : number) : Observable<SqlTag[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/gettags-with-sealid`;

    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions).pipe(
      catchError(this.handleError<any>('getTags_bySealId', [])),
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
   * 
   */
  public getAll_Marks_bySealId(sealId : number) : Observable<SqlMark[]> {

    let flask_endpoint = `${this.FLASK_API_SERVER}/getmarks_with_sealID`;
    let obs = this.httpClient.post(flask_endpoint, sealId, this.httpOptions).pipe(
      catchError(this.handleError<any>('getMarks_bySealId', [])),
      map( (jsonResponse : any) => {
        
        var markList : SqlMark[] = [];

        for (let json_mark of jsonResponse) {
          var mark : SqlMark = new SqlMark();

          mark.MarkID = json_mark['MarkID'];
          mark.Mark = json_mark['Mark'];
          mark.MarkPosition = json_mark['MarkPosition'];
          mark.markDate = json_mark['markDate'];
          mark.Year = json_mark['Year'];
          mark.ObservationID = json_mark['ObservationID'];
          mark.MarkSeal = json_mark['MarkSeal'];
          
          markList.push(mark);
        }

        return markList;
      })
    );
    return obs;
  }


  /**
   * Saves the changes made to the users and receives an updated list of users after the changes have been made.
   * @param editedUser 
   */
  public saveChanges_userObserver(editedUser : User_Observer_Obj) : Observable<User_Observer_Obj[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/saveUserEditChanges`;

    console.log("Angular Service for Flask API received this user to update:");
    console.log(editedUser);

    let obs = this.httpClient.post(flask_endpoint, editedUser, this.httpOptions).pipe(
      catchError(this.handleError<any>('saveUserEditChanges', [])),
      map( jsonResponse => {
        var userObsList : User_Observer_Obj[] = [];

        console.log("Angular Service for Flask API received this json response and will now map it to an object ");
        console.log(userObsList);

        for (let json_uo of jsonResponse) {
          var tempUO = new User_Observer_Obj();
          tempUO.userId = json_uo['UserID'];
          tempUO.username = json_uo['Username'];
          tempUO.initials = json_uo['UserID'];
          tempUO.isAdmin = json_uo['isAdmin'];
          tempUO.affiliation = json_uo['Affiliation'];
          tempUO.email = json_uo['Email'];
          tempUO.obsId = json_uo['ObsID'];
          tempUO.isVerifiedByAdmin = json_uo['isVerifiedByAdmin'];
          tempUO.firstName = json_uo['FirstName'];
          tempUO.lastName = json_uo['LastName'];
          userObsList.push(tempUO);
        }
        return userObsList;
      })
    );
    return obs;
  }


  /**
   * This method is only suppoed to be accessed by admin level users. It is called by the manage accounts component.
   * @param newUser 
   */
  public create_newUser_adminOnly(newUser: user_forCreateNewUser_byAdmin) : Observable<User_Observer_Obj[]> {
    let flask_endpoint = `${this.FLASK_API_SERVER}/addNewUser_forAdmin`;

    console.log("Angular Service for Flask API received this user to update:");
    console.log(newUser);

    let obs = this.httpClient.post(flask_endpoint, newUser, this.httpOptions).pipe(
      catchError(this.handleError<any>('addNewUser_byAdmin', [])),
      map( jsonResponse => {
        var userObsList : User_Observer_Obj[] = [];

        console.log("Angular Service for Flask API received this json response and will now map it to an object ");
        console.log(userObsList);

        for (let json_uo of jsonResponse) {
          var tempUO = new User_Observer_Obj();
          tempUO.userId = json_uo['UserID'];
          tempUO.username = json_uo['Username'];
          tempUO.initials = json_uo['UserID'];
          tempUO.isAdmin = json_uo['isAdmin'];
          tempUO.affiliation = json_uo['Affiliation'];
          tempUO.email = json_uo['Email'];
          tempUO.obsId = json_uo['ObsID'];
          tempUO.isVerifiedByAdmin = json_uo['isVerifiedByAdmin'];
          tempUO.firstName = json_uo['FirstName'];
          tempUO.lastName = json_uo['LastName'];
          userObsList.push(tempUO);
        }
        return userObsList;
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
