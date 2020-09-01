import { Injectable, NgZone } from "@angular/core";
import { User } from "../_supporting_classes/user";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Observable, of, BehaviorSubject } from  'rxjs';
import { FlaskBackendService } from './flask-backend.service';
import { sqlUser_full, sqlUser, User_Observer_Obj } from '../_supporting_classes/sqlUser';
import { HttpErrorResponse } from '@angular/common/http';


/**
 * This service needs to maintain an object representing a user that is logged in to the application.
 */
@Injectable({
  providedIn: "root"
})
export class AuthService {

  // IH is for In House... needed way to differentiate the old user validation from the new user validation.
  public IH_userIsValid: boolean;                                  // indicates whether the currently maintained object is a valid user.
  public IH_userIsValid_bs: BehaviorSubject<boolean>;
  public IH_userData: User_Observer_Obj;                        // The actual data maintained by this angular service.
  public IH_userData_bs: BehaviorSubject<User_Observer_Obj>;    // Observable so other components can asynchronously access this user data.

  // make a variable for the new image
  public userProfileImage: string;
  public userProfileImage_bs: BehaviorSubject<string>;


  /**
   * Constructs the Auth.Service... Constructed at the root level so once it exists the same instance
   *  will be available to the entire program.
   * 
   * We are subscribing to the service AngularFireAuth. 
   * 
   * @param afs Inject Firestore service
   * @param afAuth Inject Firebase auth service
   * @param router reference to the router, which will allow us to change the page the user is currently on.
   * @param ngZone NgZone service to remove outside scope warning
   */
  constructor(public router: Router, public ngZone: NgZone, public apiService: FlaskBackendService) {
    // set up our local variables on this service so components can access the data as they need it.
    this.IH_userIsValid = false;
    this.IH_userIsValid_bs = new BehaviorSubject<boolean>(this.IH_userIsValid);
    this.IH_userData = new User_Observer_Obj();
    this.IH_userData_bs = new BehaviorSubject<User_Observer_Obj>(this.IH_userData);

    // Needs to be initialized to correct blank object
    this.userProfileImage = "";
    this.userProfileImage_bs = new BehaviorSubject<string>(this.userProfileImage);

    this.attemptInitByLocalStorage()
  }


  /**
   * This method will check the local storage to see if there is a valid user there.
   * This could happen if a user refreshed the application or opened a window in a new tab.
   */
  public attemptInitByLocalStorage() {

    // do the user data
    let userData = JSON.parse(localStorage.getItem("UserObserver"));
    let userDataIsValid = JSON.parse(localStorage.getItem("UserObserverIsValid"));
    if (userData != null) {
      this.IH_userData = userData;
      this.IH_userData_bs.next(this.IH_userData);
      this.IH_userIsValid = true;
      this.IH_userIsValid_bs.next(this.IH_userIsValid);      
    }
    else {
      this.setLocalStorageLoggedOutState();
    }

    let userProfilePic = JSON.parse(localStorage.getItem("userProfilePicture"));
    if (userProfilePic != null) {
      this.userProfileImage = userProfilePic;
      this.userProfileImage_bs.next(this.userProfileImage);
    }
  }


  /**
   * Returns a reference to the behavior subject attached to the user object.
   * A subscriber to this behavior subject will receive all updates made to the 
   * user object.
   */
  public IH_getUserData_bs() {
    return this.IH_userData_bs;
  }


  /**
   * 
   */
  public IH_getUserIsValid_bs() {
    return this.IH_userIsValid_bs;
  }


  /**
   * 
   */
  public getUserImage_bs() {
    return this.userProfileImage_bs;
  }


  /**
   * This method receives a User_Observer object and passes it to the apiService to ensure that the
   * User/Observer tuples are modified to match the state of the variable userObserver.
   * 
   * **make this method not get the whole damn list of users.** 
   * 
   * @param userObserver : the new state that should be applied to the relevant user and observer tuples. 
   */
  public updateUserObserverTuplePair(userObserver: User_Observer_Obj) {

    // console.log("Manage Accounts Service received this object and will send to DB:");
    // console.log(userObserver);

    let overwriteUser_obs = this.apiService.saveChanges_userObserver(userObserver);
    overwriteUser_obs.subscribe( (userObsListAfterUpdate : User_Observer_Obj[]) => {

      // console.log("We have received from the DB the list of new users after the updates to the DB were performed:")
      // console.log(userObsListAfterUpdate);

      // get the desired userobserver from the list
      for (let user of userObsListAfterUpdate) {
        if (user.userId === userObserver.userId) {
          this.IH_userData = user;
          this.IH_userData_bs.next(this.IH_userData);

          // since it was successful, set is valid to true and pass it on its stream
          this.IH_userIsValid = true;
          this.IH_userIsValid_bs.next(this.IH_userIsValid);       
          break;
        }
      }

      
    });
  }


