import { Injectable, NgZone } from "@angular/core";
import { User } from "./user";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Router } from "@angular/router";


@Injectable({
  providedIn: "root"
})
export class AuthService {

  private userData: any; // Save logged in user data


  /**
   * Constructs the Auth.Service... Constructed at the root level so once it exists the same instance
   *  will be available to the entire program.
   * This will save user data in localstorage when logged in and setting up null when logged out
   * @param afs Inject Firestore service
   * @param afAuth Inject Firebase auth service
   * @param router reference to the router, which will allow us to change the page the user is currently on.
   * @param ngZone NgZone service to remove outside scope warning
   */
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router, public ngZone: NgZone) {
    let userObservable = this.afAuth.authState;
    userObservable.subscribe(user => this.updateLocalStorage_userData(user));
  }


  /**
   * If the value of user received by this function is non-null the user is logged in.
   * This will save user data in localstorage when logged in and setting up null when logged out.
   * @param user firebase user object received from firebase angular service.
   */
  private updateLocalStorage_userData(user: firebase.User) {
    if (user) {
      this.userData = user;
      localStorage.setItem("user", JSON.stringify(this.userData));
      JSON.parse(localStorage.getItem("user"));
    } 
    else {
      localStorage.setItem("user", null);
      JSON.parse(localStorage.getItem("user"));
    }
  }


  /**
   * Sign in with email/password
   * @param email potential email address of a user
   * @param password potential password of a user
   */
  public SignIn(email, password) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        this.ngZone.run(() => {
          this.router.navigate(["dashboard"]);
        });
        this.SetUserData(result.user);
      })
      .catch(error => {
        window.alert(error.message);
      });
  }


  // Sign out
  public SignOut() {
    alert("successfully logged out")
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem("user");
      this.router.navigate(["sign-in"]);
    });
  }


  /**
   * Sign up with email/password
   * @param email 
   * @param password 
   */
  public SignUp(email, password) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        /* Call the SendVerificaitonMail() function when new user sign up and returns promise */
        this.SendVerificationMail();
        // alert("New user successfully created and verification email was sent!");
        // this.SetUserData(result.user); // i dont want admin to log in under another account
      })
      .catch(error => {
        window.alert(error.message);
      });
  }


  // Send email verfificaiton when new user sign up
  public SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(["verify-email"]);
    });
  }


  // Reset Forgot password
  public ForgotPassword(passwordResetEmail): Promise<void> {
    return this.afAuth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch(error => {
        window.alert(error);
      });
  }


  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user !== null) {
      return true;
    } 
    else {
      return false;
    }
  }


  // Sign in with Google
  public GoogleAuth() : Promise<void> {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }


  // Auth logic to run auth providers
  public AuthLogin(provider) : Promise<void> {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.ngZone.run(() => {
          this.router.navigate(["dashboard"]);
        });
        this.SetUserData(result.user);
      })
      .catch(error => {
        window.alert(error);
      });
  }


  /**
   * Setting up user data when sign in with username/password, sign up with username/password 
   *  and sign in with social auth provider in Firestore database using 
   *  AngularFirestore + AngularFirestoreDocument service
   * @param user 
   */
  public SetUserData(user) : Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc( `users/${user.uid}` );

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };

    return userRef.set(userData, {
      merge: true
    });
  }

}
