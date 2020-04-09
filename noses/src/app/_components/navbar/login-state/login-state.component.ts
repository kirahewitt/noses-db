import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { MatMenuModule} from '@angular/material/menu';
import { AdminService } from 'src/app/_services/admin.service';
import { User_Observer_Obj } from 'src/app/_supporting_classes/sqlUser';


/**
 * The purpose of this component is to indicate to the user their logged in state.
 * When a user is logged in, it will tell them the name of the user they are logged in as.
 * When a user is not logged in, it will provide a way to reach the login page. 
 * The user should know at all times whether they are logged in.
 */
@Component({
  selector: 'app-login-state',
  templateUrl: './login-state.component.html',
  styleUrls: ['./login-state.component.scss']
})
export class LoginStateComponent implements OnInit {

  public isAdmin: boolean;
  public isAtLeastFieldLeader: boolean;

  public loggedInUser: User_Observer_Obj;
  public currentUserIsValid: boolean;
  

  /**
   * 
   * @param authService 
   * @param adminStatus 
   */
  constructor(public authService : AuthService, public adminStatus: AdminService) { 
    
    this.isAdmin = false;
    this.isAtLeastFieldLeader = false;

    this.loggedInUser = new User_Observer_Obj();
    this.currentUserIsValid = false;
  }


  /**
   * We only set the value of userData if it isn't undefined.
   * subscribes to the current state of the adminStatus variable.
   * subscribes to the state of the userData variable
   */
  ngOnInit() {
    let loggedInUser_datastream = this.authService.IH_getUserData_bs();
    loggedInUser_datastream.subscribe( (retval : User_Observer_Obj ) => {
      this.loggedInUser = retval;
      this.updatePrivelege();
    });

    let currentUserIsValid_datastream = this.authService.IH_getUserIsValid_bs();
    currentUserIsValid_datastream.subscribe( (retval : boolean) => {
      this.currentUserIsValid = retval;
      this.updatePrivelege();
    });
  }


  /**
   * 
   */
  logoutClicked() {
    this.authService.IH_SignOut();
  }


  /**
   * 
   */
  updatePrivelege() {
    if (this.currentUserIsValid == false) {
      this.isAdmin = false;
      this.isAtLeastFieldLeader = false;
    }
    else {
      if (this.loggedInUser.isAdmin == 3) {
        this.isAdmin = true;
        this.isAtLeastFieldLeader = true;
      } 
      else if(this.loggedInUser.isAdmin == 2) {
        this.isAdmin = false;
        this.isAtLeastFieldLeader = true;
      } 
      else  {
        this.isAdmin = false;
        this.isAtLeastFieldLeader = false;
      }
    }
  }
}
