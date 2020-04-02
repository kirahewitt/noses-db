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

    this.attemptInitByLocalStorage()
  }


  /**
   * This method will check the local storage to see if there is a valid user there.
   * This could happen if a user refreshed the application or opened a window in a new tab.
   * 
   */
  public attemptInitByLocalStorage() {
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
  }


  /**
   * Returns a reference to the behavior subject attached to the user object.
   * A subscriber to this behavior subject will receive all updates made to the 
   * user object.
   */
  public IH_getUserData_bs() {
    return this.IH_userData_bs;
  }

  public IH_getUserIsValid_bs() {
    return this.IH_userIsValid_bs
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
   * The behavior of this function will be similar to what is currently in the SignInComponent.
   * @param email : Email of the user attempting to log in
   * @param password : Password of the user attempting to log in
   */
  public IH_SignIn(email, password) {

    // - Login Via 'apiService'
    let loginAuthenticator_obs = this.apiService.getLoginAuthenticator_userObserver(email, password);
    loginAuthenticator_obs.subscribe( (retval : User_Observer_Obj) => {
      let resp_json = JSON.stringify(retval);

      if (resp_json.toString() != "{}") {
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

    this.setLocalStorageLoggedOutState();

    this.router.navigate(["sign-in"]);
  }


  /**
   * set the current user local storage to be that of an invalid user(meaning no one is logged in)
   */
  public setLocalStorageLoggedOutState() {
        localStorage.setItem("UserObserver", "null"); 
        localStorage.setItem("userObserverIsValid", "{'userObserverIsValid' : 'false'}"); 
  }

  // /**
  //  * Sign up with email/password
  //  * @param email 
  //  * @param password 
  //  */
  // public SignUp(email, password) {
  //   var signupResult = this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  //     .then(result => {
  //       /* Call the SendVerificaitonMail() function when new user sign up and returns promise */
  //       this.SendVerificationMail();
  //       // alert("New user successfully created and verification email was sent!");
  //       // this.SetUserData(result.user); // i dont want admin to log in under another account
  //     })
  //     .catch(error => {
  //       window.alert(error.message);
  //     });

  //   return signupResult;
  // }


  // /**
  //  * Send email verfificaiton when new user sign up
  //  * Notice that this implementation method doesn't rely on the api to know 
  //  * to send an email when a new user is created. 
  //  */
  // public SendVerificationMail() {
  //   return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
  //     this.router.navigate(["verify-email"]);
  //   });
  // }


  // // Reset Forgot password
  // public ForgotPassword(passwordResetEmail): Promise<void> {
  //   return this.afAuth.auth
  //     .sendPasswordResetEmail(passwordResetEmail)
  //     .then(() => {
  //       window.alert("Password reset email sent, check your inbox.");
  //     })
  //     .catch(error => {
  //       window.alert(error);
  //     });
  // }


}