import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { CanActivate, RouterStateSnapshot, Router } from '@angular/router';



/**
 * Prevents unauthorized users from accessing restricted routes via its CanActivate method.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  

  /**
   * 
   * @param authService : A reference to an inject angular service called AuthService.
   * @param router : A reference to the Router instance for this application
   */
  constructor(public authService: AuthService, public router: Router)
  {}


  /**
   * Returns a true/false result, wrapped in an Observable, indicating whether the user will be
   *  allowed to move from its current route "state" to a desired location "next".
   * @param next : The route which the user is attempting to navigate to.
   * @param state : The current router location of the user.
   */
  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLoggedIn !== true) {
      this.router.navigate(['sign-in'])
    }
    return true;
  }
}
