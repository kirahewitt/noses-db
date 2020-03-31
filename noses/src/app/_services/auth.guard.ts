import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { User_Observer_Obj } from '../_supporting_classes/sqlUser';



/**
 * Prevents unauthorized users from accessing restricted routes via its CanActivate method.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;


  /**
   * 
   * @param authService : A reference to an inject angular service called AuthService.
   * @param router : A reference to the Router instance for this application
   */
  constructor(public authService: AuthService, public router: Router) {
    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
    });

    let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
    currentUserIsValid_datastream.subscribe( (retval : boolean) => {
      this.currentUserIsValid = retval;
    });
  }


  /**
   * Returns a true/false result, wrapped in an Observable, indicating whether the user will be
   *  allowed to move from its current route "state" to a desired location "next".
   * @param next : The route which the user is attempting to navigate to.
   * @param state : The current router location of the user.
   */
  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.currentUserIsValid !== true) {
      this.router.navigate(['sign-in'])
    }
    return true;
  }
}
