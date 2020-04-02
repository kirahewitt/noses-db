import { Injectable } from '@angular/core';
import { User_Observer_Obj } from '../_supporting_classes/sqlUser';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlaskBackendService } from './flask-backend.service';


/**
 * Keeps track of the state of the list of users displayed by the table
 * ManageAccounts component will subscribe to the BehaviorSubject attached to the list of users.
 */
@Injectable({
  providedIn: 'root'
})
export class ManageAccountsService {

  public userObserverList: User_Observer_Obj[];
  public userObserverList_bs: BehaviorSubject<User_Observer_Obj[]>;


  /**
   * 
   * @param apiService Reference to Angular Service that talks to Flask API
   */
  constructor(private apiService: FlaskBackendService) { 
    this.userObserverList = [];
    this.userObserverList_bs = new BehaviorSubject<User_Observer_Obj[]>(this.userObserverList);

    // subscribe to primary api to store the userObserver list
    this.refreshUserList();
  }


  /**
   * Getter for the Behavior Subject for the list of users this service maintains
   */
  public getUserObserverList_datastream() {
    return this.userObserverList_bs;
  }


  /**
   * Refreshes the list of users by reaching out to the Flask API
   */
  public refreshUserList() {
    let userList_obs = this.apiService.getUserList();
    userList_obs.subscribe( (response : User_Observer_Obj[]) => {
      
      // verify that we're actually receiving the right stuff from the DB
      // console.log("Received Data in Angular Component from Subscription: ");
      // console.log(response);

      // initialize the local variables.
      this.userObserverList = response;
      this.userObserverList_bs.next(this.userObserverList);
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

    let overwriteUser_obs = this.apiService.saveUserEditChanges(userObserver);
    overwriteUser_obs.subscribe( (userObsListAfterUpdate : User_Observer_Obj[]) => {

      // console.log("We have received from the DB the list of new users after the updates to the DB were performed:")
      // console.log(userObsListAfterUpdate);

      this.userObserverList = userObsListAfterUpdate;
      this.userObserverList_bs.next(this.userObserverList);
    });
  }
}