  /**
   * This method should
   *    1. call an apiService method that **sends** a user image as a string
   *    2. overwrites the 
   * @param imageAsString 
   */
  public updateUserImage(imageAsString: string) {
    this.userProfileImage = imageAsString;
    this.userProfileImage_bs.next(this.userProfileImage);

    // we allow 
    let saveNewUserImage_bs = this.apiService.saveUserImage_obs(this.IH_userData.userId, this.userProfileImage, "");
    saveNewUserImage_bs.subscribe( () => {
      console.log("We did a thing!");
    });
  }


  /**
   * The behavior of this function will be similar to what is currently in the SignInComponent.
   * @param username : Email of the user attempting to log in
   * @param password : Password of the user attempting to log in
   */
  public IH_SignIn(username, password) {

    // - set the IH_userData* objects Via 'apiService'
    let loginAuthenticator_obs = this.apiService.getLoginAuthenticator_userObserver(username, password);
    loginAuthenticator_obs.subscribe( (retval : User_Observer_Obj) => {
      let resp_json = JSON.stringify(retval);

      if (resp_json.toString() != "{}" && resp_json.toString() != '{"profilePicture":""}') {
        // display success message
        
        console.log("Password CORRECT.");
        console.log(resp_json.toString());
        console.log(retval);

        this.IH_userData = retval;
        this.IH_userData_bs.next(this.IH_userData);

        // since it was successful, set is valid to true and pass it on its stream
        this.IH_userIsValid = true;
        this.IH_userIsValid_bs.next(this.IH_userIsValid);       

        // update the local storage to have the UserObserver
        localStorage.setItem("UserObserver", JSON.stringify(this.IH_userData)); 
        localStorage.setItem("userObserverIsValid", JSON.stringify(this.IH_userIsValid)); 

        // redirect the user to the home page.
        this.ngZone.run(() => {
          this.router.navigate(["menu"]);
        });

      }
      else {
        // display failure message
        console.log("Password INCORRECT.");
        console.log(retval.toString());

        // set the failure variable
        this.IH_userIsValid = false;

        this.setLocalStorageLoggedOutState();

        window.alert("Email/Password combination did not match any existing users.");
      }
    });


    // set the USER IMAGE
    let userImage_obs = this.apiService.getUserProfileImage_obs(username);
    userImage_obs.subscribe( (retval : string) => {

      console.log("Upon Signing in, USER PROFILE PICTURE: ");
      console.log(retval);

      this.userProfileImage = retval;
      this.userProfileImage_bs.next(this.userProfileImage);

      // set local storage
      localStorage.setItem("userProfilePicture", JSON.stringify(this.userProfileImage)); 
    });

  }
  

  /**
   * Displays a message indicating a log out operation was performed, updates the
   * user data and its data streams, and then uses the router to send the user 
   * back to the sign in page.
   */
  public IH_SignOut() {
    alert("successfully logged out");
    this.IH_userIsValid = false;
    this.IH_userIsValid_bs.next(this.IH_userIsValid);

    this.IH_userData = new User_Observer_Obj();
    this.IH_userData_bs.next(this.IH_userData);

    this.userProfileImage = ""
    this.userProfileImage_bs.next(this.userProfileImage);

    this.setLocalStorageLoggedOutState();

    this.router.navigate(["sign-in"]);
  }


  /**
   * set the current user local storage to be that of an invalid user(meaning no one is logged in)
   */
  public setLocalStorageLoggedOutState() {
    localStorage.setItem("UserObserver", "null"); 
    localStorage.setItem("userObserverIsValid", "{'userObserverIsValid' : 'false'}"); 
    localStorage.setItem("userProfilePicture", "null");
  }



}