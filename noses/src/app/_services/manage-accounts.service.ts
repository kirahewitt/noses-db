import { Injectable } from '@angular/core';
import { User_Observer_Obj, user_forCreateNewUser_byAdmin } from '../_supporting_classes/sqlUser';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlaskBackendService } from './flask-backend.service';
import { Sql_User_Profile_Pic } from '../_supporting_classes/SqlProfilePic';


export class Image_Model {
  imageId : string;
  userId: string;
  pictureData: string;
}

/**
 * Keeps track of the state of the list of users displayed by the table
 * ManageAccounts component will subscribe to the BehaviorSubject attached to the list of users.
 * 
 * We could have written this so that the User_Observer_Obj class had one more field on it for the image, 
 * but if there are a lot of user accounts, we're going to be waiting for a lot of images to show up.
 * Considering it already takes a bit for an images to get to the angular application, seems reasonable
 * to keep this separate and create an initializer which accepts a list of userIds.
 */
@Injectable({
  providedIn: 'root'
})
export class ManageAccountsService {

  public userObserverList: User_Observer_Obj[];
  public userObserverList_bs: BehaviorSubject<User_Observer_Obj[]>;

  public userProfileImageList: Sql_User_Profile_Pic[];
  public userProfileImageList_bs: BehaviorSubject<Sql_User_Profile_Pic[]>;
   

  /**
   * 
   * @param apiService Reference to Angular Service that talks to Flask API
   */
  constructor(private apiService: FlaskBackendService) { 
    this.userObserverList = [];
    this.userObserverList_bs = new BehaviorSubject<User_Observer_Obj[]>(this.userObserverList);

    this.userProfileImageList = [];
    this.userProfileImageList_bs = new BehaviorSubject<Sql_User_Profile_Pic[]>(this.userProfileImageList);

    // subscribe to primary api to store the userObserver list
    this.refreshUserList();

    this.refreshUserProfileImageList();
  }


  /**
   * Getter for the Behavior Subject for the list of users this service maintains
   */
  public getUserObserverList_datastream() {
    return this.userObserverList_bs;
  }
  

  public getUserProfileImageList_datastream() {
    return this.userProfileImageList_bs;
  }


  /**
   * Refreshes the list of users by reaching out to the Flask API
   */
  public refreshUserList() {
    let userList_obs = this.apiService.getAll_UserObservers();
    userList_obs.subscribe( (response : User_Observer_Obj[]) => {
      
      // verify that we're actually receiving the right stuff from the DB
      // console.log("Received Data in Angular Service from Subscription: ");
      // console.log(response);

      // initialize the local variables.
      this.userObserverList = response;
      this.userObserverList_bs.next(this.userObserverList);
    });
  }


  /**
   * Refreshes the list of user profile images.
   * This method could use too many resources.
   */
  public refreshUserProfileImageList() {

    console.log("MANAGE ACCOUNTS SERVICE - attempting to set up the subscription to the profile image list")

    let userImageList_obs: Observable<Sql_User_Profile_Pic[]> = this.apiService.getAll_UserProfileImages_obs();
    userImageList_obs.subscribe( (response : Sql_User_Profile_Pic[]) => {
      
      // verify we get the right stuff
      console.log("Manage Accounts Service received response for getAllUserProfileImageList");
      console.log(response);

      this.userProfileImageList = response;
      this.userProfileImageList_bs.next(this.userProfileImageList);
    });
  }


  /**
   * 
   * @param userObsObj 
   */
  public removeUser(userObsObj : User_Observer_Obj) {
    let usersAfterRemoval_obs: Observable<User_Observer_Obj[]> = this.apiService.removeUserHavingEmail(JSON.stringify(userObsObj));
    usersAfterRemoval_obs.subscribe((updatedUsers : User_Observer_Obj[]) => {
      this.userObserverList = updatedUsers;
      this.userObserverList_bs.next(this.userObserverList);
    });
  }

  
  /**
   * 
   * @param userObserver 
   */
  public updateUserObserverTuplePair(userObserver: User_Observer_Obj) {

    // console.log("Manage Accounts Service received this object and will send to DB:");
    // console.log(userObserver);

    let overwriteUser_obs = this.apiService.saveChanges_userObserver(userObserver);
    overwriteUser_obs.subscribe( (userObsListAfterUpdate : User_Observer_Obj[]) => {

      // console.log("We have received from the DB the list of new users after the updates to the DB were performed:")
      // console.log(userObsListAfterUpdate);

      this.userObserverList = userObsListAfterUpdate;
      this.userObserverList_bs.next(this.userObserverList);
    });
  }


   /**
   * 
   * @param userObserver 
   */
  public addNewUser(newUser: user_forCreateNewUser_byAdmin) {

    console.log("Manage Accounts Service received this object and will send to DB:");
    console.log(newUser);

    let overwriteUser_obs = this.apiService.create_newUser_adminOnly(newUser);
    overwriteUser_obs.subscribe( (userObsListAfterUpdate : User_Observer_Obj[]) => {

      // console.log("We have received from the DB the list of new users after the updates to the DB were performed:")
      // console.log(userObsListAfterUpdate);

      this.userObserverList = userObsListAfterUpdate;
      this.userObserverList_bs.next(this.userObserverList);
    });
  }

  
}
